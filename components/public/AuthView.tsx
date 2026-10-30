'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Leaf,
  Check,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Lock,
  Mail,
  User,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface AuthViewProps {
  mode: 'login' | 'register' | 'forgot-password'
}

export function AuthView({ mode }: AuthViewProps) {
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState(mode === 'login' ? 'aditi.shah@ahmedabad.life' : '')
  const [password, setPassword] = useState(mode === 'login' ? '••••••••' : '')
  const [name, setName] = useState('')
  const [district, setDistrict] = useState('Ahmedabad')
  const [showPassword, setShowPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const getRedirectTarget = (fallback: string) => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get('redirect')
        if (redirect && redirect.startsWith('/') && !redirect.startsWith('//') && redirect !== '/login') {
          return redirect
        }
      } catch {
        // ignore
      }
    }
    return fallback
  }

  const handleRedirect = (targetUrl: string) => {
    setIsSubmitting(true)
    router.replace(targetUrl)
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    setAuthError(null)
    try {
      const userProfile = await loginWithGoogle()
      const target = userProfile.role === 'admin' ? '/admin' : '/dashboard'
      handleRedirect(getRedirectTarget(target))
    } catch (err: any) {
      setIsSubmitting(false)
      setAuthError(err.message || 'Google Sign-In failed')
    }
  }

  const handleLoginDemo = (role: 'citizen' | 'admin') => {
    let enteredName = ''
    let enteredEmail = ''

    if (email && email.trim() && !email.includes('aditi.shah@ahmedabad.life') && !email.includes('bhavin.patel@gujarat.gov.in')) {
      enteredName = name.trim() || email.split('@')[0] || (role === 'admin' ? 'Bhavin Patel' : 'Aditi Shah')
      enteredEmail = email.trim()
    } else {
      if (role === 'admin') {
        setEmail('bhavin.patel@gujarat.gov.in')
      } else {
        setEmail('aditi.shah@ahmedabad.life')
      }
      setPassword('••••••••')
    }

    login(
      {
        email: enteredEmail || (role === 'admin' ? 'bhavin.patel@gujarat.gov.in' : 'aditi.shah@ahmedabad.life'),
        name: enteredName || (role === 'admin' ? 'Bhavin Patel' : 'Aditi Shah'),
        avatarInitials: (enteredName || (role === 'admin' ? 'BP' : 'AS')).slice(0, 2).toUpperCase(),
      },
      role
    )

    const defaultTarget = role === 'admin' ? '/admin' : '/dashboard'
    handleRedirect(getRedirectTarget(defaultTarget))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'forgot-password') {
      setResetSent(true)
      setIsSubmitting(false)
      return
    }

    if (mode === 'register') {
      const regName = name.trim() || 'Aditi Shah'
      const regEmail = email.trim() || 'aditi.shah@ahmedabad.life'
      login(
        {
          name: regName,
          email: regEmail,
          district: district || 'Ahmedabad',
          role: 'citizen',
          avatarInitials: regName.slice(0, 2).toUpperCase(),
        },
        'citizen'
      )
      handleRedirect('/onboarding')
    } else {
      const isGov = email.toLowerCase().includes('admin') || email.toLowerCase().includes('gov')
      const targetRole = isGov ? 'admin' : 'citizen'
      const enteredName = name.trim() || (email.trim() ? email.split('@')[0] : (targetRole === 'admin' ? 'Bhavin Patel' : 'Aditi Shah'))

      login(
        {
          email: email.trim() || (targetRole === 'admin' ? 'bhavin.patel@gujarat.gov.in' : 'aditi.shah@ahmedabad.life'),
          name: enteredName,
          role: targetRole,
          avatarInitials: enteredName.slice(0, 2).toUpperCase(),
        },
        targetRole
      )

      const defaultTarget = targetRole === 'admin' ? '/admin' : '/dashboard'
      handleRedirect(getRedirectTarget(defaultTarget))
    }
  }

  return (
    <main className="grid min-h-screen bg-[#E8EDF3] lg:grid-cols-[1fr_1.1fr]">
      {/* Brand Hero Panel with Soft Surfaces */}
      <div className="relative hidden p-12 lg:flex lg:flex-col lg:justify-between border-r border-[rgba(197,202,208,0.35)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 font-extrabold tracking-tight text-[#253247]">
            <span className="grid size-11 place-items-center rounded-2xl neu-raised text-[#238B57]">
              <Leaf size={22} fill="currentColor" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-extrabold">LiFE <span className="font-semibold text-[#238B57]">Gujarat</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#718096]">Soft UI Portal</span>
            </div>
          </Link>

          <div className="mt-20 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-2xl neu-inset px-3.5 py-1.5 text-xs font-bold text-[#238B57]">
              <Sparkles size={13} /> MISSION LiFE · GOVERNMENT OF GUJARAT
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-[#253247]">
              Small actions. <br />
              <span className="text-[#238B57]">Measurable impact.</span>
            </h1>

            <p className="text-sm leading-relaxed text-[#718096]">
              Join thousands of households across Gujarat tracking energy, completing daily sustainable missions, and adopting rooftop solar.
            </p>

            {/* Feature cards soft raised */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 rounded-2xl neu-raised-sm p-3.5 text-xs text-[#253247]">
                <span className="grid size-8 place-items-center rounded-xl neu-inset-sm text-[#238B57]">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>Official CEA grid emission calculations (0.716 kg/kWh)</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl neu-raised-sm p-3.5 text-xs text-[#253247]">
                <span className="grid size-8 place-items-center rounded-xl neu-inset-sm text-[#238B57]">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>PM Surya Ghar rooftop solar DBT subsidy navigator</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl neu-raised-sm p-3.5 text-xs text-[#253247]">
                <span className="grid size-8 place-items-center rounded-xl neu-inset-sm text-[#238B57]">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>Society collectives and verified points rewards</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#718096] border-t border-[rgba(197,202,208,0.35)] pt-4">
          © 2026 Climate Change Department, Government of Gujarat.
        </div>
      </div>

      {/* Auth Interaction Panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-3xl neu-raised p-8 space-y-6">
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[rgba(197,202,208,0.35)]">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[#253247]">
              <span className="grid size-9 place-items-center rounded-2xl neu-raised text-[#238B57]">
                <Leaf size={18} fill="currentColor" />
              </span>
              <span>LiFE Gujarat</span>
            </Link>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="rounded-2xl neu-inset p-4 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-[#253247] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Zap size={14} className="text-[#238B57]" /> Instant Demo Access
              </span>
              <span className="rounded-xl neu-raised-sm px-2 py-0.5 text-[10px] font-bold text-[#238B57]">
                One-Click
              </span>
            </div>
            <p className="text-[11px] text-[#718096] mb-3">
              Enter directly into the platform without typing passwords:
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                id="btn-demo-citizen"
                onClick={() => handleLoginDemo('citizen')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl neu-button-primary py-2.5 text-xs font-bold cursor-pointer"
              >
                <UserCheck size={14} />
                Citizen Demo
              </button>
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleLoginDemo('admin')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl neu-button py-2.5 text-xs font-bold text-[#253247] cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#238B57]" />
                Admin Demo
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#253247]">
              {mode === 'register'
                ? 'Create Your Account'
                : mode === 'forgot-password'
                ? 'Reset Password'
                : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-xs text-[#718096]">
              {mode === 'register'
                ? 'Start tracking household electricity and participating in Mission LiFE.'
                : mode === 'forgot-password'
                ? 'Enter your registered email to receive verification reset link.'
                : 'Sign in to access your energy dashboard and mission streak.'}
            </p>
          </div>

          {authError && (
            <div className="rounded-2xl neu-inset p-3.5 text-xs font-bold text-red-600">
              {authError}
            </div>
          )}

          {mode !== 'forgot-password' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl neu-button py-3 text-xs font-bold text-[#253247] cursor-pointer"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[rgba(197,202,208,0.35)]" />
                <span className="text-[10px] font-bold text-[#718096]">OR WITH CREDENTIALS</span>
                <div className="h-px flex-1 bg-[rgba(197,202,208,0.35)]" />
              </div>
            </div>
          )}

          {resetSent ? (
            <div className="rounded-2xl neu-inset p-5 text-xs text-[#238B57] space-y-3 font-semibold">
              <p className="font-extrabold text-sm">Reset link dispatched!</p>
              <p>We have simulated sending instructions to your email address.</p>
              <Link
                href="/login"
                className="inline-block rounded-xl neu-button-primary px-4 py-2 text-white"
              >
                Back to Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User size={16} className="absolute left-3.5 text-[#718096] pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Aditi Shah"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl neu-input py-3 pl-10 pr-4 text-xs text-[#253247]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                      District in Gujarat
                    </label>
                    <div className="relative flex items-center">
                      <MapPin size={16} className="absolute left-3.5 text-[#718096] pointer-events-none" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full appearance-none rounded-2xl neu-input py-3 pl-10 pr-8 text-xs font-bold text-[#253247] cursor-pointer"
                      >
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Rajkot">Rajkot</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Bhavnagar">Bhavnagar</option>
                        <option value="Kutch">Kutch</option>
                        <option value="Junagadh">Junagadh</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-[#718096] pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl neu-input py-3 pl-10 pr-4 text-xs text-[#253247]"
                  />
                </div>
              </div>

              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'login' && (
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-[#238B57] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-[#718096] pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl neu-input py-3 pl-10 pr-10 text-xs text-[#253247]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#718096] hover:text-[#253247] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="btn-login-submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl neu-button-primary py-3.5 text-xs font-bold cursor-pointer"
              >
                {isSubmitting
                  ? 'Redirecting to Dashboard...'
                  : mode === 'register'
                  ? 'Continue to Onboarding'
                  : mode === 'forgot-password'
                  ? 'Send Reset Link'
                  : 'Sign In & Open Dashboard'}
                <ArrowRight size={14} />
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  id="btn-quick-demo-access"
                  onClick={() => handleLoginDemo('citizen')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl neu-button py-2.5 text-xs font-bold text-[#238B57] cursor-pointer"
                >
                  <Zap size={14} />
                  Demo Access (Skip password)
                </button>
              )}
            </form>
          )}

          <div className="pt-4 border-t border-[rgba(197,202,208,0.35)] text-center text-xs text-[#718096]">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-bold text-[#238B57] hover:underline">
                  Create citizen profile
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-[#238B57] hover:underline">
                  Sign in here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

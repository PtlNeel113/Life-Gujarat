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

    // If user entered custom credentials, preserve them in profile
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
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      {/* Brand Hero Panel */}
      <div className="relative hidden overflow-hidden bg-[#103D30] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 size-[450px] rounded-full bg-[#176B4D]/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-[400px] rounded-full bg-[#B8E986]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold tracking-tight text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-[#B8E986] text-[#176B4D]">
              <Leaf size={22} fill="currentColor" />
            </span>
            <span className="text-xl">LiFE <span className="font-normal opacity-80">Gujarat</span></span>
          </Link>

          <div className="mt-28 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#B8E986]">
              MISSION LiFE · GOVERNMENT OF GUJARAT
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
              Small actions. <br />
              <span className="text-[#B8E986]">Measurable impact.</span>
            </h1>
            <p className="text-base text-white/75 leading-relaxed">
              Join thousands of households across Gujarat tracking energy, completing daily sustainable missions,
              and adopting rooftop solar.
            </p>

            <div className="space-y-3 pt-4 text-xs text-white/80">
              <div className="flex items-center gap-2.5">
                <Check className="text-[#B8E986]" size={16} /> Official CEA grid emission calculations (0.716 kg/kWh)
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="text-[#B8E986]" size={16} /> PM Surya Ghar rooftop solar DBT subsidy navigator
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="text-[#B8E986]" size={16} /> Society collectives and verified points rewards
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50 border-t border-white/10 pt-4">
          © 2026 Climate Change Department, Government of Gujarat.
        </div>
      </div>

      {/* Auth Interaction Panel */}
      <div className="flex items-center justify-center bg-[#F6F8F3] p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#E3E8DF]">
            <Link href="/" className="flex items-center gap-2 font-bold text-[#103D30]">
              <span className="grid size-8 place-items-center rounded-lg bg-[#B8E986] text-[#176B4D]">
                <Leaf size={18} fill="currentColor" />
              </span>
              <span>LiFE Gujarat</span>
            </Link>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="rounded-2xl border-2 border-[#B8E986] bg-[#EBF4E5] p-3.5 text-xs shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-[#103D30] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Zap size={14} className="text-[#176B4D]" /> Instant Demo Access
              </span>
              <span className="text-[10px] text-[#176B4D] font-bold bg-white px-2 py-0.5 rounded-full border border-[#CBE3C3]">
                One-Click Access
              </span>
            </div>
            <p className="text-[11px] text-[#4A6356] mb-2.5">
              Enter directly into the platform without passwords:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                id="btn-demo-citizen"
                onClick={() => handleLoginDemo('citizen')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#176B4D] px-3 py-2.5 font-bold text-white shadow-xs hover:bg-[#103D30] transition text-center cursor-pointer"
              >
                <UserCheck size={14} />
                Demo Access (Dashboard)
              </button>
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleLoginDemo('admin')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white border border-[#CBD8CA] px-3 py-2.5 font-bold text-[#103D30] shadow-xs hover:bg-[#F6F8F3] transition text-center cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#176B4D]" />
                Demo Access (Admin)
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#103D30]">
              {mode === 'register'
                ? 'Create Your Account'
                : mode === 'forgot-password'
                ? 'Reset Password'
                : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-xs text-[#66736B]">
              {mode === 'register'
                ? 'Start tracking household electricity and participating in Mission LiFE.'
                : mode === 'forgot-password'
                ? 'Enter your registered email to receive verification reset link.'
                : 'Sign in to access your energy dashboard and mission streak.'}
            </p>
          </div>

          {authError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {authError}
            </div>
          )}

          {mode !== 'forgot-password' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#D7E2D3] bg-white py-3 text-xs font-bold text-[#103D30] shadow-xs transition hover:bg-[#F6F8F3] hover:border-[#176B4D] disabled:opacity-60 cursor-pointer"
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
                Continue with Google (Firebase Auth)
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E3E8DF]" />
                <span className="text-[11px] font-medium text-[#8E9B92]">OR WITH CREDENTIALS</span>
                <div className="h-px flex-1 bg-[#E3E8DF]" />
              </div>
            </div>
          )}

          {resetSent ? (
            <div className="rounded-2xl bg-[#E5F1DF] p-5 text-xs text-[#176B4D] space-y-3 font-semibold">
              <p className="font-bold text-sm">Reset link dispatched!</p>
              <p>We have simulated sending instructions to your email address.</p>
              <Link
                href="/login"
                className="inline-block rounded-xl bg-[#176B4D] px-4 py-2 text-white hover:bg-[#103D30]"
              >
                Back to Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#103D30]">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Aditi Shah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-white p-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#103D30]">District in Gujarat</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-white p-3 text-xs font-semibold text-[#103D30] outline-none focus:border-[#176B4D]"
                    >
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Rajkot">Rajkot</option>
                      <option value="Gandhinagar">Gandhinagar</option>
                      <option value="Bhavnagar">Bhavnagar</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#103D30]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-white p-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                />
              </div>

              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#103D30]">Password</label>
                    {mode === 'login' && (
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-[#176B4D] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D7E2D3] bg-white p-3 text-xs text-[#103D30] outline-none focus:border-[#176B4D]"
                  />
                </div>
              )}

              <button
                type="submit"
                id="btn-login-submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B4D] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#103D30] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting
                  ? 'Redirecting to Dashboard...'
                  : mode === 'register'
                  ? 'Continue to Onboarding'
                  : mode === 'forgot-password'
                  ? 'Send Reset Link'
                  : 'Sign In & Redirect to Dashboard'}
                <ArrowRight size={14} />
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  id="btn-quick-demo-access"
                  onClick={() => handleLoginDemo('citizen')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#B8E986] bg-[#F1F8EE] py-2.5 text-xs font-bold text-[#176B4D] hover:bg-[#E5F1DF] transition cursor-pointer"
                >
                  <Zap size={14} />
                  Demo Access (Skip password & open dashboard)
                </button>
              )}
            </form>
          )}

          <div className="pt-4 border-t border-[#E3E8DF] text-center text-xs text-[#66736B]">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-bold text-[#176B4D] hover:underline">
                  Create citizen profile
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-[#176B4D] hover:underline">
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

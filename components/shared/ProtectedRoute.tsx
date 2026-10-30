'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Leaf, ShieldAlert, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'citizen' | 'admin'
  fallbackUrl?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackUrl = '/login',
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      const redirectTarget = pathname
        ? `${fallbackUrl}?redirect=${encodeURIComponent(pathname)}`
        : fallbackUrl

      try {
        router.replace(redirectTarget)
      } catch {
        // Fallback for direct browser redirection
      }

      if (typeof window !== 'undefined') {
        window.location.replace(redirectTarget)
      }
    }
  }, [isLoading, isAuthenticated, router, pathname, fallbackUrl, hasRedirected])

  // While checking auth status, render high-fidelity Neumorphic loader
  if (isLoading || (!isAuthenticated && !hasRedirected)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#E8EDF3] p-6 text-center">
        <div className="relative mb-6">
          <div className="grid size-20 place-items-center rounded-3xl neu-raised text-[#238B57]">
            <Leaf size={34} className="animate-pulse" />
          </div>
        </div>
        <h2 className="text-lg font-extrabold text-[#253247]">Verifying Authorization</h2>
        <p className="mt-1 text-xs text-[#718096]">
          Checking Mission LiFE Gujarat citizen credentials...
        </p>
      </div>
    )
  }

  // If unauthenticated after check, keep showing redirect state while browser navigates
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#E8EDF3] p-6 text-center">
        <div className="rounded-3xl neu-raised p-8 max-w-md w-full">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl neu-inset-sm text-[#238B57] mb-4">
            <Leaf size={30} />
          </div>
          <h2 className="text-xl font-extrabold text-[#253247]">Authentication Required</h2>
          <p className="mt-2 text-xs text-[#718096] leading-relaxed">
            Please sign in or use one-click demo access to view your LiFE dashboard and energy metrics.
          </p>
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl neu-button-primary px-6 py-3 text-xs font-bold"
          >
            <span>Go to Sign In</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  // Role validation: if page requires admin role and current user is citizen
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#E8EDF3] p-6 text-center">
        <div className="rounded-3xl neu-raised p-8 max-w-md w-full">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl neu-inset-sm text-[#d97706] mb-4">
            <ShieldAlert size={30} />
          </div>
          <h2 className="text-xl font-extrabold text-[#253247]">Admin Access Required</h2>
          <p className="mt-2 text-xs text-[#718096] leading-relaxed">
            This section is restricted to Government Directorate administrators. Please switch to Admin mode in the profile menu.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl neu-button px-5 py-2.5 text-xs font-bold text-[#253247]"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-2xl neu-button-primary px-5 py-2.5 text-xs font-bold"
            >
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export const RouteGuard = ProtectedRoute

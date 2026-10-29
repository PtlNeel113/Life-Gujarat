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

  // While checking auth status, render high-fidelity loader to prevent protected content flashing
  if (isLoading || (!isAuthenticated && !hasRedirected)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F8F3] p-6 text-center">
        <div className="relative mb-6">
          <div className="size-16 animate-ping rounded-2xl bg-[#B8E986]/40 absolute inset-0" />
          <div className="relative grid size-16 place-items-center rounded-2xl bg-[#103D30] text-[#B8E986] shadow-lg">
            <Leaf size={32} className="animate-pulse" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-[#103D30]">Verifying Authorization</h2>
        <p className="mt-1 text-xs text-[#55695C]">
          Checking Mission LiFE Gujarat citizen credentials...
        </p>
      </div>
    )
  }

  // If unauthenticated after check, keep showing redirect state while browser navigates
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F8F3] p-6 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-[#E5F1DF] text-[#176B4D] mb-4">
          <Leaf size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#103D30]">Authentication Required</h2>
        <p className="mt-2 text-xs text-[#55695C] max-w-sm">
          Please sign in or use one-click demo access to view your LiFE dashboard and energy metrics.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B4D] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#103D30] transition"
        >
          <span>Go to Sign In</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  // Role validation: if page requires admin role and current user is citizen
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F8F3] p-6 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#103D30]">Admin Access Required</h2>
        <p className="mt-2 text-xs text-[#55695C] max-w-sm">
          This section is restricted to Government Directorate administrators. Please switch to Admin mode in the profile menu.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl border border-[#D7E2D3] bg-white px-4 py-2.5 text-xs font-semibold text-[#103D30] hover:bg-[#EBF4E5]"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-[#176B4D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#103D30]"
          >
            Switch Account
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Re-export as RouteGuard for semantic flexibility
export const RouteGuard = ProtectedRoute

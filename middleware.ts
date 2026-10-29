import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected application routes
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/energy',
  '/footprint',
  '/missions',
  '/energy-coach',
  '/solar-advisor',
  '/community',
  '/rewards',
  '/reports',
  '/settings',
  '/notifications',
  '/admin',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if target path is a protected route
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (isProtected) {
    const sessionCookie = request.cookies.get('life_session')
    // If no valid session cookie is present, redirect to login with destination param
    if (!sessionCookie || !sessionCookie.value || sessionCookie.value === '0') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets and public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
}

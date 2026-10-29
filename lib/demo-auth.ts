/**
 * Demo Authentication Utility
 * ---------------------------
 * Frontend-only demo session for local judging / demonstration.
 * Never stores passwords, real tokens, or grants backend privileges.
 * Clearly separates demo sessions from production authentication.
 */

const DEMO_SESSION_KEY = 'life_gujarat_demo_session'

export type DemoRole = 'citizen' | 'admin'

export interface DemoSession {
  isDemo: true
  email: string
  displayName: string
  role: DemoRole
  loginTime: number
}

/** Log in as a demo user. Stores a non-sensitive marker in localStorage. */
export function loginAsDemo(
  email: string = 'demo@lifegujarat.in',
  role: DemoRole = 'citizen'
): DemoSession {
  const session: DemoSession = {
    isDemo: true,
    email,
    displayName: email.split('@')[0] || 'Demo User',
    role,
    loginTime: Date.now(),
  }

  try {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
  } catch {
    // localStorage unavailable (private browsing, etc.) — session lives in memory only
    console.warn('[demo-auth] localStorage unavailable; session will not persist across refresh.')
  }

  return session
}

/** Retrieve the current demo session, or null if none exists. */
export function getDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.isDemo === true) return parsed as DemoSession
    return null
  } catch {
    return null
  }
}

/** Check whether a demo session is active. */
export function isDemoLoggedIn(): boolean {
  return getDemoSession() !== null
}

/** Clear the demo session and return to a logged-out state. */
export function logoutDemo(): void {
  try {
    localStorage.removeItem(DEMO_SESSION_KEY)
  } catch {
    // no-op
  }
}

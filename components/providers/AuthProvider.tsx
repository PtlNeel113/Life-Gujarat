'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { UserProfile } from '@/lib/types'
import { dataStore } from '@/lib/data-store'
import { auth, signInWithGoogle, signOutUser, testFirestoreConnection } from '@/lib/firebase'
import { syncUserProfileToFirestore, fetchUserProfileFromFirestore } from '@/lib/firestore-sync'

interface AuthContextType {
  user: UserProfile | null
  firebaseUser: FirebaseUser | null
  isAuthenticated: boolean
  isLoading: boolean
  loginWithGoogle: () => Promise<UserProfile>
  login: (userUpdate?: Partial<UserProfile>, role?: 'citizen' | 'admin') => UserProfile
  logout: () => Promise<void>
  switchRole: (role: 'citizen' | 'admin') => UserProfile
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const syncStateFromStore = useCallback(() => {
    try {
      const authOk = dataStore.isAuthenticated()
      setIsAuthenticated(authOk)
      if (authOk) {
        setUser(dataStore.getUser())
      } else {
        setUser(null)
      }
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial connection validation
    testFirestoreConnection().catch(() => {})

    // Sync from local store first
    syncStateFromStore()

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const isGovAdmin =
          fbUser.email?.endsWith('@gujarat.gov.in') ||
          fbUser.email?.toLowerCase().includes('admin') ||
          false
        const role = isGovAdmin ? 'admin' : 'citizen'

        const baseProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Gujarat Citizen',
          email: fbUser.email || 'citizen@life.gujarat.gov.in',
          role,
          district: 'Ahmedabad',
          discom: 'UGVCL',
          consumerNumber: '02148/99120',
          householdMembers: 4,
          homeType: 'apartment',
          points: 450,
          streakDays: 7,
          joinedDate: new Date().toISOString().split('T')[0],
          language: 'en',
          avatarInitials: (fbUser.displayName || 'GC')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        }

        // Check if existing profile in Firestore
        try {
          const remote = await fetchUserProfileFromFirestore(fbUser.uid)
          const merged = remote ? { ...baseProfile, ...remote } : baseProfile
          const updated = dataStore.login(merged, role)
          setUser(updated)
          setIsAuthenticated(true)
          // Persist to Firestore
          await syncUserProfileToFirestore(updated)
        } catch {
          const updated = dataStore.login(baseProfile, role)
          setUser(updated)
          setIsAuthenticated(true)
        }
      }
      setIsLoading(false)
    })

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key?.includes('life_gujarat_auth_session') ||
        e.key?.includes('life_gujarat_current_user')
      ) {
        syncStateFromStore()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorage)
    }
  }, [syncStateFromStore])

  const loginWithGoogle = async (): Promise<UserProfile> => {
    setIsLoading(true)
    try {
      const fbUser = await signInWithGoogle()
      const isGovAdmin =
        fbUser.email?.endsWith('@gujarat.gov.in') ||
        fbUser.email?.toLowerCase().includes('admin') ||
        false
      const role = isGovAdmin ? 'admin' : 'citizen'

      const userProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Gujarat Citizen',
        email: fbUser.email || 'citizen@life.gujarat.gov.in',
        role,
        district: 'Ahmedabad',
        discom: 'UGVCL',
        consumerNumber: '02148/99120',
        householdMembers: 4,
        homeType: 'apartment',
        points: 450,
        streakDays: 7,
        joinedDate: new Date().toISOString().split('T')[0],
        language: 'en',
        avatarInitials: (fbUser.displayName || 'GC')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      }

      const updated = dataStore.login(userProfile, role)
      setUser(updated)
      setIsAuthenticated(true)
      await syncUserProfileToFirestore(updated).catch(() => {})
      return updated
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userUpdate?: Partial<UserProfile>, role?: 'citizen' | 'admin') => {
    const updatedUser = dataStore.login(userUpdate, role)
    setUser(updatedUser)
    setIsAuthenticated(true)
    setIsLoading(false)
    syncUserProfileToFirestore(updatedUser).catch(() => {})
    return updatedUser
  }

  const logout = async () => {
    await signOutUser().catch(() => {})
    dataStore.logout()
    setUser(null)
    setFirebaseUser(null)
    setIsAuthenticated(false)
    setIsLoading(false)
  }

  const switchRole = (role: 'citizen' | 'admin') => {
    const targetUser = dataStore.switchRole(role)
    setUser(targetUser)
    setIsAuthenticated(true)
    setIsLoading(false)
    syncUserProfileToFirestore(targetUser).catch(() => {})
    return targetUser
  }

  const refreshUser = () => {
    if (dataStore.isAuthenticated()) {
      const u = dataStore.getUser()
      setUser(u)
      syncUserProfileToFirestore(u).catch(() => {})
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        isLoading,
        loginWithGoogle,
        login,
        logout,
        switchRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

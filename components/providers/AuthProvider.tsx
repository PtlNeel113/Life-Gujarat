'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { UserProfile } from '@/lib/types'
import { dataStore } from '@/lib/data-store'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userUpdate?: Partial<UserProfile>, role?: 'citizen' | 'admin') => UserProfile
  logout: () => void
  switchRole: (role: 'citizen' | 'admin') => UserProfile
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const syncStateFromStore = useCallback(() => {
    try {
      const auth = dataStore.isAuthenticated()
      setIsAuthenticated(auth)
      if (auth) {
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
    syncStateFromStore()

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key?.includes('life_gujarat_auth_session') ||
        e.key?.includes('life_gujarat_current_user')
      ) {
        syncStateFromStore()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [syncStateFromStore])

  const login = (userUpdate?: Partial<UserProfile>, role?: 'citizen' | 'admin') => {
    const updatedUser = dataStore.login(userUpdate, role)
    setUser(updatedUser)
    setIsAuthenticated(true)
    setIsLoading(false)
    return updatedUser
  }

  const logout = () => {
    dataStore.logout()
    setUser(null)
    setIsAuthenticated(false)
    setIsLoading(false)
  }

  const switchRole = (role: 'citizen' | 'admin') => {
    const targetUser = dataStore.switchRole(role)
    setUser(targetUser)
    setIsAuthenticated(true)
    setIsLoading(false)
    return targetUser
  }

  const refreshUser = () => {
    if (dataStore.isAuthenticated()) {
      setUser(dataStore.getUser())
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
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

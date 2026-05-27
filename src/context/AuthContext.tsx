'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'

const ADMIN_EMAIL = 'heonaliu@gmail.com'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  unauthorizedAttempt: boolean
  clearUnauthorizedAttempt: () => void
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: false,
  unauthorizedAttempt: false,
  clearUnauthorizedAttempt: () => {},
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initAuth = async () => {
      try {
        const { auth } = await import('@/lib/firebase')
        if (!auth) { setLoading(false); return }
        const { onAuthStateChanged } = await import('firebase/auth')
        setLoading(true)
        unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u)
          setLoading(false)
        })
      } catch (e) {
        console.warn('Auth init failed:', e)
        setLoading(false)
      }
    }

    initAuth()
    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await import('@/lib/firebase')
      if (!auth || !googleProvider) return
      const { signInWithPopup, signOut } = await import('firebase/auth')

      const result = await signInWithPopup(auth, googleProvider)

      // Block anyone who isn't the admin — sign them out immediately
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth)
        setUnauthorizedAttempt(true)
      }
    } catch (error: any) {
      // popup-closed-by-user is not an error worth surfacing
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error('Sign in error:', error)
      }
    }
  }

  const signOutUser = async () => {
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth) return
      const { signOut } = await import('firebase/auth')
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isAdmin = user?.email === ADMIN_EMAIL

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      unauthorizedAttempt,
      clearUnauthorizedAttempt: () => setUnauthorizedAttempt(false),
      signInWithGoogle,
      signOutUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

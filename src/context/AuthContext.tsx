'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'

const ADMIN_EMAIL = 'heonaliu@gmail.com'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: false,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lazy-load Firebase auth only on client
    let unsubscribe: (() => void) | undefined

    const initAuth = async () => {
      try {
        const { auth } = await import('@/lib/firebase')
        if (!auth) {
          setLoading(false)
          return
        }
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
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await import('@/lib/firebase')
      if (!auth || !googleProvider) return
      const { signInWithPopup } = await import('firebase/auth')
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Sign in error:', error)
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
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

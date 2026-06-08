'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, User, Palette, Code2, BookOpen, Mail,
  Menu, X, Sparkles, ShieldX, KeyRound,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/',         label: 'Home',     Icon: Home     },
  { href: '/about',    label: 'About',    Icon: User     },
  { href: '/art',      label: 'Art',      Icon: Palette  },
  { href: '/projects', label: 'Projects', Icon: Code2    },
  { href: '/blog',     label: 'Blog',     Icon: BookOpen },
  { href: '/contact',  label: 'Contact',  Icon: Mail     },
]

const GATE_CODE = (process.env.NEXT_PUBLIC_SIGNIN_GATE_CODE || '').toUpperCase()

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAdmin, user, signInWithGoogle, signOutUser, unauthorizedAttempt, clearUnauthorizedAttempt } = useAuth()

  const [showSignInGate, setShowSignInGate] = useState(false)
  const [gateInput, setGateInput] = useState('')
  const [gateVerified, setGateVerified] = useState(false)
  const [gateError, setGateError] = useState(false)

  const openSignInGate = () => {
    setGateInput('')
    setGateVerified(false)
    setGateError(false)
    setShowSignInGate(true)
  }

  const closeSignInGate = () => setShowSignInGate(false)

  const handleGateInputChange = (value: string) => {
    const next = value.toUpperCase().slice(0, 4)
    setGateInput(next)
    setGateError(false)
    if (next.length === 4) {
      if (GATE_CODE && next === GATE_CODE) {
        setGateVerified(true)
      } else {
        setGateError(true)
        setGateVerified(false)
        setTimeout(() => {
          setGateInput('')
          setGateError(false)
        }, 700)
      }
    } else {
      setGateVerified(false)
    }
  }

  const handleGateSignIn = () => {
    closeSignInGate()
    signInWithGoogle()
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ─── Main bar ─── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={`
            w-full max-w-4xl flex items-center justify-between
            px-6 py-3.5 rounded-full
            glass
            transition-shadow duration-300
            ${scrolled ? 'shadow-medium' : 'shadow-soft'}
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#671372] flex items-center justify-center flex-shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-[#671372] to-[#8B1D9F] bg-clip-text text-transparent hidden sm:block">
              heona.
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1.5">
            {navLinks.map(({ href, label, Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                      transition-colors duration-200
                      ${active
                        ? 'text-[#671372] dark:text-[#c44cf0]'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    `}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-[#671372]/10 dark:bg-[#671372]/20"
                        transition={{ type: 'spring', bounce: 0.18, duration: 0.42 }}
                      />
                    )}
                    <Icon
                      size={14}
                      className={`relative z-10 flex-shrink-0 ${active ? 'text-[#671372] dark:text-[#c44cf0]' : ''}`}
                    />
                    <span className="relative z-10">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAdmin && (
              <button
                onClick={signOutUser}
                className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full
                           text-gray-500 dark:text-gray-400
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-colors duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Admin
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen
                  ? <motion.div key="x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <X size={18} />
                    </motion.div>
                  : <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Menu size={18} />
                    </motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ─── Unauthorized access banner ─── */}
      <AnimatePresence>
        {unauthorizedAttempt && (
          <motion.div
            key="unauth-banner"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60]
                       flex items-center gap-3
                       px-5 py-3 rounded-2xl
                       bg-red-50 dark:bg-red-950/80
                       border border-red-200 dark:border-red-800
                       shadow-large backdrop-blur-sm"
          >
            <ShieldX size={15} className="text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Unauthorized access — this account is not permitted.
            </p>
            <button
              onClick={clearUnauthorizedAttempt}
              className="ml-1 p-0.5 rounded-lg text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile drawer ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-[72px] left-4 right-4 z-50 md:hidden
                         rounded-3xl overflow-hidden
                         bg-white dark:bg-gray-900
                         border border-gray-100 dark:border-gray-800
                         shadow-large"
            >
              <ul className="p-3 space-y-0.5">
                {navLinks.map(({ href, label, Icon }, i) => {
                  const active = isActive(href)
                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={href}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                          transition-colors duration-150
                          ${active
                            ? 'bg-[#671372]/10 dark:bg-[#671372]/20 text-[#671372] dark:text-[#c44cf0]'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <Icon size={16} className="flex-shrink-0" />
                        {label}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Sign in / admin strip */}
              <div className="border-t border-gray-100 dark:border-gray-800 p-3">
                {isAdmin ? (
                  <button
                    onClick={signOutUser}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium
                               text-gray-600 dark:text-gray-400
                               hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Signed in as admin — sign out
                  </button>
                ) : !user ? (
                  <button
                    onClick={openSignInGate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium
                               bg-[#671372] text-white hover:bg-[#8B1D9F] transition-colors"
                  >
                    Sign in with Google
                  </button>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Sign-in verification gate ─── */}
      <AnimatePresence>
        {showSignInGate && (
          <motion.div
            key="gate-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm
                       flex items-center justify-center px-4"
            onClick={closeSignInGate}
          >
            <motion.div
              key="gate-panel"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900 dark:text-white">
                  <KeyRound size={17} className="text-[#671372] dark:text-[#c44cf0]" /> Verify to continue
                </h2>
                <button
                  onClick={closeSignInGate}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                             flex items-center justify-center
                             hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={14} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Enter your access code to continue.
              </p>

              <input
                type="password"
                value={gateInput}
                onChange={(e) => handleGateInputChange(e.target.value)}
                placeholder="••••"
                maxLength={4}
                autoFocus
                className={`w-full text-center font-mono text-lg tracking-[0.4em] uppercase
                            px-4 py-3 rounded-2xl border bg-transparent
                            text-gray-900 dark:text-white
                            placeholder:tracking-normal placeholder:font-sans placeholder:text-sm
                            focus:outline-none focus:ring-2 transition-colors
                            ${gateError
                              ? 'border-red-300 dark:border-red-700 focus:ring-red-200 dark:focus:ring-red-900/40'
                              : gateVerified
                                ? 'border-emerald-300 dark:border-emerald-700 focus:ring-emerald-200 dark:focus:ring-emerald-900/40'
                                : 'border-gray-200 dark:border-gray-700 focus:ring-[#671372]/20'
                            }`}
              />
              {gateError && (
                <p className="text-xs text-red-500 mt-2 text-center">Incorrect code — try again.</p>
              )}

              <AnimatePresence>
                {gateVerified && (
                  <motion.button
                    key="gate-google-btn"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onClick={handleGateSignIn}
                    className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold
                               bg-[#671372] text-white hover:bg-[#8B1D9F] transition-colors"
                  >
                    Sign in with Google
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

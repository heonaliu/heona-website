'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, User, Palette, Code2, BookOpen, Mail,
  Menu, X, Sparkles,
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAdmin, user, signInWithGoogle, signOutUser } = useAuth()

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
            w-full max-w-3xl flex items-center justify-between
            px-5 py-3 rounded-full
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
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label, Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
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
                      size={13.5}
                      className={`relative z-10 flex-shrink-0 ${active ? 'text-[#671372] dark:text-[#c44cf0]' : ''}`}
                    />
                    <span className="relative z-10">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
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
                    onClick={signInWithGoogle}
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
    </>
  )
}

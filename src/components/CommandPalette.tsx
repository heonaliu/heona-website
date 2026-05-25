'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, User, Palette, Code2, BookOpen, Mail, Sun, Moon, X } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const commands = [
  { id: 'home', label: 'Go to Home', icon: Home, href: '/', category: 'Navigation' },
  { id: 'about', label: 'Go to About', icon: User, href: '/about', category: 'Navigation' },
  { id: 'art', label: 'Go to Art', icon: Palette, href: '/art', category: 'Navigation' },
  { id: 'projects', label: 'Go to Projects', icon: Code2, href: '/projects', category: 'Navigation' },
  { id: 'blog', label: 'Go to Blog', icon: BookOpen, href: '/blog', category: 'Navigation' },
  { id: 'contact', label: 'Go to Contact', icon: Mail, href: '/contact', category: 'Navigation' },
  { id: 'theme', label: 'Toggle Theme', icon: Sun, href: null, category: 'Actions' },
  { id: 'github', label: 'Open GitHub', icon: Code2, href: 'https://github.com/heonaliu', category: 'Links', external: true },
  { id: 'email', label: 'Send Email', icon: Mail, href: 'mailto:heonaliu@gmail.com', category: 'Links', external: true },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const { toggleTheme, isDark } = useTheme()

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
    setQuery('')
    setSelected(0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (cmd: typeof commands[0]) => {
    if (cmd.id === 'theme') {
      toggleTheme()
    } else if (cmd.href) {
      if ((cmd as any).external) {
        window.open(cmd.href, '_blank')
      } else {
        router.push(cmd.href)
      }
    }
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      if (filtered[selected]) handleSelect(filtered[selected])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[1001] w-[90vw] max-w-xl"
          >
            <div className="glass border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-large overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelected(0)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-center text-gray-400">No commands found</p>
                ) : (
                  <>
                    {['Navigation', 'Actions', 'Links'].map((category) => {
                      const items = filtered.filter((c) => c.category === category)
                      if (!items.length) return null
                      return (
                        <div key={category}>
                          <p className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            {category}
                          </p>
                          {items.map((cmd, globalIdx) => {
                            const idx = filtered.indexOf(cmd)
                            const Icon = cmd.id === 'theme' ? (isDark ? Sun : Moon) : cmd.icon
                            return (
                              <button
                                key={cmd.id}
                                onClick={() => handleSelect(cmd)}
                                onMouseEnter={() => setSelected(idx)}
                                className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-left transition-colors ${
                                  selected === idx
                                    ? 'bg-[#671372]/10 dark:bg-[#671372]/20 text-[#671372] dark:text-[#c44cf0]'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                              >
                                <Icon size={15} className="flex-shrink-0" />
                                {cmd.label}
                                {cmd.id === 'theme' && (
                                  <span className="ml-auto text-xs text-gray-400">
                                    Switch to {isDark ? 'light' : 'dark'}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-[10px] text-gray-400">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">esc</kbd> close</span>
                <span className="ml-auto flex items-center gap-1">
                  <kbd className="font-mono">⌘K</kbd>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

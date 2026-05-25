'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Moon size={16} className="text-[#c44cf0]" />
        ) : (
          <Sun size={16} className="text-[#671372]" />
        )}
      </motion.div>
    </motion.button>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setLoading(false), 300)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950"
        >
          {/* Background blur blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#671372]/20 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#8B1D9F]/20 blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-16 h-16 rounded-2xl bg-[#671372] flex items-center justify-center shadow-purple-lg"
            >
              <span className="text-white font-bold text-xl">HL</span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">initializing...</p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#671372] via-[#8B1D9F] to-[#c44cf0]"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

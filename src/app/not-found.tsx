'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#671372]/8 dark:bg-[#671372]/12 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[#8B1D9F]/6 dark:bg-[#8B1D9F]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center max-w-sm"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.05 }}
          className="w-14 h-14 rounded-2xl bg-[#671372] flex items-center justify-center mx-auto mb-8 shadow-purple-lg"
        >
          <Sparkles size={20} className="text-white" />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-8xl font-extrabold tracking-tight
                     bg-gradient-to-br from-[#671372] to-[#c44cf0]
                     bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
        >
          This page doesn&apos;t exist — it may have been moved or the link is broken.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-[#671372] text-white text-sm font-semibold
                       hover:bg-[#8B1D9F] transition-colors shadow-purple-lg"
          >
            <ArrowLeft size={14} /> Back home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

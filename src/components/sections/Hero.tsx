'use client'

import React from 'react'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Palette, Hammer, Terminal } from 'lucide-react'

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
}

const item: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

const roles = [
  { Icon: Code2,    label: 'Developer' },
  { Icon: Palette,  label: 'Artist'    },
  { Icon: Hammer,   label: 'Builder'   },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-[#0d0d14]" />
        <div className="bg-mesh-gradient absolute inset-0 opacity-70 dark:opacity-50" />

        {/* blobs */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-[20%] w-72 h-72 rounded-full bg-[#671372]/[0.14] dark:bg-[#671372]/[0.09] blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], x: [0, -18, 0], y: [0, 24, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 left-[15%] w-64 h-64 rounded-full bg-[#8B1D9F]/[0.10] dark:bg-[#8B1D9F]/[0.07] blur-3xl"
        />

        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #671372 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="w-full max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ─ Left: copy ─ */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-7">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full
                               bg-[#671372]/10 dark:bg-[#671372]/20
                               border border-[#671372]/20 dark:border-[#671372]/30
                               text-[#671372] dark:text-[#c44cf0] text-xs font-semibold">
                <Sparkles size={11} />
                Open to opportunities
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={item}
              className="text-6xl md:text-7xl font-extrabold leading-[1.03] tracking-tight
                         text-gray-900 dark:text-white mb-5"
            >
              Hi, I&apos;m{' '}
              <span className="gradient-text">Heona</span>
            </motion.h1>

            {/* Roles */}
            <motion.div variants={item} className="flex flex-wrap gap-2 mb-6">
              {roles.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                             bg-white dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-sm font-medium text-gray-700 dark:text-gray-300
                             shadow-soft"
                >
                  <Icon size={12} className="text-[#671372] dark:text-[#c44cf0]" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={item}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-9 max-w-[44ch]"
            >
              I build things for the web, create digital art, and explore the
              intersection where engineering meets creativity. CS student — driven
              by curiosity and a love of thoughtful design.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full
                             bg-[#671372] hover:bg-[#8B1D9F]
                             text-white text-sm font-semibold
                             shadow-purple-lg transition-all duration-200"
                >
                  View Projects <ArrowRight size={14} />
                </motion.button>
              </Link>

              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full
                             bg-white dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-gray-800 dark:text-gray-200 text-sm font-semibold
                             shadow-soft hover:shadow-medium transition-all duration-200"
                >
                  Read Blog
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full
                             border border-[#671372]/25 dark:border-[#671372]/35
                             text-[#671372] dark:text-[#c44cf0] text-sm font-semibold
                             hover:bg-[#671372]/5 dark:hover:bg-[#671372]/10
                             transition-all duration-200"
                >
                  Contact Me
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="flex items-center gap-10 mt-12 pt-8
                         border-t border-gray-100 dark:border-gray-800"
            >
              {[
                { value: '10+', label: 'Projects Built' },
                { value: '3+',  label: 'Years Coding'  },
                { value: '∞',   label: 'Things to Learn' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ─ Right: visual card ─ */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="relative"
            >
              {/* Main card */}
              <div className="relative w-72 h-72 md:w-80 md:h-80">

                {/* Floating icon cards */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-5 -right-5 w-20 h-20
                             bg-white dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700
                             rounded-2xl shadow-medium
                             flex items-center justify-center"
                >
                  <Code2 size={26} className="text-[#671372] dark:text-[#c44cf0]" />
                </motion.div>

                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-3 -left-7 w-16 h-16
                             bg-white dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700
                             rounded-2xl shadow-medium
                             flex items-center justify-center"
                >
                  <Palette size={20} className="text-[#671372] dark:text-[#c44cf0]" />
                </motion.div>

                {/* Centre avatar */}
                <div className="w-full h-full rounded-[2rem] overflow-hidden
                                bg-gradient-to-br from-[#671372]/15 via-[#8B1D9F]/10 to-[#c44cf0]/8
                                dark:from-[#671372]/25 dark:via-[#8B1D9F]/15 dark:to-[#c44cf0]/10
                                border border-[#671372]/10 dark:border-[#671372]/20
                                shadow-large flex items-center justify-center">
                  <div className="text-center space-y-3 px-6">
                    {/* Static monogram */}
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#671372]
                                    flex items-center justify-center shadow-purple-lg">
                      <Terminal size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-800 dark:text-gray-100">
                        Heona Liu
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        CS Student & Digital Artist
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute right-[-60px] top-1/2 -translate-y-1/2
                             bg-white dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700
                             rounded-2xl px-3.5 py-2.5 shadow-medium whitespace-nowrap"
                >
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Currently</p>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                    🎵 Making art
                  </p>
                </motion.div>
              </div>

              {/* ⌘K hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                           flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800
                                font-mono text-[10px] text-gray-500 dark:text-gray-400">
                  ⌘K
                </kbd>
                to search
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-5 h-8 border-2 border-gray-300 dark:border-gray-700 rounded-full
                     flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-[#671372] dark:bg-[#c44cf0] rounded-full" />
        </motion.div>
        <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400 dark:text-gray-600">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Palette } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const artPreviews = [
  { id: 1, title: 'Purple Dreams',      medium: 'Procreate',   year: '2024', gradient: 'from-purple-400 via-pink-500 to-rose-400'     },
  { id: 2, title: 'Ocean Flow',         medium: 'Illustrator', year: '2024', gradient: 'from-blue-400 via-cyan-500 to-teal-400'        },
  { id: 3, title: 'Character Sketch',   medium: 'Procreate',   year: '2023', gradient: 'from-orange-400 via-amber-400 to-yellow-300'   },
  { id: 4, title: 'Neon City',          medium: 'Photoshop',   year: '2023', gradient: 'from-violet-500 via-purple-500 to-indigo-500'  },
]

export default function FeaturedArt() {
  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/40">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#671372] dark:text-[#c44cf0] mb-2 flex items-center gap-2">
                <Palette size={11} /> Creative
              </p>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                Art Gallery
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Digital illustrations, concept art, and creative experiments
              </p>
            </div>
            <Link href="/art">
              <motion.span
                whileHover={{ x: 3 }}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium
                           text-[#671372] dark:text-[#c44cf0] cursor-pointer hover:underline"
              >
                Full gallery <ArrowRight size={14} />
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artPreviews.map((art, i) => (
            <AnimatedSection key={art.id} delay={i * 0.08}>
              <Link href="/art">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer
                             shadow-soft hover:shadow-purple-lg transition-shadow duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient}`} />
                  <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45
                                  flex items-end transition-all duration-300">
                    <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full">
                      <p className="text-white text-sm font-semibold">{art.title}</p>
                      <p className="text-white/65 text-xs">{art.medium} · {art.year}</p>
                    </div>
                  </div>
                  {/* purple border on hover */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-[#671372]
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="text-center mt-10">
            <Link href="/art">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                           bg-white dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700
                           text-sm font-semibold text-gray-800 dark:text-gray-200
                           shadow-soft hover:shadow-medium hover:border-[#671372]/25
                           transition-all duration-200"
              >
                <Palette size={14} /> Explore the full gallery
              </motion.button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

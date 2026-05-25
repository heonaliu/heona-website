'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Palette } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const artPreviews = [
  { id: 1, title: 'Purple Dreams',    medium: 'Procreate',   year: '2024', gradient: 'from-purple-400 via-pink-500 to-rose-400'     },
  { id: 2, title: 'Ocean Flow',       medium: 'Illustrator', year: '2024', gradient: 'from-blue-400 via-cyan-500 to-teal-400'        },
  { id: 3, title: 'Character Sketch', medium: 'Procreate',   year: '2023', gradient: 'from-orange-400 via-amber-400 to-yellow-300'   },
  { id: 4, title: 'Neon City',        medium: 'Photoshop',   year: '2023', gradient: 'from-violet-500 via-purple-500 to-indigo-500'  },
]

export default function FeaturedArt() {
  return (
    <section className="section-white py-24 lg:py-32">
      <Container>

        {/* Section header */}
        <AnimatedSection className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>
                <Palette size={10} className="inline mr-1.5 -mt-px" />
                Creative
              </SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                Art Gallery
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md leading-relaxed">
                Digital illustrations, concept art, and creative experiments
              </p>
            </div>
            <Link href="/art">
              <motion.span
                whileHover={{ x: 3 }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold
                           text-[#671372] dark:text-[#c44cf0] cursor-pointer
                           hover:underline underline-offset-2 shrink-0"
              >
                Full gallery <ArrowRight size={14} />
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>

        {/* Gallery grid — deliberately constrained height */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {artPreviews.map((art, i) => (
            <AnimatedSection key={art.id} delay={i * 0.08}>
              <Link href="/art">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="group relative h-[260px] rounded-3xl overflow-hidden cursor-pointer
                             shadow-soft hover:shadow-purple-lg transition-shadow duration-300"
                >
                  {/* Art placeholder */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient}`} />
                  <div
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Purple border on hover */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-[#671372]
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* Caption */}
                  <div className="absolute inset-x-0 bottom-0
                                  bg-gradient-to-t from-black/70 via-black/30 to-transparent
                                  p-4 translate-y-full group-hover:translate-y-0
                                  transition-transform duration-300 z-20">
                    <p className="text-white text-sm font-semibold leading-none">{art.title}</p>
                    <p className="text-white/60 text-xs mt-1">{art.medium} · {art.year}</p>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.3} className="flex justify-center mt-12">
          <Link href="/art">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full
                         bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         text-sm font-semibold text-gray-800 dark:text-gray-200
                         shadow-soft hover:shadow-medium
                         hover:border-[#671372]/25 dark:hover:border-[#671372]/35
                         transition-all duration-200"
            >
              <Palette size={15} /> Explore the full gallery
            </motion.button>
          </Link>
        </AnimatedSection>

      </Container>
    </section>
  )
}

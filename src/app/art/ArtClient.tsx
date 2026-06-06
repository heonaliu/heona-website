'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Calendar, Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const artworks = [
  {
    id: 1,
    title: 'Purple Dreams',
    medium: 'Procreate',
    year: '2024',
    description: 'An exploration of color and emotion through abstract digital painting.',
    reflection: 'This piece was born from a late-night creative session where I just let the brush flow without planning. Sometimes the best work comes from letting go of control.',
    gradient: 'from-purple-400 via-pink-500 to-rose-400',
    tags: ['abstract', 'digital'],
  },
  {
    id: 2,
    title: 'Ocean Flow',
    medium: 'Adobe Illustrator',
    year: '2024',
    description: 'Vector art inspired by water and fluid dynamics.',
    reflection: 'I was fascinated by how water moves — there is math in every wave. This piece tries to capture that dance between chaos and order.',
    gradient: 'from-blue-400 via-cyan-500 to-teal-400',
    tags: ['vector', 'nature'],
  },
  {
    id: 3,
    title: 'Character Sketch',
    medium: 'Procreate',
    year: '2023',
    description: 'Character design exploration for a personal game concept.',
    reflection: 'My first serious attempt at character design. Learned so much about anatomy, expression, and storytelling through a single image.',
    gradient: 'from-orange-400 via-amber-400 to-yellow-300',
    tags: ['character', 'concept art'],
  },
  {
    id: 4,
    title: 'Neon City',
    medium: 'Photoshop',
    year: '2023',
    description: 'Cyberpunk cityscape at night, inspired by sci-fi aesthetics.',
    reflection: 'Cities fascinate me — millions of stories in one frame. This is my love letter to that chaos.',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    tags: ['environment', 'sci-fi'],
  },
  {
    id: 5,
    title: 'Minimalist Botanics',
    medium: 'Procreate',
    year: '2024',
    description: 'Clean botanical illustrations in a minimal style.',
    reflection: 'Sometimes simple is most powerful. These botanical studies taught me that restraint can be its own form of creativity.',
    gradient: 'from-green-400 via-emerald-400 to-teal-500',
    tags: ['minimal', 'botanical'],
  },
  {
    id: 6,
    title: 'Code & Canvas',
    medium: 'p5.js (generative)',
    year: '2024',
    description: 'Generative art created with code — where programming meets painting.',
    reflection: 'What if code was a brush? This piece is a celebration of that question. Every curve is a function, every color a variable.',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
    tags: ['generative', 'code art'],
  },
]

const artJourney = [
  { year: '2018', milestone: 'First sketches with pencil and paper. Just doodles at first.' },
  { year: '2020', milestone: 'Discovered digital art. Got my first drawing tablet — game changer.' },
  { year: '2021', milestone: 'Started sharing work online. Learned from incredible artists in the community.' },
  { year: '2022', milestone: 'Explored generative art — where code meets canvas. A new obsession.' },
  { year: '2023', milestone: 'Developed a consistent personal style. Started client commissions.' },
  { year: '2024', milestone: 'Integrating art and code more intentionally. Exploring interactive experiences.' },
]

export default function ArtClient() {
  const [selected, setSelected] = useState<typeof artworks[0] | null>(null)
  const [filter, setFilter] = useState('all')

  const allTags = ['all', ...Array.from(new Set(artworks.flatMap((a) => a.tags)))]
  const filtered = filter === 'all' ? artworks : artworks.filter((a) => a.tags.includes(filter))

  const currentIndex = selected ? artworks.findIndex((a) => a.id === selected.id) : -1
  const goNext = () => { if (currentIndex < artworks.length - 1) setSelected(artworks[currentIndex + 1]) }
  const goPrev = () => { if (currentIndex > 0) setSelected(artworks[currentIndex - 1]) }

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-14 lg:pt-40 lg:pb-20">
        <Container>
          <AnimatedSection>
            <SectionLabel>Creative Work</SectionLabel>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                           leading-[1.1] tracking-tight
                           text-gray-900 dark:text-white mb-4">
              Art Gallery
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              Digital illustrations, character designs, and creative experiments.
              Click any piece for a closer look.
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Filter Tags ═══════════════════════════════════ */}
      <section className="section-tint py-3">
        <Container>
          <AnimatedSection>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    filter === tag
                      ? 'bg-[#671372] text-white shadow-purple-lg'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Gallery Grid ══════════════════════════════════ */}
      <section className="section-white py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((art, i) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  onClick={() => setSelected(art)}
                  className="group relative h-[280px] rounded-3xl overflow-hidden cursor-pointer
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

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45
                                  transition-all duration-300
                                  flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <ZoomIn size={22} />
                      <span className="text-sm font-semibold">{art.title}</span>
                      <span className="text-xs opacity-75">{art.medium}</span>
                    </div>
                  </div>

                  {/* Purple border on hover */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-[#671372]
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* Bottom label */}
                  <div className="absolute inset-x-0 bottom-0 p-4
                                  bg-gradient-to-t from-black/65 to-transparent
                                  translate-y-full group-hover:translate-y-0
                                  transition-transform duration-300 z-20">
                    <p className="text-white text-sm font-semibold leading-none">{art.title}</p>
                    <p className="text-white/65 text-xs mt-1">{art.year}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Container>
      </section>

      {/* ══ Art Journey ═══════════════════════════════════ */}
      <section className="section-subtle py-12 lg:py-16">
        <Container>
          <AnimatedSection className="mb-14">
            <SectionLabel>Background</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Art Journey
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              How programming and art connect for me — two ways of making things that weren&apos;t there before.
            </p>
          </AnimatedSection>

          <div className="max-w-2xl relative">
            {/* Vertical rule */}
            <div className="absolute left-4 top-6 bottom-6 w-px
                            bg-gradient-to-b from-[#671372] via-[#8B1D9F]/50 to-transparent" />

            <div className="flex flex-col gap-7">
              {artJourney.map(({ year, milestone }, i) => (
                <AnimatedSection key={year} delay={i * 0.08} direction="left">
                  <div className="flex gap-6">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-[#671372]
                                    flex items-center justify-center flex-shrink-0 shadow-purple-lg mt-0.5"
                         style={{ marginLeft: '0px' }}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="text-xs font-mono font-semibold
                                       text-[#671372] dark:text-[#c44cf0]
                                       bg-[#671372]/09 dark:bg-[#671372]/18
                                       px-2.5 py-1 rounded-full">
                        {year}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2.5 leading-relaxed">
                        {milestone}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection delay={0.3} className="mt-14 max-w-2xl">
            <div className="p-8
                            bg-white dark:bg-gray-900
                            border border-gray-100 dark:border-gray-800
                            rounded-3xl shadow-soft">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                💭 On the connection between code and art
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Both coding and art are fundamentally about problem-solving with constraints. In
                programming, you have languages, APIs, and logic. In art, you have colors,
                composition, and medium. The process of going from blank page to something
                meaningful — that journey is identical. Both teach you to iterate, to embrace
                failure, and to find beauty in the act of making.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Lightbox Modal ════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="art-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Art display */}
              <div className={`relative w-full aspect-[4/3] bg-gradient-to-br ${selected.gradient} rounded-t-[2rem] flex items-center justify-center overflow-hidden`}>
                <div
                  className="absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <p className="text-white/50 text-xs relative z-10">Artwork preview</p>

                {/* Navigation arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  disabled={currentIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2
                             w-9 h-9 rounded-full bg-black/30 hover:bg-black/50
                             flex items-center justify-center text-white
                             disabled:opacity-30 transition-colors z-20"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  disabled={currentIndex === artworks.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             w-9 h-9 rounded-full bg-black/30 hover:bg-black/50
                             flex items-center justify-center text-white
                             disabled:opacity-30 transition-colors z-20"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Info */}
              <div style={{ padding: '1.75rem' }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selected.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Layers size={11} /> {selected.medium}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={11} /> {selected.year}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full
                               bg-gray-100 dark:bg-gray-700
                               flex items-center justify-center
                               hover:bg-gray-200 dark:hover:bg-gray-600
                               transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  {selected.description}
                </p>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/40
                                rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] font-semibold uppercase tracking-wider
                                text-[#671372] dark:text-[#c44cf0] mb-2">
                    Artist&apos;s Note
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    &ldquo;{selected.reflection}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {selected.tags.map((tag) => (
                    <span key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium
                                     bg-[#671372]/10 dark:bg-[#671372]/25
                                     text-[#671372] dark:text-[#c44cf0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

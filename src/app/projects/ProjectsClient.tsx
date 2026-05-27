'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Search, X, ChevronRight, Clock, Zap } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const allTags = ['All', 'React', 'Next.js', 'Firebase', 'Python', 'Machine Learning', 'UI/UX', 'Tailwind CSS', 'TypeScript', 'Node.js']

const projects = [
  {
    id: 1,
    title: 'Heona Portfolio',
    description: 'This portfolio website — built with Next.js, Framer Motion, and Firebase. Features a blog system with admin auth, art gallery with lightbox, and premium animations.',
    longDescription: 'A full-featured personal portfolio built from scratch. Includes authentication-gated blog editing, art gallery with masonry layout and lightbox modals, framer-motion page transitions, dark mode, cursor glow effects, scroll progress indicator, and a command palette.',
    tags: ['Next.js', 'React', 'Firebase', 'Tailwind CSS', 'TypeScript'],
    color: 'from-[#671372]/25 to-[#8B1D9F]/15',
    github: 'https://github.com/heonaliu/heona-website',
    demo: null as string | null,
    status: 'live',
    year: '2024',
    inspiration: 'I wanted a creative space to showcase both my technical and artistic work.',
    problem: 'Most developer portfolios feel clinical. I wanted mine to feel personal and alive.',
    challenges: ['Building a markdown blog editor with live preview', 'Implementing smooth page transitions in Next.js', 'Creating a masonry layout with proper animation'],
    lessons: ['Framer Motion\'s layout animations are magic', 'Firebase auth is remarkably straightforward', 'Design systems pay off early'],
  },
  {
    id: 2,
    title: 'Creative Tool',
    description: 'Coming soon — a generative art tool that turns code parameters into visual compositions you can export.',
    longDescription: 'A browser-based tool for creating generative art using sliders, color pickers, and algorithm presets. Export to PNG or SVG.',
    tags: ['React', 'TypeScript', 'UI/UX'],
    color: 'from-blue-500/18 to-cyan-500/15',
    github: null as string | null,
    demo: null as string | null,
    status: 'wip',
    year: '2024',
    inspiration: 'I wanted to make generative art accessible to people without coding knowledge.',
    problem: 'Existing tools require familiarity with p5.js or Processing — high barrier to entry.',
    challenges: ['Real-time parameter rendering', 'Exporting canvas to SVG'],
    lessons: ['Browser canvas is surprisingly powerful', 'UX matters more than features'],
  },
  {
    id: 3,
    title: 'Hackathon Project',
    description: 'A project built in 24 hours at a hackathon. Details coming soon as I write it up properly.',
    longDescription: 'Built in 24 hours at a hackathon. Focused on solving a real-world problem with minimal tech debt.',
    tags: ['Python', 'Machine Learning', 'React'],
    color: 'from-orange-400/18 to-rose-500/15',
    github: null as string | null,
    demo: null as string | null,
    status: 'wip',
    year: '2023',
    inspiration: 'Hackathon challenge prompt.',
    problem: 'A real problem identified during the hackathon.',
    challenges: ['Building fast under time pressure', 'Making something presentable in 24 hours'],
    lessons: ['Speed matters more than perfection', 'Team communication is everything'],
  },
]

const StatusBadge = ({ status }: { status: string }) =>
  status === 'live' ? (
    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5
                     px-2.5 py-1 rounded-full
                     bg-emerald-100 dark:bg-emerald-900/40
                     text-emerald-700 dark:text-emerald-400
                     text-[10px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  ) : (
    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5
                     px-2.5 py-1 rounded-full
                     bg-amber-100 dark:bg-amber-900/40
                     text-amber-700 dark:text-amber-400
                     text-[10px] font-semibold">
      <Clock size={9} /> In progress
    </span>
  )

export default function ProjectsClient() {
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof projects[0] | null>(null)

  const filtered = projects.filter((p) => {
    const matchTag = activeTag === 'All' || p.tags.includes(activeTag)
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-14 lg:pt-40 lg:pb-20">
        <Container>
          <AnimatedSection>
            <SectionLabel>Work</SectionLabel>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                           leading-[1.1] tracking-tight
                           text-gray-900 dark:text-white mb-4">
              Projects
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              Things I&apos;ve built, experiments I&apos;ve run, and ideas I&apos;ve shipped.
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Filters ════════════════════════════════════════ */}
      <section className="section-tint py-3">
        <Container>
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <AnimatedSection className="w-full sm:max-w-xs">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-9 py-2 rounded-xl
                             border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-900
                             text-sm text-gray-900 dark:text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#671372]/25
                             focus:border-[#671372]/40 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    <X size={12} className="text-gray-400" />
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Tags */}
            <AnimatedSection delay={0.05} className="flex-1">
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeTag === tag
                        ? 'bg-[#671372] text-white shadow-purple-lg'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ══ Grid ══════════════════════════════════════════ */}
      <section className="section-white py-16 lg:py-24">
        <Container>
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Zap size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No projects match your filter.</p>
              <button
                onClick={() => { setActiveTag('All'); setSearch('') }}
                className="mt-3 text-sm text-[#671372] dark:text-[#c44cf0] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="group h-full flex flex-col
                                 bg-white dark:bg-gray-900
                                 border border-gray-100 dark:border-gray-800
                                 rounded-3xl overflow-hidden
                                 shadow-soft hover:shadow-large hover:shadow-[#671372]/8
                                 hover:border-[#671372]/20 dark:hover:border-[#671372]/30
                                 transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className={`relative w-full h-32 bg-gradient-to-br ${project.color} shrink-0`}>
                        <div
                          className="absolute inset-0 opacity-[0.22]"
                          style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '14px 14px',
                          }}
                        />
                        <StatusBadge status={project.status} />
                      </div>

                      <div className="flex flex-col flex-1 p-4">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2.5 leading-snug">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-1">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.tags.map((tag) => (
                            <span key={tag}
                                  className="px-3.5 py-1.5 rounded-full text-xs font-medium
                                             bg-gray-100 dark:bg-gray-800
                                             text-gray-600 dark:text-gray-400">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-gray-800">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                          bg-gray-100 dark:bg-gray-800
                                          text-gray-700 dark:text-gray-300
                                          hover:bg-[#671372] hover:text-white
                                          transition-all duration-200">
                              <Github size={12} /> Code
                            </a>
                          )}
                          {project.demo ? (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                          bg-[#671372] text-white hover:bg-[#8B1D9F] transition-all">
                              <ExternalLink size={12} /> Live
                            </a>
                          ) : (
                            <button
                              onClick={() => setSelected(project)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                         border border-gray-200 dark:border-gray-700
                                         text-gray-600 dark:text-gray-400
                                         hover:border-[#671372]/40 hover:text-[#671372] dark:hover:text-[#c44cf0]
                                         transition-all duration-200"
                            >
                              Details <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Container>
      </section>

      {/* ══ Project Detail Modal ══════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="project-modal"
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
              transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header band */}
              <div className={`relative w-full h-36 bg-gradient-to-br ${selected.color}
                               flex items-end p-7 rounded-t-[2rem]`}>
                <div
                  className="absolute inset-0 opacity-[0.2] rounded-t-[2rem]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
                  {selected.title}
                </h2>
              </div>

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4
                           w-9 h-9 rounded-full
                           bg-white/80 dark:bg-gray-700
                           border border-gray-200 dark:border-gray-600
                           flex items-center justify-center
                           hover:bg-white dark:hover:bg-gray-600
                           transition-colors shadow-soft"
              >
                <X size={15} className="text-gray-600 dark:text-gray-300" />
              </button>

              <div style={{ padding: '1.75rem' }} className="space-y-6">
                {[
                  { label: '💡 Inspiration',    text: selected.inspiration     },
                  { label: '🔧 Problem Solved',  text: selected.problem         },
                  { label: '📖 Description',     text: selected.longDescription },
                ].map(({ label, text }) => (
                  <div key={label}>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                   text-[#671372] dark:text-[#c44cf0] mb-2">
                      {label}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
                  </div>
                ))}

                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                 text-[#671372] dark:text-[#c44cf0] mb-3">
                    ⚡ Challenges
                  </h3>
                  <ul className="space-y-2">
                    {selected.challenges.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] mt-1.5 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                 text-[#671372] dark:text-[#c44cf0] mb-3">
                    🌱 Lessons Learned
                  </h3>
                  <ul className="space-y-2">
                    {selected.lessons.map((l) => (
                      <li key={l} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] mt-1.5 flex-shrink-0" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                 text-[#671372] dark:text-[#c44cf0] mb-3">
                    🛠 Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium
                                       bg-[#671372]/10 dark:bg-[#671372]/20
                                       text-[#671372] dark:text-[#c44cf0]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                                bg-gray-100 dark:bg-gray-800
                                text-gray-800 dark:text-gray-200
                                text-sm font-medium
                                hover:bg-[#671372] hover:text-white
                                transition-all duration-200">
                    <Github size={14} /> View Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

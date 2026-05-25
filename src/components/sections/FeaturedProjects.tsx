'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, Clock } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const featured = [
  {
    title: 'Portfolio Website',
    description: 'This very site — a premium Next.js portfolio with animations, blog system, and admin panel.',
    tags: ['Next.js', 'Tailwind', 'Firebase', 'Framer Motion'],
    color: 'from-[#671372]/20 to-[#8B1D9F]/10',
    github: 'https://github.com/heonaliu/heona-website',
    demo: null as string | null,
    status: 'live',
  },
  {
    title: 'Creative Tools',
    description: 'Coming soon — generative art tool that turns code parameters into visual compositions.',
    tags: ['React', 'TypeScript', 'UI/UX'],
    color: 'from-blue-500/15 to-cyan-500/10',
    github: null as string | null,
    demo: null as string | null,
    status: 'wip',
  },
  {
    title: 'Art × Code Experiments',
    description: 'Experiments at the intersection of code and art — generative visuals and interactive canvases.',
    tags: ['p5.js', 'WebGL', 'Canvas'],
    color: 'from-orange-400/15 to-pink-400/10',
    github: null as string | null,
    demo: null as string | null,
    status: 'wip',
  },
]

export default function FeaturedProjects() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#671372] dark:text-[#c44cf0] mb-2">
                Work
              </p>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Featured Projects
              </h2>
            </div>
            <Link href="/projects">
              <motion.span
                whileHover={{ x: 3 }}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium
                           text-[#671372] dark:text-[#c44cf0] cursor-pointer hover:underline"
              >
                View all <ArrowRight size={14} />
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
                className="group h-full flex flex-col
                           bg-white dark:bg-gray-900
                           border border-gray-100 dark:border-gray-800
                           rounded-3xl p-6
                           shadow-soft hover:shadow-large hover:shadow-[#671372]/8
                           hover:border-[#671372]/15 dark:hover:border-[#671372]/25
                           transition-all duration-300"
              >
                {/* Colour band */}
                <div className={`relative w-full h-24 rounded-2xl bg-gradient-to-br ${project.color} mb-5 overflow-hidden`}>
                  <div
                    className="absolute inset-0 opacity-[0.22]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '14px 14px',
                    }}
                  />
                  {project.status === 'live' ? (
                    <span className="absolute top-2 right-2 flex items-center gap-1.5
                                     px-2.5 py-1 rounded-full
                                     bg-emerald-100 dark:bg-emerald-900/40
                                     text-emerald-700 dark:text-emerald-400
                                     text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 flex items-center gap-1
                                     px-2.5 py-1 rounded-full
                                     bg-amber-100 dark:bg-amber-900/40
                                     text-amber-700 dark:text-amber-400
                                     text-[10px] font-semibold">
                      <Clock size={9} /> WIP
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium
                                       bg-gray-100 dark:bg-gray-800
                                       text-gray-600 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                    bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                                    hover:bg-[#671372] hover:text-white transition-all duration-200">
                        <Github size={12} /> Code
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                    bg-[#671372] text-white hover:bg-[#8B1D9F] transition-all">
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                    {!project.github && !project.demo && (
                      <span className="text-xs text-gray-400 italic">Coming soon</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

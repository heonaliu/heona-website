'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const projects = [
  {
    title: 'Portfolio Website',
    description: 'This very site — a premium Next.js portfolio with animations, a Firebase-backed blog system, and an art gallery.',
    tags: ['Next.js', 'Tailwind', 'Firebase', 'Framer Motion'],
    color: 'from-[#671372]/20 to-[#8B1D9F]/10',
    github: 'https://github.com/heonaliu/heona-website',
    demo: null as string | null,
    status: 'live' as const,
  },
  {
    title: 'Creative Tools',
    description: 'A generative art tool that turns sliders and algorithm presets into exportable visual compositions.',
    tags: ['React', 'TypeScript', 'UI/UX'],
    color: 'from-blue-500/15 to-cyan-500/10',
    github: null as string | null,
    demo: null as string | null,
    status: 'wip' as const,
  },
  {
    title: 'Art × Code Experiments',
    description: 'Interactive generative visuals and canvas experiments living at the boundary of art and engineering.',
    tags: ['p5.js', 'WebGL', 'Canvas'],
    color: 'from-orange-400/15 to-pink-400/10',
    github: null as string | null,
    demo: null as string | null,
    status: 'wip' as const,
  },
]

const StatusBadge = ({ status }: { status: 'live' | 'wip' }) =>
  status === 'live' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                     bg-emerald-50 dark:bg-emerald-900/30
                     text-emerald-700 dark:text-emerald-400
                     text-[11px] font-semibold">
      <CheckCircle2 size={10} /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                     bg-amber-50 dark:bg-amber-900/30
                     text-amber-700 dark:text-amber-400
                     text-[11px] font-semibold">
      <Clock size={10} /> In progress
    </span>
  )

export default function FeaturedProjects() {
  return (
    <section className="section-subtle py-24 lg:py-32">
      <Container>

        {/* Section header */}
        <AnimatedSection className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>Work</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                Featured Projects
              </h2>
            </div>
            <Link href="/projects">
              <motion.span
                whileHover={{ x: 3 }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold
                           text-[#671372] dark:text-[#c44cf0] cursor-pointer
                           hover:underline underline-offset-2 shrink-0"
              >
                View all projects <ArrowRight size={14} />
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>

        {/* Card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col h-full
                           bg-white dark:bg-gray-900
                           border border-gray-100 dark:border-gray-800
                           rounded-3xl shadow-soft
                           hover:shadow-large hover:shadow-[#671372]/08
                           hover:border-[#671372]/12 dark:hover:border-[#671372]/22
                           transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className={`relative w-full h-32 bg-gradient-to-br ${project.color} shrink-0`}>
                  <div
                    className="absolute inset-0 opacity-[0.2]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={project.status} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-7">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2.5">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
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
                         className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                    bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                                    hover:bg-[#671372] hover:text-white transition-all duration-200">
                        <Github size={12} /> Code
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                    bg-[#671372] text-white hover:bg-[#8B1D9F] transition-all">
                        <ExternalLink size={12} /> Live demo
                      </a>
                    )}
                    {!project.github && !project.demo && (
                      <span className="text-xs text-gray-400 italic">Coming soon</span>
                    )}
                  </div>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>

      </Container>
    </section>
  )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, Clock, CheckCircle2, Pause, CircleSlash, PenLine } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import { useAuth } from '@/context/AuthContext'
import { saveFeaturedSelection } from '@/lib/home-featured-firestore'
import FeaturedSelectionModal from './FeaturedSelectionModal'
import type { Project } from '@/lib/projects'

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  live:         { label: 'Live',         className: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: <CheckCircle2 size={10} /> },
  wip:          { label: 'In progress',  className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',         icon: <Clock size={10} /> },
  paused:       { label: 'Paused',       className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',               icon: <Pause size={10} /> },
  'not-deployed': { label: 'Not deployed', className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',             icon: <CircleSlash size={10} /> },
}

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.wip
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.className}`}>
      {config.icon} {config.label}
    </span>
  )
}

export default function FeaturedProjects({
  projects,
  selectedIds,
}: {
  projects: Project[]
  selectedIds: string[]
}) {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [showSelector, setShowSelector] = useState(false)

  const byId = new Map(projects.filter((p) => p.docId).map((p) => [p.docId as string, p]))
  const featured = selectedIds.map((id) => byId.get(id)).filter((p): p is Project => !!p)
  const display = featured.length > 0 ? featured : projects.slice(0, 3)

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
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowSelector(true)}
                  className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full
                             bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                             hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <PenLine size={13} /> Edit Featured
                </button>
              )}
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
          </div>
        </AnimatedSection>

        {/* Card grid */}
        {display.length === 0 ? (
          <p className="text-center text-sm text-gray-400 italic py-12">No projects yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {display.map((project, i) => (
              <AnimatedSection key={project.docId ?? project.id} delay={i * 0.1}>
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
                  <div className="relative w-full h-32 shrink-0">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`}>
                        <div
                          className="absolute inset-0 opacity-[0.2]"
                          style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                          }}
                        />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={project.status} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4">
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
        )}

      </Container>

      <AnimatePresence>
        {showSelector && (
          <FeaturedSelectionModal
            title="Choose Featured Projects"
            items={projects.filter((p) => p.docId).map((p) => ({
              id: p.docId as string,
              label: p.title,
              sublabel: p.description,
            }))}
            selectedIds={selectedIds}
            onClose={() => setShowSelector(false)}
            onSave={async (ids) => {
              await saveFeaturedSelection('projects', ids)
              router.refresh()
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

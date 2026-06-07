'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BookOpen, Clock, FileText, PenLine } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import { useAuth } from '@/context/AuthContext'
import { saveFeaturedSelection } from '@/lib/home-featured-firestore'
import FeaturedSelectionModal from './FeaturedSelectionModal'
import type { BlogPost } from '@/lib/blog'

export default function LatestBlog({
  posts,
  selectedIds,
}: {
  posts: BlogPost[]
  selectedIds: string[]
}) {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [showSelector, setShowSelector] = useState(false)

  const byId = new Map(posts.filter((p) => p.docId).map((p) => [p.docId as string, p]))
  const featured = selectedIds.map((id) => byId.get(id)).filter((p): p is BlogPost => !!p)
  const display = (featured.length > 0 ? featured : posts.slice(0, 2)).slice(0, 2)

  return (
    <section className="section-tint py-24 lg:py-32">
      <Container>

        {/* Section header */}
        <AnimatedSection className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>
                <BookOpen size={10} className="inline mr-1.5 -mt-px" />
                Writing
              </SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                Latest Posts
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
              <Link href="/blog">
                <motion.span
                  whileHover={{ x: 3 }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold
                             text-[#671372] dark:text-[#c44cf0] cursor-pointer
                             hover:underline underline-offset-2 shrink-0"
                >
                  All posts <ArrowRight size={14} />
                </motion.span>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Post list */}
        {display.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-12">No posts yet.</p>
        ) : (
          <div className="flex flex-col gap-5 max-w-3xl">
            {display.map((post, i) => (
              <AnimatedSection key={post.docId ?? post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`}>
                  <motion.article
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-start gap-5 p-7
                               bg-white dark:bg-gray-900
                               border border-gray-100 dark:border-gray-800
                               rounded-3xl shadow-soft
                               hover:shadow-medium
                               hover:border-[#671372]/12 dark:hover:border-[#671372]/22
                               transition-all duration-300 cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-[#671372]/10 dark:bg-[#671372]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText size={17} className="text-[#671372] dark:text-[#c44cf0]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold leading-snug
                                     text-gray-900 dark:text-white
                                     group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                                     transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{post.date}</span>
                        <span className="text-gray-200 dark:text-gray-700" aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Clock size={10} /> {post.readingTime}
                        </span>
                        {post.tags.map((tag) => (
                          <span key={tag}
                                className="px-3 py-1 rounded-full text-[11px] font-medium
                                           bg-[#671372]/09 dark:bg-[#671372]/18
                                           text-[#671372] dark:text-[#c44cf0]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      size={15}
                      className="flex-shrink-0 mt-1 text-gray-300 dark:text-gray-600
                                 group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                                 group-hover:translate-x-1
                                 transition-all duration-200"
                    />
                  </motion.article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}

      </Container>

      <AnimatePresence>
        {showSelector && (
          <FeaturedSelectionModal
            title="Choose Featured Posts"
            items={posts.filter((p) => p.docId).map((p) => ({
              id: p.docId as string,
              label: p.title,
              sublabel: p.excerpt,
            }))}
            selectedIds={selectedIds}
            onClose={() => setShowSelector(false)}
            onSave={async (ids) => {
              await saveFeaturedSelection('posts', ids)
              router.refresh()
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

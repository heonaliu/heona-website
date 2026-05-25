'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, PenLine, Plus, X, BookOpen } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useAuth } from '@/context/AuthContext'
import type { BlogPost } from '@/lib/blog'

interface Props {
  posts: BlogPost[]
  tags: string[]
}

export default function BlogClient({ posts, tags }: Props) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const { isAdmin } = useAuth()

  const filtered = posts.filter((p) => {
    const matchTag = activeTag === 'all' || p.tags.includes(activeTag)
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen pt-28 pb-24">

      {/* ── Header ── */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex items-end justify-between gap-6">
          <AnimatedSection className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#671372] dark:text-[#c44cf0] mb-3">
              Writing
            </p>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
              Blog
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              Reflections, stories, and thoughts from the journey.
            </p>
          </AnimatedSection>

          {isAdmin && (
            <AnimatedSection direction="left">
              <Link href="/blog/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full
                             bg-[#671372] text-white text-sm font-semibold
                             shadow-purple-lg hover:bg-[#8B1D9F] transition-all"
                >
                  <Plus size={15} /> New Post
                </motion.button>
              </Link>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* ── Search ── */}
      <section className="max-w-4xl mx-auto px-6 mb-6">
        <AnimatedSection>
          <div className="relative w-full max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl
                         border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-900
                         text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-[#671372]/25 focus:border-[#671372]/40
                         transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                <X size={13} className="text-gray-400" />
              </button>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Tags ── */}
      {tags.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mb-10">
          <AnimatedSection>
            <div className="flex flex-wrap gap-2">
              {['all', ...tags].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTag === tag
                      ? 'bg-[#671372] text-white shadow-purple-lg'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* ── Posts ── */}
      <section className="max-w-4xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {posts.length === 0
                ? 'No posts yet. The first one is coming soon!'
                : 'No posts match your search.'}
            </p>
            {search && (
              <button onClick={() => setSearch('')}
                      className="mt-2 text-sm text-[#671372] dark:text-[#c44cf0] hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <motion.article
                      whileHover={{ x: 3 }}
                      className="group flex items-start gap-5 p-6
                                 bg-white dark:bg-gray-900
                                 border border-gray-100 dark:border-gray-800
                                 rounded-3xl shadow-soft
                                 hover:shadow-medium hover:border-[#671372]/15 dark:hover:border-[#671372]/25
                                 transition-all duration-300 cursor-pointer"
                    >
                      {/* Emoji */}
                      <div className="text-3xl flex-shrink-0 mt-0.5">{post.emoji || '📝'}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold leading-snug
                                       text-gray-900 dark:text-white
                                       group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                                       transition-colors mb-1.5">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{post.date}</span>
                          <span className="text-gray-200 dark:text-gray-700">·</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> {post.readingTime}
                          </span>
                          {post.tags.map((tag) => (
                            <span key={tag}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-medium
                                             bg-[#671372]/10 dark:bg-[#671372]/20
                                             text-[#671372] dark:text-[#c44cf0]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Admin edit */}
                      {isAdmin && (
                        <Link
                          href={`/blog/${post.slug}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 p-2 rounded-xl
                                     hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <PenLine size={14} className="text-gray-400" />
                        </Link>
                      )}
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  )
}

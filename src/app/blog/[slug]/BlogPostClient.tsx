'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, PenLine, Tag, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '@/context/AuthContext'
import Container from '@/components/ui/Container'
import type { BlogPost } from '@/lib/blog'

interface Props {
  post: BlogPost
}

export default function BlogPostClient({ post }: Props) {
  const { isAdmin } = useAuth()

  return (
    <div className="min-h-screen layout-safe">
      <section className="section-white pt-32 pb-24 lg:pt-40 lg:pb-32">
        <Container>
          <div className="max-w-3xl mx-auto">

            {/* Back */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-10"
            >
              <Link href="/blog">
                <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400
                                   hover:text-[#671372] dark:hover:text-[#c44cf0]
                                   transition-colors group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Blog
                </button>
              </Link>
            </motion.div>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#671372]/10 dark:bg-[#671372]/20 flex items-center justify-center mb-6">
                <FileText size={28} className="text-[#671372] dark:text-[#c44cf0]" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                             leading-[1.1] tracking-tight
                             text-gray-900 dark:text-white mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400
                              pb-8 border-b border-gray-100 dark:border-gray-800">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readingTime}
                </span>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={12} />
                  {post.tags.map((tag) => (
                    <span key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-medium
                                     bg-[#671372]/10 dark:bg-[#671372]/20
                                     text-[#671372] dark:text-[#c44cf0]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Admin edit */}
                {isAdmin && (
                  <Link href={`/blog/${post.slug}/edit`} className="ml-auto">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                                       bg-gray-100 dark:bg-gray-800
                                       hover:bg-[#671372] hover:text-white
                                       transition-all duration-200">
                      <PenLine size={11} /> Edit
                    </button>
                  </Link>
                )}
              </div>
            </motion.header>

            {/* Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-gray dark:prose-invert prose-lg max-w-none
                prose-headings:font-bold
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#671372] dark:prose-a:text-[#c44cf0]
                prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-[#671372] dark:prose-code:text-[#c44cf0]
                prose-code:bg-[#671372]/10 dark:prose-code:bg-[#671372]/20
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
                prose-pre:rounded-2xl prose-pre:border prose-pre:border-gray-800
                prose-blockquote:border-l-[#671372]
                prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-hr:border-gray-200 dark:prose-hr:border-gray-800"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </motion.article>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800"
            >
              <Link href="/blog">
                <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400
                                   hover:text-[#671372] dark:hover:text-[#c44cf0]
                                   transition-colors group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to all posts
                </button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}

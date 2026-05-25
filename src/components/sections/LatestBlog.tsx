'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const posts = [
  {
    slug: 'hello-world',
    title: 'Hello World — Starting This Journey',
    excerpt: 'Every great story starts somewhere. This is mine — a place to share my journey through code, art, and everything in between.',
    date: 'May 24, 2026',
    readTime: '3 min read',
    tags: ['personal', 'reflection'],
    emoji: '🌱',
  },
  {
    slug: 'code-and-canvas',
    title: 'Where Code Meets Canvas',
    excerpt: 'Exploring the surprising connections between software engineering and digital art — and why every developer should try creating.',
    date: 'May 20, 2026',
    readTime: '5 min read',
    tags: ['art', 'coding'],
    emoji: '🎨',
  },
]

export default function LatestBlog() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#671372] dark:text-[#c44cf0] mb-2 flex items-center gap-2">
                <BookOpen size={11} /> Writing
              </p>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Latest Posts
              </h2>
            </div>
            <Link href="/blog">
              <motion.span
                whileHover={{ x: 3 }}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium
                           text-[#671372] dark:text-[#c44cf0] cursor-pointer hover:underline"
              >
                All posts <ArrowRight size={14} />
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>

        <div className="space-y-3">
          {posts.map((post, i) => (
            <AnimatedSection key={post.slug} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-5 p-6
                             bg-white dark:bg-gray-900
                             border border-gray-100 dark:border-gray-800
                             rounded-3xl shadow-soft
                             hover:shadow-medium hover:border-[#671372]/15 dark:hover:border-[#671372]/25
                             transition-all duration-300 cursor-pointer"
                >
                  <div className="text-3xl flex-shrink-0">{post.emoji}</div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-snug
                                   text-gray-900 dark:text-white
                                   group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                                   transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{post.date}</span>
                      <span className="text-gray-200 dark:text-gray-700">·</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Clock size={10} /> {post.readTime}
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

                  <ArrowRight
                    size={15}
                    className="text-gray-300 dark:text-gray-600
                               group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                               flex-shrink-0 transition-colors duration-200
                               group-hover:translate-x-1"
                  />
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

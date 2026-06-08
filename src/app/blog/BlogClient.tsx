'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, PenLine, Plus, X, BookOpen, ArrowRight, FileText, Trash2 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditTextFieldsModal from '@/components/ui/EditTextFieldsModal'
import { useAuth } from '@/context/AuthContext'
import type { BlogPost } from '@/lib/blog'
import type { PageHeaderOverride } from '@/lib/page-content-firestore'

interface Props {
  posts: BlogPost[]
  tags: string[]
  headerOverride?: PageHeaderOverride
}

const DEFAULT_HEADER = {
  title: 'Blog',
  subtitle: 'Reflections, stories, and thoughts from the journey.',
}

export default function BlogClient({ posts, headerOverride }: Props) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingHeader, setEditingHeader] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const [drafts, setDrafts] = useState<BlogPost[] | null>(null)
  const [loadingDrafts, setLoadingDrafts] = useState(false)
  const [draftsError, setDraftsError] = useState<string | null>(null)
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null)

  const openDrafts = async () => {
    setShowDrafts(true)
    if (drafts) return
    setLoadingDrafts(true)
    setDraftsError(null)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { setDraftsError('Not signed in as admin.'); return }
      const { getPostsFromFirestore } = await import('@/lib/blog-firestore')
      const all = await getPostsFromFirestore(true)
      setDrafts(all.filter((p) => p.draft))
    } catch (err: any) {
      setDraftsError(err?.message || 'Failed to load drafts.')
    } finally {
      setLoadingDrafts(false)
    }
  }

  const headerTitle = headerOverride?.title ?? DEFAULT_HEADER.title
  const headerSubtitle = headerOverride?.subtitle ?? DEFAULT_HEADER.subtitle

  const handleSaveHeader = async (values: Record<string, string>) => {
    const { auth } = await import('@/lib/firebase')
    if (!auth?.currentUser) throw new Error('You are not signed in. Please sign in as admin and try again.')
    const { savePageHeader } = await import('@/lib/page-content-firestore')
    await savePageHeader('blog', { title: values.title.trim(), subtitle: values.subtitle.trim() })
    router.refresh()
  }

  const handleDelete = async (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!post.docId) {
      window.alert('Could not find this post in the database.')
      return
    }
    if (!window.confirm(`Permanently delete "${post.title}"? This cannot be undone.`)) return
    setDeleting(post.docId)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { window.alert('Not signed in as admin.'); return }
      const { deletePostFromFirestore } = await import('@/lib/blog-firestore')
      await deletePostFromFirestore(post.docId)
      router.refresh()
    } catch (err: any) {
      window.alert(err?.message || 'Failed to delete.')
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteDraft = async (post: BlogPost, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!post.docId) {
      window.alert('Could not find this draft in the database.')
      return
    }
    if (!window.confirm(`Permanently delete "${post.title || 'Untitled'}"? This cannot be undone.`)) return
    setDeletingDraftId(post.docId)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { window.alert('Not signed in as admin.'); return }
      const { deletePostFromFirestore } = await import('@/lib/blog-firestore')
      await deletePostFromFirestore(post.docId)
      setDrafts((prev) => prev?.filter((p) => p.docId !== post.docId) ?? null)
    } catch (err: any) {
      window.alert(err?.message || 'Failed to delete.')
    } finally {
      setDeletingDraftId(null)
    }
  }

  const categoryTabs = ['achievements', 'self growth', 'experiences'].filter((tab) =>
    posts.some((p) => p.tags.some((t) => t.toLowerCase() === tab.toLowerCase()))
  )
  const tabs = ['all', ...categoryTabs]

  const filtered = posts.filter((p) => {
    const matchTag = activeTag === 'all' || p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-14 lg:pt-40 lg:pb-20">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <AnimatedSection className="flex-1">
              <div className="flex items-start gap-2">
                <SectionLabel>Writing</SectionLabel>
                {isAdmin && (
                  <button
                    onClick={() => setEditingHeader(true)}
                    title="Edit header"
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <PenLine size={12} className="text-gray-400" />
                  </button>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                             leading-[1.1] tracking-tight
                             text-gray-900 dark:text-white mb-4">
                {headerTitle}
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                {headerSubtitle}
              </p>
            </AnimatedSection>

            {isAdmin && (
              <AnimatedSection direction="left">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openDrafts}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full
                               border border-gray-200 dark:border-gray-700
                               bg-white dark:bg-gray-800
                               text-gray-700 dark:text-gray-300 text-sm font-semibold
                               hover:border-[#671372]/40 hover:text-[#671372] dark:hover:text-[#c44cf0]
                               transition-all"
                  >
                    <FileText size={15} /> Drafts
                  </motion.button>
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
                </div>
              </AnimatedSection>
            )}
          </div>
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
                  placeholder="Search posts..."
                  className="w-full pl-9 pr-9 py-2 rounded-xl
                             border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-900
                             text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-[#671372]/25 focus:border-[#671372]/40
                             transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    <X size={12} className="text-gray-400" />
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Tabs */}
            <AnimatedSection delay={0.05} className="flex-1">
              <div className="flex flex-wrap gap-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTag(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeTag === tab
                        ? 'bg-[#671372] text-white shadow-purple-lg'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ══ Posts ══════════════════════════════════════════ */}
      <section className="section-white py-10 lg:py-14">
        <Container>
          <div className="max-w-3xl">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
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
              <div className="flex flex-col gap-5">
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
                      <motion.article
                        onClick={() => router.push(`/blog/${post.slug}`)}
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
                          <h2 className="text-base font-bold leading-snug
                                         text-gray-900 dark:text-white
                                         group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                                         transition-colors mb-2">
                            {post.title}
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
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

                        {/* Arrow / Admin edit + delete */}
                        {isAdmin ? (
                          <div className="flex-shrink-0 flex items-center gap-1">
                            <Link
                              href={`/blog/${post.slug}/edit`}
                              onClick={(e) => e.stopPropagation()}
                              title="Edit post"
                              className="p-2 rounded-xl
                                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <PenLine size={14} className="text-gray-400" />
                            </Link>
                            <button
                              onClick={(e) => handleDelete(post, e)}
                              disabled={deleting === post.docId}
                              title="Delete post"
                              className="p-2 rounded-xl
                                         hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                                         disabled:opacity-50"
                            >
                              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ) : (
                          <ArrowRight
                            size={15}
                            className="flex-shrink-0 mt-1 text-gray-300 dark:text-gray-600
                                       group-hover:text-[#671372] dark:group-hover:text-[#c44cf0]
                                       group-hover:translate-x-1
                                       transition-all duration-200"
                          />
                        )}
                      </motion.article>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ══ Edit Header ═══════════════════════════════════ */}
      <AnimatePresence>
        {editingHeader && (
          <EditTextFieldsModal
            heading="Edit Page Header"
            fields={[
              { key: 'title', label: 'Title', value: headerTitle },
              { key: 'subtitle', label: 'Subtitle', value: headerSubtitle, multiline: true },
            ]}
            onClose={() => setEditingHeader(false)}
            onSave={handleSaveHeader}
          />
        )}
      </AnimatePresence>

      {/* ══ Drafts ════════════════════════════════════════ */}
      <AnimatePresence>
        {showDrafts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                       flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={() => setShowDrafts(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-8 py-6
                              border-b border-gray-100 dark:border-gray-800">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900 dark:text-white">
                  <FileText size={17} className="text-[#671372] dark:text-[#c44cf0]" /> Drafts
                </h2>
                <button
                  onClick={() => setShowDrafts(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                             flex items-center justify-center
                             hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={14} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="p-8">
                {loadingDrafts ? (
                  <p className="text-sm text-gray-400 text-center py-8">Loading drafts…</p>
                ) : draftsError ? (
                  <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5">
                    {draftsError}
                  </p>
                ) : !drafts || drafts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No drafts yet — save a post as a draft to see it here.</p>
                ) : (
                  <div className="space-y-3">
                    {drafts.map((post) => (
                      <div
                        key={post.docId}
                        className="flex items-center gap-2 rounded-2xl
                                   border border-gray-100 dark:border-gray-800
                                   hover:border-[#671372]/30 hover:bg-[#671372]/5
                                   dark:hover:bg-[#671372]/10 transition-all group"
                      >
                        <Link
                          href={`/blog/${post.slug}/edit`}
                          onClick={() => setShowDrafts(false)}
                          className="flex items-center justify-between gap-4 p-4 flex-1 min-w-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {post.title || 'Untitled'}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1.5">
                              <Clock size={11} /> Last saved {post.date || 'recently'}
                            </p>
                          </div>
                          <ArrowRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-[#671372] dark:group-hover:text-[#c44cf0] shrink-0 transition-colors" />
                        </Link>
                        <button
                          onClick={(e) => handleDeleteDraft(post, e)}
                          disabled={deletingDraftId === post.docId}
                          title="Delete draft"
                          className="w-8 h-8 mr-3 rounded-full flex items-center justify-center shrink-0
                                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                                     disabled:opacity-50"
                        >
                          <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

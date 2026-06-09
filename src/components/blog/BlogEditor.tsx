'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Eye, EyeOff, Send, ArrowLeft, Tag, Clock, Image as ImageIcon, X, Link2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AUTOSAVE_INTERVAL = 30000 // 30 seconds

interface Props {
  /** Firestore document ID — when provided, editor is in edit mode */
  postId?: string
  initialTitle?: string
  initialContent?: string
  initialExcerpt?: string
  initialTags?: string[]
  initialSlug?: string
  /** Publish date in YYYY-MM-DD form — defaults to today for new posts */
  initialDate?: string
}

export default function BlogEditor({
  postId,
  initialTitle = '',
  initialContent = '',
  initialExcerpt = '',
  initialTags = [],
  initialSlug,
  initialDate,
}: Props) {
  const { isAdmin, user } = useAuth()
  const router = useRouter()
  const isEditMode = Boolean(postId)

  const [title, setTitle]     = useState(initialTitle)
  const [slug, setSlug]       = useState(initialSlug || '')
  const [content, setContent] = useState(initialContent)
  const [excerpt, setExcerpt] = useState(initialExcerpt)
  const [date, setDate]       = useState(initialDate || new Date().toISOString().slice(0, 10))
  const [tags, setTags]       = useState<string[]>(initialTags)

  const sanitizeSlug = (v: string) =>
    v.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const [tagInput, setTagInput] = useState('')
  const [isDraft, setIsDraft] = useState(!isEditMode)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saved, setSaved]     = useState(false)

  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [showImageForm, setShowImageForm] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [imageAltInput, setImageAltInput] = useState('')

  const addTag = () => {
    const next = tagInput.trim()
    if (next && !tags.includes(next)) setTags([...tags, next])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const insertImage = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    const alt = imageAltInput.trim()
    const markdown = `![${alt}](${url})`
    const textarea = contentRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const next = content.slice(0, start) + markdown + content.slice(end)
      setContent(next)
      requestAnimationFrame(() => {
        textarea.focus()
        const cursor = start + markdown.length
        textarea.setSelectionRange(cursor, cursor)
      })
    } else {
      setContent((c) => `${c}\n${markdown}\n`)
    }
    setImageUrlInput('')
    setImageAltInput('')
    setShowImageForm(false)
  }

  // ─── Save / Update draft ──────────────────────────────────
  const saveDraft = useCallback(async () => {
    if (!isAdmin || !title) return
    setSaving(true)
    try {
      const { db } = await import('@/lib/firebase')
      if (!db) throw new Error('Firestore not initialized')
      const { serverTimestamp, Timestamp } = await import('firebase/firestore')
      const publishedAt = Timestamp.fromDate(new Date(`${date}T12:00:00`))

      if (isEditMode && postId) {
        const { doc, updateDoc } = await import('firebase/firestore')
        await updateDoc(doc(db, 'posts', postId), {
          title, content, excerpt, tags,
          ...(slug ? { slug } : {}),
          publishedAt,
          updatedAt: serverTimestamp(),
        })
      } else {
        const { collection, addDoc } = await import('firebase/firestore')
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        await addDoc(collection(db, 'posts'), {
          slug, title, content, excerpt, tags,
          draft: true, published: false,
          publishedAt,
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
          authorEmail: user?.email,
        })
      }

      setLastSaved(new Date())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Save error:', e)
    } finally {
      setSaving(false)
    }
  }, [isAdmin, title, slug, content, excerpt, date, tags, user, isEditMode, postId])

  // ─── Publish ──────────────────────────────────────────────
  const publish = async () => {
    if (!isAdmin || !title || !content) return
    setSaving(true)
    try {
      const { db } = await import('@/lib/firebase')
      if (!db) throw new Error('Firestore not initialized')
      const { serverTimestamp, Timestamp } = await import('firebase/firestore')
      const publishedAt = Timestamp.fromDate(new Date(`${date}T12:00:00`))

      if (isEditMode && postId) {
        const { doc, updateDoc } = await import('firebase/firestore')
        const finalSlug = slug || title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        await updateDoc(doc(db, 'posts', postId), {
          slug: finalSlug,
          title, content, excerpt, tags,
          draft: false, published: true,
          publishedAt,
          updatedAt: serverTimestamp(),
        })
        router.push(`/blog/${finalSlug}`)
      } else {
        const { collection, addDoc } = await import('firebase/firestore')
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        await addDoc(collection(db, 'posts'), {
          slug, title, content, excerpt, tags,
          draft: false, published: true,
          publishedAt, createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(), authorEmail: user?.email,
        })
        router.push(`/blog/${slug}`)
      }
    } catch (e) {
      console.error('Publish error:', e)
    } finally {
      setSaving(false)
    }
  }

  // Auto-save
  useEffect(() => {
    if (!title) return
    const timer = setInterval(saveDraft, AUTOSAVE_INTERVAL)
    return () => clearInterval(timer)
  }, [saveDraft, title])

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Admin Only</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">You need to be signed in as admin to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#671372] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {isEditMode && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                Editing post
              </span>
            )}

            {lastSaved && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={10} />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}

            {saved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-green-500 font-medium"
              >
                ✓ Saved
              </motion.span>
            )}

            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? 'Edit' : 'Preview'}
            </button>

            <button
              onClick={saveDraft}
              disabled={saving || !title}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Save size={14} />
              {isEditMode ? 'Save Changes' : 'Save Draft'}
            </button>

            <button
              onClick={publish}
              disabled={saving || !title || !content}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm bg-[#671372] text-white font-semibold hover:bg-[#8B1D9F] shadow-purple-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {isEditMode ? 'Update Post' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-4xl shadow-soft overflow-hidden">
          {/* Metadata bar */}
          <div className="border-b border-gray-100 dark:border-gray-800 p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Excerpt</label>
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Add a tag…"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#671372]/10 dark:bg-[#671372]/25 text-[#671372] dark:text-[#c44cf0] hover:bg-[#671372]/20 dark:hover:bg-[#671372]/35 transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium
                                 bg-[#671372]/10 dark:bg-[#671372]/25 text-[#671372] dark:text-[#c44cf0]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="p-0.5 rounded-full hover:bg-[#671372]/20 dark:hover:bg-[#671372]/35 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isEditMode ? (
              <div className="flex items-center gap-2">
                <Link2 size={13} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-400 block mb-1">URL slug</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                    placeholder="post-url-slug"
                    className="w-full text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#671372]"
                  />
                  Save as draft
                </label>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="px-8 pt-8 pb-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              rows={2}
              className="w-full text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none resize-none placeholder-gray-200 dark:placeholder-gray-700"
            />
          </div>

          {/* Content area */}
          <div className="px-8 pb-8 min-h-96">
            {!preview && (
              <div className="relative mb-3">
                <button
                  type="button"
                  onClick={() => setShowImageForm((s) => !s)}
                  className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full
                             bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                             hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon size={13} />
                  Insert Image
                </button>

                <AnimatePresence>
                  {showImageForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-10 top-full left-0 mt-2 w-80 p-4 rounded-2xl
                                 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-large"
                    >
                      <label className="text-xs text-gray-400 block mb-1">Image URL (Imgur or any public link)</label>
                      <input
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertImage() } }}
                        placeholder="https://i.imgur.com/..."
                        className="w-full text-sm px-3 py-2 mb-2 rounded-xl bg-gray-50 dark:bg-gray-800
                                   border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#671372]/30"
                      />
                      <label className="text-xs text-gray-400 block mb-1">Alt text (optional)</label>
                      <input
                        value={imageAltInput}
                        onChange={(e) => setImageAltInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertImage() } }}
                        placeholder="Describe the image…"
                        className="w-full text-sm px-3 py-2 mb-3 rounded-xl bg-gray-50 dark:bg-gray-800
                                   border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#671372]/30"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => { setShowImageForm(false); setImageUrlInput(''); setImageAltInput('') }}
                          className="text-xs font-medium px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={insertImage}
                          disabled={!imageUrlInput.trim()}
                          className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#671372] text-white hover:bg-[#8B1D9F] transition-colors disabled:opacity-40"
                        >
                          Insert
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {preview ? (
              <div className="prose prose-gray dark:prose-invert prose-lg max-w-none
                prose-headings:font-bold prose-a:text-[#671372] dark:prose-a:text-[#c44cf0]
                prose-code:bg-[#671372]/10 prose-code:text-[#671372] prose-code:rounded-lg prose-code:px-1.5
                prose-blockquote:border-l-[#671372]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || '*Start typing to see preview...*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post in Markdown...

# Heading
**Bold**, *italic*, `code`

- List items
- More items

> Blockquote

```js
// Code blocks
const hello = 'world'
```"
                className="w-full h-96 bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-mono placeholder-gray-300 dark:placeholder-gray-700"
              />
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Write in Markdown.{isEditMode ? ' Changes are saved to the existing post.' : ' Auto-saves every 30 seconds.'}
        </p>
      </div>
    </div>
  )
}

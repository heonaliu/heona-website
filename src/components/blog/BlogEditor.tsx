'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Eye, EyeOff, Send, ArrowLeft, Tag, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AUTOSAVE_INTERVAL = 30000 // 30 seconds

export default function BlogEditor() {
  const { isAdmin, user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [emoji, setEmoji] = useState('✍️')
  const [isDraft, setIsDraft] = useState(true)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saved, setSaved] = useState(false)

  const saveDraft = useCallback(async () => {
    if (!isAdmin || !title) return
    setSaving(true)
    try {
      const { db } = await import('@/lib/firebase')
      if (!db) throw new Error('Firestore not initialized')
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        excerpt,
        tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        emoji,
        draft: true,
        published: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authorEmail: user?.email,
      })
      setLastSaved(new Date())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Save error:', e)
    } finally {
      setSaving(false)
    }
  }, [isAdmin, title, content, excerpt, tags, emoji, user])

  const publish = async () => {
    if (!isAdmin || !title || !content) return
    setSaving(true)
    try {
      const { db } = await import('@/lib/firebase')
      if (!db) throw new Error('Firestore not initialized')
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      await addDoc(collection(db, 'posts'), {
        slug,
        title,
        content,
        excerpt,
        tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        emoji,
        draft: false,
        published: true,
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authorEmail: user?.email,
      })

      router.push('/blog')
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
              Save Draft
            </button>

            <button
              onClick={publish}
              disabled={saving || !title || !content}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm bg-[#671372] text-white font-semibold hover:bg-[#8B1D9F] shadow-purple-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              Publish
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-4xl shadow-soft overflow-hidden">
          {/* Metadata bar */}
          <div className="border-b border-gray-100 dark:border-gray-800 p-6 grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-12 h-12 text-2xl text-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none"
                maxLength={2}
                placeholder="✍️"
              />
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

            <div className="flex items-center gap-2">
              <Tag size={14} className="text-gray-400 flex-shrink-0" />
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags: personal, coding, art (comma separated)"
                className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
            </div>

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
          Write in Markdown. Auto-saves every 30 seconds.
        </p>
      </div>
    </div>
  )
}

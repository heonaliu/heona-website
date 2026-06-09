'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { X, ZoomIn, Calendar, Layers, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, PenLine, Plus, Trash2, GripVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditTextFieldsModal from '@/components/ui/EditTextFieldsModal'
import { useAuth } from '@/context/AuthContext'
import type { ArtworkOverride, CustomArtwork } from '@/lib/artworks-firestore'
import type { ArtJourneyNode } from '@/lib/art-journey-firestore'
import { staticArtworks, buildArtworkList, type Artwork } from '@/lib/artworks'
import LinkedText from '@/components/ui/LinkedText'
import type { PageHeaderOverride } from '@/lib/page-content-firestore'

const DEFAULT_HEADER = {
  title: 'Art Gallery',
  subtitle: 'Digital illustrations, character designs, and creative experiments. Click any piece for a closer look.',
}

const ART_GRADIENT_PRESETS = [
  'from-purple-400 via-pink-500 to-rose-400',
  'from-blue-400 via-cyan-500 to-teal-400',
  'from-orange-400 via-amber-400 to-yellow-300',
  'from-violet-500 via-purple-500 to-indigo-500',
  'from-green-400 via-emerald-400 to-teal-500',
  'from-rose-400 via-pink-400 to-fuchsia-500',
]

const staticArtJourney = [
  { year: '2018', milestone: 'First sketches with pencil and paper. Just doodles at first.' },
  { year: '2020', milestone: 'Discovered digital art. Got my first drawing tablet — game changer.' },
  { year: '2021', milestone: 'Started sharing work online. Learned from incredible artists in the community.' },
  { year: '2022', milestone: 'Explored generative art — where code meets canvas. A new obsession.' },
  { year: '2023', milestone: 'Developed a consistent personal style. Started client commissions.' },
  { year: '2024', milestone: 'Integrating art and code more intentionally. Exploring interactive experiences.' },
]

// ─── Edit Artwork Modal ────────────────────────────────────────────────────────
function EditArtworkModal({
  art,
  onClose,
  onSuccess,
}: {
  art: Artwork
  onClose: () => void
  onSuccess: () => void
}) {
  const router = useRouter()
  const [title, setTitle]            = useState(art.title)
  const [year, setYear]              = useState(art.year)
  const [medium, setMedium]          = useState(art.medium)
  const [reflection, setReflection]  = useState(art.reflection)
  const [imageUrl, setImageUrl]      = useState(art.imageUrl ?? '')
  const [tags, setTags]              = useState<string[]>(art.tags)
  const [tagInput, setTagInput]      = useState('')
  const [imgError, setImgError]  = useState(false)
  const [saving, setSaving]      = useState(false)
  const [error, setError]        = useState<string | null>(null)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { setError('Not signed in as admin.'); return }
      const { saveArtworkOverrides } = await import('@/lib/artworks-firestore')
      await saveArtworkOverrides(art.id, {
        imageUrl:   imageUrl.trim()   || undefined,
        title:      title.trim()      || undefined,
        year:       year.trim()       || undefined,
        medium:     medium.trim()     || undefined,
        reflection: reflection.trim() || undefined,
        tags:       tags.length       ? tags : undefined,
      })
      router.refresh()
      onSuccess()
    } catch (e: any) {
      const msg = e?.message || String(e)
      if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
        setError('Permission denied — add art_images to your Firestore rules.')
      } else {
        setError(msg || 'Failed to save.')
      }
    } finally {
      setSaving(false)
    }
  }

  const inputCls = `w-full px-4 py-2.5 rounded-xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    text-sm text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#671372]/25
                    focus:border-[#671372]/40 transition-all`
  const labelCls = `block text-xs font-semibold uppercase tracking-wider
                    text-gray-500 dark:text-gray-400 mb-1.5`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header preview */}
        <div className={`relative w-full h-44 bg-gradient-to-br ${art.gradient}`}>
          {imageUrl.trim() && !imgError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl.trim()}
              alt="preview"
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/35 flex items-end p-5">
            <div>
              <p className="text-white/70 text-[10px] uppercase tracking-widest font-semibold mb-1">
                Editing artwork
              </p>
              <p className="text-white font-bold text-lg leading-tight">{title || art.title}</p>
              {year && <p className="text-white/65 text-xs mt-0.5">{year}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full
                       bg-black/30 hover:bg-black/50 flex items-center justify-center
                       text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title"
              className={inputCls}
            />
          </div>

          {/* Year */}
          <div>
            <label className={labelCls}>Year</label>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className={inputCls}
            />
          </div>

          {/* Medium / Software */}
          <div>
            <label className={labelCls}>Software / Medium</label>
            <input
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="Procreate, Photoshop, p5.js…"
              className={inputCls}
            />
          </div>

          {/* Artist's Note */}
          <div>
            <label className={labelCls}>Artist&apos;s Note</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your thoughts on this piece…"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="e.g. abstract, nature…"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold
                           bg-[#671372]/10 dark:bg-[#671372]/25
                           text-[#671372] dark:text-[#c44cf0]
                           hover:bg-[#671372]/20 dark:hover:bg-[#671372]/35
                           transition-colors flex-shrink-0"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                               bg-[#671372]/10 dark:bg-[#671372]/25
                               text-[#671372] dark:text-[#c44cf0]"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className={labelCls}>Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImgError(false) }}
              placeholder="https://i.imgur.com/..."
              className={inputCls}
            />
            {imgError && imageUrl.trim() && (
              <p className="text-xs text-amber-500 mt-1">
                Could not load image — check the URL. It will still be saved.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium
                         text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-sm font-semibold
                         bg-[#671372] text-white hover:bg-[#8B1D9F]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-purple-lg"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Add / Edit Custom Artwork Modal ───────────────────────────────────────────
function ArtworkFormModal({
  artwork,
  onClose,
  onSuccess,
}: {
  artwork?: CustomArtwork
  onClose: () => void
  onSuccess: () => void
}) {
  const router = useRouter()
  const isEdit = !!artwork

  const [title, setTitle]             = useState(artwork?.title ?? '')
  const [medium, setMedium]           = useState(artwork?.medium ?? '')
  const [year, setYear]               = useState(artwork?.year ?? new Date().getFullYear().toString())
  const [description, setDescription] = useState(artwork?.description ?? '')
  const [reflection, setReflection]   = useState(artwork?.reflection ?? '')
  const [imageUrl, setImageUrl]       = useState(artwork?.imageUrl ?? '')
  const [tags, setTags]               = useState<string[]>(artwork?.tags ?? [])
  const [tagInput, setTagInput]       = useState('')
  const [gradient, setGradient]       = useState(artwork?.gradient ?? ART_GRADIENT_PRESETS[0])
  const [imgError, setImgError]       = useState(false)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t))

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError(null)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { setError('Not signed in as admin.'); return }
      const payload = {
        title: title.trim(),
        medium: medium.trim(),
        year: year.trim(),
        description: description.trim(),
        reflection: reflection.trim(),
        imageUrl: imageUrl.trim(),
        tags,
        gradient,
      }
      if (isEdit && artwork) {
        const { updateCustomArtwork } = await import('@/lib/artworks-firestore')
        await updateCustomArtwork(artwork.id, payload)
      } else {
        const { addCustomArtwork } = await import('@/lib/artworks-firestore')
        await addCustomArtwork(payload)
      }
      router.refresh()
      onSuccess()
    } catch (e: any) {
      const msg = e?.message || String(e)
      if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
        setError('Permission denied — add custom_artworks to your Firestore rules.')
      } else {
        setError(msg || 'Failed to save.')
      }
    } finally {
      setSaving(false)
    }
  }

  const inputCls = `w-full px-4 py-2.5 rounded-xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    text-sm text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#671372]/25
                    focus:border-[#671372]/40 transition-all`
  const labelCls = `block text-xs font-semibold uppercase tracking-wider
                    text-gray-500 dark:text-gray-400 mb-1.5`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5
                        border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Artwork' : 'Add Artwork'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                       flex items-center justify-center
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={14} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-7 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Image URL + preview */}
          <div>
            <label className={labelCls}>Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImgError(false) }}
              placeholder="https://i.imgur.com/..."
              className={inputCls}
            />
            <div className="relative mt-2.5 w-full h-36 rounded-2xl overflow-hidden">
              {imageUrl.trim() && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl.trim()}
                  alt="preview"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <span className="text-xs text-white/50">
                    {imgError ? 'Could not load image — check the URL' : 'Preview (paste a URL above)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gradient preset (fallback color) */}
          <div>
            <label className={labelCls}>Fallback Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {ART_GRADIENT_PRESETS.map((g) => (
                <button
                  key={g} type="button" onClick={() => setGradient(g)}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} transition-all ${
                    gradient === g
                      ? 'ring-2 ring-[#671372] ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
                   placeholder="Artwork title" className={inputCls} />
          </div>

          {/* Medium + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Software / Medium</label>
              <input value={medium} onChange={(e) => setMedium(e.target.value)}
                     placeholder="Procreate, Photoshop…" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input value={year} onChange={(e) => setYear(e.target.value)}
                     placeholder="2024" className={inputCls} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="A short description of this piece…" rows={2}
                      className={`${inputCls} resize-none`} />
          </div>

          {/* Artist's Note */}
          <div>
            <label className={labelCls}>Artist&apos;s Note</label>
            <textarea value={reflection} onChange={(e) => setReflection(e.target.value)}
                      placeholder="Share your thoughts on this piece…" rows={3}
                      className={`${inputCls} resize-none`} />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="e.g. abstract, nature…"
                className={`${inputCls} flex-1`}
              />
              <button type="button" onClick={addTag}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold
                                 bg-[#671372]/10 dark:bg-[#671372]/25
                                 text-[#671372] dark:text-[#c44cf0]
                                 hover:bg-[#671372]/20 dark:hover:bg-[#671372]/35
                                 transition-colors flex-shrink-0">
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span key={t}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                                   bg-[#671372]/10 dark:bg-[#671372]/25
                                   text-[#671372] dark:text-[#c44cf0]">
                    {t}
                    <button type="button" onClick={() => removeTag(t)}
                            className="hover:text-red-500 transition-colors ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium
                         text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-sm font-semibold
                         bg-[#671372] text-white hover:bg-[#8B1D9F]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-purple-lg"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Artwork'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Add / Edit Art Journey Node Modal ─────────────────────────────────────────
function JourneyFormModal({
  onClose,
  onSuccess,
  node,
  nextOrder,
}: {
  onClose: () => void
  onSuccess: () => void
  node?: ArtJourneyNode  // present → edit mode
  nextOrder: number
}) {
  const isEdit = !!node

  const [year, setYear]           = useState(node?.year ?? new Date().getFullYear().toString())
  const [milestone, setMilestone] = useState(node?.milestone ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!year.trim() || !milestone.trim()) { setError('Year and milestone are required'); return }

    setSubmitting(true)
    setError(null)

    const payload = {
      year: year.trim(),
      milestone: milestone.trim(),
      order: node?.order ?? nextOrder,
    }

    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) {
        setError('You are not signed in. Please sign in as admin and try again.')
        return
      }

      if (isEdit && node) {
        const { updateArtJourneyNode } = await import('@/lib/art-journey-firestore')
        await updateArtJourneyNode(node.id, payload)
      } else {
        const { addArtJourneyNode } = await import('@/lib/art-journey-firestore')
        await addArtJourneyNode(payload)
      }
      onSuccess()
    } catch (err: any) {
      console.error('[JourneyForm]', err)
      const msg = err?.message || String(err)
      if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
        setError('Permission denied — check your Firestore security rules.')
      } else {
        setError(msg || 'Failed to save. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const input = `w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white
                 placeholder-gray-400 focus:outline-none focus:ring-2
                 focus:ring-[#671372]/25 focus:border-[#671372]/40 transition-all`
  const label = `block text-xs font-semibold uppercase tracking-wider
                 text-gray-500 dark:text-gray-400 mb-1.5`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6
                        border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Milestone' : 'Add Journey Milestone'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                       flex items-center justify-center
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={14} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Year */}
          <div>
            <label className={label}>Year *</label>
            <input value={year} onChange={(e) => setYear(e.target.value)}
                   placeholder="2026" className={input} />
          </div>

          {/* Milestone */}
          <div>
            <label className={label}>Milestone *</label>
            <textarea value={milestone} onChange={(e) => setMilestone(e.target.value)}
                      rows={3} placeholder="What happened this year..."
                      className={`${input} resize-none`} />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold
                         text-gray-600 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full bg-[#671372] text-white text-sm font-semibold
                         shadow-purple-lg hover:bg-[#8B1D9F] transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Milestone'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Tag pill ──────────────────────────────────────────────────────────────────
function ArtTagPill({ tag, filter, onSelect }: { tag: string; filter: string; onSelect: (t: string) => void }) {
  return (
    <motion.button
      onClick={() => onSelect(tag)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        filter === tag
          ? 'bg-[#671372] text-white shadow-purple-lg'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
      }`}
    >
      {tag}
    </motion.button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ArtClient({
  overrides,
  customArtworks,
  artJourneyNodes,
  headerOverride,
}: {
  overrides: Record<string, ArtworkOverride>
  customArtworks: CustomArtwork[]
  artJourneyNodes: ArtJourneyNode[]
  headerOverride?: PageHeaderOverride
}) {
  const { isAdmin } = useAuth()

  const artworks: Artwork[] = buildArtworkList(overrides, customArtworks)

  const [selected, setSelected]   = useState<Artwork | null>(null)
  const [filter, setFilter]       = useState('all')
  const [tagsExpanded, setTagsExpanded] = useState(false)
  const [editing, setEditing]     = useState<Artwork | null>(null)
  const [showAddArtwork, setShowAddArtwork] = useState(false)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [editingHeader, setEditingHeader] = useState(false)
  const router = useRouter()

  const headerTitle = headerOverride?.title ?? DEFAULT_HEADER.title
  const headerSubtitle = headerOverride?.subtitle ?? DEFAULT_HEADER.subtitle

  const handleSaveHeader = async (values: Record<string, string>) => {
    const { auth } = await import('@/lib/firebase')
    if (!auth?.currentUser) throw new Error('You are not signed in. Please sign in as admin and try again.')
    const { savePageHeader } = await import('@/lib/page-content-firestore')
    await savePageHeader('art', { title: values.title.trim(), subtitle: values.subtitle.trim() })
    router.refresh()
  }

  const handleDelete = async (art: Artwork) => {
    const verb = art.isCustom ? 'permanently delete' : 'remove'
    if (!window.confirm(`Are you sure you want to ${verb} "${art.title}"? This cannot be undone.`)) return
    setDeleting(art.id)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { window.alert('Not signed in as admin.'); return }
      if (art.isCustom && art.docId) {
        const { deleteCustomArtwork } = await import('@/lib/artworks-firestore')
        await deleteCustomArtwork(art.docId)
      } else {
        const { saveArtworkOverrides } = await import('@/lib/artworks-firestore')
        await saveArtworkOverrides(art.id, { hidden: true })
      }
      if (selected?.id === art.id) setSelected(null)
      router.refresh()
    } catch (e: any) {
      window.alert(e?.message || 'Failed to delete.')
    } finally {
      setDeleting(null)
    }
  }

  // ─── Art Journey timeline (admin-editable) ───────────────────────────────────
  const usingCustomJourney = artJourneyNodes.length > 0
  const buildJourneyNodes = (nodes: ArtJourneyNode[]): ArtJourneyNode[] =>
    nodes.length > 0 ? nodes : staticArtJourney.map((j, i) => ({ id: `static-${i}`, order: i, ...j }))

  const [localJourney, setLocalJourney]       = useState<ArtJourneyNode[]>(() => buildJourneyNodes(artJourneyNodes))
  const [showAddJourneyNode, setShowAddJourneyNode] = useState(false)
  const [editingJourneyNode, setEditingJourneyNode] = useState<ArtJourneyNode | null>(null)
  const [deletingJourneyId, setDeletingJourneyId]   = useState<string | null>(null)
  const [migratingJourney, setMigratingJourney]     = useState(false)
  const journeyReorderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const journeyMigratedRef = useRef(false)

  React.useEffect(() => {
    setLocalJourney(buildJourneyNodes(artJourneyNodes))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artJourneyNodes])

  // First time an admin visits with no Firestore-backed journey nodes yet, seed
  // the database with the placeholder milestones so they become editable,
  // draggable, and deletable like any other node.
  React.useEffect(() => {
    if (!isAdmin || artJourneyNodes.length > 0 || journeyMigratedRef.current) return
    journeyMigratedRef.current = true
    setMigratingJourney(true)
    ;(async () => {
      try {
        const { auth } = await import('@/lib/firebase')
        if (!auth?.currentUser) return
        const { addArtJourneyNode } = await import('@/lib/art-journey-firestore')
        for (let i = 0; i < staticArtJourney.length; i++) {
          const j = staticArtJourney[i]
          await addArtJourneyNode({ year: j.year, milestone: j.milestone, order: i })
        }
        router.refresh()
      } catch (e) {
        console.error('[ArtClient] failed to seed art journey:', e)
        journeyMigratedRef.current = false
      } finally {
        setMigratingJourney(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, artJourneyNodes.length])

  const handleJourneyReorder = (nodes: ArtJourneyNode[]) => {
    setLocalJourney(nodes)
    if (!usingCustomJourney) return
    if (journeyReorderTimeout.current) clearTimeout(journeyReorderTimeout.current)
    journeyReorderTimeout.current = setTimeout(async () => {
      try {
        const { reorderArtJourneyNodes } = await import('@/lib/art-journey-firestore')
        await reorderArtJourneyNodes(nodes.map((n, i) => ({ id: n.id, order: i })))
        router.refresh()
      } catch (e: any) {
        window.alert(e?.message || 'Failed to save the new order.')
      }
    }, 800)
  }

  const handleJourneyDelete = async (node: ArtJourneyNode) => {
    if (!usingCustomJourney) {
      window.alert(migratingJourney
        ? 'Setting up your journey timeline for editing — please try again in a moment.'
        : 'Could not find this milestone in the database yet. Please refresh the page and try again.')
      return
    }
    if (!window.confirm(`Delete the "${node.year}" milestone? This cannot be undone.`)) return
    setDeletingJourneyId(node.id)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { window.alert('Not signed in as admin.'); return }
      const { deleteArtJourneyNode } = await import('@/lib/art-journey-firestore')
      await deleteArtJourneyNode(node.id)
      router.refresh()
    } catch (e: any) {
      window.alert(e?.message || 'Failed to delete.')
    } finally {
      setDeletingJourneyId(null)
    }
  }

  // New milestones are placed at the top of the timeline (most recent first)
  const nextJourneyOrder = localJourney.length ? Math.min(...localJourney.map((n) => n.order)) - 1 : 0

  const TAG_VISIBLE_LIMIT = 6
  const tagFreq = artworks.flatMap((a) => a.tags).reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] ?? 0) + 1; return acc
  }, {})
  const sortedTags = Array.from(new Set(artworks.flatMap((a) => a.tags)))
    .sort((a, b) => (tagFreq[b] - tagFreq[a]) || a.localeCompare(b))
  const visibleTags = sortedTags.slice(0, TAG_VISIBLE_LIMIT)
  const hiddenTags  = sortedTags.slice(TAG_VISIBLE_LIMIT)
  const filtered = filter === 'all' ? artworks : artworks.filter((a) => a.tags.includes(filter))

  const currentIndex = selected ? artworks.findIndex((a) => a.id === selected.id) : -1
  const goNext = () => { if (currentIndex < artworks.length - 1) setSelected(artworks[currentIndex + 1]) }
  const goPrev = () => { if (currentIndex > 0) setSelected(artworks[currentIndex - 1]) }

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-14 lg:pt-40 lg:pb-20">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <AnimatedSection className="flex-1">
              <div className="flex items-start gap-2">
                <SectionLabel>Creative Work</SectionLabel>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddArtwork(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full
                             bg-[#671372] text-white text-sm font-semibold
                             shadow-purple-lg hover:bg-[#8B1D9F] transition-all"
                >
                  <Plus size={15} /> Add Artwork
                </motion.button>
              </AnimatedSection>
            )}
          </div>
        </Container>
      </section>

      {/* ══ Filter Tags ═══════════════════════════════════ */}
      <section className="section-tint py-3">
        <Container>
          <AnimatedSection>
            <div className="flex flex-col gap-2">
              {/* Always-visible row: all + top tags + expand toggle */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <ArtTagPill tag="all" filter={filter} onSelect={setFilter} />
                {visibleTags.map((tag) => (
                  <ArtTagPill key={tag} tag={tag} filter={filter} onSelect={setFilter} />
                ))}
                {hiddenTags.length > 0 && (
                  <motion.button
                    onClick={() => setTagsExpanded((v) => !v)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${hiddenTags.includes(filter)
                        ? 'bg-[#671372] text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
                      }`}
                  >
                    {tagsExpanded
                      ? <><ChevronUp size={11} /> Less</>
                      : <>{hiddenTags.includes(filter) ? filter : `+${hiddenTags.length} more`}<ChevronDown size={11} /></>
                    }
                  </motion.button>
                )}
              </div>

              {/* Expanded overflow tags */}
              <AnimatePresence>
                {tagsExpanded && hiddenTags.length > 0 && (
                  <motion.div
                    key="overflow-tags"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 pt-1 pl-1 border-l-2 border-[#671372]/20 dark:border-[#671372]/30">
                      {hiddenTags.map((tag) => (
                        <ArtTagPill key={tag} tag={tag} filter={filter} onSelect={(t) => { setFilter(t); setTagsExpanded(false) }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Gallery Grid ══════════════════════════════════ */}
      <section className="section-white py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((art, i) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  onClick={() => setSelected(art)}
                  className="group relative h-[280px] rounded-3xl overflow-hidden cursor-pointer
                             shadow-soft hover:shadow-purple-lg transition-shadow duration-300"
                >
                  {/* Background: real image or gradient */}
                  {art.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient}`} />
                      <div
                        className="absolute inset-0 opacity-[0.18]"
                        style={{
                          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                          backgroundSize: '18px 18px',
                        }}
                      />
                    </>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45
                                  transition-all duration-300
                                  flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <ZoomIn size={22} />
                      <span className="text-sm font-semibold">{art.title}</span>
                      <span className="text-xs opacity-75">{art.medium}</span>
                    </div>
                  </div>

                  {/* Purple border on hover */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-[#671372]
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* Bottom label */}
                  <div className="absolute inset-x-0 bottom-0 p-4
                                  bg-gradient-to-t from-black/65 to-transparent
                                  translate-y-full group-hover:translate-y-0
                                  transition-transform duration-300 z-20">
                    <p className="text-white text-sm font-semibold leading-none">{art.title}</p>
                    <p className="text-white/65 text-xs mt-1">{art.year}</p>
                  </div>

                  {/* Admin edit / delete buttons */}
                  {isAdmin && (
                    <div className="absolute top-2.5 right-2.5 z-30 flex gap-1.5
                                    opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditing(art) }}
                        title="Edit artwork"
                        className="w-7 h-7 rounded-full
                                   bg-black/40 hover:bg-[#671372]
                                   flex items-center justify-center
                                   text-white transition-colors duration-200"
                      >
                        <PenLine size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(art) }}
                        disabled={deleting === art.id}
                        title="Delete artwork"
                        className="w-7 h-7 rounded-full
                                   bg-black/40 hover:bg-red-600
                                   flex items-center justify-center
                                   text-white transition-colors duration-200
                                   disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Container>
      </section>

      {/* ══ Art Journey ═══════════════════════════════════ */}
      <section className="section-subtle py-12 lg:py-16">
        <Container>
          <div className="flex items-end justify-between gap-6 mb-14">
            <AnimatedSection>
              <SectionLabel>Background</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                Art Journey
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
                How programming and art connect for me — two ways of making things that weren&apos;t there before.
              </p>
            </AnimatedSection>

            {isAdmin && (
              <AnimatedSection direction="left">
                <div className="flex items-center gap-3">
                  {migratingJourney && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">Setting up editor…</span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddJourneyNode(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full
                               bg-[#671372] text-white text-sm font-semibold
                               shadow-purple-lg hover:bg-[#8B1D9F] transition-all"
                  >
                    <Plus size={15} /> Add Milestone
                  </motion.button>
                </div>
              </AnimatedSection>
            )}
          </div>

          <div className="max-w-2xl relative">
            <div className="absolute left-4 top-6 bottom-6 w-px
                            bg-gradient-to-b from-[#671372] via-[#8B1D9F]/50 to-transparent" />

            {isAdmin && usingCustomJourney ? (
              <Reorder.Group axis="y" values={localJourney} onReorder={handleJourneyReorder} className="flex flex-col gap-3">
                {localJourney.map((node) => (
                  <Reorder.Item
                    key={node.id}
                    value={node}
                    className="relative flex items-start gap-4 p-3 -ml-3 rounded-2xl
                               bg-white dark:bg-gray-900
                               hover:bg-gray-50 dark:hover:bg-gray-800/60
                               transition-colors cursor-grab active:cursor-grabbing"
                  >
                    {/* Drag handle */}
                    <div className="flex items-center pt-1.5 text-gray-300 dark:text-gray-600 flex-shrink-0">
                      <GripVertical size={16} />
                    </div>

                    <div className="relative z-10 w-8 h-8 rounded-full bg-[#671372]
                                    flex items-center justify-center flex-shrink-0 shadow-purple-lg mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    <div className="flex-1 pb-2 min-w-0">
                      <span className="text-xs font-mono font-semibold
                                       text-[#671372] dark:text-[#c44cf0]
                                       bg-[#671372]/09 dark:bg-[#671372]/18
                                       px-2.5 py-1 rounded-full">
                        {node.year}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2.5 leading-relaxed">
                        <LinkedText text={node.milestone} />
                      </p>
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex items-start gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingJourneyNode(node) }}
                        title="Edit milestone"
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <PenLine size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleJourneyDelete(node) }}
                        disabled={deletingJourneyId === node.id}
                        title="Delete milestone"
                        className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="flex flex-col gap-7">
                {localJourney.map(({ id, year, milestone }, i) => (
                  <AnimatedSection key={id} delay={i * 0.08} direction="left">
                    <div className="flex gap-6">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-[#671372]
                                      flex items-center justify-center flex-shrink-0 shadow-purple-lg mt-0.5"
                           style={{ marginLeft: '0px' }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 pb-2">
                        <span className="text-xs font-mono font-semibold
                                         text-[#671372] dark:text-[#c44cf0]
                                         bg-[#671372]/09 dark:bg-[#671372]/18
                                         px-2.5 py-1 rounded-full">
                          {year}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2.5 leading-relaxed">
                          <LinkedText text={milestone} />
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>

          <AnimatedSection delay={0.3} className="mt-14 max-w-2xl">
            <div className="p-8 bg-white dark:bg-gray-900
                            border border-gray-100 dark:border-gray-800
                            rounded-3xl shadow-soft">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                💭 On the connection between code and art
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Both coding and art are fundamentally about problem-solving with constraints. In
                programming, you have languages, APIs, and logic. In art, you have colors,
                composition, and medium. The process of going from blank page to something
                meaningful — that journey is identical. Both teach you to iterate, to embrace
                failure, and to find beauty in the act of making.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Lightbox Modal ════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="art-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Art display */}
              <div className={`relative w-full aspect-[4/3] rounded-t-[2rem] overflow-hidden
                               bg-gradient-to-br ${selected.gradient}`}>
                {selected.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.imageUrl}
                    alt={selected.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.18]"
                      style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                    <p className="absolute inset-0 flex items-center justify-center
                                  text-white/50 text-xs">
                      Artwork preview
                    </p>
                  </>
                )}

                {/* Navigation arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  disabled={currentIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2
                             w-9 h-9 rounded-full bg-black/30 hover:bg-black/50
                             flex items-center justify-center text-white
                             disabled:opacity-30 transition-colors z-20"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  disabled={currentIndex === artworks.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             w-9 h-9 rounded-full bg-black/30 hover:bg-black/50
                             flex items-center justify-center text-white
                             disabled:opacity-30 transition-colors z-20"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Admin edit / delete buttons in lightbox */}
                {isAdmin && (
                  <div className="absolute top-3 left-3 z-30 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(selected); setSelected(null) }}
                      title="Edit artwork"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-black/40 hover:bg-[#671372]
                                 text-white text-xs font-medium
                                 transition-all duration-200"
                    >
                      <PenLine size={12} /> Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(selected) }}
                      disabled={deleting === selected.id}
                      title="Delete artwork"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-black/40 hover:bg-red-600
                                 text-white text-xs font-medium
                                 transition-all duration-200 disabled:opacity-50"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '1.75rem' }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selected.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Layers size={11} /> {selected.medium}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={11} /> {selected.year}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full
                               bg-gray-100 dark:bg-gray-700
                               flex items-center justify-center
                               hover:bg-gray-200 dark:hover:bg-gray-600
                               transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  {selected.description}
                </p>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/40
                                rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] font-semibold uppercase tracking-wider
                                text-[#671372] dark:text-[#c44cf0] mb-2">
                    Artist&apos;s Note
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    &ldquo;{selected.reflection}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {selected.tags.map((tag) => (
                    <span key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium
                                     bg-[#671372]/10 dark:bg-[#671372]/25
                                     text-[#671372] dark:text-[#c44cf0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Edit Artwork Modal ════════════════════════════ */}
      <AnimatePresence>
        {editing && !editing.isCustom && (
          <EditArtworkModal
            art={editing}
            onClose={() => setEditing(null)}
            onSuccess={() => setEditing(null)}
          />
        )}
        {editing && editing.isCustom && (
          <ArtworkFormModal
            artwork={{
              id: editing.docId ?? editing.id,
              title: editing.title,
              medium: editing.medium,
              year: editing.year,
              description: editing.description,
              reflection: editing.reflection,
              imageUrl: editing.imageUrl ?? '',
              tags: editing.tags,
              gradient: editing.gradient,
            }}
            onClose={() => setEditing(null)}
            onSuccess={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      {/* ══ Add Artwork Modal ═════════════════════════════ */}
      <AnimatePresence>
        {showAddArtwork && (
          <ArtworkFormModal
            onClose={() => setShowAddArtwork(false)}
            onSuccess={() => setShowAddArtwork(false)}
          />
        )}
      </AnimatePresence>

      {/* ══ Art Journey Node Modals ═══════════════════════ */}
      <AnimatePresence>
        {showAddJourneyNode && (
          <JourneyFormModal
            nextOrder={nextJourneyOrder}
            onClose={() => setShowAddJourneyNode(false)}
            onSuccess={() => { setShowAddJourneyNode(false); router.refresh() }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingJourneyNode && (
          <JourneyFormModal
            node={editingJourneyNode}
            nextOrder={nextJourneyOrder}
            onClose={() => setEditingJourneyNode(null)}
            onSuccess={() => { setEditingJourneyNode(null); router.refresh() }}
          />
        )}
      </AnimatePresence>

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
    </div>
  )
}

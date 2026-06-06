'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink, Github, Search, X, ChevronRight,
  Clock, Zap, Plus, Upload,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import { useAuth } from '@/context/AuthContext'
import type { Project } from '@/lib/projects'

const GRADIENT_PRESETS = [
  'from-[#671372]/25 to-[#8B1D9F]/15',
  'from-blue-500/18 to-cyan-500/15',
  'from-orange-400/18 to-rose-500/15',
  'from-green-400/18 to-emerald-500/15',
  'from-violet-500/18 to-purple-500/15',
  'from-rose-400/18 to-pink-500/15',
]

interface Props {
  projects: Project[]
}

// ─── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) =>
  status === 'live' ? (
    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5
                     px-2.5 py-1 rounded-full
                     bg-emerald-100 dark:bg-emerald-900/40
                     text-emerald-700 dark:text-emerald-400
                     text-[10px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  ) : (
    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5
                     px-2.5 py-1 rounded-full
                     bg-amber-100 dark:bg-amber-900/40
                     text-amber-700 dark:text-amber-400
                     text-[10px] font-semibold">
      <Clock size={9} /> In progress
    </span>
  )

// ─── Add Project Modal ─────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle]               = useState('')
  const [description, setDescription]   = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [year, setYear]                 = useState(new Date().getFullYear().toString())
  const [status, setStatus]             = useState<'live' | 'wip'>('wip')
  const [github, setGithub]             = useState('')
  const [demo, setDemo]                 = useState('')
  const [color, setColor]               = useState(GRADIENT_PRESETS[0])
  const [imageFile, setImageFile]       = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [inspiration, setInspiration]   = useState('')
  const [problem, setProblem]           = useState('')
  const [tags, setTags]                 = useState<string[]>([])
  const [tagInput, setTagInput]         = useState('')
  const [challenges, setChallenges]     = useState<string[]>([''])
  const [lessons, setLessons]           = useState<string[]>([''])
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState<string | null>(null)

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim())       { setError('Title is required'); return }
    if (!description.trim()) { setError('Short description is required'); return }

    setSubmitting(true)
    setError(null)

    try {
      const { addProjectToFirestore } = await import('@/lib/projects-firestore')
      await addProjectToFirestore(
        {
          title: title.trim(),
          description: description.trim(),
          longDescription: longDescription.trim(),
          tags,
          color,
          github: github.trim() || null,
          demo: demo.trim() || null,
          status,
          year,
          inspiration: inspiration.trim(),
          problem: problem.trim(),
          challenges: challenges.filter(Boolean),
          lessons: lessons.filter(Boolean),
          imageUrl: null,
        },
        imageFile ?? undefined,
      )
      onSuccess()
    } catch (err) {
      console.error(err)
      setError('Failed to save. Please try again.')
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
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6
                        border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Project</h2>
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

          {/* Cover image */}
          <div>
            <label className={label}>Cover Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-44 rounded-2xl border-2 border-dashed
                         border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden
                         hover:border-[#671372]/40 transition-colors"
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="preview" fill className="object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${color}
                                 flex flex-col items-center justify-center gap-2`}>
                  <Upload size={20} className="text-white/60" />
                  <span className="text-xs text-white/60">Click to upload</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*"
                   onChange={handleImageChange} className="hidden" />
          </div>

          {/* Gradient preset */}
          <div>
            <label className={label}>Card Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {GRADIENT_PRESETS.map((g) => (
                <button
                  key={g} type="button" onClick={() => setColor(g)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} transition-all ${
                    color === g
                      ? 'ring-2 ring-[#671372] ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={label}>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
                   placeholder="My Project" className={input} />
          </div>

          {/* Short description */}
          <div>
            <label className={label}>Short Description * (shown on card)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="A brief description of what this project does..."
                      rows={2} className={`${input} resize-none`} />
          </div>

          {/* Long description */}
          <div>
            <label className={label}>Full Description (detail modal)</label>
            <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)}
                      placeholder="A fuller explanation of the project..."
                      rows={3} className={`${input} resize-none`} />
          </div>

          {/* Year + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Year</label>
              <input value={year} onChange={(e) => setYear(e.target.value)}
                     placeholder="2024" className={input} />
            </div>
            <div>
              <label className={label}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'live' | 'wip')}
                      className={input}>
                <option value="wip">In Progress</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>

          {/* GitHub + Demo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>GitHub URL</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)}
                     placeholder="https://github.com/..." className={input} />
            </div>
            <div>
              <label className={label}>Demo URL</label>
              <input value={demo} onChange={(e) => setDemo(e.target.value)}
                     placeholder="https://..." className={input} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={label}>Tags</label>
            <div className="flex gap-2 mb-2.5">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="React, TypeScript, Node.js..."
                className={`${input} flex-1`}
              />
              <button type="button" onClick={addTag}
                      className="px-4 py-2.5 rounded-xl bg-[#671372] text-white text-sm
                                 font-medium hover:bg-[#8B1D9F] transition-colors whitespace-nowrap">
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                   text-xs font-medium bg-[#671372]/10 text-[#671372]
                                   dark:bg-[#671372]/20 dark:text-[#c44cf0]">
                    {tag}
                    <button type="button"
                            onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Inspiration */}
          <div>
            <label className={label}>Inspiration</label>
            <textarea value={inspiration} onChange={(e) => setInspiration(e.target.value)}
                      placeholder="Why did you build this?" rows={2}
                      className={`${input} resize-none`} />
          </div>

          {/* Problem */}
          <div>
            <label className={label}>Problem Solved</label>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)}
                      placeholder="What problem does this solve?" rows={2}
                      className={`${input} resize-none`} />
          </div>

          {/* Challenges */}
          <div>
            <label className={label}>Challenges</label>
            <div className="space-y-2">
              {challenges.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={c}
                    onChange={(e) => {
                      const next = [...challenges]; next[i] = e.target.value
                      setChallenges(next)
                    }}
                    placeholder={`Challenge ${i + 1}`}
                    className={`${input} flex-1`}
                  />
                  {challenges.length > 1 && (
                    <button type="button"
                            onClick={() => setChallenges((prev) => prev.filter((_, j) => j !== i))}
                            className="px-3 rounded-xl bg-gray-100 dark:bg-gray-800
                                       text-gray-400 hover:bg-red-50 hover:text-red-500
                                       dark:hover:bg-red-900/20 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setChallenges((prev) => [...prev, ''])}
                      className="text-xs text-[#671372] dark:text-[#c44cf0] hover:underline">
                + Add challenge
              </button>
            </div>
          </div>

          {/* Lessons */}
          <div>
            <label className={label}>Lessons Learned</label>
            <div className="space-y-2">
              {lessons.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={l}
                    onChange={(e) => {
                      const next = [...lessons]; next[i] = e.target.value
                      setLessons(next)
                    }}
                    placeholder={`Lesson ${i + 1}`}
                    className={`${input} flex-1`}
                  />
                  {lessons.length > 1 && (
                    <button type="button"
                            onClick={() => setLessons((prev) => prev.filter((_, j) => j !== i))}
                            className="px-3 rounded-xl bg-gray-100 dark:bg-gray-800
                                       text-gray-400 hover:bg-red-50 hover:text-red-500
                                       dark:hover:bg-red-900/20 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setLessons((prev) => [...prev, ''])}
                      className="text-xs text-[#671372] dark:text-[#c44cf0] hover:underline">
                + Add lesson
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
                    className="px-5 py-2.5 rounded-full text-sm font-medium
                               text-gray-600 dark:text-gray-400
                               hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
                         bg-[#671372] text-white hover:bg-[#8B1D9F]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-purple-lg"
            >
              {submitting ? 'Saving…' : 'Add Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ProjectsClient({ projects }: Props) {
  const router = useRouter()
  const { isAdmin } = useAuth()

  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Project | null>(null)
  const [showForm, setShowForm]   = useState(false)

  const derivedTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags))).sort()]

  const filtered = projects.filter((p) => {
    const matchTag = activeTag === 'All' || p.tags.includes(activeTag)
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-14 lg:pt-40 lg:pb-20">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <AnimatedSection className="flex-1">
              <SectionLabel>Work</SectionLabel>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                             leading-[1.1] tracking-tight
                             text-gray-900 dark:text-white mb-4">
                Projects
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                Things I&apos;ve built, experiments I&apos;ve run, and ideas I&apos;ve shipped.
              </p>
            </AnimatedSection>

            {isAdmin && (
              <AnimatedSection direction="left">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full
                             bg-[#671372] text-white text-sm font-semibold
                             shadow-purple-lg hover:bg-[#8B1D9F] transition-all"
                >
                  <Plus size={15} /> Add Project
                </motion.button>
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
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-9 py-2 rounded-xl
                             border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-900
                             text-sm text-gray-900 dark:text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#671372]/25
                             focus:border-[#671372]/40 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    <X size={12} className="text-gray-400" />
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Tags */}
            <AnimatedSection delay={0.05} className="flex-1">
              <div className="flex flex-wrap gap-1.5">
                {derivedTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeTag === tag
                        ? 'bg-[#671372] text-white shadow-purple-lg'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#671372]/30 dark:hover:border-[#671372]/40'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ══ Grid ══════════════════════════════════════════ */}
      <section className="section-white py-10 lg:py-14">
        <Container>
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Zap size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No projects match your filter.</p>
              <button
                onClick={() => { setActiveTag('All'); setSearch('') }}
                className="mt-3 text-sm text-[#671372] dark:text-[#c44cf0] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="group h-full flex flex-col
                                 bg-white dark:bg-gray-900
                                 border border-gray-100 dark:border-gray-800
                                 rounded-3xl overflow-hidden
                                 shadow-soft hover:shadow-large hover:shadow-[#671372]/8
                                 hover:border-[#671372]/20 dark:hover:border-[#671372]/30
                                 transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full h-32 shrink-0">
                        {project.imageUrl ? (
                          <Image src={project.imageUrl} alt={project.title} fill
                                 className="object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${project.color}`}>
                            <div
                              className="absolute inset-0 opacity-[0.22]"
                              style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '14px 14px',
                              }}
                            />
                          </div>
                        )}
                        <StatusBadge status={project.status} />
                      </div>

                      <div className="flex flex-col flex-1 p-4">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2.5 leading-snug">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-1">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
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
                               onClick={(e) => e.stopPropagation()}
                               className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                          bg-gray-100 dark:bg-gray-800
                                          text-gray-700 dark:text-gray-300
                                          hover:bg-[#671372] hover:text-white
                                          transition-all duration-200">
                              <Github size={12} /> Code
                            </a>
                          )}
                          {project.demo ? (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                          bg-[#671372] text-white hover:bg-[#8B1D9F] transition-all">
                              <ExternalLink size={12} /> Live
                            </a>
                          ) : (
                            <button
                              onClick={() => setSelected(project)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                                         border border-gray-200 dark:border-gray-700
                                         text-gray-600 dark:text-gray-400
                                         hover:border-[#671372]/40 hover:text-[#671372] dark:hover:text-[#c44cf0]
                                         transition-all duration-200"
                            >
                              Details <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Container>
      </section>

      {/* ══ Project Detail Modal ══════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="project-modal"
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
              transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header band */}
              <div className={`relative w-full h-36 rounded-t-[2rem] flex items-end p-7 overflow-hidden ${
                selected.imageUrl ? '' : `bg-gradient-to-br ${selected.color}`
              }`}>
                {selected.imageUrl ? (
                  <Image src={selected.imageUrl} alt={selected.title} fill className="object-cover" />
                ) : (
                  <div
                    className="absolute inset-0 opacity-[0.2] rounded-t-[2rem]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                )}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
                  {selected.title}
                </h2>
              </div>

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4
                           w-9 h-9 rounded-full
                           bg-white/80 dark:bg-gray-700
                           border border-gray-200 dark:border-gray-600
                           flex items-center justify-center
                           hover:bg-white dark:hover:bg-gray-600
                           transition-colors shadow-soft"
              >
                <X size={15} className="text-gray-600 dark:text-gray-300" />
              </button>

              <div style={{ padding: '1.75rem' }} className="space-y-6">
                {[
                  { label: '💡 Inspiration',   text: selected.inspiration     },
                  { label: '🔧 Problem Solved', text: selected.problem         },
                  { label: '📖 Description',    text: selected.longDescription },
                ].map(({ label, text }) => text ? (
                  <div key={label}>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                   text-[#671372] dark:text-[#c44cf0] mb-2">
                      {label}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
                  </div>
                ) : null)}

                {selected.challenges.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                   text-[#671372] dark:text-[#c44cf0] mb-3">
                      ⚡ Challenges
                    </h3>
                    <ul className="space-y-2">
                      {selected.challenges.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] mt-1.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.lessons.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                   text-[#671372] dark:text-[#c44cf0] mb-3">
                      🌱 Lessons Learned
                    </h3>
                    <ul className="space-y-2">
                      {selected.lessons.map((l) => (
                        <li key={l} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] mt-1.5 flex-shrink-0" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                 text-[#671372] dark:text-[#c44cf0] mb-3">
                    🛠 Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium
                                       bg-[#671372]/10 dark:bg-[#671372]/20
                                       text-[#671372] dark:text-[#c44cf0]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                                bg-gray-100 dark:bg-gray-800
                                text-gray-800 dark:text-gray-200
                                text-sm font-medium
                                hover:bg-[#671372] hover:text-white
                                transition-all duration-200">
                    <Github size={14} /> View Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Add Project Form ══════════════════════════════ */}
      <AnimatePresence>
        {showForm && (
          <AddProjectModal
            onClose={() => setShowForm(false)}
            onSuccess={() => { setShowForm(false); router.refresh() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

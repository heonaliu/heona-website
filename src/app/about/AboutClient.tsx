'use client'

import React, { useState, useRef } from 'react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import {
  Download, Code2, Palette, Music, Activity, Zap, Star, Coffee, BookOpen,
  Heart, Lightbulb, Rocket, Trophy, Target, Sparkles, GraduationCap, Briefcase,
  Plus, PenLine, Trash2, X, GripVertical,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import { useAuth } from '@/context/AuthContext'
import type { TimelineNode } from '@/lib/timeline-firestore'

const ICON_OPTIONS = [
  { key: 'Code2', Icon: Code2 },
  { key: 'Palette', Icon: Palette },
  { key: 'Music', Icon: Music },
  { key: 'Activity', Icon: Activity },
  { key: 'Zap', Icon: Zap },
  { key: 'Star', Icon: Star },
  { key: 'Coffee', Icon: Coffee },
  { key: 'BookOpen', Icon: BookOpen },
  { key: 'Heart', Icon: Heart },
  { key: 'Lightbulb', Icon: Lightbulb },
  { key: 'Rocket', Icon: Rocket },
  { key: 'Trophy', Icon: Trophy },
  { key: 'Target', Icon: Target },
  { key: 'Sparkles', Icon: Sparkles },
  { key: 'GraduationCap', Icon: GraduationCap },
  { key: 'Briefcase', Icon: Briefcase },
] as const

const ICON_MAP: Record<string, typeof Star> = Object.fromEntries(
  ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])
)

/* ─── Data ─────────────────────────────────────────── */
const skills = [
  {
    category: 'Languages',
    items: ['TypeScript', 'Python', 'JavaScript', 'Java', 'SQL', 'HTML / CSS'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Figma'],
  },
  {
    category: 'Backend & Databases',
    items: ['Node.js', 'Firebase', 'Firestore', 'PostgreSQL', 'REST APIs'],
  },
  {
    category: 'Tools & Workflow',
    items: ['Git', 'VS Code', 'Vercel', 'Docker', 'Procreate', 'Illustrator'],
  },
  {
    category: 'ML / Data',
    items: ['TensorFlow', 'scikit-learn', 'Pandas', 'NumPy', 'Jupyter'],
  },
]

const staticTimeline = [
  { year: '2020', title: 'Started Coding',          desc: 'Wrote my first "Hello World" in Python. Fell in love immediately.',        icon: 'Code2'    },
  { year: '2021', title: 'Discovered Digital Art',  desc: 'Picked up Procreate and started experimenting with illustration.',          icon: 'Palette'  },
  { year: '2022', title: 'First Hackathon',         desc: 'Built something real in 24 hours. Learned more in one weekend than one semester.', icon: 'Zap' },
  { year: '2023', title: 'Web Dev Deep Dive',       desc: 'Fell into the React / Next.js rabbit hole. Never came out.',                icon: 'Star'     },
  { year: '2024', title: 'Projects & Growth',       desc: 'Built multiple projects, explored ML, contributed to open source.',         icon: 'Coffee'   },
  { year: '2025', title: 'Now',                     desc: 'CS student, part-time creator, full-time curious human.',                   icon: 'BookOpen' },
]

const interests = [
  { Icon: Code2,    label: 'Programming',  desc: 'Building tools that solve real problems — and creative experiments that don\'t.' },
  { Icon: Palette,  label: 'Digital Art',  desc: 'Illustration, character design, and generative visual experiments.' },
  { Icon: Activity, label: 'Badminton',    desc: 'On the court whenever possible — the best way to clear the mind.' },
  { Icon: Music,    label: 'Piano',        desc: 'Classical pieces, movie soundtracks, and occasional improvisation.' },
]

/* ─── Components ─────────────────────────────────────── */
function SectionDivider({ className = '' }: { className?: string }) {
  return <div className={`border-t border-gray-100 dark:border-gray-800 ${className}`} />
}

// ─── Add / Edit Timeline Node Modal ────────────────────────────────────────────
function TimelineFormModal({
  onClose,
  onSuccess,
  node,
  nextOrder,
}: {
  onClose: () => void
  onSuccess: () => void
  node?: TimelineNode  // present → edit mode
  nextOrder: number
}) {
  const isEdit = !!node

  const [year, setYear]       = useState(node?.year ?? new Date().getFullYear().toString())
  const [title, setTitle]     = useState(node?.title ?? '')
  const [desc, setDesc]       = useState(node?.desc ?? '')
  const [icon, setIcon]       = useState(node?.icon ?? ICON_OPTIONS[0].key)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!year.trim() || !title.trim()) { setError('Year and title are required'); return }

    setSubmitting(true)
    setError(null)

    const payload = {
      year: year.trim(),
      title: title.trim(),
      desc: desc.trim(),
      icon,
      order: node?.order ?? nextOrder,
    }

    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) {
        setError('You are not signed in. Please sign in as admin and try again.')
        return
      }

      if (isEdit && node) {
        const { updateTimelineNode } = await import('@/lib/timeline-firestore')
        await updateTimelineNode(node.id, payload)
      } else {
        const { addTimelineNode } = await import('@/lib/timeline-firestore')
        await addTimelineNode(payload)
      }
      onSuccess()
    } catch (err: any) {
      console.error('[TimelineForm]', err)
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
            {isEdit ? 'Edit Node' : 'Add Timeline Node'}
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

          {/* Icon picker */}
          <div>
            <label className={label}>Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  title={key}
                  onClick={() => setIcon(key)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    icon === key
                      ? 'border-[#671372] bg-[#671372]/10 text-[#671372] dark:text-[#c44cf0] ring-2 ring-[#671372]/30'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-[#671372]/30'
                  }`}
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <label className={label}>Year *</label>
            <input value={year} onChange={(e) => setYear(e.target.value)}
                   placeholder="2026" className={input} />
          </div>

          {/* Title */}
          <div>
            <label className={label}>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
                   placeholder="Started Coding" className={input} />
          </div>

          {/* Subtext */}
          <div>
            <label className={label}>Subtext</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                      rows={3} placeholder="A short description of this milestone..."
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
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Node'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AboutClient({ timelineNodes }: { timelineNodes: TimelineNode[] }) {
  const { isAdmin } = useAuth()
  const router = useRouter()

  const usingCustomTimeline = timelineNodes.length > 0
  const buildNodes = (nodes: TimelineNode[]): TimelineNode[] =>
    nodes.length > 0 ? nodes : staticTimeline.map((t, i) => ({ id: `static-${i}`, order: i, ...t }))

  const [localNodes, setLocalNodes]   = useState<TimelineNode[]>(() => buildNodes(timelineNodes))
  const [showAddNode, setShowAddNode] = useState(false)
  const [editingNode, setEditingNode] = useState<TimelineNode | null>(null)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [migrating, setMigrating]     = useState(false)
  const reorderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const migratedRef = useRef(false)

  React.useEffect(() => {
    setLocalNodes(buildNodes(timelineNodes))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineNodes])

  // First time an admin visits with no Firestore-backed nodes yet, seed the
  // database with the placeholder milestones so they become editable, draggable,
  // and deletable like any other node — instead of staying static forever.
  React.useEffect(() => {
    if (!isAdmin || timelineNodes.length > 0 || migratedRef.current) return
    migratedRef.current = true
    setMigrating(true)
    ;(async () => {
      try {
        const { auth } = await import('@/lib/firebase')
        if (!auth?.currentUser) return
        const { addTimelineNode } = await import('@/lib/timeline-firestore')
        for (let i = 0; i < staticTimeline.length; i++) {
          const t = staticTimeline[i]
          await addTimelineNode({ year: t.year, title: t.title, desc: t.desc, icon: t.icon, order: i })
        }
        router.refresh()
      } catch (e) {
        console.error('[AboutClient] failed to seed timeline:', e)
        migratedRef.current = false
      } finally {
        setMigrating(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, timelineNodes.length])

  const handleReorder = (nodes: TimelineNode[]) => {
    setLocalNodes(nodes)
    if (!usingCustomTimeline) return
    if (reorderTimeout.current) clearTimeout(reorderTimeout.current)
    reorderTimeout.current = setTimeout(async () => {
      try {
        const { reorderTimelineNodes } = await import('@/lib/timeline-firestore')
        await reorderTimelineNodes(nodes.map((n, i) => ({ id: n.id, order: i })))
        router.refresh()
      } catch (e: any) {
        window.alert(e?.message || 'Failed to save the new order.')
      }
    }, 800)
  }

  const handleDelete = async (node: TimelineNode) => {
    if (!usingCustomTimeline) {
      window.alert(migrating
        ? 'Setting up your timeline for editing — please try again in a moment.'
        : 'Could not find this milestone in the database yet. Please refresh the page and try again.')
      return
    }
    if (!window.confirm(`Delete the "${node.title}" milestone? This cannot be undone.`)) return
    setDeletingId(node.id)
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth?.currentUser) { window.alert('Not signed in as admin.'); return }
      const { deleteTimelineNode } = await import('@/lib/timeline-firestore')
      await deleteTimelineNode(node.id)
      router.refresh()
    } catch (e: any) {
      window.alert(e?.message || 'Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  const nextOrder = localNodes.length ? Math.max(...localNodes.map((n) => n.order)) + 1 : 0

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-24 lg:pt-40 lg:pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <AnimatedSection>
              <SectionLabel>About Me</SectionLabel>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                             leading-[1.1] tracking-tight
                             text-gray-900 dark:text-white mb-6">
                A CS student who{' '}
                <span className="gradient-text">can&apos;t stop creating</span>
              </h1>

              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-lg mb-8">
                <p>
                  Hi! I&apos;m Heona — a computer science student with a deep passion
                  for building things that matter. I love the intersection of technical
                  precision and creative expression, which is why I spend equal time
                  writing code and making art.
                </p>
                <p>
                  Whether it&apos;s architecting a clean backend, designing an intuitive UI,
                  or illustrating a digital piece from scratch — I approach everything
                  with curiosity and a desire to make it <em>just right</em>.
                </p>
                <p>
                  When I&apos;m not at my desk you&apos;ll find me on a badminton court,
                  at a piano, or wherever curiosity leads next.
                </p>
              </div>

              <motion.a
                href="/resume.pdf"
                download
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                           bg-[#671372] hover:bg-[#8B1D9F] text-white text-sm font-semibold
                           shadow-purple-lg transition-all duration-200"
              >
                <Download size={14} /> Download Resume
              </motion.a>
            </AnimatedSection>

            {/* Visual card */}
            <AnimatedSection direction="left">
              <div className="relative mx-auto max-w-sm lg:ml-auto lg:mr-0">
                <div className="aspect-square rounded-[2rem]
                                bg-gradient-to-br
                                from-[#671372]/14 via-[#8B1D9F]/08 to-[#c44cf0]/06
                                dark:from-[#671372]/22 dark:via-[#8B1D9F]/14 dark:to-[#c44cf0]/10
                                border border-[#671372]/10 dark:border-[#671372]/20
                                shadow-large
                                flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#671372]
                                    flex items-center justify-center shadow-purple-lg mb-5">
                      <span className="text-white font-bold text-3xl">HL</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Photo coming soon</p>
                  </div>
                </div>

                {/* Floating chips — intentionally offset but contained */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 z-10
                             bg-white dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700
                             rounded-2xl px-4 py-3 shadow-medium"
                >
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Favourite language</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">TypeScript 💙</p>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute -top-4 -right-4 z-10
                             bg-white dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700
                             rounded-2xl px-4 py-3 shadow-medium"
                >
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Currently building</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">This site ✨</p>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ══ Currently / Building ══════════════════════════ */}
      <section className="section-tint py-20 lg:py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">

            {[
              {
                emoji: '📚',
                title: 'Currently Learning',
                items: ['Advanced ML & Neural Networks', 'System Design & Architecture', 'Web3 & Solidity (exploring)', 'Piano — Chopin Nocturnes', '3D Modeling in Blender'],
              },
              {
                emoji: '🔨',
                title: 'What I Enjoy Building',
                items: ['Tools that solve real everyday problems', 'Beautiful, accessible web experiences', 'Creative coding experiments', 'Automations that save hours', 'Things that make people smile'],
              },
            ].map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <div className="bg-white dark:bg-gray-900
                                border border-gray-100 dark:border-gray-800
                                rounded-3xl p-8 shadow-soft h-full">
                  <h2 className="flex items-center gap-3 text-base font-bold
                                 text-gray-900 dark:text-white mb-6">
                    <span className="w-9 h-9 rounded-xl bg-[#671372]/10 dark:bg-[#671372]/20
                                     flex items-center justify-center text-lg flex-shrink-0">
                      {card.emoji}
                    </span>
                    {card.title}
                  </h2>
                  <ul className="space-y-3.5">
                    {card.items.map((item) => (
                      <li key={item}
                          className="flex items-center gap-3 text-sm
                                     leading-relaxed text-gray-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}

          </div>
        </Container>
      </section>

      {/* ══ Skills ════════════════════════════════════════ */}
      <section className="section-white py-24 lg:py-32">
        <Container>
          <AnimatedSection className="mb-14">
            <SectionLabel>Toolkit</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Skills &amp; Tools
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              Technologies I reach for when building products, interfaces, and experiments.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((group, i) => (
              <AnimatedSection key={group.category} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-900
                             border border-gray-100 dark:border-gray-800
                             rounded-3xl p-7 shadow-soft
                             hover:shadow-medium
                             hover:border-[#671372]/12 dark:hover:border-[#671372]/22
                             transition-all duration-300 h-full"
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.14em]
                                 text-[#671372] dark:text-[#c44cf0] mb-5">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {group.items.map((skill) => (
                      <span key={skill} className="skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ Interests ════════════════════════════════════ */}
      <section className="section-subtle py-24 lg:py-32">
        <Container>
          <AnimatedSection className="mb-14">
            <SectionLabel>Beyond the Screen</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Interests
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {interests.map(({ Icon, label, desc }, i) => (
              <AnimatedSection key={label} delay={i * 0.09}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-900
                             border border-gray-100 dark:border-gray-800
                             rounded-3xl p-7 shadow-soft
                             hover:shadow-medium transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl
                                  bg-[#671372]/09 dark:bg-[#671372]/18
                                  flex items-center justify-center mb-5">
                    <Icon size={21} className="text-[#671372] dark:text-[#c44cf0]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5">
                    {label}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {desc}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ Timeline ══════════════════════════════════════ */}
      <section className="section-white py-24 lg:py-32">
        <Container>
          <div className="flex items-end justify-between gap-6 mb-14">
            <AnimatedSection>
              <SectionLabel>Background</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                My Journey
              </h2>
            </AnimatedSection>

            {isAdmin && (
              <AnimatedSection direction="left">
                <div className="flex items-center gap-3">
                  {migrating && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">Setting up editor…</span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddNode(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full
                               bg-[#671372] text-white text-sm font-semibold
                               shadow-purple-lg hover:bg-[#8B1D9F] transition-all"
                  >
                    <Plus size={15} /> Add Node
                  </motion.button>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Timeline — max-width to keep it readable, not full-grid wide */}
          <div className="max-w-2xl relative">
            {/* Vertical rule */}
            <div className="absolute left-8 top-6 bottom-6 w-px
                            bg-gradient-to-b from-[#671372] via-[#8B1D9F]/50 to-transparent" />

            {isAdmin && usingCustomTimeline ? (
              <Reorder.Group axis="y" values={localNodes} onReorder={handleReorder} className="flex flex-col gap-4">
                {localNodes.map((node) => {
                  const Icon = ICON_MAP[node.icon] ?? Star
                  return (
                    <Reorder.Item
                      key={node.id}
                      value={node}
                      className="relative flex items-start gap-4 p-3 -ml-3 rounded-2xl
                                 bg-white dark:bg-gray-900
                                 hover:bg-gray-50 dark:hover:bg-gray-800/60
                                 transition-colors cursor-grab active:cursor-grabbing"
                    >
                      {/* Drag handle */}
                      <div className="flex items-center pt-6 text-gray-300 dark:text-gray-600 flex-shrink-0">
                        <GripVertical size={16} />
                      </div>

                      {/* Icon bubble */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl flex-shrink-0
                                        bg-white dark:bg-gray-900
                                        border-2 border-[#671372]/18 dark:border-[#671372]/30
                                        shadow-soft flex items-center justify-center">
                          <Icon size={20} className="text-[#671372] dark:text-[#c44cf0]" />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1 pt-1.5 min-w-0">
                        <span className="inline-block text-[10px] font-mono font-bold
                                         text-[#671372] dark:text-[#c44cf0]
                                         bg-[#671372]/09 dark:bg-[#671372]/18
                                         px-2.5 py-1 rounded-full mb-2">
                          {node.year}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                          {node.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {node.desc}
                        </p>
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex items-start gap-1 pt-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingNode(node) }}
                          title="Edit node"
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <PenLine size={14} className="text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(node) }}
                          disabled={deletingId === node.id}
                          title="Delete node"
                          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </Reorder.Item>
                  )
                })}
              </Reorder.Group>
            ) : (
              <div className="flex flex-col gap-8">
                {localNodes.map((node, i) => {
                  const Icon = ICON_MAP[node.icon] ?? Star
                  return (
                    <AnimatedSection key={node.id} delay={i * 0.08} direction="left">
                      <div className="flex gap-6">
                        {/* Icon bubble */}
                        <div className="relative z-10 flex-shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="w-16 h-16 rounded-2xl flex-shrink-0
                                       bg-white dark:bg-gray-900
                                       border-2 border-[#671372]/18 dark:border-[#671372]/30
                                       shadow-soft flex items-center justify-center"
                          >
                            <Icon size={20} className="text-[#671372] dark:text-[#c44cf0]" />
                          </motion.div>
                        </div>

                        {/* Text */}
                        <div className="flex-1 pt-1.5">
                          <span className="inline-block text-[10px] font-mono font-bold
                                           text-[#671372] dark:text-[#c44cf0]
                                           bg-[#671372]/09 dark:bg-[#671372]/18
                                           px-2.5 py-1 rounded-full mb-2">
                            {node.year}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                            {node.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {node.desc}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  )
                })}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ══ Timeline Node Modals ══════════════════════════ */}
      <AnimatePresence>
        {showAddNode && (
          <TimelineFormModal
            nextOrder={nextOrder}
            onClose={() => setShowAddNode(false)}
            onSuccess={() => { setShowAddNode(false); router.refresh() }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingNode && (
          <TimelineFormModal
            node={editingNode}
            nextOrder={nextOrder}
            onClose={() => setEditingNode(null)}
            onSuccess={() => { setEditingNode(null); router.refresh() }}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

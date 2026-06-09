"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowRight, Sparkles, Code2, Palette, Hammer, Terminal, Github, Mail, Youtube, PenLine,
  Music, Headphones, Star, Zap, Heart, Rocket, Coffee, BookOpen, Trophy,
  Activity, Camera, Lightbulb, Cpu, Globe, Pen, Gamepad2, X,
} from "lucide-react";
import Container from "@/components/ui/Container";
import EditTextFieldsModal from "@/components/ui/EditTextFieldsModal";
import { useAuth } from "@/context/AuthContext";
import type { PageHeaderOverride, HeroChipOverride } from "@/lib/page-content-firestore";

const CHIP_ICON_OPTIONS = [
  { key: 'Code2', Icon: Code2 }, { key: 'Terminal', Icon: Terminal }, { key: 'Cpu', Icon: Cpu },
  { key: 'Globe', Icon: Globe }, { key: 'Palette', Icon: Palette }, { key: 'Pen', Icon: Pen },
  { key: 'Camera', Icon: Camera }, { key: 'Music', Icon: Music }, { key: 'Headphones', Icon: Headphones },
  { key: 'Star', Icon: Star }, { key: 'Sparkles', Icon: Sparkles }, { key: 'Zap', Icon: Zap },
  { key: 'Heart', Icon: Heart }, { key: 'Rocket', Icon: Rocket }, { key: 'Coffee', Icon: Coffee },
  { key: 'BookOpen', Icon: BookOpen }, { key: 'Trophy', Icon: Trophy }, { key: 'Activity', Icon: Activity },
  { key: 'Lightbulb', Icon: Lightbulb }, { key: 'Gamepad2', Icon: Gamepad2 }, { key: 'Hammer', Icon: Hammer },
] as const

type ChipIconKey = typeof CHIP_ICON_OPTIONS[number]['key']
const CHIP_ICON_MAP = Object.fromEntries(CHIP_ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])) as Record<string, React.ElementType>

/* ─── Animation variants ─────────────────────────── */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ─── Data ───────────────────────────────────────── */
const roles = [
  { Icon: Code2, label: "Developer" },
  { Icon: Palette, label: "Artist" },
  { Icon: Hammer, label: "Builder" },
];

const DEFAULT_BIO =
  "I build things for the web, create digital art, and explore the intersection where engineering meets creativity. CS student — driven by curiosity and a love of thoughtful design."

const DEFAULT_CHIPS: Record<string, { label: string; sublabel: string; icon: string }> = {
  chip1: { label: "TypeScript", sublabel: "Favourite language", icon: "Code2" },
  chip2: { label: "Making art", sublabel: "Currently",          icon: "Music" },
}

/* ─── Chip Edit Modal ────────────────────────────── */
function ChipEditModal({
  chip, iconDraft, onIconChange, onClose, onSave,
}: {
  chipId: string
  chip: { label: string; sublabel: string; icon: string }
  iconDraft: string
  onIconChange: (key: string) => void
  onClose: () => void
  onSave: (values: Record<string, string>) => Promise<void>
}) {
  const [label, setLabel] = useState(chip.label)
  const [sublabel, setSublabel] = useState(chip.sublabel)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputCls = `w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white
    placeholder-gray-400 focus:outline-none focus:ring-2
    focus:ring-[#671372]/25 focus:border-[#671372]/40 transition-all`
  const labelCls = `block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSave({ label, sublabel })
      onClose()
    } catch (err: any) {
      const msg = err?.message || String(err)
      setError(msg.includes('permission-denied') || msg.includes('Missing or insufficient')
        ? 'Permission denied — check your Firestore security rules.'
        : msg || 'Failed to save.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Badge</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X size={14} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className={labelCls}>Label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Sublabel</label>
            <input value={sublabel} onChange={(e) => setSublabel(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Icon</label>
            <div className="grid grid-cols-7 gap-2">
              {CHIP_ICON_OPTIONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onIconChange(key)}
                  title={key}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all
                    ${iconDraft === key
                      ? 'bg-[#671372] text-white shadow-purple-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#671372]/10 hover:text-[#671372] dark:hover:text-[#c44cf0]'
                    }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <motion.button
              type="submit" disabled={submitting}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full bg-[#671372] text-white text-sm font-semibold shadow-purple-lg hover:bg-[#8B1D9F] transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

interface Props {
  headerOverride?: PageHeaderOverride
  chipOverrides?: Record<string, HeroChipOverride>
}

export default function Hero({ headerOverride, chipOverrides }: Props) {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [editingBio, setEditingBio] = useState(false)
  const [editingChip, setEditingChip] = useState<string | null>(null)
  const [chipIconDraft, setChipIconDraft] = useState<string>('Code2')

  const bio = headerOverride?.subtitle ?? DEFAULT_BIO
  const chip1 = { ...DEFAULT_CHIPS.chip1, ...chipOverrides?.chip1 }
  const chip2 = { ...DEFAULT_CHIPS.chip2, ...chipOverrides?.chip2 }

  const openChipEdit = (chipId: string) => {
    setChipIconDraft(chipId === 'chip1' ? chip1.icon : chip2.icon)
    setEditingChip(chipId)
  }

  const handleSaveBio = async (values: Record<string, string>) => {
    const { auth } = await import("@/lib/firebase")
    if (!auth?.currentUser) throw new Error("You are not signed in. Please sign in as admin and try again.")
    const { savePageHeader } = await import("@/lib/page-content-firestore")
    await savePageHeader("home", { subtitle: values.subtitle.trim() })
    router.refresh()
  }

  const handleSaveChip = (chipId: string) => async (values: Record<string, string>) => {
    const { auth } = await import("@/lib/firebase")
    if (!auth?.currentUser) throw new Error("You are not signed in. Please sign in as admin and try again.")
    const { saveHeroChip } = await import("@/lib/page-content-firestore")
    await saveHeroChip(chipId, { label: values.label.trim(), sublabel: values.sublabel.trim(), icon: chipIconDraft })
    router.refresh()
  }

  return (
    <section
      className="
    section-white layout-safe relative flex items-center
    min-h-screen
    pt-32 pb-24
    overflow-x-hidden
  "
    >
      {/* Background decoration — contained, never overflows */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-mesh-gradient opacity-60 dark:opacity-40" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0
            translate-x-1/3 -translate-y-1/3
            w-[500px] h-[500px]
            rounded-full
            bg-[#671372]/10 dark:bg-[#671372]/08
            blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="
            absolute bottom-0 left-0
            -translate-x-1/4 translate-y-1/3
            w-[400px] h-[400px]
            rounded-full
            bg-[#8B1D9F]/08 dark:bg-[#8B1D9F]/06
            blur-3xl
            "
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #671372 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <Container>
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-16 lg:gap-20
            items-center
            w-full
          "
        >
          {/* LEFT */}
          <div className="flex justify-center w-full">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="
                flex flex-col
                items-center lg:items-start
                text-center lg:text-left
                w-full
                max-w-[620px]
              "
            >
              {/* Availability badge */}

              {/* Headline */}
              <motion.h1
                variants={item}
                className="
                text-5xl
                sm:text-6xl
                lg:text-[4.75rem]
                font-extrabold
                tracking-tight
                leading-[0.98]
                max-w-[9ch]
                text-gray-900 dark:text-white
                mb-5
              "
              >
                <span className="gradient-text">Heona Liu</span>
              </motion.h1>

              {/* Role chips */}
              <motion.div variants={item} className="flex flex-wrap gap-2 mb-6">
                {roles.map(({ Icon, label }) => (
                  <span
                    key={label}
                    style={{ padding: "0.5rem 1rem" }}
                    className="
                      inline-flex items-center justify-center
                      gap-2
                      rounded-full
                      border
                      bg-white dark:bg-gray-800
                      border-gray-200 dark:border-gray-700
                      text-[15px]
                      leading-none
                      font-medium
                      whitespace-nowrap
                      text-gray-700 dark:text-gray-300
                      shadow-soft
                    "
                  >
                    <Icon
                      size={14}
                      className="text-[#671372] dark:text-[#c44cf0] shrink-0"
                    />
                    {label}
                  </span>
                ))}
              </motion.div>

              {/* Bio */}
              <motion.div variants={item} className="relative max-w-xl mb-8 group/bio">
                <p
                  className="
                  text-lg sm:text-xl
                  leading-[1.9]
                  text-gray-600 dark:text-gray-400
                "
                >
                  {bio}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setEditingBio(true)}
                    title="Edit bio"
                    className="absolute -right-9 top-0 p-1.5 rounded-lg
                               opacity-0 group-hover/bio:opacity-100
                               hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <PenLine size={13} className="text-gray-400" />
                  </button>
                )}
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={item}
                className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 w-full justify-center lg:justify-start"
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: "0.5rem 1rem" }}
                    className="flex items-center gap-2 px-8 py-4 rounded-full
                             bg-[#671372] hover:bg-[#8B1D9F]
                             text-white text-[15px] font-semibold
                             shadow-purple-lg transition-all duration-200"
                  >
                    View Projects <ArrowRight size={14} />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: "0.5rem 1rem" }}
                    className="
                      flex items-center gap-2 px-8 py-4 rounded-full
                      border
                      bg-white dark:bg-gray-800
                      border-gray-200 dark:border-gray-700
                      text-[15px]
                      font-medium
                      shadow-purple-lg transition-all duration-200"
                  >
                    Contact Me
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats row */}
        
            </motion.div>
          </div>

          {/* ── Right column: visual card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="
              order-1 lg:order-2
              flex justify-center
              w-full
            "
          >
            {/*
              Self-contained card — all decorative children stay inside
              the overflow-hidden wrapper.
            */}
            <div
              className="
                relative
                w-[280px] h-[330px]
                sm:w-[320px] sm:h-[370px]
                lg:w-[360px] lg:h-[410px]
                shrink-0
              "
            >
              {/* Main panel */}
              <div
                className="w-full h-full rounded-[2rem]
                              bg-gradient-to-br
                              from-[#671372]/12 via-[#8B1D9F]/08 to-[#c44cf0]/06
                              dark:from-[#671372]/22 dark:via-[#8B1D9F]/14 dark:to-[#c44cf0]/10
                              border border-[#671372]/10 dark:border-[#671372]/20
                              shadow-large overflow-hidden
                              flex flex-col items-center justify-center gap-4 p-8"
              >
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full bg-[#671372]
                                flex items-center justify-center shadow-purple-lg flex-shrink-0"
                >
                  <Terminal size={30} className="text-white" />
                </div>

                <div className="text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-100">
                    Heona Liu
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    CS Student &amp; Digital Artist
                  </p>
                </div>

                {/* Social row inside card */}
                <div className="flex gap-2 mt-2">
                  {[
                    { Icon: Github,   href: "https://github.com/heonaliu" },
                    { Icon: Mail,    href: "mailto:heonaliu@gmail.com" },
                    { Icon: Youtube, href: "https://www.youtube.com/@sleepymeilows" },
                    { Icon: Palette, href: "/art" },
                  ].map(({ Icon, href }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="w-9 h-9 rounded-full
                                 bg-white/60 dark:bg-white/10
                                 border border-white/40 dark:border-white/10
                                 flex items-center justify-center
                                 text-gray-600 dark:text-gray-300
                                 hover:bg-[#671372] hover:text-white hover:border-[#671372]
                                 transition-all duration-200"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>

                {/* Keyboard shortcut hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-1"
                >
                  <kbd
                    className="px-1.5 py-0.5 rounded bg-white/70 dark:bg-white/10
                                   font-mono text-[10px] text-gray-500 dark:text-gray-400
                                   border border-gray-200 dark:border-gray-700"
                  >
                    ⌘K
                  </kbd>
                  quick search
                </motion.p>
              </div>

              {/* Decorative floating chips — outside main panel but within 320/360px container */}
              <div
                className="
                  group/chip
                  absolute top-0 right-0
                  translate-x-1/4 -translate-y-1/4
                  bg-white dark:bg-gray-800
                  border border-gray-100 dark:border-gray-700
                  rounded-2xl px-5 py-3
                  shadow-medium z-10
                  "
              >
                {isAdmin && (
                  <button
                    onClick={() => openChipEdit("chip1")}
                    title="Edit badge"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                               bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                               flex items-center justify-center shadow-soft
                               opacity-0 group-hover/chip:opacity-100 transition-opacity"
                  >
                    <PenLine size={11} className="text-gray-400" />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  {React.createElement(CHIP_ICON_MAP[chip1.icon] ?? Code2, {
                    size: 14,
                    className: "text-[#671372] dark:text-[#c44cf0]",
                  })}
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {chip1.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {chip1.sublabel}
                </p>
              </div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                className="
                  group/chip
                  absolute bottom-0 left-0
                  -translate-x-1/4 translate-y-1/4
                  bg-white dark:bg-gray-800
                  border border-gray-100 dark:border-gray-700
                  rounded-2xl
                  px-5 py-3
                  shadow-medium
                  z-10
                  "
              >
                {isAdmin && (
                  <button
                    onClick={() => openChipEdit("chip2")}
                    title="Edit badge"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                               bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                               flex items-center justify-center shadow-soft
                               opacity-0 group-hover/chip:opacity-100 transition-opacity"
                  >
                    <PenLine size={11} className="text-gray-400" />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  {React.createElement(CHIP_ICON_MAP[chip2.icon] ?? Music, {
                    size: 14,
                    className: "text-[#671372] dark:text-[#c44cf0]",
                  })}
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {chip2.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {chip2.sublabel}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-2"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-5 h-8 border-2 border-gray-300 dark:border-gray-700
                     rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-[#671372] dark:bg-[#c44cf0] rounded-full" />
        </motion.div>
      </motion.div>

      {/* ══ Edit Bio ══════════════════════════════════════ */}
      <AnimatePresence>
        {editingBio && (
          <EditTextFieldsModal
            heading="Edit Bio"
            fields={[{ key: "subtitle", label: "Bio", value: bio, multiline: true }]}
            onClose={() => setEditingBio(false)}
            onSave={handleSaveBio}
          />
        )}
      </AnimatePresence>

      {/* ══ Edit Floating Badge ═══════════════════════════ */}
      <AnimatePresence>
        {editingChip && (
          <ChipEditModal
            chipId={editingChip}
            chip={editingChip === 'chip1' ? chip1 : chip2}
            iconDraft={chipIconDraft}
            onIconChange={setChipIconDraft}
            onClose={() => setEditingChip(null)}
            onSave={handleSaveChip(editingChip)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

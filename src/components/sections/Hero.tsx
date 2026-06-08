"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Palette,
  Hammer,
  Terminal,
  Github,
  Mail,
  PenLine,
} from "lucide-react";
import Container from "@/components/ui/Container";
import EditTextFieldsModal from "@/components/ui/EditTextFieldsModal";
import { useAuth } from "@/context/AuthContext";
import type { PageHeaderOverride, HeroChipOverride } from "@/lib/page-content-firestore";

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

const DEFAULT_CHIPS: Record<string, { label: string; sublabel: string }> = {
  chip1: { label: "TypeScript", sublabel: "Favourite language" },
  chip2: { label: "Making art", sublabel: "Currently" },
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

  const bio = headerOverride?.subtitle ?? DEFAULT_BIO
  const chip1 = { ...DEFAULT_CHIPS.chip1, ...chipOverrides?.chip1 }
  const chip2 = { ...DEFAULT_CHIPS.chip2, ...chipOverrides?.chip2 }

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
    await saveHeroChip(chipId, { label: values.label.trim(), sublabel: values.sublabel.trim() })
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
                    { Icon: Github, href: "https://github.com/heonaliu" },
                    { Icon: Mail, href: "mailto:heonaliu@gmail.com" },
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
                    onClick={() => setEditingChip("chip1")}
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
                  <Code2
                    size={14}
                    className="text-[#671372] dark:text-[#c44cf0]"
                  />
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
                    onClick={() => setEditingChip("chip2")}
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
                  <span className="text-[15px]">🎵</span>
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
          <EditTextFieldsModal
            heading="Edit Badge"
            fields={[
              { key: "label", label: "Label", value: editingChip === "chip1" ? chip1.label : chip2.label },
              { key: "sublabel", label: "Sublabel", value: editingChip === "chip1" ? chip1.sublabel : chip2.sublabel },
            ]}
            onClose={() => setEditingChip(null)}
            onSave={handleSaveChip(editingChip)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

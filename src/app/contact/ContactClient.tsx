'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle, PenLine } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditTextFieldsModal from '@/components/ui/EditTextFieldsModal'
import { useAuth } from '@/context/AuthContext'
import type { PageHeaderOverride } from '@/lib/page-content-firestore'

const socialLinks = [
  { Icon: Github,   label: 'GitHub',   handle: '@heonaliu',          href: 'https://github.com/heonaliu' },
  { Icon: Linkedin, label: 'LinkedIn', handle: 'Heona Liu',           href: 'https://linkedin.com/in/heonaliu' },
  { Icon: Mail,     label: 'Email',    handle: 'heonaliu@gmail.com', href: 'mailto:heonaliu@gmail.com' },
]

interface Props {
  headerOverride?: PageHeaderOverride
}

const DEFAULT_HEADER = {
  title: "Let's Connect",
  subtitle: "Whether it's a project idea, a collaboration, or just saying hello — my inbox is always open.",
}

export default function ContactClient({ headerOverride }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [editingHeader, setEditingHeader] = useState(false)

  const headerTitle = headerOverride?.title ?? DEFAULT_HEADER.title
  const headerSubtitle = headerOverride?.subtitle ?? DEFAULT_HEADER.subtitle

  const handleSaveHeader = async (values: Record<string, string>) => {
    const { auth } = await import('@/lib/firebase')
    if (!auth?.currentUser) throw new Error('You are not signed in. Please sign in as admin and try again.')
    const { savePageHeader } = await import('@/lib/page-content-firestore')
    await savePageHeader('contact', { title: values.title.trim(), subtitle: values.subtitle.trim() })
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setSubmitted(true)
    setLoading(false)
  }

  const inputCls = `w-full px-5 py-3.5 rounded-2xl text-sm
    border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-[#671372]/25 focus:border-[#671372]/40
    transition-all`

  return (
    <div className="min-h-screen layout-safe">

      {/* ══ Hero ══════════════════════════════════════════ */}
      <section className="section-white pt-32 pb-14 lg:pt-40 lg:pb-20">
        <Container>
          <AnimatedSection>
            <div className="flex items-start gap-2">
              <SectionLabel>Get In Touch</SectionLabel>
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
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              {headerSubtitle}
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* ══ Form + Social ══════════════════════════════════ */}
      <section className="section-subtle py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">

            {/* Form — 3 cols */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20
                               bg-white dark:bg-gray-900
                               border border-gray-100 dark:border-gray-800
                               rounded-3xl shadow-soft"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 250 }}
                    >
                      <CheckCircle size={48} className="text-emerald-500 mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      I&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                      className="mt-6 text-sm text-[#671372] dark:text-[#c44cf0] hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-900
                               border border-gray-100 dark:border-gray-800
                               rounded-3xl p-8 shadow-soft space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider
                                          text-gray-500 dark:text-gray-400 mb-2">
                          Name
                        </label>
                        <input
                          required value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider
                                          text-gray-500 dark:text-gray-400 mb-2">
                          Email
                        </label>
                        <input
                          required type="email" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@email.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider
                                        text-gray-500 dark:text-gray-400 mb-2">
                        Subject
                      </label>
                      <input
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="What's this about?"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider
                                        text-gray-500 dark:text-gray-400 mb-2">
                        Message
                      </label>
                      <textarea
                        required rows={6} value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Hi Heona, I'd love to..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2
                                 px-6 py-4 rounded-2xl
                                 bg-[#671372] hover:bg-[#8B1D9F] text-white
                                 text-sm font-semibold shadow-purple-lg
                                 transition-all duration-200
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <><Send size={15} /> Send Message</>
                      )}
                    </motion.button>
                  </form>
                )}
              </AnimatedSection>
            </div>

            {/* Social — 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              <AnimatedSection delay={0.1}>
                <div className="bg-white dark:bg-gray-900
                                border border-gray-100 dark:border-gray-800
                                rounded-3xl p-7 shadow-soft">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Other Ways to Reach Me
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Prefer direct contact? Find me on any of these.
                  </p>

                  <div className="space-y-3">
                    {socialLinks.map(({ Icon, label, handle, href }) => (
                      <motion.a
                        key={href}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-4 p-4 rounded-2xl
                                   bg-gray-50 dark:bg-gray-800
                                   border border-gray-100 dark:border-gray-700
                                   hover:border-[#671372]/25 dark:hover:border-[#671372]/35
                                   hover:bg-gray-100 dark:hover:bg-gray-700/50
                                   transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-xl
                                        bg-white dark:bg-gray-700
                                        border border-gray-100 dark:border-gray-600
                                        flex items-center justify-center shadow-soft flex-shrink-0">
                          <Icon size={16} className="text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{handle}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="rounded-3xl p-7 text-white overflow-hidden relative"
                     style={{ background: 'linear-gradient(135deg, #671372 0%, #4A0D52 100%)' }}>
                  {/* Decorative blob */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-3xl mb-4">☕</div>
                    <h3 className="text-base font-bold mb-2">Open to Opportunities</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      I&apos;m always interested in exciting projects, internships, and collaborations.
                      If you have something in mind, I&apos;d love to hear about it.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Available for new projects
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
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
    </div>
  )
}

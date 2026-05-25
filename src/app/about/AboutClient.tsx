'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, Code2, Palette, Music, Activity, Zap, Star, Coffee, BookOpen } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

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

const timeline = [
  { year: '2020', title: 'Started Coding',          desc: 'Wrote my first "Hello World" in Python. Fell in love immediately.',        Icon: Code2    },
  { year: '2021', title: 'Discovered Digital Art',  desc: 'Picked up Procreate and started experimenting with illustration.',          Icon: Palette  },
  { year: '2022', title: 'First Hackathon',         desc: 'Built something real in 24 hours. Learned more in one weekend than one semester.', Icon: Zap },
  { year: '2023', title: 'Web Dev Deep Dive',       desc: 'Fell into the React / Next.js rabbit hole. Never came out.',                Icon: Star     },
  { year: '2024', title: 'Projects & Growth',       desc: 'Built multiple projects, explored ML, contributed to open source.',         Icon: Coffee   },
  { year: '2025', title: 'Now',                     desc: 'CS student, part-time creator, full-time curious human.',                   Icon: BookOpen },
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

export default function AboutClient() {
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
          <AnimatedSection className="mb-14">
            <SectionLabel>Background</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              My Journey
            </h2>
          </AnimatedSection>

          {/* Timeline — max-width to keep it readable, not full-grid wide */}
          <div className="max-w-2xl relative">
            {/* Vertical rule */}
            <div className="absolute left-8 top-6 bottom-6 w-px
                            bg-gradient-to-b from-[#671372] via-[#8B1D9F]/50 to-transparent" />

            <div className="flex flex-col gap-8">
              {timeline.map(({ year, title, desc, Icon }, i) => (
                <AnimatedSection key={year} delay={i * 0.08} direction="left">
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
                        {year}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

    </div>
  )
}

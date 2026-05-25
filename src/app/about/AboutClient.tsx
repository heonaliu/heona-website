'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, Code2, Palette, Music, Activity, Zap, Star, Coffee, BookOpen } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const skills = [
  { category: 'Languages',     items: ['TypeScript', 'Python', 'JavaScript', 'Java', 'SQL', 'HTML/CSS'] },
  { category: 'Frontend',      items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Figma'] },
  { category: 'Backend & DB',  items: ['Node.js', 'Firebase', 'Firestore', 'PostgreSQL', 'REST APIs'] },
  { category: 'Tools & Other', items: ['Git', 'VS Code', 'Vercel', 'Docker', 'Procreate', 'Illustrator'] },
  { category: 'ML / AI',       items: ['Python ML', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy'] },
]

const timeline = [
  { year: '2020', title: 'Started Coding',           desc: 'Wrote my first "Hello World" in Python. Fell in love immediately.',         Icon: Code2    },
  { year: '2021', title: 'Discovered Digital Art',   desc: 'Picked up Procreate and started experimenting with illustration.',           Icon: Palette  },
  { year: '2022', title: 'First Hackathon',          desc: 'Joined my first hackathon and built something real in 24 hours.',            Icon: Zap      },
  { year: '2023', title: 'Web Dev Deep Dive',        desc: 'Fell into the React / Next.js rabbit hole. Never came out.',                 Icon: Star     },
  { year: '2024', title: 'Projects & Growth',        desc: 'Built multiple projects, explored ML, contributed to open source.',          Icon: Coffee   },
  { year: '2025', title: 'Now',                      desc: 'CS student, part-time creator, full-time curious human.',                    Icon: BookOpen },
]

const interests = [
  { Icon: Code2,    label: 'Programming',  desc: 'Building tools that solve real problems and creative experiments' },
  { Icon: Palette,  label: 'Digital Art',  desc: 'Illustrations, character design, and generative visual experiments' },
  { Icon: Activity, label: 'Badminton',    desc: 'On the court whenever possible — great way to clear the mind' },
  { Icon: Music,    label: 'Piano',        desc: 'Classical pieces, movie soundtracks, and occasional improvisation' },
]

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-900
                   border border-gray-100 dark:border-gray-800
                   rounded-3xl shadow-soft ${className}`}>
    {children}
  </div>
)

export default function AboutClient() {
  return (
    <div className="min-h-screen pt-28 pb-24">

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Copy */}
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#671372] dark:text-[#c44cf0] mb-4">
              About Me
            </p>
            <h1 className="text-5xl font-extrabold leading-tight
                           text-gray-900 dark:text-white mb-6">
              A CS student who<br />
              <span className="gradient-text">can&apos;t stop creating</span>
            </h1>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
              <p>
                Hi! I&apos;m Heona — a computer science student with a deep passion for building
                things that matter. I love the intersection of technical precision and creative
                expression, which is why I spend equal time writing code and making art.
              </p>
              <p>
                Whether it&apos;s architecting a clean backend system, designing an intuitive UI,
                or illustrating a digital piece from scratch — I approach everything with
                curiosity and a desire to make it <em>just right</em>.
              </p>
              <p>
                When I&apos;m not at my desk, you&apos;ll find me on a badminton court, at a piano,
                or exploring wherever curiosity leads.
              </p>
            </div>

            <motion.a
              href="/resume.pdf"
              download
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full
                         bg-[#671372] hover:bg-[#8B1D9F] text-white text-sm font-semibold
                         shadow-purple-lg transition-all duration-200"
            >
              <Download size={14} />
              Download Resume
            </motion.a>
          </AnimatedSection>

          {/* Avatar */}
          <AnimatedSection direction="left">
            <div className="relative max-w-sm mx-auto">
              <div className="w-full aspect-square rounded-[2rem]
                              bg-gradient-to-br from-[#671372]/15 via-[#8B1D9F]/10 to-[#c44cf0]/8
                              dark:from-[#671372]/22 dark:via-[#8B1D9F]/15 dark:to-[#c44cf0]/10
                              border border-[#671372]/10 dark:border-[#671372]/20
                              shadow-large flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-[#671372]
                                  flex items-center justify-center shadow-purple-lg mb-4">
                    <span className="text-white font-bold text-3xl">HL</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Photo coming soon</p>
                </div>
              </div>

              {/* Floating chips */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4
                           bg-white dark:bg-gray-800
                           border border-gray-100 dark:border-gray-700
                           rounded-2xl px-4 py-3 shadow-medium"
              >
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Fav language</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">TypeScript 💙</p>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -top-4 -right-4
                           bg-white dark:bg-gray-800
                           border border-gray-100 dark:border-gray-700
                           rounded-2xl px-4 py-3 shadow-medium"
              >
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Building</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">This site ✨</p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Currently ── */}
      <section className="bg-gray-50 dark:bg-gray-900/40 py-20 px-6 mb-0">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <AnimatedSection>
            <Card className="p-8 h-full">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#671372]/10 dark:bg-[#671372]/20
                                 flex items-center justify-center text-base flex-shrink-0">
                  📚
                </span>
                Currently Learning
              </h2>
              <ul className="space-y-3">
                {['Advanced ML & Neural Networks', 'System Design & Architecture', 'Web3 & Solidity (exploring)', 'Piano — Chopin Nocturnes', '3D Modeling in Blender'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Card className="p-8 h-full">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#671372]/10 dark:bg-[#671372]/20
                                 flex items-center justify-center text-base flex-shrink-0">
                  🔨
                </span>
                What I Enjoy Building
              </h2>
              <ul className="space-y-3">
                {['Tools that solve real everyday problems', 'Beautiful, accessible web experiences', 'Creative coding experiments', 'Automations that save hours', 'Things that make people smile'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#671372] dark:bg-[#c44cf0] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Skills & Tools</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10">Technologies I work with and enjoy</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((group, i) => (
              <AnimatedSection key={group.category} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-gray-900
                             border border-gray-100 dark:border-gray-800
                             rounded-3xl p-6 shadow-soft
                             hover:shadow-medium hover:border-[#671372]/15 dark:hover:border-[#671372]/25
                             transition-all duration-300"
                >
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest
                                 text-[#671372] dark:text-[#c44cf0] mb-4">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span key={skill}
                            className="px-3 py-1.5 rounded-full text-xs font-medium
                                       bg-gray-100 dark:bg-gray-800
                                       text-gray-700 dark:text-gray-300
                                       hover:bg-[#671372]/10 hover:text-[#671372]
                                       dark:hover:bg-[#671372]/20 dark:hover:text-[#c44cf0]
                                       transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interests ── */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Interests</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10">Things I care about beyond the screen</p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {interests.map(({ Icon, label, desc }, i) => (
              <AnimatedSection key={label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900
                             border border-gray-100 dark:border-gray-800
                             rounded-3xl p-6 shadow-soft
                             hover:shadow-medium transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl
                                  bg-[#671372]/10 dark:bg-[#671372]/20
                                  flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#671372] dark:text-[#c44cf0]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Journey</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-12">How I got here</p>
          </AnimatedSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-4 bottom-4 w-px
                            bg-gradient-to-b from-[#671372] via-[#8B1D9F]/50 to-transparent" />

            <div className="space-y-6">
              {timeline.map(({ year, title, desc, Icon }, i) => (
                <AnimatedSection key={year} delay={i * 0.09} direction="left">
                  <div className="flex gap-5">
                    {/* Icon bubble */}
                    <div className="relative z-10 flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className="w-16 h-16 rounded-2xl
                                   bg-white dark:bg-gray-900
                                   border-2 border-[#671372]/20 dark:border-[#671372]/35
                                   shadow-soft flex items-center justify-center"
                      >
                        <Icon size={20} className="text-[#671372] dark:text-[#c44cf0]" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1.5 pb-6">
                      <span className="text-[10px] font-mono font-bold
                                       text-[#671372] dark:text-[#c44cf0]
                                       bg-[#671372]/10 dark:bg-[#671372]/20
                                       px-2.5 py-1 rounded-full">
                        {year}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2 mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

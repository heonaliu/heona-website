'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Youtube, ArrowRight, Sparkles } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'

export default function ContactCTA() {
  return (
    <section className="section-white py-24 lg:py-32">
      <Container>
        <AnimatedSection>
          <div
            className="relative overflow-hidden rounded-[2rem] px-8 py-16 md:px-16 md:py-20 text-center"
            style={{
              background: 'linear-gradient(135deg, #671372 0%, #4A0D52 100%)',
            }}
          >
            {/* Decorative blobs — contained */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.15, 1, 1.15], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-white/10 blur-3xl"
              />
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-white/15 border border-white/25
                           text-white/90 text-xs font-semibold mb-6"
              >
                <Sparkles size={11} />
                Let&apos;s build something together
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
              >
                Get In Touch
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="text-white/65 text-base sm:text-lg leading-relaxed mb-10"
              >
                Whether it&apos;s a project, a collaboration, or just saying hi —
                I&apos;d love to connect.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-full
                               bg-white text-[#671372] font-semibold text-sm
                               shadow-large hover:shadow-xl transition-all duration-200"
                  >
                    <Mail size={14} />
                    Send a message
                    <ArrowRight size={13} />
                  </motion.button>
                </Link>

                <div className="flex items-center gap-3">
                  {[
                    { Icon: Github,   href: 'https://github.com/heonaliu'     },
                    { Icon: Linkedin, href: 'https://www.linkedin.com/in/heona-liu-3ab1b237a/' },
                    { Icon: Youtube,  href: 'https://www.youtube.com/@sleepymeilows'      },
                  ].map(({ Icon, href }) => (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -1 }}
                      whileTap={{ scale: 0.92 }}
                      className="w-11 h-11 rounded-full
                                 bg-white/12 border border-white/20
                                 flex items-center justify-center text-white
                                 hover:bg-white/22 transition-all duration-200"
                    >
                      <Icon size={17} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}

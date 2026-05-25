'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, ArrowRight, Sparkles } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ContactCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <motion.div
            className="relative overflow-hidden rounded-4xl p-12 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, #671372 0%, #8B1D9F 50%, #4A0D52 100%)',
            }}
          >
            {/* Background elements */}
            <div className="absolute inset-0">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl"
              />
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white/90 text-xs font-medium mb-6"
              >
                <Sparkles size={12} />
                Let&apos;s build something together
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Get In Touch
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg mb-8 max-w-md mx-auto"
              >
                Whether it&apos;s a project, collaboration, or just saying hi —
                I&apos;d love to connect.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#671372] font-semibold text-sm shadow-large hover:shadow-xl transition-all duration-200"
                  >
                    <Mail size={15} />
                    Send a message
                    <ArrowRight size={14} />
                  </motion.button>
                </Link>

                <div className="flex items-center gap-3">
                  <motion.a
                    href="https://github.com/heonaliu"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Github size={18} />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/heonaliu"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Linkedin size={18} />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}

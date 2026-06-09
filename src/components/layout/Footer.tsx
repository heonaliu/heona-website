'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart, Sparkles, Youtube } from 'lucide-react'

const socials = [
  { Icon: Github,   href: 'https://github.com/heonaliu',         label: 'GitHub'   },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/heona-liu-3ab1b237a/',    label: 'LinkedIn' },
  { Icon: Mail,     href: 'mailto:heonaliu@gmail.com',           label: 'Email'    },
  { Icon: Youtube,  href: 'https://www.youtube.com/@sleepymeilows', label: 'YouTube'  },
]

const pages = [
  { href: '/about',    label: 'About'    },
  { href: '/projects', label: 'Projects' },
  { href: '/art',      label: 'Art'      },
  { href: '/blog',     label: 'Blog'     },
  { href: '/contact',  label: 'Contact'  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800
                       bg-white/60 dark:bg-gray-950/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#671372] flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Heona Liu</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              A minimal digital space showcasing engineering, creativity, and personal growth.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest
                           text-gray-400 dark:text-gray-500 mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {pages.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                        className="text-sm text-gray-600 dark:text-gray-400
                                   hover:text-[#671372] dark:hover:text-[#c44cf0]
                                   transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest
                           text-gray-400 dark:text-gray-500 mb-5">
              Connect
            </h3>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl
                             bg-gray-100 dark:bg-gray-800
                             text-gray-600 dark:text-gray-400
                             hover:bg-[#671372] hover:text-white
                             transition-all duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4
                        pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} Heona Liu. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
            Built with <Heart size={10} className="text-[#671372] mx-0.5" /> using Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}

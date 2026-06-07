'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Palette, PenLine } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import { useAuth } from '@/context/AuthContext'
import { saveFeaturedSelection } from '@/lib/home-featured-firestore'
import FeaturedSelectionModal from './FeaturedSelectionModal'
import type { Artwork } from '@/lib/artworks'

export default function FeaturedArt({
  artworks,
  selectedIds,
}: {
  artworks: Artwork[]
  selectedIds: string[]
}) {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [showSelector, setShowSelector] = useState(false)

  const byId = new Map(artworks.map((a) => [a.id, a]))
  const featured = selectedIds.map((id) => byId.get(id)).filter((a): a is Artwork => !!a)
  const display = (featured.length > 0 ? featured : artworks.slice(0, 4)).slice(0, 4)

  return (
    <section className="section-white py-24 lg:py-32">
      <Container>

        {/* Section header */}
        <AnimatedSection className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>
                <Palette size={10} className="inline mr-1.5 -mt-px" />
                Creative
              </SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                Art Gallery
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md leading-relaxed">
                Digital illustrations, concept art, and creative experiments
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowSelector(true)}
                  className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full
                             bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                             hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <PenLine size={13} /> Edit Featured
                </button>
              )}
              <Link href="/art">
                <motion.span
                  whileHover={{ x: 3 }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold
                             text-[#671372] dark:text-[#c44cf0] cursor-pointer
                             hover:underline underline-offset-2 shrink-0"
                >
                  Full gallery <ArrowRight size={14} />
                </motion.span>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Gallery grid — deliberately constrained height */}
        {display.length === 0 ? (
          <p className="text-center text-sm text-gray-400 italic py-12">No artwork yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {display.map((art, i) => (
              <AnimatedSection key={art.id} delay={i * 0.08}>
                <Link href="/art">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="group relative h-[260px] rounded-3xl overflow-hidden cursor-pointer
                               shadow-soft hover:shadow-purple-lg transition-shadow duration-300"
                  >
                    {/* Art image or gradient placeholder */}
                    {art.imageUrl ? (
                      <Image src={art.imageUrl} alt={art.title} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient}`} />
                    )}
                    <div
                      className="absolute inset-0 opacity-[0.16]"
                      style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Purple border on hover */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-[#671372]
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    {/* Caption */}
                    <div className="absolute inset-x-0 bottom-0
                                    bg-gradient-to-t from-black/70 via-black/30 to-transparent
                                    p-4 translate-y-full group-hover:translate-y-0
                                    transition-transform duration-300 z-20">
                      <p className="text-white text-sm font-semibold leading-none">{art.title}</p>
                      <p className="text-white/60 text-xs mt-1">{art.medium} · {art.year}</p>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* CTA */}
        <AnimatedSection delay={0.3} className="flex justify-center mt-12">
          <Link href="/art">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full
                         bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         text-sm font-semibold text-gray-800 dark:text-gray-200
                         shadow-soft hover:shadow-medium
                         hover:border-[#671372]/25 dark:hover:border-[#671372]/35
                         transition-all duration-200"
            >
              <Palette size={15} /> Explore the full gallery
            </motion.button>
          </Link>
        </AnimatedSection>

      </Container>

      <AnimatePresence>
        {showSelector && (
          <FeaturedSelectionModal
            title="Choose Featured Artwork"
            items={artworks.map((a) => ({
              id: a.id,
              label: a.title,
              sublabel: `${a.medium} · ${a.year}`,
            }))}
            selectedIds={selectedIds}
            onClose={() => setShowSelector(false)}
            onSave={async (ids) => {
              await saveFeaturedSelection('art', ids)
              router.refresh()
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

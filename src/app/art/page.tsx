import type { Metadata } from 'next'
import { getArtworkOverrides, getCustomArtworks } from '@/lib/artworks-firestore'
import { getArtJourneyNodes } from '@/lib/art-journey-firestore'
import ArtClient from './ArtClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Art',
  description: 'Digital art gallery — illustrations, concept art, and creative experiments by Heona Liu.',
}

export default async function ArtPage() {
  const [overrides, customArtworks, artJourneyNodes] = await Promise.all([
    getArtworkOverrides(),
    getCustomArtworks(),
    getArtJourneyNodes(),
  ])
  return <ArtClient overrides={overrides} customArtworks={customArtworks} artJourneyNodes={artJourneyNodes} />
}

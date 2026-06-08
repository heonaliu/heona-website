import type { Metadata } from 'next'
import { getArtworkOverrides, getCustomArtworks } from '@/lib/artworks-firestore'
import { getArtJourneyNodes } from '@/lib/art-journey-firestore'
import { getPageHeaderOverrides } from '@/lib/page-content-firestore'
import ArtClient from './ArtClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Art',
  description: 'Digital art gallery — illustrations, concept art, and creative experiments by Heona Liu.',
}

export default async function ArtPage() {
  const [overrides, customArtworks, artJourneyNodes, headerOverrides] = await Promise.all([
    getArtworkOverrides(),
    getCustomArtworks(),
    getArtJourneyNodes(),
    getPageHeaderOverrides(),
  ])
  return (
    <ArtClient
      overrides={overrides}
      customArtworks={customArtworks}
      artJourneyNodes={artJourneyNodes}
      headerOverride={headerOverrides.art}
    />
  )
}

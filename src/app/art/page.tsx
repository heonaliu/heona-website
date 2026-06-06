import type { Metadata } from 'next'
import { getArtworkOverrides } from '@/lib/artworks-firestore'
import ArtClient from './ArtClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Art',
  description: 'Digital art gallery — illustrations, concept art, and creative experiments by Heona Liu.',
}

export default async function ArtPage() {
  const overrides = await getArtworkOverrides()
  return <ArtClient overrides={overrides} />
}

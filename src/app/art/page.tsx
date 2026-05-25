import type { Metadata } from 'next'
import ArtClient from './ArtClient'

export const metadata: Metadata = {
  title: 'Art',
  description: 'Digital art gallery — illustrations, concept art, and creative experiments by Heona Liu.',
}

export default function ArtPage() {
  return <ArtClient />
}

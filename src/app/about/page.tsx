import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Heona Liu — CS student, digital artist, and builder.',
}

export default function AboutPage() {
  return <AboutClient />
}

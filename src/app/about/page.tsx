import type { Metadata } from 'next'
import { getTimelineNodes } from '@/lib/timeline-firestore'
import AboutClient from './AboutClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Heona Liu — CS student, digital artist, and builder.',
}

export default async function AboutPage() {
  const timelineNodes = await getTimelineNodes()
  return <AboutClient timelineNodes={timelineNodes} />
}

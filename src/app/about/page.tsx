import type { Metadata } from 'next'
import { getTimelineNodes } from '@/lib/timeline-firestore'
import { getSkillSections } from '@/lib/skills-firestore'
import { getInterests } from '@/lib/interests-firestore'
import { getAboutCardOverrides } from '@/lib/about-cards-firestore'
import AboutClient from './AboutClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Heona Liu — CS student, digital artist, and builder.',
}

export default async function AboutPage() {
  const [timelineNodes, skillSections, interests, cardOverrides] = await Promise.all([
    getTimelineNodes(),
    getSkillSections(),
    getInterests(),
    getAboutCardOverrides(),
  ])
  return (
    <AboutClient
      timelineNodes={timelineNodes}
      skillSections={skillSections}
      interests={interests}
      cardOverrides={cardOverrides}
    />
  )
}

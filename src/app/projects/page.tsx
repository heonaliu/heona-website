import type { Metadata } from 'next'
import { getProjectsFromFirestore } from '@/lib/projects-firestore'
import { getPageHeaderOverrides } from '@/lib/page-content-firestore'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software projects and experiments by Heona Liu.',
}

export default async function ProjectsPage() {
  const [projects, headerOverrides] = await Promise.all([
    getProjectsFromFirestore(),
    getPageHeaderOverrides(),
  ])
  return <ProjectsClient projects={projects} headerOverride={headerOverrides.projects} />
}

import type { Metadata } from 'next'
import { getProjectsFromFirestore } from '@/lib/projects-firestore'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software projects and experiments by Heona Liu.',
}

export default async function ProjectsPage() {
  const projects = await getProjectsFromFirestore()
  return <ProjectsClient projects={projects} />
}

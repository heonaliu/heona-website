import type { Metadata } from 'next'
import { getProjectsFromFirestore } from '@/lib/projects-firestore'
import { staticProjects } from '@/lib/projects'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software projects and experiments by Heona Liu.',
}

export default async function ProjectsPage() {
  const firestoreProjects = await getProjectsFromFirestore()
  // Firestore projects appear first (newest), static examples follow
  const projects = [...firestoreProjects, ...staticProjects]
  return <ProjectsClient projects={projects} />
}

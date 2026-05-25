import type { Metadata } from 'next'
import ProjectsClient from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software projects and experiments by Heona Liu.',
}

export default function ProjectsPage() {
  return <ProjectsClient />
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  color: string
  github: string | null
  demo: string | null
  status: 'live' | 'wip' | 'paused' | 'not-deployed'
  year: string
  inspiration: string
  problem: string
  challenges: string[]
  lessons: string[]
  imageUrl?: string | null
  otherLinks?: { title: string; url: string }[]
  docId?: string
}

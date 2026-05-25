import type { Metadata } from 'next'
import { getAllPosts, getAllTags } from '@/lib/blog'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Personal reflections, project stories, and creative thoughts by Heona Liu.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  return <BlogClient posts={posts} tags={tags} />
}

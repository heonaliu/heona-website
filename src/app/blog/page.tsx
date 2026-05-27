import type { Metadata } from 'next'
import { getPostsFromFirestore } from '@/lib/blog-firestore'
import BlogClient from './BlogClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Personal reflections, project stories, and creative thoughts by Heona Liu.',
}

export default async function BlogPage() {
  const posts = await getPostsFromFirestore()
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
  return <BlogClient posts={posts} tags={tags} />
}

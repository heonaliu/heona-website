import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlugFromFirestore } from '@/lib/blog-firestore'
import BlogPostClient from './BlogPostClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlugFromFirestore(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlugFromFirestore(slug)
  if (!post) notFound()
  return <BlogPostClient post={post!} />
}

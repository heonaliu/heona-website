import type { Metadata } from 'next'
import BlogEditor from '@/components/blog/BlogEditor'

export const metadata: Metadata = {
  title: 'New Post',
}

export default function NewPostPage() {
  return <BlogEditor />
}

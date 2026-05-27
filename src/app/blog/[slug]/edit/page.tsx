import { notFound } from 'next/navigation'
import { getPostForEditing } from '@/lib/blog-firestore'
import BlogEditor from '@/components/blog/BlogEditor'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  const { slug } = await params
  const result = await getPostForEditing(slug)

  if (!result) notFound()

  const { post, docId } = result

  return (
    <BlogEditor
      postId={docId}
      initialTitle={post.title}
      initialContent={post.content}
      initialExcerpt={post.excerpt}
      initialTags={post.tags}
      initialSlug={post.slug}
    />
  )
}

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  docId?: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  coverImage?: string
  emoji?: string
  draft?: boolean
  content: string
  readingTime: string
}

export function getAllPosts(includeDrafts = false): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
    const { data, content } = matter(raw)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      emoji: data.emoji,
      draft: data.draft || false,
      content,
      readingTime: stats.text,
    } as BlogPost
  })

  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    const altPath = path.join(BLOG_DIR, `${slug}.md`)
    const actualPath = fs.existsSync(filePath) ? filePath : altPath

    if (!fs.existsSync(actualPath)) return null

    const raw = fs.readFileSync(actualPath, 'utf8')
    const { data, content } = matter(raw)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      emoji: data.emoji,
      draft: data.draft || false,
      content,
      readingTime: stats.text,
    }
  } catch {
    return null
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set(posts.flatMap((p) => p.tags))
  return Array.from(tags).sort()
}

import type { BlogPost } from './blog'

// Safely import db — works server-side and client-side
async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getPostsFromFirestore(includeDrafts = false): Promise<BlogPost[]> {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, getDocs, query, where } = await import('firebase/firestore')
    const postsRef = collection(db, 'posts')
    // Single-field where — no composite index needed. Sort in JS.
    const q = includeDrafts
      ? query(postsRef)
      : query(postsRef, where('published', '==', true))

    const snapshot = await getDocs(q)
    const { default: readingTime } = await import('reading-time')

    const posts = snapshot.docs.map((doc) => {
      const d = doc.data()
      const stats = readingTime(d.content || '')
      const ts = d.publishedAt ?? d.createdAt
      const date = ts?.toDate
        ? ts.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : ''
      const sortMs: number = ts?.toMillis ? ts.toMillis() : 0

      return {
        slug: d.slug || doc.id,
        docId: doc.id,
        title: d.title || 'Untitled',
        excerpt: d.excerpt || '',
        date,
        tags: d.tags || [],
        draft: d.draft ?? false,
        content: d.content || '',
        readingTime: stats.text,
        _sortMs: sortMs,
      }
    })

    // Sort newest-first in JS (avoids composite index requirement)
    posts.sort((a, b) => b._sortMs - a._sortMs)

    return posts.map(({ _sortMs: _unused, ...p }) => p) as BlogPost[]
  } catch (e) {
    console.error('[blog-firestore] getPostsFromFirestore:', e)
    return []
  }
}

export async function deletePostFromFirestore(docId: string): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')

  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'posts', docId))
}

/** Returns the post plus its Firestore document ID — used by the edit page. */
export async function getPostForEditing(slug: string): Promise<{ post: BlogPost; docId: string; dateISO: string } | null> {
  try {
    const db = await getDb()
    if (!db) return null

    const { collection, getDocs, getDoc, doc: docRef, query, where } = await import('firebase/firestore')
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('slug', '==', slug))
    const snapshot = await getDocs(q)

    let docSnap = snapshot.docs[0]
    if (!docSnap) {
      // Older drafts may have been saved without a `slug` field — fall back to a direct document-ID lookup.
      const direct = await getDoc(docRef(db, 'posts', slug))
      if (!direct.exists()) return null
      docSnap = direct as typeof docSnap
    }

    const d = docSnap.data()
    const { default: readingTime } = await import('reading-time')
    const stats = readingTime(d.content || '')
    const ts = d.publishedAt ?? d.createdAt
    const tsDate: Date | null = ts?.toDate ? ts.toDate() : null
    const date = tsDate
      ? tsDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : ''
    const dateISO = tsDate
      ? `${tsDate.getFullYear()}-${String(tsDate.getMonth() + 1).padStart(2, '0')}-${String(tsDate.getDate()).padStart(2, '0')}`
      : new Date().toISOString().slice(0, 10)

    return {
      docId: docSnap.id,
      dateISO,
      post: {
        slug: d.slug || docSnap.id,
        title: d.title || '',
        excerpt: d.excerpt || '',
        date,
        tags: d.tags || [],
        draft: d.draft ?? false,
        content: d.content || '',
        readingTime: stats.text,
      },
    }
  } catch (e) {
    console.error('[blog-firestore] getPostForEditing:', e)
    return null
  }
}

export async function getPostBySlugFromFirestore(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getDb()
    if (!db) return null

    const { collection, getDocs, query, where } = await import('firebase/firestore')
    const postsRef = collection(db, 'posts')
    // Query only by slug; check published in JS to avoid composite index
    const q = query(postsRef, where('slug', '==', slug))
    const snapshot = await getDocs(q)

    if (snapshot.empty) return null

    const doc = snapshot.docs.find((d) => d.data().published === true)
    if (!doc) return null

    const d = doc.data()
    const { default: readingTime } = await import('reading-time')
    const stats = readingTime(d.content || '')
    const ts = d.publishedAt ?? d.createdAt
    const date = ts?.toDate
      ? ts.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : ''

    return {
      slug: d.slug || doc.id,
      title: d.title || 'Untitled',
      excerpt: d.excerpt || '',
      date,
      tags: d.tags || [],
      draft: d.draft ?? false,
      content: d.content || '',
      readingTime: stats.text,
    }
  } catch (e) {
    console.error('[blog-firestore] getPostBySlugFromFirestore:', e)
    return null
  }
}

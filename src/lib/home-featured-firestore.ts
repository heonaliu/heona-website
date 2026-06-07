// Stores which items are featured on the home page (and in what order) for
// each section. Keyed by a fixed section id ('projects' | 'art' | 'posts'),
// each doc holds an ordered list of the underlying item IDs to display.

export type FeaturedSection = 'projects' | 'art' | 'posts'

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getFeaturedSelections(): Promise<Record<FeaturedSection, string[]>> {
  const empty: Record<FeaturedSection, string[]> = { projects: [], art: [], posts: [] }
  try {
    const db = await getDb()
    if (!db) return empty
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'home_featured'))
    const selections = { ...empty }
    snapshot.docs.forEach((doc) => {
      const d = doc.data()
      if ((doc.id === 'projects' || doc.id === 'art' || doc.id === 'posts') && Array.isArray(d.ids)) {
        selections[doc.id] = d.ids
      }
    })
    return selections
  } catch (e) {
    console.error('[home-featured-firestore] getFeaturedSelections:', e)
    return empty
  }
}

export async function saveFeaturedSelection(section: FeaturedSection, ids: string[]): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, setDoc } = await import('firebase/firestore')
  await setDoc(doc(db, 'home_featured', section), { ids }, { merge: true })
}

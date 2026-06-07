export interface ArtworkOverride {
  imageUrl?: string
  title?: string
  year?: string
  medium?: string
  reflection?: string
  tags?: string[]
}

export interface CustomArtwork {
  id: string
  title: string
  medium: string
  year: string
  description: string
  reflection: string
  imageUrl: string
  tags: string[]
  gradient: string
}

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

/** Returns a map of artworkId → { imageUrl, title, year } for all saved overrides. */
export async function getArtworkOverrides(): Promise<Record<string, ArtworkOverride>> {
  try {
    const db = await getDb()
    if (!db) return {}
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'art_images'))
    const overrides: Record<string, ArtworkOverride> = {}
    snapshot.docs.forEach((doc) => {
      const d = doc.data()
      overrides[doc.id] = {
        imageUrl:   d.imageUrl   || undefined,
        title:      d.title      || undefined,
        year:       d.year       || undefined,
        medium:     d.medium     || undefined,
        reflection: d.reflection || undefined,
        tags:       Array.isArray(d.tags) && d.tags.length ? d.tags : undefined,
      }
    })
    return overrides
  } catch (e) {
    console.error('[artworks-firestore]', e)
    return {}
  }
}

/** Upserts overrides (imageUrl, title, year) for a single artwork. */
export async function saveArtworkOverrides(
  artworkId: string,
  overrides: ArtworkOverride,
): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, setDoc } = await import('firebase/firestore')
  await setDoc(doc(db, 'art_images', artworkId), overrides, { merge: true })
}

/** Returns all admin-added artworks (separate from the static gallery pieces). */
export async function getCustomArtworks(): Promise<CustomArtwork[]> {
  try {
    const db = await getDb()
    if (!db) return []
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'custom_artworks'))
    const artworks = snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        title: d.title || '',
        medium: d.medium || '',
        year: d.year || new Date().getFullYear().toString(),
        description: d.description || '',
        reflection: d.reflection || '',
        imageUrl: d.imageUrl || '',
        tags: Array.isArray(d.tags) ? d.tags : [],
        gradient: d.gradient || 'from-purple-400 via-pink-500 to-rose-400',
      } satisfies CustomArtwork
    })
    return artworks.sort((a, b) => {
      const aMs = snapshot.docs.find((doc) => doc.id === a.id)?.data().createdAt?.toMillis?.() ?? 0
      const bMs = snapshot.docs.find((doc) => doc.id === b.id)?.data().createdAt?.toMillis?.() ?? 0
      return bMs - aMs
    })
  } catch (e) {
    console.error('[artworks-firestore] getCustomArtworks:', e)
    return []
  }
}

/** Adds a brand-new artwork piece (admin-only). */
export async function addCustomArtwork(data: Omit<CustomArtwork, 'id'>): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
  const docRef = await addDoc(collection(db, 'custom_artworks'), { ...data, createdAt: serverTimestamp() })
  return docRef.id
}

/** Updates a brand-new artwork piece (admin-only). */
export async function updateCustomArtwork(id: string, data: Omit<CustomArtwork, 'id'>): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'custom_artworks', id), { ...data })
}

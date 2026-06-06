export interface ArtworkOverride {
  imageUrl?: string
  title?: string
  year?: string
  reflection?: string
  tags?: string[]
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

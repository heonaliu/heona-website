export interface ArtJourneyNode {
  id: string
  year: string
  milestone: string
  order: number
}

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getArtJourneyNodes(): Promise<ArtJourneyNode[]> {
  try {
    const db = await getDb()
    if (!db) return []
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'art_journey'))
    const nodes = snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        year: d.year || '',
        milestone: d.milestone || '',
        order: typeof d.order === 'number' ? d.order : 0,
      } satisfies ArtJourneyNode
    })
    return nodes.sort((a, b) => a.order - b.order)
  } catch (e) {
    console.error('[art-journey-firestore] getArtJourneyNodes:', e)
    return []
  }
}

export async function addArtJourneyNode(data: Omit<ArtJourneyNode, 'id'>): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { collection, addDoc } = await import('firebase/firestore')
  const docRef = await addDoc(collection(db, 'art_journey'), { ...data })
  return docRef.id
}

export async function updateArtJourneyNode(id: string, data: Omit<ArtJourneyNode, 'id'>): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'art_journey', id), { ...data })
}

export async function deleteArtJourneyNode(id: string): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'art_journey', id))
}

export async function reorderArtJourneyNodes(order: { id: string; order: number }[]): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, writeBatch } = await import('firebase/firestore')
  const batch = writeBatch(db)
  order.forEach(({ id, order: pos }) => {
    batch.update(doc(db, 'art_journey', id), { order: pos })
  })
  await batch.commit()
}

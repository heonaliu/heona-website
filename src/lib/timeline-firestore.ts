export interface TimelineNode {
  id: string
  year: string
  title: string
  desc: string
  icon: string
  order: number
}

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getTimelineNodes(): Promise<TimelineNode[]> {
  try {
    const db = await getDb()
    if (!db) return []
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'timeline'))
    const nodes = snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        year: d.year || '',
        title: d.title || '',
        desc: d.desc || '',
        icon: d.icon || 'Star',
        order: typeof d.order === 'number' ? d.order : 0,
      } satisfies TimelineNode
    })
    return nodes.sort((a, b) => a.order - b.order)
  } catch (e) {
    console.error('[timeline-firestore] getTimelineNodes:', e)
    return []
  }
}

export async function addTimelineNode(data: Omit<TimelineNode, 'id'>): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { collection, addDoc } = await import('firebase/firestore')
  const docRef = await addDoc(collection(db, 'timeline'), { ...data })
  return docRef.id
}

export async function updateTimelineNode(id: string, data: Omit<TimelineNode, 'id'>): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'timeline', id), { ...data })
}

export async function deleteTimelineNode(id: string): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'timeline', id))
}

export async function reorderTimelineNodes(order: { id: string; order: number }[]): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, writeBatch } = await import('firebase/firestore')
  const batch = writeBatch(db)
  order.forEach(({ id, order: pos }) => {
    batch.update(doc(db, 'timeline', id), { order: pos })
  })
  await batch.commit()
}

export interface InterestNode {
  id: string
  icon: string
  label: string
  desc: string
  order: number
}

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getInterests(): Promise<InterestNode[]> {
  try {
    const db = await getDb()
    if (!db) return []
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'interests'))
    const nodes = snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        icon: d.icon || 'Star',
        label: d.label || '',
        desc: d.desc || '',
        order: typeof d.order === 'number' ? d.order : 0,
      } satisfies InterestNode
    })
    return nodes.sort((a, b) => a.order - b.order)
  } catch (e) {
    console.error('[interests-firestore] getInterests:', e)
    return []
  }
}

export async function addInterest(data: Omit<InterestNode, 'id'>): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { collection, addDoc } = await import('firebase/firestore')
  const docRef = await addDoc(collection(db, 'interests'), { ...data })
  return docRef.id
}

export async function updateInterest(id: string, data: Omit<InterestNode, 'id'>): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'interests', id), { ...data })
}

export async function deleteInterest(id: string): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'interests', id))
}

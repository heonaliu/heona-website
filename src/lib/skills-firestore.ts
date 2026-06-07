export interface SkillSection {
  id: string
  category: string
  items: string[]
  order: number
}

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getSkillSections(): Promise<SkillSection[]> {
  try {
    const db = await getDb()
    if (!db) return []
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'skill_sections'))
    const sections = snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        category: d.category || '',
        items: Array.isArray(d.items) ? d.items : [],
        order: typeof d.order === 'number' ? d.order : 0,
      } satisfies SkillSection
    })
    return sections.sort((a, b) => a.order - b.order)
  } catch (e) {
    console.error('[skills-firestore] getSkillSections:', e)
    return []
  }
}

export async function addSkillSection(data: Omit<SkillSection, 'id'>): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { collection, addDoc } = await import('firebase/firestore')
  const docRef = await addDoc(collection(db, 'skill_sections'), { ...data })
  return docRef.id
}

export async function updateSkillSection(id: string, data: Omit<SkillSection, 'id'>): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'skill_sections', id), { ...data })
}

export async function deleteSkillSection(id: string): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'skill_sections', id))
}

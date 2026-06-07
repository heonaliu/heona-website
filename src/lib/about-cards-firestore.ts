async function getDb() {
  const { db } = await import('./firebase')
  return db
}

// Keyed by a fixed card id (e.g. 'learning', 'building') — only the bullet
// list is overridable, the card's emoji/title stay defined in source.
export async function getAboutCardOverrides(): Promise<Record<string, string[]>> {
  try {
    const db = await getDb()
    if (!db) return {}
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'about_cards'))
    const overrides: Record<string, string[]> = {}
    snapshot.docs.forEach((doc) => {
      const d = doc.data()
      if (Array.isArray(d.items)) overrides[doc.id] = d.items
    })
    return overrides
  } catch (e) {
    console.error('[about-cards-firestore] getAboutCardOverrides:', e)
    return {}
  }
}

export async function saveAboutCardItems(key: string, items: string[]): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, setDoc } = await import('firebase/firestore')
  await setDoc(doc(db, 'about_cards', key), { items }, { merge: true })
}

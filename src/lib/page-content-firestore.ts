async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export interface PageHeaderOverride {
  title?: string
  subtitle?: string
}

// Keyed by a fixed page id (e.g. 'home', 'about', 'projects') — overrides the
// hero title and/or subtext for that page.
export async function getPageHeaderOverrides(): Promise<Record<string, PageHeaderOverride>> {
  try {
    const db = await getDb()
    if (!db) return {}
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'page_headers'))
    const overrides: Record<string, PageHeaderOverride> = {}
    snapshot.docs.forEach((doc) => {
      const d = doc.data()
      overrides[doc.id] = {
        title: typeof d.title === 'string' ? d.title : undefined,
        subtitle: typeof d.subtitle === 'string' ? d.subtitle : undefined,
      }
    })
    return overrides
  } catch (e) {
    console.error('[page-content-firestore] getPageHeaderOverrides:', e)
    return {}
  }
}

export async function savePageHeader(pageId: string, data: PageHeaderOverride): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, setDoc } = await import('firebase/firestore')
  await setDoc(doc(db, 'page_headers', pageId), data, { merge: true })
}

export interface HeroChipOverride {
  label?: string
  sublabel?: string
}

// Keyed by a fixed chip id (e.g. 'chip1', 'chip2') — overrides the floating
// badge text on the home hero card.
export async function getHeroChipOverrides(): Promise<Record<string, HeroChipOverride>> {
  try {
    const db = await getDb()
    if (!db) return {}
    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'home_hero_chips'))
    const overrides: Record<string, HeroChipOverride> = {}
    snapshot.docs.forEach((doc) => {
      const d = doc.data()
      overrides[doc.id] = {
        label: typeof d.label === 'string' ? d.label : undefined,
        sublabel: typeof d.sublabel === 'string' ? d.sublabel : undefined,
      }
    })
    return overrides
  } catch (e) {
    console.error('[page-content-firestore] getHeroChipOverrides:', e)
    return {}
  }
}

export async function saveHeroChip(chipId: string, data: HeroChipOverride): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')
  const { doc, setDoc } = await import('firebase/firestore')
  await setDoc(doc(db, 'home_hero_chips', chipId), data, { merge: true })
}

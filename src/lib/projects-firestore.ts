import type { Project } from './projects'

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const ref = collection(db, 'projects')
    const q = query(ref, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        docId: doc.id,
        title: d.title || '',
        description: d.description || '',
        longDescription: d.longDescription || '',
        tags: d.tags || [],
        color: d.color || 'from-[#671372]/25 to-[#8B1D9F]/15',
        github: d.github || null,
        demo: d.demo || null,
        status: (d.status as 'live' | 'wip') || 'wip',
        year: d.year || new Date().getFullYear().toString(),
        inspiration: d.inspiration || '',
        problem: d.problem || '',
        challenges: d.challenges || [],
        lessons: d.lessons || [],
        imageUrl: d.imageUrl || null,
      } satisfies Project
    })
  } catch (e) {
    console.error('[projects-firestore] getProjectsFromFirestore:', e)
    return []
  }
}

export async function uploadProjectImage(file: File): Promise<string> {
  const { storage } = await import('./firebase')
  if (!storage) throw new Error('Firebase Storage not initialized')

  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
  const storageRef = ref(storage, `projects/${Date.now()}-${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function addProjectToFirestore(
  data: Omit<Project, 'id' | 'docId'>,
  imageFile?: File,
): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')

  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')

  let imageUrl: string | null = null
  if (imageFile) {
    imageUrl = await uploadProjectImage(imageFile)
  }

  const docRef = await addDoc(collection(db, 'projects'), {
    ...data,
    imageUrl,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

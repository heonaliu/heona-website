import type { Project } from './projects'

async function getDb() {
  const { db } = await import('./firebase')
  return db
}

export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const db = await getDb()
    if (!db) return []

    const { collection, getDocs } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'projects'))

    const projects = snapshot.docs.map((doc) => {
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
        otherLinks: d.otherLinks || [],
      } satisfies Project
    })

    // Sort newest-first in JS — avoids requiring a Firestore composite index
    return projects.sort((a, b) => {
      const aMs = snapshot.docs.find((d) => d.id === a.id)?.data().createdAt?.toMillis?.() ?? 0
      const bMs = snapshot.docs.find((d) => d.id === b.id)?.data().createdAt?.toMillis?.() ?? 0
      return bMs - aMs
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

export async function updateProjectInFirestore(
  docId: string,
  data: Omit<Project, 'id' | 'docId'>,
): Promise<void> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')

  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'projects', docId), { ...data })
}

export async function addProjectToFirestore(
  data: Omit<Project, 'id' | 'docId'>,
): Promise<string> {
  const db = await getDb()
  if (!db) throw new Error('Firestore not initialized')

  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')

  const docRef = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

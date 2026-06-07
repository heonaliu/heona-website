import type { ArtworkOverride, CustomArtwork } from './artworks-firestore'

export const staticArtworks = [
  {
    id: '1',
    title: 'Purple Dreams',
    medium: 'Procreate',
    year: '2024',
    description: 'An exploration of color and emotion through abstract digital painting.',
    reflection: 'This piece was born from a late-night creative session where I just let the brush flow without planning. Sometimes the best work comes from letting go of control.',
    gradient: 'from-purple-400 via-pink-500 to-rose-400',
    tags: ['abstract', 'digital'],
  },
  {
    id: '2',
    title: 'Ocean Flow',
    medium: 'Adobe Illustrator',
    year: '2024',
    description: 'Vector art inspired by water and fluid dynamics.',
    reflection: 'I was fascinated by how water moves — there is math in every wave. This piece tries to capture that dance between chaos and order.',
    gradient: 'from-blue-400 via-cyan-500 to-teal-400',
    tags: ['vector', 'nature'],
  },
  {
    id: '3',
    title: 'Character Sketch',
    medium: 'Procreate',
    year: '2023',
    description: 'Character design exploration for a personal game concept.',
    reflection: 'My first serious attempt at character design. Learned so much about anatomy, expression, and storytelling through a single image.',
    gradient: 'from-orange-400 via-amber-400 to-yellow-300',
    tags: ['character', 'concept art'],
  },
  {
    id: '4',
    title: 'Neon City',
    medium: 'Photoshop',
    year: '2023',
    description: 'Cyberpunk cityscape at night, inspired by sci-fi aesthetics.',
    reflection: 'Cities fascinate me — millions of stories in one frame. This is my love letter to that chaos.',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    tags: ['environment', 'sci-fi'],
  },
  {
    id: '5',
    title: 'Minimalist Botanics',
    medium: 'Procreate',
    year: '2024',
    description: 'Clean botanical illustrations in a minimal style.',
    reflection: 'Sometimes simple is most powerful. These botanical studies taught me that restraint can be its own form of creativity.',
    gradient: 'from-green-400 via-emerald-400 to-teal-500',
    tags: ['minimal', 'botanical'],
  },
  {
    id: '6',
    title: 'Code & Canvas',
    medium: 'p5.js (generative)',
    year: '2024',
    description: 'Generative art created with code — where programming meets painting.',
    reflection: 'What if code was a brush? This piece is a celebration of that question. Every curve is a function, every color a variable.',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
    tags: ['generative', 'code art'],
  },
]

export type StaticArtwork = typeof staticArtworks[number]
export type Artwork = StaticArtwork & { imageUrl: string | null; isCustom?: boolean; docId?: string }

/** Merges the static gallery (with admin overrides applied) and custom artworks into one display list. */
export function buildArtworkList(
  overrides: Record<string, ArtworkOverride>,
  customArtworks: CustomArtwork[],
): Artwork[] {
  const overriddenStatic: Artwork[] = staticArtworks
    .filter((a) => !overrides[a.id]?.hidden)
    .map((a) => {
      const o = overrides[a.id]
      return {
        ...a,
        title:      o?.title      ?? a.title,
        year:       o?.year       ?? a.year,
        medium:     o?.medium     ?? a.medium,
        reflection: o?.reflection ?? a.reflection,
        imageUrl:   o?.imageUrl   ?? null,
        tags:       o?.tags       ?? a.tags,
      }
    })

  const customAsArtworks: Artwork[] = customArtworks.map((c) => ({
    id: c.id,
    title: c.title,
    medium: c.medium,
    year: c.year,
    description: c.description,
    reflection: c.reflection,
    gradient: c.gradient,
    tags: c.tags,
    imageUrl: c.imageUrl || null,
    isCustom: true,
    docId: c.id,
  }))

  return [...overriddenStatic, ...customAsArtworks]
}

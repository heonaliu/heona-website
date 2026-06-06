export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  color: string
  github: string | null
  demo: string | null
  status: 'live' | 'wip'
  year: string
  inspiration: string
  problem: string
  challenges: string[]
  lessons: string[]
  imageUrl?: string | null
  docId?: string
}

export const staticProjects: Project[] = [
  {
    id: 'static-1',
    title: 'Heona Portfolio',
    description: 'This portfolio website — built with Next.js, Framer Motion, and Firebase. Features a blog system with admin auth, art gallery with lightbox, and premium animations.',
    longDescription: 'A full-featured personal portfolio built from scratch. Includes authentication-gated blog editing, art gallery with masonry layout and lightbox modals, framer-motion page transitions, dark mode, cursor glow effects, scroll progress indicator, and a command palette.',
    tags: ['Next.js', 'React', 'Firebase', 'Tailwind CSS', 'TypeScript'],
    color: 'from-[#671372]/25 to-[#8B1D9F]/15',
    github: 'https://github.com/heonaliu/heona-website',
    demo: null,
    status: 'live',
    year: '2024',
    inspiration: 'I wanted a creative space to showcase both my technical and artistic work.',
    problem: 'Most developer portfolios feel clinical. I wanted mine to feel personal and alive.',
    challenges: [
      'Building a markdown blog editor with live preview',
      'Implementing smooth page transitions in Next.js',
      'Creating a masonry layout with proper animation',
    ],
    lessons: [
      "Framer Motion's layout animations are magic",
      'Firebase auth is remarkably straightforward',
      'Design systems pay off early',
    ],
  },
  {
    id: 'static-2',
    title: 'Creative Tool',
    description: 'Coming soon — a generative art tool that turns code parameters into visual compositions you can export.',
    longDescription: 'A browser-based tool for creating generative art using sliders, color pickers, and algorithm presets. Export to PNG or SVG.',
    tags: ['React', 'TypeScript', 'UI/UX'],
    color: 'from-blue-500/18 to-cyan-500/15',
    github: null,
    demo: null,
    status: 'wip',
    year: '2024',
    inspiration: 'I wanted to make generative art accessible to people without coding knowledge.',
    problem: 'Existing tools require familiarity with p5.js or Processing — high barrier to entry.',
    challenges: ['Real-time parameter rendering', 'Exporting canvas to SVG'],
    lessons: ['Browser canvas is surprisingly powerful', 'UX matters more than features'],
  },
  {
    id: 'static-3',
    title: 'Hackathon Project',
    description: 'A project built in 24 hours at a hackathon. Details coming soon as I write it up properly.',
    longDescription: 'Built in 24 hours at a hackathon. Focused on solving a real-world problem with minimal tech debt.',
    tags: ['Python', 'Machine Learning', 'React'],
    color: 'from-orange-400/18 to-rose-500/15',
    github: null,
    demo: null,
    status: 'wip',
    year: '2023',
    inspiration: 'Hackathon challenge prompt.',
    problem: 'A real problem identified during the hackathon.',
    challenges: ['Building fast under time pressure', 'Making something presentable in 24 hours'],
    lessons: ['Speed matters more than perfection', 'Team communication is everything'],
  },
]

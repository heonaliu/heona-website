import React from 'react'
import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import FeaturedArt from '@/components/sections/FeaturedArt'
import LatestBlog from '@/components/sections/LatestBlog'
import ContactCTA from '@/components/sections/ContactCTA'
import { getProjectsFromFirestore } from '@/lib/projects-firestore'
import { getArtworkOverrides, getCustomArtworks } from '@/lib/artworks-firestore'
import { buildArtworkList } from '@/lib/artworks'
import { getPostsFromFirestore } from '@/lib/blog-firestore'
import { getFeaturedSelections } from '@/lib/home-featured-firestore'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projects, overrides, customArtworks, posts, featured] = await Promise.all([
    getProjectsFromFirestore(),
    getArtworkOverrides(),
    getCustomArtworks(),
    getPostsFromFirestore(),
    getFeaturedSelections(),
  ])
  const artworks = buildArtworkList(overrides, customArtworks)

  return (
    <>
      <Hero />
      <FeaturedProjects projects={projects} selectedIds={featured.projects} />
      <FeaturedArt artworks={artworks} selectedIds={featured.art} />
      <LatestBlog posts={posts} selectedIds={featured.posts} />
      <ContactCTA />
    </>
  )
}

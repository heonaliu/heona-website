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
import { getPageHeaderOverrides, getHeroChipOverrides } from '@/lib/page-content-firestore'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projects, overrides, customArtworks, posts, featured, headerOverrides, chipOverrides] = await Promise.all([
    getProjectsFromFirestore(),
    getArtworkOverrides(),
    getCustomArtworks(),
    getPostsFromFirestore(),
    getFeaturedSelections(),
    getPageHeaderOverrides(),
    getHeroChipOverrides(),
  ])
  const artworks = buildArtworkList(overrides, customArtworks)

  return (
    <>
      <Hero headerOverride={headerOverrides.home} chipOverrides={chipOverrides} />
      <FeaturedProjects projects={projects} selectedIds={featured.projects} />
      <FeaturedArt artworks={artworks} selectedIds={featured.art} />
      <LatestBlog posts={posts} selectedIds={featured.posts} />
      <ContactCTA />
    </>
  )
}

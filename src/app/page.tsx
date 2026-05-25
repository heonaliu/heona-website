import React from 'react'
import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import FeaturedArt from '@/components/sections/FeaturedArt'
import LatestBlog from '@/components/sections/LatestBlog'
import ContactCTA from '@/components/sections/ContactCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <FeaturedArt />
      <LatestBlog />
      <ContactCTA />
    </>
  )
}

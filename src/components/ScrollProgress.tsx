'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const smoothProgress = useSpring(progress, { stiffness: 200, damping: 30 })

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(p)
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: smoothProgress.get() / 100 }}
    />
  )
}

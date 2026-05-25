'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      targetRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)

    const handleMouseEnter = () => setIsVisible(true)

    // Check for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, textarea, select')
      setIsHovering(!!interactive)
    }

    // Smooth ring follow
    let animFrame: number
    const animateRing = () => {
      setRingPosition((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.12,
        y: prev.y + (targetRef.current.y - prev.y) * 0.12,
      }))
      animFrame = requestAnimationFrame(animateRing)
    }
    animFrame = requestAnimationFrame(animateRing)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animFrame)
    }
  }, [isVisible])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      {/* Dot */}
      <motion.div
        className="cursor-dot pointer-events-none hidden lg:block"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          opacity: isVisible ? 1 : 0,
          transform: isHovering ? 'scale(2)' : 'scale(1)',
        }}
      />
      {/* Ring */}
      <motion.div
        className="cursor-ring pointer-events-none hidden lg:block"
        style={{
          left: ringPosition.x - 16,
          top: ringPosition.y - 16,
          opacity: isVisible ? (isHovering ? 0.8 : 0.5) : 0,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          marginLeft: isHovering ? -8 : 0,
          marginTop: isHovering ? -8 : 0,
        }}
      />
    </>
  )
}

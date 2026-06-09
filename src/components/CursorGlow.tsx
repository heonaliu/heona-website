'use client'

import React, { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const target = { x: -200, y: -200 }
    const ring = { x: -200, y: -200 }
    let visible = false
    let hovering = false
    let animFrame: number

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x - 4}px, ${target.y - 4}px) scale(${hovering ? 1.8 : 1})`
        dotRef.current.style.opacity = visible ? '1' : '0'
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 16}px, ${ring.y - 16}px)`
        ringRef.current.style.opacity = visible ? (hovering ? '0.75' : '0.45') : '0'
      }

      animFrame = requestAnimationFrame(tick)
    }
    animFrame = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      visible = true
    }
    const onLeave = () => { visible = false }
    const onEnter = () => { visible = true }
    const onOver = (e: MouseEvent) => {
      hovering = !!((e.target as HTMLElement).closest('a, button, [role="button"], input, textarea, select'))
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none hidden lg:block"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          background: '#671372',
          borderRadius: '50%',
          zIndex: 99999,
          transition: 'opacity 0.2s ease, transform 0.06s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none hidden lg:block"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          border: '2px solid rgba(103,19,114,0.55)',
          borderRadius: '50%',
          zIndex: 99998,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}

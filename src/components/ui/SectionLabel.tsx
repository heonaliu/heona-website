import React from 'react'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

/** Eyebrow label above section headings — consistent typography everywhere. */
export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.16em] text-[#671372] dark:text-[#c44cf0] mb-3 ${className}`}>
      {children}
    </p>
  )
}

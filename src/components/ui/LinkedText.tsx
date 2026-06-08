import React from 'react'

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g

/**
 * Renders plain text but turns markdown-style `[label](https://url)` segments
 * into real links — lets short fields (timeline/interest descriptions, etc.)
 * support links without pulling in a full markdown renderer.
 */
export default function LinkedText({ text, className }: { text: string; className?: string }) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  LINK_PATTERN.lastIndex = 0
  while ((match = LINK_PATTERN.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const [, label, href] = match
    parts.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`text-[#671372] dark:text-[#c44cf0] underline underline-offset-2
                    hover:text-[#8B1D9F] dark:hover:text-[#d873f5] transition-colors ${className ?? ''}`}
      >
        {label}
      </a>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  return <>{parts}</>
}

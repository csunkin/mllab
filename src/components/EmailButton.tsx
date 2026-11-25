'use client'

import { useState } from 'react'

/**
 * Client half of SafeEmailLink. Receives the address only in encoded form
 * (base64 of the reversed string), so the plain address never appears in the
 * HTML or page data that bots scrape. It is decoded only when a person clicks.
 */
export default function EmailButton({
  enc,
  reveal,
  children,
  className,
  title,
  'aria-label': ariaLabel,
}: {
  enc: string
  reveal?: boolean
  children: React.ReactNode
  className?: string
  title?: string
  'aria-label'?: string
}) {
  const [shown, setShown] = useState<string | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const addr = atob(enc).split('').reverse().join('')
    if (reveal) setShown(addr)
    window.location.href = `mailto:${addr}`
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || 'inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer text-base'}
      title={title}
      aria-label={ariaLabel}
    >
      {shown ? <span className="select-all">{shown}</span> : children}
    </button>
  )
}

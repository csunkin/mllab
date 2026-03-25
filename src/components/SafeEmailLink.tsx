'use client'

export default function SafeEmailLink({ 
  email, 
  children, 
  className,
  title,
  'aria-label': ariaLabel
}: { 
  email: string, 
  children: React.ReactNode, 
  className?: string,
  title?: string,
  'aria-label'?: string
}) {
  const cleanEmail = email.replace('mailto:', '')
  const [user, domain] = cleanEmail.split('@')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = `mailto:${user}@${domain}`
  }

  return (
    <button
      onClick={handleClick}
      className={className || "inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer text-base"}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

import EmailButton from './EmailButton'

/**
 * Bot-resistant email link. Rendered on the server: the address is encoded
 * here and only the encoded form is sent to the browser. With `reveal`, the
 * button swaps its label for the address after a click.
 */
export default function SafeEmailLink({
  email,
  reveal,
  children,
  className,
  title,
  'aria-label': ariaLabel,
}: {
  email: string
  reveal?: boolean
  children: React.ReactNode
  className?: string
  title?: string
  'aria-label'?: string
}) {
  const clean = email.replace(/^mailto:/, '')
  const enc = Buffer.from(clean.split('').reverse().join('')).toString('base64')
  return (
    <EmailButton enc={enc} reveal={reveal} className={className} title={title} aria-label={ariaLabel}>
      {children}
    </EmailButton>
  )
}

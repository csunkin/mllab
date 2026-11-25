'use client'

import { useRef, useState } from 'react'

/**
 * "Request a copy" for papers without a public PDF.
 * The visitor fills in who they are, where they are from and why they want the paper;
 * we then open their email app with a pre-written request to the lab contact.
 * The address is never in the page as plain text (it is encoded and only decoded on submit),
 * and a hidden honeypot field plus a minimum fill time keep simple bots out.
 */
export default function RequestCopy({
  to,
  contactName,
  title,
  citation,
}: {
  to: string // base64 of the reversed email address
  contactName: string
  title: string
  citation: string
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const openedAt = useRef(0)

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  function onOpen() {
    openedAt.current = Date.now()
    setOpen(true)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    if (get('website')) return // honeypot: bots fill every field
    if (Date.now() - openedAt.current < 4000) {
      setError('Please take a moment to complete the form.')
      return
    }
    const name = get('name'), role = get('role'), affiliation = get('affiliation'), reason = get('reason')
    if (!name || !role || !affiliation || reason.length < 20) {
      setError('Please fill in every field, and give a reason of at least a sentence.')
      return
    }
    setError('')
    const email = atob(to).split('').reverse().join('')
    const subject = `Copy request: ${title}`
    const body = [
      `Dear ${contactName},`,
      '',
      `I am ${name}, ${role} at ${affiliation}.`,
      '',
      `I found your article on the Move-Learn Lab website and would like to request a copy for my personal research use:`,
      `${citation}`,
      '',
      `Why I am requesting it: ${reason}`,
      '',
      'Thank you for considering my request.',
      '',
      name,
    ].join('\n')
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="text-sm font-medium bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800"
      >
        Request a copy
      </button>
    )
  }

  return (
    <div className="w-full mt-2 border border-gray-200 rounded-xl p-5 bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-1">Request a copy of this article</h3>
      <p className="text-sm text-gray-600 mb-4">
        Tell {contactName} a little about yourself. This opens your email app with a pre-written request,
        and the author decides whether to share a private copy.
      </p>
      {sent ? (
        <p className="text-sm text-emerald-700">
          Your email app should now be open with the request. If nothing happened, please check that an email app is set up on this device.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-gray-700">I am (full name)</span>
              <input name="name" className={inputCls} autoComplete="name" required />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700">Position</span>
              <input name="role" className={inputCls} placeholder="e.g., graduate student, physical therapist" required />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-gray-700">Affiliated with</span>
            <input name="affiliation" className={inputCls} autoComplete="organization" placeholder="University, school or organization" required />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">I am requesting this because…</span>
            <textarea name="reason" rows={3} className={inputCls} placeholder="How you plan to use the article" required />
          </label>
          {/* Honeypot: hidden from people, filled by bots */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="text-sm font-medium bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
              Write the email
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-gray-600 hover:underline">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

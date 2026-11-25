import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SafeEmailLink from '@/components/SafeEmailLink'
import { getAllAuthors } from '@/lib/content'

export const metadata: Metadata = { title: 'Contact' }

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function ContactPage() {
  // Lab co-directors: the founding director (superuser) first, then alphabetical by last name
  const lastName = (t: string) => t.replace(/,.*$/, '').trim().split(/\s+/).pop() ?? t
  const directors = getAllAuthors()
    .filter(a => a.user_groups?.includes('Lab Directors'))
    .sort((a, b) => Number(!!b.superuser) - Number(!!a.superuser) || lastName(a.title).localeCompare(lastName(b.title)))

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
      <p className="text-gray-500 mb-12 max-w-xl">
        Interested in collaborating, joining the lab, or learning more about our research?
        We&apos;d love to hear from you.
      </p>

      <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">Lab Co-Directors</h2>
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {directors.map(d => {
          const email = d.social?.find(s => s.link?.startsWith('mailto:'))?.link?.replace(/^mailto:/, '')
          return (
            <div key={d.slug} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex gap-4">
              {d.avatar ? (
                <Image
                  src={`${BASE_PATH}${d.avatar}`}
                  alt={d.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xl font-bold flex-shrink-0">
                  {d.title.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <Link href={`/people/${d.slug}/`} className="font-medium text-gray-900 hover:text-blue-700">
                  {d.title}
                </Link>
                <p className="text-sm text-gray-500 mb-3">{d.role ? `${d.role} · Kinesiology` : 'Kinesiology'}</p>
                {email && (
                  <SafeEmailLink
                    email={email}
                    reveal
                    title="Click to email"
                    className="flex items-center gap-2 text-sm text-blue-700 hover:underline break-all"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>Send an email</span>
                  </SafeEmailLink>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Lab / Social */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Move-Learn Lab</h2>
          <ul className="space-y-3">
            <li>
              <a
                href="https://twitter.com/MoveLearnLab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @MoveLearnLab on X
              </a>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              Department of Kinesiology<br />
              California State University, Northridge<br />
              18111 Nordhoff St, Northridge, CA 91330
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

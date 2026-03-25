import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllAuthors, markdownToHtml } from '@/lib/content'

export const metadata: Metadata = { title: 'People' }

// Groups rendered in this order; In Memoriam is always last
const GROUP_ORDER = [
  'Lab Coordinators',
  'Principal Investigators',
  'Faculty',
  'Researchers',
  'Graduate Students',
  'Undergraduate Students',
  'Visitors',
  'Alumni',
  'Administration',
  'In Memoriam',
]

export default async function PeoplePage() {
  const authors = getAllAuthors()

  // Resolve markdown bio for each author
  const authorsWithBio = await Promise.all(
    authors.map(async a => ({
      ...a,
      bioHtml: a.bio ? await markdownToHtml(a.bio) : undefined,
    }))
  )

  // Group by user_groups
  const grouped = new Map<string, typeof authorsWithBio>()
  for (const author of authorsWithBio) {
    const groups = author.user_groups?.length ? author.user_groups : ['Team']
    for (const g of groups) {
      if (!grouped.has(g)) grouped.set(g, [])
      grouped.get(g)!.push(author)
    }
  }

  // Sort: known order first, In Memoriam last, unknown alphabetically in between
  const MEMORIAM = 'In Memoriam'
  const sortedGroups = [...grouped.keys()].sort((a, b) => {
    if (a === MEMORIAM) return 1
    if (b === MEMORIAM) return -1
    const ai = GROUP_ORDER.indexOf(a)
    const bi = GROUP_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">People</h1>
      <p className="text-gray-500 mb-14 max-w-2xl">
        Meet the Move-Learn Lab team at California State University, Northridge.
      </p>

      {sortedGroups.map(group => (
        <section key={group} className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 pb-3 border-b border-gray-200">
            {group}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {grouped.get(group)!.map(author => (
              <PersonCard key={author.slug} author={author} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

type AuthorWithBio = Awaited<ReturnType<typeof PeoplePage>> extends never
  ? never
  : ReturnType<typeof getAllAuthors>[number] & { bioHtml?: string }

function PersonCard({ author }: { author: ReturnType<typeof getAllAuthors>[number] & { bioHtml?: string } }) {
  const twitterLink = author.social?.find(s => s.icon === 'twitter' || s.icon === 'x-twitter')
  const emailLink = author.social?.find(s => s.icon === 'envelope')

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col items-center text-center">
      {/* Avatar */}
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.title}
          width={80}
          height={80}
          className="rounded-full object-cover w-20 h-20 mb-4"
          unoptimized
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-bold mb-4">
          {author.title.charAt(0)}
        </div>
      )}

      {/* Name & role */}
      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{author.title}</h3>
      {author.role && <p className="text-xs text-blue-700 mb-1">{author.role}</p>}
      {author.organizations?.[0] && (
        <p className="text-xs text-gray-400 mb-3">{author.organizations[0].name}</p>
      )}

      {/* Social icons */}
      <div className="flex gap-3 justify-center mb-4">
        {emailLink && (
          <a href={emailLink.link} className="text-gray-400 hover:text-blue-700 transition-colors" aria-label="Email">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
        )}
        {twitterLink && (
          <a href={twitterLink.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors" aria-label="Twitter / X">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        )}
      </div>

      {/* Bio link */}
      <Link
        href={`/people/${author.slug}/`}
        className="text-xs font-medium text-blue-700 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors mt-auto"
      >
        View Bio
      </Link>
    </div>
  )
}

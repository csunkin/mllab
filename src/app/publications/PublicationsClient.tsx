'use client'

import { useState, useMemo } from 'react'
import type { Publication } from '@/lib/content'
import { getPubTypeLabel, getPubStatus, PUB_STATUSES } from '@/lib/utils'
import Link from 'next/link'
import JournalCover from '@/components/JournalCover'

interface Props {
  publications: Publication[]
  resolvedAuthorMap: Record<string, string[]>
  allTypes: string[]
  allYears: number[]
  allTags: string[]
}

export default function PublicationsClient({
  publications,
  resolvedAuthorMap,
  allTypes,
  allYears,
  allTags,
}: Props) {
  const [activeType, setActiveType] = useState<string>('all')
  const [activeYear, setActiveYear] = useState<number | 'all'>('all')
  const [activeTag, setActiveTag] = useState<string>('all')
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return publications.filter(pub => {
      if (activeType !== 'all') {
        const types = pub.publication_types ?? []
        if (!types.includes(activeType)) return false
      }
      if (activeYear !== 'all' && pub.year !== activeYear) return false
      if (activeTag !== 'all' && !(pub.tags ?? []).includes(activeTag)) return false
      if (activeStatus !== 'all' && pub.status !== activeStatus) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const authors = (resolvedAuthorMap[pub.slug] ?? []).join(' ').toLowerCase()
        if (
          !pub.title.toLowerCase().includes(q) &&
          !authors.includes(q) &&
          !(pub.abstract ?? '').toLowerCase().includes(q) &&
          !(pub.publication ?? '').toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [publications, resolvedAuthorMap, activeType, activeYear, activeTag, activeStatus, search])

  const statusCounts = PUB_STATUSES.map(s => ({
    ...s,
    count: publications.filter(p => p.status === s.key).length,
  })).filter(s => s.count > 0)

  const btnBase =
    'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap'
  const btnActive = 'bg-blue-700 text-white border-blue-700'
  const btnInactive = 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-700'

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by title, author, or keyword…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Type filter */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveType('all')}
            className={`${btnBase} ${activeType === 'all' ? btnActive : btnInactive}`}
          >
            All
          </button>
          {allTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type === activeType ? 'all' : type)}
              className={`${btnBase} ${activeType === type ? btnActive : btnInactive}`}
            >
              {getPubTypeLabel([type])}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter */}
      {statusCounts.length > 1 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveStatus('all')}
              className={`${btnBase} ${activeStatus === 'all' ? btnActive : btnInactive}`}
            >
              All
            </button>
            {statusCounts.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveStatus(s.key === activeStatus ? 'all' : s.key)}
                className={`${btnBase} ${activeStatus === s.key ? btnActive : btnInactive}`}
              >
                {s.label} <span className="opacity-60">({s.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year filter */}
      {allYears.length > 1 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Year</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveYear('all')}
              className={`${btnBase} ${activeYear === 'all' ? btnActive : btnInactive}`}
            >
              All
            </button>
            {allYears.map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year === activeYear ? 'all' : year)}
                className={`${btnBase} ${activeYear === year ? btnActive : btnInactive}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Topic</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag('all')}
              className={`${btnBase} ${activeTag === 'all' ? btnActive : btnInactive}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? 'all' : tag)}
                className={`${btnBase} ${activeTag === tag ? btnActive : btnInactive}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        Showing {filtered.length} of {publications.length} publication{publications.length !== 1 ? 's' : ''}
      </p>

      {/* Publication list */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm py-12 text-center">No publications match your filters.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map(pub => {
            const resolvedAuthors = resolvedAuthorMap[pub.slug] ?? []
            return (
              <article
                key={pub.slug}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex gap-5"
              >
                <Link href={`/publications/${pub.slug}/`} className="flex-shrink-0" aria-label={pub.title}>
                  <JournalCover pub={pub} />
                </Link>
                <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {getPubTypeLabel(pub.publication_types)}
                  </span>
                  {pub.year && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {pub.year}
                    </span>
                  )}
                  {pub.status && pub.status !== 'published' && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPubStatus(pub.status).badge}`}>
                      {getPubStatus(pub.status).label}
                    </span>
                  )}
                  {pub.featured && (
                    <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2">
                  <Link href={`/publications/${pub.slug}/`} className="hover:text-blue-700">
                    {pub.title}
                  </Link>
                </h3>

                {resolvedAuthors.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">{resolvedAuthors.join(', ')}</p>
                )}

                {pub.publication && (
                  <p className="text-sm text-gray-500 italic mb-3">{pub.publication}</p>
                )}


                {pub.tags && pub.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pub.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-2">
                  <Link
                    href={`/publications/${pub.slug}/`}
                    className="text-xs font-medium text-blue-700 hover:underline"
                  >
                    {pub.abstract ? 'Abstract & details →' : 'Details →'}
                  </Link>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-700 hover:underline"
                    >
                      DOI →
                    </a>
                  )}
                  {pub.url_pdf && (
                    <a
                      href={pub.url_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-700 hover:underline"
                    >
                      PDF →
                    </a>
                  )}
                </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

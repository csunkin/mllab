import type { Metadata } from 'next'
import {
  getAllEvents,
  getAllAuthors,
  buildAuthorNameMap,
  resolveAuthors,
} from '@/lib/content'

export const metadata: Metadata = { title: 'Events & Presentations' }

export default function EventsPage() {
  const events = getAllEvents()
  const authors = getAllAuthors()
  const nameMap = buildAuthorNameMap(authors)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Events & Presentations</h1>
      <p className="text-gray-500 mb-14 max-w-2xl">
        Conference presentations and talks by the Move-Learn Lab.
      </p>

      <div className="flex flex-col gap-8">
        {events.map(event => {
          const resolvedAuthors = resolveAuthors(event.authors, nameMap)
          return (
            <article
              key={event.slug}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {event.year && (
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {event.year}
                  </span>
                )}
                {event.featured && (
                  <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-gray-900 text-xl leading-snug mb-2">
                {event.title}
              </h2>

              {event.event && (
                <p className="text-sm text-blue-700 font-medium mb-1">
                  {event.event_url ? (
                    <a href={event.event_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {event.event}
                    </a>
                  ) : (
                    event.event
                  )}
                </p>
              )}

              {event.location && (
                <p className="text-sm text-gray-500 mb-3">📍 {event.location}</p>
              )}

              {resolvedAuthors.length > 0 && (
                <p className="text-sm text-gray-600 mb-3">{resolvedAuthors.join(', ')}</p>
              )}

              {(event.abstract || event.summary) && (
                <details className="mb-3">
                  <summary className="text-sm text-blue-700 cursor-pointer font-medium hover:underline select-none">
                    Abstract
                  </summary>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {event.abstract || event.summary}
                  </p>
                </details>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {event.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-2">
                {event.url_pdf && (
                  <a
                    href={event.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-700 hover:underline"
                  >
                    PDF →
                  </a>
                )}
                {event.url_slides && (
                  <a
                    href={event.url_slides}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-700 hover:underline"
                  >
                    Slides →
                  </a>
                )}
                {event.url_video && (
                  <a
                    href={event.url_video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-700 hover:underline"
                  >
                    Video →
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  getAllPublications,
  getAllProjects,
  getAllAuthors,
  buildAuthorNameMap,
} from '@/lib/content'
import { getPubTypeLabel, getPubStatus } from '@/lib/utils'
import JournalCover from '@/components/JournalCover'
import RequestCopy from '@/components/RequestCopy'

export async function generateStaticParams() {
  return getAllPublications().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pub = getAllPublications().find(p => p.slug === params.slug)
  return { title: pub?.title ?? 'Publication', description: pub?.abstract?.slice(0, 160) }
}

export default async function PublicationDetailPage({ params }: { params: { slug: string } }) {
  const pub = getAllPublications().find(p => p.slug === params.slug)
  if (!pub) notFound()

  const allAuthors = getAllAuthors()
  const nameMap = buildAuthorNameMap(allAuthors)
  const authors = (pub.authors ?? []).map(a => ({ name: nameMap.get(a) ?? a, slug: nameMap.has(a) ? a : undefined }))
  const projects = getAllProjects().filter(p => pub.projects?.includes(p.slug))

  // Who receives copy requests: a lab director on the paper, else any lab author with an email, else the founding director
  const emailOf = (slug?: string) =>
    allAuthors.find(a => a.slug === slug)?.social?.find(x => x.link?.startsWith('mailto:'))?.link?.replace(/^mailto:/, '')
  const labAuthors = (pub.authors ?? []).map(a => allAuthors.find(x => x.slug === a)).filter(Boolean) as typeof allAuthors
  const contact =
    labAuthors.find(a => a.user_groups?.includes('Lab Directors') && emailOf(a.slug)) ??
    labAuthors.find(a => emailOf(a.slug)) ??
    allAuthors.find(a => a.superuser)
  const contactEmail = emailOf(contact?.slug)
  const canRequest = !pub.url_pdf && pub.status !== 'under-review' && !!contactEmail
  const contactName = contact ? (contact.title.includes('Ph.D') ? `Dr. ${contact.title.replace(/,.*$/, '').split(/\s+/).pop()}` : contact.title) : 'the authors'
  const citation = `${authors.map(a => a.name.replace(/,\s*Ph\.D\.?$/, '')).join(', ')} (${pub.year ?? 'n.d.'}). ${pub.title}. ${(pub.publication ?? '').replace(/\*/g, '')}.`

  const links = [
    pub.doi && { label: 'DOI', href: `https://doi.org/${pub.doi}` },
    pub.url_pdf && { label: 'PDF', href: pub.url_pdf },
    pub.url_dataset && { label: 'Dataset', href: pub.url_dataset },
    pub.url_code && { label: 'Code', href: pub.url_code },
    pub.url_slides && { label: 'Slides', href: pub.url_slides },
    pub.url_video && { label: 'Video', href: pub.url_video },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link href="/publications/" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline mb-8">
        ← All Publications
      </Link>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-shrink-0">
          <JournalCover pub={pub} size="lg" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {getPubTypeLabel(pub.publication_types)}
            </span>
            {pub.year && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{pub.year}</span>
            )}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPubStatus(pub.status).badge}`}>
              {getPubStatus(pub.status).label}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-4">{pub.title}</h1>

          {authors.length > 0 && (
            <p className="text-gray-700 mb-2">
              {authors.map((a, i) => (
                <span key={`${a.name}-${i}`}>
                  {a.slug ? (
                    <Link href={`/people/${a.slug}/`} className="text-blue-700 hover:underline">{a.name}</Link>
                  ) : (
                    a.name
                  )}
                  {i < authors.length - 1 && ', '}
                </span>
              ))}
            </p>
          )}

          {pub.publication && (
            <p className="text-gray-500 italic mb-5">{pub.publication.replace(/\*/g, '')}</p>
          )}

          {(links.length > 0 || canRequest) && (
            <div className="flex flex-wrap items-start gap-3 mb-5">
              {links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                >
                  {l.label} →
                </a>
              ))}
              {canRequest && (
                <RequestCopy
                  to={Buffer.from(contactEmail!.split('').reverse().join('')).toString('base64')}
                  contactName={contactName}
                  title={pub.title}
                  citation={citation}
                />
              )}
            </div>
          )}

          {pub.tags && pub.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pub.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Abstract</h2>
        {pub.abstract ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pub.abstract}</p>
        ) : (
          <p className="text-gray-500 italic">
            Abstract coming soon.{pub.doi ? ' In the meantime, see the article via its DOI link above.' : ''}
          </p>
        )}
      </section>

      {projects.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Related project{projects.length > 1 ? 's' : ''}</h2>
          <ul className="space-y-2">
            {projects.map(p => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}/`} className="text-blue-700 hover:underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

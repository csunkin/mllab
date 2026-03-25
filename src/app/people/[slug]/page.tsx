import { getAllAuthorSlugs, getAuthorBySlug, markdownToHtml, getAllProjects, getAllPublications } from '@/lib/content'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SafeEmailLink from '@/components/SafeEmailLink'

export async function generateStaticParams() {
  return getAllAuthorSlugs().map(slug => ({ slug }))
}

/** Map Font Awesome icon names to a simple emoji/text label for accessibility */
const SOCIAL_LABELS: Record<string, string> = {
  envelope:          'Email',
  twitter:           'Twitter / X',
  'x-twitter':       'Twitter / X',
  github:            'GitHub',
  linkedin:          'LinkedIn',
  globe:             'Website',
  orcid:             'ORCID',
  'google-scholar':  'Google Scholar',
  researchgate:      'ResearchGate',
  instagram:         'Instagram',
  youtube:           'YouTube',
}

/** Simple inline SVG icons keyed by Font Awesome name */
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'envelope':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      )
    case 'twitter':
    case 'x-twitter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      )
    case 'orcid':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.872-2.484 3.872-3.722 0-2.016-1.284-3.722-3.872-3.722h-2.297z"/>
        </svg>
      )
    case 'google-scholar':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
        </svg>
      )
  }
}

export default async function PersonPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug)
  if (!author) notFound()

  const bioHtml = author.body?.trim() ? await markdownToHtml(author.body) : null

  const org = author.organizations?.[0]

  // Resolve linked projects by slug
  const allProjects = getAllProjects()
  const linkedProjects = (author.projects ?? [])
    .map(s => allProjects.find(p => p.slug === s))
    .filter(Boolean) as typeof allProjects

  // Find related publications
  const relatedPublications = getAllPublications().filter(pub => 
    pub.authors?.includes(author.slug) || pub.authors?.includes(author.title)
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/people/"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline mb-8"
        >
          ← People
        </Link>

        {/* Header card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          {author.avatar ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${author.avatar}`}
              alt={author.title}
              width={144}
              height={144}
              className="rounded-full object-cover w-36 h-36 flex-shrink-0 border border-gray-200"
              unoptimized
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-blue-100 flex items-center justify-center text-5xl text-blue-500 font-bold flex-shrink-0">
              {author.title.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{author.title}</h1>
            {author.role && (
              <p className="text-blue-700 font-medium mt-1">{author.role}</p>
            )}
            {org && (
              <p className="text-gray-500 text-sm mt-1">
                {org.url ? (
                  <a href={org.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {org.name}
                  </a>
                ) : org.name}
              </p>
            )}

            {/* Social icons */}
            {author.social && author.social.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                {author.social.map((s, i) => {
                  const label = SOCIAL_LABELS[s.icon] ?? s.icon
                  
                  if (s.icon === 'envelope') {
                    return (
                      <SafeEmailLink
                        key={i}
                        email={s.link}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label={label}
                        title={label}
                      >
                        <SocialIcon icon={s.icon} />
                      </SafeEmailLink>
                    )
                  }

                  const href = s.link
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={label}
                      title={label}
                    >
                      <SocialIcon icon={s.icon} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bio / body content */}
        {bioHtml && (
          <section className="mb-10">
            <div
              className="prose max-w-none text-gray-700 prose-a:text-blue-700 prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </section>
        )}

        {/* Related Publications */}
        {relatedPublications.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Publications</h2>
            <div className="flex flex-col gap-5">
              {relatedPublications.map(pub => (
                <article key={pub.slug} className="group">
                  <div className="flex items-baseline gap-2 mb-1">
                    {pub.year && (
                      <span className="text-xs font-semibold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {pub.year}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                      {pub.title}
                    </h3>
                  </div>
                  
                  {pub.publication && (
                    <p className="text-sm text-gray-600 mb-2 italic">
                      {pub.publication}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-1">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi.replace(/^https?:\/\/doi\.org\//, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-500 hover:text-blue-700 hover:underline inline-flex flex-wrap gap-x-1"
                      >
                        DOI ↗
                      </a>
                    )}
                    {pub.url_pdf && (
                      <a
                        href={pub.url_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-500 hover:text-blue-700 hover:underline inline-flex flex-wrap gap-x-1"
                      >
                        PDF ↗
                      </a>
                    )}
                    {pub.url_code && (
                      <a
                        href={pub.url_code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-500 hover:text-blue-700 hover:underline inline-flex flex-wrap gap-x-1"
                      >
                        Code ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Current Research Projects */}
        {linkedProjects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Research Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {linkedProjects.map(project => (
                <div
                  key={project.slug}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">
                    {project.title}
                  </h3>
                  {(project.summary || project.abstract) && (
                    <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-3">
                      {project.summary || project.abstract}
                    </p>
                  )}
                  <Link
                    href={`/projects/${project.slug}/`}
                    className="text-xs font-medium text-blue-700 hover:underline mt-auto"
                  >
                    More Info →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {author.interests && author.interests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {author.interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {author.education?.courses && author.education.courses.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
            <ul className="space-y-1">
              {author.education.courses.map((c, i) => (
                <li key={i} className="text-gray-700 text-sm">
                  <span className="font-medium">{c.course}</span>
                  {c.institution && <span className="text-gray-500">, {c.institution}</span>}
                  {c.year && <span className="text-gray-400">, {c.year}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

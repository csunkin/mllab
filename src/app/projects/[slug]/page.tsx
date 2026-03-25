import { getAllProjects, getAllPublications, markdownToHtml, getAllAuthors, buildAuthorNameMap, resolveAuthors } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllProjects().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getAllProjects().find(p => p.slug === params.slug)
  return { title: project?.title ?? 'Project' }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getAllProjects().find(p => p.slug === params.slug)
  if (!project) notFound()

  const bodyHtml = project.body?.trim() ? await markdownToHtml(project.body) : null

  // Find publications that list this project slug
  const allPublications = getAllPublications()
  const authors = getAllAuthors()
  const nameMap = buildAuthorNameMap(authors)
  const relatedPubs = allPublications.filter(pub =>
    pub.projects?.includes(params.slug)
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/projects/"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline mb-8"
        >
          ← All Projects
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
          {project.title}
        </h1>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Summary */}
        {project.summary && (
          <p className="text-gray-600 text-base leading-relaxed mb-8 italic border-l-4 border-blue-200 pl-4">
            {project.summary}
          </p>
        )}

        {/* Body content */}
        {bodyHtml && (
          <div
            className="prose max-w-none text-gray-700 prose-a:text-blue-700 prose-headings:text-gray-900"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        )}

        {/* Related Publications */}
        {relatedPubs.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Publications</h2>
            <ul className="space-y-4">
              {relatedPubs.map(pub => {
                const pubAuthors = resolveAuthors(pub.authors, nameMap)
                return (
                  <li key={pub.slug} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <p className="font-medium text-gray-900 text-sm leading-snug mb-1">
                      {pub.title}
                    </p>
                    {pubAuthors.length > 0 && (
                      <p className="text-xs text-gray-500 mb-1">{pubAuthors.join(', ')}</p>
                    )}
                    {pub.publication && (
                      <p className="text-xs text-blue-700 italic mb-2">{pub.publication}{pub.year ? `, ${pub.year}` : ''}</p>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-blue-700 hover:underline"
                      >
                        DOI: {pub.doi}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 mt-10 pt-6 border-t border-gray-100">
          {project.external_link && (
            <a
              href={project.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              Visit Project →
            </a>
          )}
          {project.url_pdf && (
            <a href={project.url_pdf} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-700 hover:underline">
              PDF →
            </a>
          )}
          {project.url_code && (
            <a href={project.url_code} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-700 hover:underline">
              Code →
            </a>
          )}
        </div>
      </div>
    </main>
  )
}

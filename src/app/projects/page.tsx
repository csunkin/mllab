import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAllProjects,
  getAllAuthors,
  buildAuthorNameMap,
  resolveAuthors,
} from '@/lib/content'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  const projects = getAllProjects()
  const authors = getAllAuthors()
  const nameMap = buildAuthorNameMap(authors)

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Projects</h1>
      <p className="text-gray-500 mb-14 max-w-2xl">
        Ongoing and completed research initiatives from the Move-Learn Lab.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {projects.map(project => {
          const resolvedAuthors = resolveAuthors(project.authors, nameMap)
          return (
            <article
              key={project.slug}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <h2 className="font-semibold text-gray-900 text-xl leading-snug mb-3">
                {project.title}
              </h2>

              {resolvedAuthors.length > 0 && (
                <p className="text-sm text-gray-500 mb-3">{resolvedAuthors.join(', ')}</p>
              )}

              {(project.summary || project.abstract) && (
                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
                  {project.summary || project.abstract}
                </p>
              )}

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-auto pt-3 border-t border-gray-100">
                <Link
                  href={`/projects/${project.slug}/`}
                  className="text-xs font-medium text-blue-700 hover:underline"
                >
                  More Info →
                </Link>
                {project.external_link && (
                  <a
                    href={project.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gray-500 hover:underline"
                  >
                    Visit Project ↗
                  </a>
                )}
                {project.url_pdf && (
                  <a
                    href={project.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gray-500 hover:underline"
                  >
                    PDF ↗
                  </a>
                )}
                {project.url_code && (
                  <a
                    href={project.url_code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gray-500 hover:underline"
                  >
                    Code ↗
                  </a>
                )}
                {project.url_slides && (
                  <a
                    href={project.url_slides}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gray-500 hover:underline"
                  >
                    Slides ↗
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

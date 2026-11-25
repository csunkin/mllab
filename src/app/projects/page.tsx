import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAllProjects,
  getAllAuthors,
  buildAuthorNameMap,
  resolveAuthors,
} from '@/lib/content'

export const metadata: Metadata = { title: 'Projects' }

type ProjectItem = ReturnType<typeof getAllProjects>[number]

function ProjectCard({ project, nameMap }: { project: ProjectItem; nameMap: Map<string, string> }) {
  const resolvedAuthors = resolveAuthors(project.authors, nameMap)
  return (
    <article
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
    >
      <h3 className="font-semibold text-gray-900 text-xl leading-snug mb-3">
        {project.title}
      </h3>

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
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  const authors = getAllAuthors()
  const nameMap = buildAuthorNameMap(authors)

  // Lab directors: the founding director (superuser) first, then alphabetical by last name
  const lastName = (t: string) => t.replace(/,.*$/, '').trim().split(/\s+/).pop() ?? t
  const leads = authors
    .filter(a => a.user_groups?.includes('Lab Directors'))
    .sort((a, b) => Number(!!b.superuser) - Number(!!a.superuser) || lastName(a.title).localeCompare(lastName(b.title)))

  // Each project goes under the first of its authors who is a lab director
  const groups = leads
    .map(lead => ({
      lead,
      items: projects.filter(p => p.authors?.find(a => leads.some(l => l.slug === a)) === lead.slug),
    }))
    .filter(g => g.items.length > 0)
  const other = projects.filter(p => !p.authors?.some(a => leads.some(l => l.slug === a)))

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Projects</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">
        Ongoing and completed research initiatives from the Move-Learn Lab.
      </p>

      {/* Jump to a lab director */}
      <nav aria-label="Projects by co-director" className="mb-14">
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3">Co-director</p>
        <div className="flex flex-wrap gap-2">
          {groups.map(({ lead, items }) => (
            <a
              key={lead.slug}
              href={`#lead-${lead.slug}`}
              className="px-4 py-1.5 text-sm rounded-full border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-700 transition-colors"
            >
              {lead.title} <span className="text-gray-400">({items.length})</span>
            </a>
          ))}
          {other.length > 0 && (
            <a
              href="#lead-other"
              className="px-4 py-1.5 text-sm rounded-full border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-700 transition-colors"
            >
              Other <span className="text-gray-400">({other.length})</span>
            </a>
          )}
        </div>
      </nav>

      {groups.map(({ lead, items }) => (
        <section key={lead.slug} id={`lead-${lead.slug}`} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            <Link href={`/people/${lead.slug}/`} className="hover:text-blue-700">
              {lead.title}
            </Link>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {items.map(project => (
              <ProjectCard key={project.slug} project={project} nameMap={nameMap} />
            ))}
          </div>
        </section>
      ))}

      {other.length > 0 && (
        <section id="lead-other" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">Other Projects</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {other.map(project => (
              <ProjectCard key={project.slug} project={project} nameMap={nameMap} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

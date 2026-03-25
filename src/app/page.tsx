import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  getAllPublications,
  getAllProjects,
  getAllAuthors,
  getPubTypeLabel,
} from '@/lib/content'

export const metadata: Metadata = {
  title: 'Move-Learn Lab — CSUN Kinesiology',
}

export default function HomePage() {
  const publications = getAllPublications().slice(0, 3)
  const projects = getAllProjects()
  const authors = getAllAuthors().filter(a => !a.user_groups?.some(g => g.toLowerCase().includes('student')))

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/mllab-logo.png`}
              alt="Move-Learn Lab"
              width={700}
              height={233}
              className="w-auto h-auto max-w-sm md:max-w-xl"
              unoptimized
              priority
            />
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
              California State University, Northridge · Kinesiology
            </span>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            We study motor development, motor learning, and motor control across the lifespan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/people/"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
            >
              Meet the Team
            </Link>
            <Link
              href="/publications/"
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              Our Research
            </Link>
            <a
              href="https://twitter.com/MoveLearnLab"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              Follow on X
            </a>
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Recent Publications</h2>
            <Link href="/publications/" className="text-blue-700 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publications.map(pub => (
              <article
                key={pub.slug}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
              >
                <span className="inline-block mb-3 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full self-start">
                  {getPubTypeLabel(pub.publication_types)} · {pub.year}
                </span>
                <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2">
                  {pub.title}
                </h3>
                {pub.publication && (
                  <p className="text-sm text-gray-500 italic mb-3">{pub.publication}</p>
                )}
                {pub.abstract && (
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">{pub.abstract}</p>
                )}
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-blue-700 text-xs font-medium hover:underline"
                  >
                    DOI →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Research Projects</h2>
            <Link href="/projects/" className="text-blue-700 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map(project => (
              <article
                key={project.slug}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
              >
                <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2">
                  {project.title}
                </h3>
                {project.summary && (
                  <p className="text-sm text-gray-600 line-clamp-4 flex-1">{project.summary}</p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <Link href="/people/" className="text-blue-700 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 justify-center md:justify-start">
            {authors.map(author => (
              <div key={author.slug} className="flex flex-col items-center text-center w-36">
                {author.avatar ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${author.avatar}`}
                    alt={author.title}
                    width={144}
                    height={144}
                    className="rounded-full mb-3 object-cover w-36 h-36"
                    unoptimized
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-slate-200 mb-3 flex items-center justify-center text-slate-500 text-4xl font-bold">
                    {author.title.charAt(0)}
                  </div>
                )}
                <p className="font-medium text-gray-900 text-sm leading-tight">{author.title}</p>
                {author.role && <p className="text-xs text-gray-500 mt-0.5">{author.role}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

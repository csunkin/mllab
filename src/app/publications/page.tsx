import type { Metadata } from 'next'
import {
  getAllPublications,
  getAllAuthors,
  buildAuthorNameMap,
  resolveAuthors,
} from '@/lib/content'
import PublicationsClient from './PublicationsClient'

export const metadata: Metadata = { title: 'Publications' }

export default function PublicationsPage() {
  const publications = getAllPublications()
  const authors = getAllAuthors()
  const nameMap = buildAuthorNameMap(authors)

  // Pre-resolve authors for each publication (serialisable for client component)
  const resolvedAuthorMap: Record<string, string[]> = {}
  for (const pub of publications) {
    resolvedAuthorMap[pub.slug] = resolveAuthors(pub.authors, nameMap)
  }

  // Collect unique filter values
  const typeSet = new Set<string>()
  const yearSet = new Set<number>()
  const tagSet = new Set<string>()
  for (const pub of publications) {
    pub.publication_types?.forEach(t => typeSet.add(t))
    if (pub.year) yearSet.add(pub.year)
    pub.tags?.forEach(t => tagSet.add(t))
  }
  const allTypes = [...typeSet].sort()
  const allYears = [...yearSet].sort((a, b) => b - a)
  const allTags = [...tagSet].sort()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications</h1>
      <p className="text-gray-500 mb-10">
        Peer-reviewed journals and conference proceedings from the Move-Learn Lab.
      </p>

      <PublicationsClient
        publications={publications}
        resolvedAuthorMap={resolvedAuthorMap}
        allTypes={allTypes}
        allYears={allYears}
        allTags={allTags}
      />
    </div>
  )
}

/** Pure utility — no Node.js imports, safe to use in client components */

export function getPubTypeLabel(types?: string[]): string {
  if (!types || types.length === 0) return 'Publication'
  const map: Record<string, string> = {
    '0': 'Uncategorised',
    '1': 'Conference paper',
    '2': 'Journal article',
    '3': 'Preprint',
    '4': 'Report',
    '5': 'Book',
    '6': 'Book section',
    '7': 'Thesis',
    '8': 'Patent',
  }
  return map[types[0]] ?? 'Publication'
}

/**
 * Publication status, set with `status:` in a publication's front matter.
 * Leave it out for published articles.
 */
export const PUB_STATUSES = [
  { key: 'published', label: 'Published', badge: 'bg-emerald-50 text-emerald-700' },
  { key: 'online-first', label: 'Online first', badge: 'bg-sky-50 text-sky-700' },
  { key: 'in-press', label: 'In press', badge: 'bg-violet-50 text-violet-700' },
  { key: 'under-review', label: 'Under review', badge: 'bg-amber-50 text-amber-700' },
] as const

export function getPubStatus(status?: string) {
  return PUB_STATUSES.find(s => s.key === status) ?? PUB_STATUSES[0]
}

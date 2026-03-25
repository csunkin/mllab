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

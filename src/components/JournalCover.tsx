import type { Publication } from '@/lib/content'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function journalName(publication?: string): string {
  return (publication ?? '')
    .replace(/\*/g, '')
    .replace(/\s*\(.*$/, '')
    .replace(/,\s*\d.*$/, '')
    .trim()
}

export function journalInitials(publication?: string): string {
  const skip = new Set(['of', 'and', 'the', 'for', 'in', 'on', '&', 'a'])
  const letters = journalName(publication)
    .split(/\s+/)
    .filter(w => w && !skip.has(w.toLowerCase()))
    .map(w => w[0].toUpperCase())
    .join('')
  return letters.slice(0, 5) || '—'
}

const SIZES = {
  sm: {
    box: 'w-[6.5rem] h-[8.45rem]',
    band: 'px-1.5 py-1',
    label: 'text-[9px]',
    initials: 'text-xl',
    rule: 'w-8',
    name: 'text-[9px] line-clamp-4',
    stripe: 'h-2',
  },
  lg: {
    box: 'w-44 h-[14.3rem]',
    band: 'px-3 py-2',
    label: 'text-[11px]',
    initials: 'text-3xl',
    rule: 'w-12',
    name: 'text-xs line-clamp-5',
    stripe: 'h-3',
  },
}

/** Journal cover: the real cover image when we have one, otherwise a generic cover with the journal's initials. */
export default function JournalCover({ pub, size = 'sm' }: { pub: Publication; size?: 'sm' | 'lg' }) {
  const journal = journalName(pub.publication)
  const s = SIZES[size]
  if (pub.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${BASE_PATH}${pub.cover}`}
        alt={journal ? `${journal} cover` : 'Journal cover'}
        className={`${s.box} object-cover rounded-md border border-gray-200 shadow-sm flex-shrink-0`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      title={journal}
      className={`${s.box} rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-shrink-0 bg-white`}
    >
      <div className={`bg-blue-900 ${s.band}`}>
        <span className={`block ${s.label} font-semibold uppercase tracking-[0.15em] text-blue-100`}>Journal</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-1.5 text-center">
        <span className={`${s.initials} font-bold tracking-wide text-blue-900 leading-none`}>
          {journalInitials(pub.publication)}
        </span>
        <span className={`mt-1 block ${s.rule} h-px bg-blue-900/30`} />
        <span className={`mt-1 leading-tight text-gray-600 ${s.name}`}>{journal}</span>
      </div>
      <div className={`${s.stripe} bg-gradient-to-r from-blue-900 via-blue-600 to-red-700`} />
    </div>
  )
}

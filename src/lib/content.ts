import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Organization {
  name: string
  url?: string
}

export interface Course {
  course: string
  institution: string
  year?: number
}

export interface Education {
  courses?: Course[]
}

export interface Social {
  icon: string
  icon_pack: string
  link: string
}

export interface Author {
  slug: string
  title: string
  role?: string
  avatar?: string
  organizations?: Organization[]
  interests?: string[]
  education?: Education
  social?: Social[]
  user_groups?: string[]
  bio?: string
  superuser?: boolean
  projects?: string[]
}

export interface Publication {
  slug: string
  title: string
  subtitle?: string
  summary?: string
  abstract?: string
  authors?: string[]
  tags?: string[]
  date?: string
  year?: number
  publication_types?: string[]
  publication?: string
  doi?: string
  featured?: boolean
  url_pdf?: string
  url_code?: string
  url_dataset?: string
  url_poster?: string
  url_project?: string
  url_slides?: string
  url_source?: string
  url_video?: string
  projects?: string[]
}

export interface Project {
  slug: string
  title: string
  summary?: string
  abstract?: string
  authors?: string[]
  tags?: string[]
  date?: string
  external_link?: string
  url_code?: string
  url_pdf?: string
  url_slides?: string
  url_video?: string
  image?: { filename?: string; caption?: string }
  body?: string
}

export interface Event {
  slug: string
  title: string
  event?: string
  event_url?: string
  location?: string
  summary?: string
  abstract?: string
  award?: string
  date?: string
  year?: number
  authors?: string[]
  tags?: string[]
  url_slides?: string
  url_video?: string
  url_pdf?: string
  featured?: boolean
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html, { sanitize: false }).process(markdown)
  return result.toString()
}

// Re-export for server-side callers that already import from content
export { getPubTypeLabel } from '@/lib/utils'

function readMarkdownDir(dir: string): Array<{ slug: string; data: Record<string, unknown>; content: string }> {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results: Array<{ slug: string; data: Record<string, unknown>; content: string }> = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    // Try index.md then _index.md
    const candidates = ['index.md', '_index.md']
    let filePath = ''
    for (const c of candidates) {
      const p = path.join(dir, slug, c)
      if (fs.existsSync(p)) { filePath = p; break }
    }
    if (!filePath) continue

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    results.push({ slug, data: data as Record<string, unknown>, content })
  }

  return results
}

// ---------------------------------------------------------------------------
// Authors
// ---------------------------------------------------------------------------

export function getAllAuthors(): Author[] {
  const dir = path.join(CONTENT_DIR, 'authors')
  const entries = readMarkdownDir(dir)

  return entries.map(({ slug, data }) => {
    const avatarBase = path.join(CONTENT_DIR, 'authors', slug)
    let avatar: string | undefined
    for (const ext of ['jpg', 'jpeg', 'png', 'gif', 'webp', 'JPG', 'PNG']) {
      if (fs.existsSync(path.join(avatarBase, `avatar.${ext}`))) {
        avatar = `/authors/${slug}/avatar.${ext}`
        break
      }
    }
    return {
      slug,
      title: (data.title as string) ?? slug,
      role: data.role as string | undefined,
      avatar,
      organizations: data.organizations as Organization[] | undefined,
      interests: data.interests as string[] | undefined,
      education: data.education as Education | undefined,
      social: data.social as Social[] | undefined,
      user_groups: data.user_groups as string[] | undefined,
      bio: data.bio as string | undefined,
      superuser: data.superuser as boolean | undefined,
      projects: data.projects as string[] | undefined,
    }
  })
}

/** Return all author directory slugs (for generateStaticParams) */
export function getAllAuthorSlugs(): string[] {
  const dir = path.join(CONTENT_DIR, 'authors')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
}

/** Get a single author by slug, plus their markdown body content */
export function getAuthorBySlug(slug: string): (Author & { body: string }) | null {
  const dir = path.join(CONTENT_DIR, 'authors')
  const candidates = ['_index.md', 'index.md']
  let filePath = ''
  for (const c of candidates) {
    const p = path.join(dir, slug, c)
    if (fs.existsSync(p)) { filePath = p; break }
  }
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const avatarBase = path.join(CONTENT_DIR, 'authors', slug)
  let avatar: string | undefined
  for (const ext of ['jpg', 'jpeg', 'png', 'gif', 'webp', 'JPG', 'PNG']) {
    if (fs.existsSync(path.join(avatarBase, `avatar.${ext}`))) {
      avatar = `/authors/${slug}/avatar.${ext}`
      break
    }
  }

  return {
    slug,
    title: (data.title as string) ?? slug,
    role: data.role as string | undefined,
    avatar,
    organizations: data.organizations as Organization[] | undefined,
    interests: data.interests as string[] | undefined,
    education: data.education as Education | undefined,
    social: data.social as Social[] | undefined,
    user_groups: data.user_groups as string[] | undefined,
    bio: data.bio as string | undefined,
    superuser: data.superuser as boolean | undefined,
    projects: data.projects as string[] | undefined,
    body: content,
  }
}

/** Build a map from slug → display name */
export function buildAuthorNameMap(authors: Author[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const a of authors) {
    map.set(a.slug, a.title)
  }
  return map
}

/** Resolve an array of author slugs/names to display names */
export function resolveAuthors(raw: string[] | undefined, nameMap: Map<string, string>): string[] {
  if (!raw) return []
  return raw.map(a => nameMap.get(a) ?? a)
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

export function getAllPublications(): Publication[] {
  const dir = path.join(CONTENT_DIR, 'publication')
  const entries = readMarkdownDir(dir)

  return entries
    .map(({ slug, data }) => {
      const dateStr = data.date as string | undefined
      const year = dateStr ? new Date(dateStr).getUTCFullYear() : undefined
      return {
        slug,
        title: (data.title as string) ?? slug,
        subtitle: data.subtitle as string | undefined,
        summary: data.summary as string | undefined,
        abstract: data.abstract as string | undefined,
        authors: data.authors as string[] | undefined,
        tags: data.tags as string[] | undefined,
        date: dateStr,
        year,
        publication_types: data.publication_types as string[] | undefined,
        publication: data.publication as string | undefined,
        doi: data.doi as string | undefined,
        featured: data.featured as boolean | undefined,
        url_pdf: data.url_pdf as string | undefined,
        url_code: data.url_code as string | undefined,
        url_dataset: data.url_dataset as string | undefined,
        url_slides: data.url_slides as string | undefined,
        url_video: data.url_video as string | undefined,
        projects: data.projects as string[] | undefined,
      } satisfies Publication
    })
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function getAllProjects(): Project[] {
  const dir = path.join(CONTENT_DIR, 'project')
  const entries = readMarkdownDir(dir)

  return entries.map(({ slug, data, content }) => ({
    slug,
    title: (data.title as string) ?? slug,
    summary: data.summary as string | undefined,
    abstract: data.abstract as string | undefined,
    authors: data.authors as string[] | undefined,
    tags: data.tags as string[] | undefined,
    date: data.date as string | undefined,
    external_link: data.external_link as string | undefined,
    url_code: data.url_code as string | undefined,
    url_pdf: data.url_pdf as string | undefined,
    url_slides: data.url_slides as string | undefined,
    url_video: data.url_video as string | undefined,
    image: data.image as { filename?: string; caption?: string } | undefined,
    body: content,
  }))
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export function getAllEvents(): Event[] {
  const dir = path.join(CONTENT_DIR, 'event')
  const entries = readMarkdownDir(dir)

  return entries
    .map(({ slug, data }) => {
      const dateStr = data.date as string | undefined
      const year = dateStr ? new Date(dateStr).getUTCFullYear() : undefined
      return {
        slug,
        title: (data.title as string) ?? slug,
        event: data.event as string | undefined,
        event_url: data.event_url as string | undefined,
        location: data.location as string | undefined,
        summary: data.summary as string | undefined,
        abstract: data.abstract as string | undefined,
        award: data.award as string | undefined,
        date: dateStr,
        year,
        authors: data.authors as string[] | undefined,
        tags: data.tags as string[] | undefined,
        url_slides: data.url_slides as string | undefined,
        url_video: data.url_video as string | undefined,
        url_pdf: data.url_pdf as string | undefined,
        featured: data.featured as boolean | undefined,
      } satisfies Event
    })
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-slate-800 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div>
          <p className="text-white font-semibold text-base">Move-Learn Lab</p>
          <p className="mt-1">Kinesiology Department · California State University, Northridge</p>
        </div>
        <ul className="flex flex-wrap gap-4 items-center">
          <li>
            <Link href="/people/" className="hover:text-white transition-colors">People</Link>
          </li>
          <li>
            <Link href="/publications/" className="hover:text-white transition-colors">Publications</Link>
          </li>
          <li>
            <Link href="/projects/" className="hover:text-white transition-colors">Projects</Link>
          </li>
          <li>
            <Link href="/contact/" className="hover:text-white transition-colors">Contact</Link>
          </li>
          <li>
            <a
              href="https://twitter.com/drfurtado"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              X / Twitter
            </a>
          </li>
        </ul>
      </div>
      <div className="border-t border-slate-700 text-center py-4 text-xs text-slate-500">
        © {year} Move-Learn Lab · California State University, Northridge
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
      <p className="text-gray-500 mb-12 max-w-xl">
        Interested in collaborating, joining the lab, or learning more about our research?
        We&apos;d love to hear from you.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Lab Director */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Lab Director</h2>
          <p className="font-medium text-gray-900 mb-1">Dr. Ovande Furtado Jr</p>
          <p className="text-sm text-gray-500 mb-4">Associate Professor · Kinesiology</p>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:ovandef@csun.edu"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                ovandef@csun.edu
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/drfurtado"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @drfurtado
              </a>
            </li>
            <li>
              <a
                href="https://www.metalab.csun.edu/faculty/ovande.furtado"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Faculty Profile
              </a>
            </li>
          </ul>
        </div>

        {/* Lab / Social */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Move-Learn Lab</h2>
          <ul className="space-y-3">
            <li>
              <a
                href="https://twitter.com/MoveLearnLab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @MoveLearnLab on X
              </a>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              Department of Kinesiology<br />
              California State University, Northridge<br />
              18111 Nordhoff St, Northridge, CA 91330
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import SafeEmailLink from '@/components/SafeEmailLink'

export const metadata: Metadata = {
  title: 'Donate',
}

export default function DonatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Support the Move-Learn Lab</h1>
      
      <div className="mt-8 text-gray-700">
        <p className="text-lg mb-6 leading-relaxed">
          Thank you for considering a donation to the Move-Learn Lab at California State University, Northridge! Your generous support is vital in advancing our research in motor development, motor learning, motor control, physical activity, and physical education across the lifespan.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">How to Give</h2>
        <p className="mb-6 leading-relaxed">
          You can make a direct contribution through the official university foundation. Every gift helps support our students, expands our community programs, and furthers our mission.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 my-8 flex flex-col items-center text-center">
          <p className="mb-6 text-gray-800 text-lg">
            Please visit the main CSUN giving portal to process your donation securely online.
          </p>
          <a
            href="https://givenow.csun.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            Visit CSUN Donation Page
          </a>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Need More Information?</h2>
        <p className="mb-6 leading-relaxed">
          If you have specific questions about directing your gift toward the Move-Learn Lab, establishing a targeted scholarship, or if you need more details about our ongoing research initiatives, please contact me directly:
        </p>

        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="font-semibold text-gray-900 text-lg">Ovande Furtado Jr., Ph.D.</p>
          <p className="text-gray-600 mb-3">Director, Move-Learn Lab</p>
          <SafeEmailLink email="ovandef@csun.edu">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>ovandef<span className="hidden">null</span>&#64;csun.edu</span>
          </SafeEmailLink>
        </div>
      </div>
    </div>
  )
}

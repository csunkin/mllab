import type { Metadata } from 'next'
import Link from 'next/link'

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
          If you have specific questions about directing your gift toward the Move-Learn Lab, establishing a targeted scholarship, or if you need more details about our ongoing research initiatives, please reach out to any of our lab co-directors.
        </p>

        <Link
          href="/contact/"
          className="inline-flex items-center gap-2 bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-800"
        >
          Contact the lab co-directors →
        </Link>
      </div>
    </div>
  )
}

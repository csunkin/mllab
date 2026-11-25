'use client'

/**
 * Floating "Suggest a change" button. Opens the MLLAB Website Feedback Google
 * Form with the current page address already filled in. Responses land in the
 * "MLLAB Website Feedback: Responses" sheet in the lab's Drive folder.
 *
 * FEEDBACK_FORM_PREFILL is the form's prefilled link with the page field set to
 * the placeholder PAGE_URL (see the Setup tab of the responses sheet).
 * Leave it empty to hide the button.
 */
const FEEDBACK_FORM_PREFILL = 'https://docs.google.com/forms/d/e/1FAIpQLSe7AcGZkmtZCKcYxy8_1C1FqjN8cNQAM1Kmu3CFJxg4QCjMuw/viewform?usp=pp_url&entry.926292351=PAGE_URL'

export default function FeedbackButton() {
  if (!FEEDBACK_FORM_PREFILL) return null

  const open = () => {
    const page = window.location.href
    const url = FEEDBACK_FORM_PREFILL.replace('PAGE_URL', encodeURIComponent(page))
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={open}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 print:hidden"
      aria-label="Suggest a change to this page"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-9 6 3-3h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14z" />
      </svg>
      Suggest a change
    </button>
  )
}

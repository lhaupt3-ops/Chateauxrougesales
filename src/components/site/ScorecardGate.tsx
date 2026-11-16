'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SCORECARD_PATH, SCORECARD_QUESTIONS, interpretYesCount } from '@/content/scorecard'
import { consentGranted } from './EmailCapture'
import { track } from '@/components/analytics/track'

export function ScorecardGate({ unlocked, publicId }: { unlocked: boolean; publicId: string }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get('consent') !== 'yes') {
      setError('Tick the box so we can email the scorecard.')
      return
    }
    setPending(true)
    const response = await fetch('/api/apply/magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(form.get('email') || ''),
        resource: 'closer-readiness-scorecard',
        page: SCORECARD_PATH,
        analyticsConsent: consentGranted(),
        marketingConsent: true,
      }),
    })
    const data = (await response.json()) as { error?: string; id?: string }
    setPending(false)
    if (!response.ok || !data.id) {
      setError(data.error || 'Use a real email.')
      return
    }
    track('lead_magnet_optin', { resource: 'closer-readiness-scorecard', page: SCORECARD_PATH })
    router.replace(`${SCORECARD_PATH}?id=${data.id}`)
    router.refresh()
  }

  if (!unlocked) {
    return (
      <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-2xl border border-stone bg-white p-5">
        <p className="text-base leading-7 text-muted">The guide is free to read. This page is the one-page scorecard. Leave an email and we will send the link. You can print it or download the PDF.</p>
        <label className="block text-base" htmlFor="scorecard-email">
          Email
          <input id="scorecard-email" name="email" type="email" required autoComplete="email" inputMode="email" enterKeyHint="send" placeholder="Email" className="mt-1 h-12 w-full rounded-full border border-stone px-4 text-base" />
        </label>
        <label className="flex min-h-11 items-start gap-3 text-base leading-6 text-muted">
          <input name="consent" type="checkbox" value="yes" className="mt-1 size-5" />
          <span>Email me this scorecard. I can unsubscribe in one click. This is separate from analytics cookies.</span>
        </label>
        <button className="inline-flex h-12 min-w-11 items-center rounded-full bg-rouge px-5 text-base text-white" disabled={pending}>
          {pending ? 'Sending…' : 'Email me the scorecard'}
        </button>
        {error && <p className="text-base text-wine" role="alert">{error}</p>}
      </form>
    )
  }

  const yesCount = Object.values(answers).filter(Boolean).length
  const answered = Object.keys(answers).length
  const reading = answered === SCORECARD_QUESTIONS.length ? interpretYesCount(yesCount) : null

  return (
    <div className="scorecard-sheet mt-8">
      <div className="flex flex-wrap gap-3 print:hidden">
        <a className="inline-flex h-12 items-center rounded-full bg-ink px-5 text-base text-ivory" href={`${SCORECARD_PATH}/pdf?id=${publicId}`}>
          Download the PDF
        </a>
        <button type="button" className="inline-flex h-12 items-center rounded-full border border-stone px-5 text-base" onClick={() => window.print()}>
          Print this page
        </button>
      </div>
      <ol className="mt-6 space-y-3">
        {SCORECARD_QUESTIONS.map(([title, body], index) => (
          <li key={title} className="rounded-2xl border border-stone bg-white p-4">
            <p className="font-medium">{index + 1}. {title}</p>
            <p className="mt-1 text-base leading-6 text-muted">{body}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className={`inline-flex h-11 min-w-11 items-center rounded-full border px-4 ${answers[index] === true ? 'border-ink bg-ink text-ivory' : 'border-stone'}`} aria-pressed={answers[index] === true} onClick={() => setAnswers((current) => ({ ...current, [index]: true }))}>
                Yes
              </button>
              <button type="button" className={`inline-flex h-11 min-w-11 items-center rounded-full border px-4 ${answers[index] === false ? 'border-ink bg-ink text-ivory' : 'border-stone'}`} aria-pressed={answers[index] === false} onClick={() => setAnswers((current) => ({ ...current, [index]: false }))}>
                No
              </button>
            </div>
          </li>
        ))}
      </ol>
      <section className="mt-6 rounded-2xl border border-stone p-4">
        <h2 className="font-serif text-2xl">Your score</h2>
        <p className="mt-2 text-base text-muted">{answered} of {SCORECARD_QUESTIONS.length} answered. Yes count: {yesCount}.</p>
        {reading ? (
          <>
            <p className="mt-3 font-medium">{reading.heading}</p>
            <p className="mt-2 text-base leading-7 text-muted">{reading.body}</p>
          </>
        ) : (
          <p className="mt-3 text-base leading-7 text-muted">Answer every row. Seven or eight yeses means a closer can be the next look. Two or more nos means fix those first.</p>
        )}
      </section>
    </div>
  )
}

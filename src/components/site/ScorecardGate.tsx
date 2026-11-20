'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SCORECARD_PATH, SCORECARD_QUESTIONS } from '@/content/scorecard'
import { consentGranted } from './EmailCapture'
import { track } from '@/components/analytics/track'

type Access = 'form' | 'checking' | 'open'

function candidateId(): string {
  const fromUrl = new URLSearchParams(window.location.search).get('id')?.trim() || ''
  const stored = window.localStorage.getItem('cr_application_id')?.trim() || ''
  return fromUrl || stored
}

async function fetchUnlocked(id: string): Promise<boolean> {
  const response = await fetch(`/api/apply/scorecard-access?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
  const data = (await response.json().catch(() => null)) as { unlocked?: boolean } | null
  return data?.unlocked === true
}

function ScorecardSkeleton({ pending = false }: { pending?: boolean }) {
  return (
    <div className={`${pending ? 'scorecard-gate-pending ' : ''}mt-8 space-y-3`} aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="animate-pulse space-y-3 rounded-2xl border border-stone bg-white p-5 motion-reduce:animate-none">
        <div className="h-5 w-full rounded-2xl bg-stone" />
        <div className="h-5 w-4/5 rounded-2xl bg-stone" />
        <div className="h-12 w-full rounded-full bg-stone" />
        <div className="h-12 w-48 rounded-full bg-stone" />
      </div>
      <div className="animate-pulse h-28 rounded-2xl bg-stone motion-reduce:animate-none" />
      <div className="animate-pulse h-28 rounded-2xl bg-stone motion-reduce:animate-none" />
    </div>
  )
}

export function ScorecardGate({
  questions = SCORECARD_QUESTIONS,
  labels,
}: {
  questions?: [string, string][]
  labels?: {
    yes: string
    no: string
    scoreHeading: string
    progressHint: string
    passHeading: string
    passBody: string
    failHeading: string
    failBody: string
    passMaxNos: number
  }
}) {
  const copy = labels || {
    yes: 'Yes',
    no: 'No',
    scoreHeading: 'Your score',
    progressHint: 'Answer every row. Seven or eight yeses means a closer can be the next look. Two or more nos means fix those first.',
    passHeading: 'A closer can be the next look',
    passBody: 'One no, or none. The process is mostly in place. A closer is a reasonable next conversation if delivery can take the work and a setup fee is possible.',
    failHeading: 'Fix the nos first',
    failBody: 'Two or more nos means a closer will not fix the week. Write the price, the people it is not for, and where a maybe goes. Then look at a setter if the gap is conversations, or a closer if the gap is the decision.',
    passMaxNos: 1,
  }
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [access, setAccess] = useState<Access>('form')
  const [publicId, setPublicId] = useState('')
  const router = useRouter()

  useEffect(() => {
    const id = candidateId()
    if (!id) {
      document.documentElement.removeAttribute('data-scorecard')
      return
    }
    let cancel = false
    void fetchUnlocked(id)
      .then((unlocked) => {
        if (cancel) return
        document.documentElement.removeAttribute('data-scorecard')
        if (!unlocked) return
        setPublicId(id)
        setAccess('open')
      })
      .catch(() => {
        if (!cancel) document.documentElement.removeAttribute('data-scorecard')
      })
    return () => {
      cancel = true
    }
  }, [])

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
    setPublicId(data.id)
    setAccess('checking')
    router.replace(`${SCORECARD_PATH}?id=${data.id}`)
    setAccess((await fetchUnlocked(data.id)) ? 'open' : 'form')
  }

  if (access === 'checking') return <ScorecardSkeleton />

  if (access !== 'open') {
    return (
      <>
      <ScorecardSkeleton pending />
      <form onSubmit={onSubmit} className="scorecard-gate-form mt-8 space-y-3 rounded-2xl border border-stone bg-white p-5">
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
      </>
    )
  }

  const yesCount = Object.values(answers).filter(Boolean).length
  const answered = Object.keys(answers).length
  const nos = questions.length - yesCount
  const reading = answered === questions.length
    ? nos <= copy.passMaxNos
      ? { heading: copy.passHeading, body: copy.passBody }
      : { heading: copy.failHeading, body: copy.failBody }
    : null

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
        {questions.map(([title, body], index) => (
          <li key={title} className="rounded-2xl border border-stone bg-white p-4">
            <p className="font-medium">{index + 1}. {title}</p>
            <p className="mt-1 text-base leading-6 text-muted">{body}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className={`inline-flex h-11 min-w-11 items-center rounded-full border px-4 ${answers[index] === true ? 'border-ink bg-ink text-ivory' : 'border-stone'}`} aria-pressed={answers[index] === true} onClick={() => setAnswers((current) => ({ ...current, [index]: true }))}>
                {copy.yes}
              </button>
              <button type="button" className={`inline-flex h-11 min-w-11 items-center rounded-full border px-4 ${answers[index] === false ? 'border-ink bg-ink text-ivory' : 'border-stone'}`} aria-pressed={answers[index] === false} onClick={() => setAnswers((current) => ({ ...current, [index]: false }))}>
                {copy.no}
              </button>
            </div>
          </li>
        ))}
      </ol>
      <section className="mt-6 rounded-2xl border border-stone p-4">
        <h2 className="font-serif text-2xl">{copy.scoreHeading}</h2>
        <p className="mt-2 text-base text-muted">{answered} of {questions.length} answered. Yes count: {yesCount}.</p>
        {reading ? (
          <>
            <p className="mt-3 font-medium">{reading.heading}</p>
            <p className="mt-2 text-base leading-7 text-muted">{reading.body}</p>
          </>
        ) : (
          <p className="mt-3 text-base leading-7 text-muted">{copy.progressHint}</p>
        )}
      </section>
    </div>
  )
}

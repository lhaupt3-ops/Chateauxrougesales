'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { consentGranted, readAttribution } from '@/components/site/EmailCapture'
import { identifyApplication, readPostSlug, setPersonProperties, track } from '@/components/analytics/track'
import { sanitizeStepAnswer } from '@/lib/funnel-analytics'
import { emailDomainType } from '@/lib/site'
import {
  CONVERSATION_OPTIONS,
  DIAL_CODES,
  NEED_OPTIONS,
  DECISION_OPTIONS,
  SETUP_FEE_OPTIONS,
  OFFER_OPTIONS,
  PRICE_OPTIONS,
  REVENUE_OPTIONS,
  SETUP_OPTIONS,
  TIMELINE_OPTIONS,
  type Option,
} from '@/lib/options'

const STEPS = ['email', 'offer', 'price', 'revenue', 'conversations', 'setup', 'needs', 'timeline', 'setupFee', 'decisionMakers', 'contact'] as const

type Answers = Record<string, string | string[]>

export function ApplyWizard({
  initialId = '',
  initialStep = '1',
  entry = 'apply_page',
  defaultDial,
}: {
  initialId?: string
  initialStep?: string
  entry?: string
  defaultDial: string
}) {
  const [index, setIndex] = useState(initialStep === '2' && initialId ? 1 : 0)
  const [id, setId] = useState(initialId)
  const [answers, setAnswers] = useState<Answers>({})
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [dial, setDial] = useState(defaultDial)
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const started = useRef(Date.now())
  const viewed = useRef(false)
  const completed = useRef(false)
  const identified = useRef(false)
  const emailSubmitted = useRef(false)
  const idRef = useRef(initialId)
  const indexRef = useRef(initialStep === '2' && initialId ? 1 : 0)

  const stitch = useCallback((applicationId: string, email?: string) => {
    idRef.current = applicationId
    if (identifyApplication(applicationId, email)) identified.current = true
  }, [])

  const setupFeeOptions: Option[] = SETUP_FEE_OPTIONS

  useEffect(() => {
    if (viewed.current) return
    viewed.current = true
    track('apply_started', { entry, variant: 'email_first', post_slug: readPostSlug() })
    track('apply_step_viewed', { step_id: STEPS[index], step_index: index })
    const stored = window.localStorage.getItem('cr_application_id')
    const resumeId = initialId || stored || ''
    if (resumeId) stitch(resumeId)
    if (!resumeId) return
    void fetch(`/api/apply/resume?id=${resumeId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.id) return
        setId(data.id)
        stitch(data.id, typeof data.email === 'string' ? data.email : undefined)
        window.localStorage.setItem('cr_application_id', data.id)
        if (data.next) {
          completed.current = true
          window.location.href = data.next
          return
        }
        setAnswers({
          email: data.email || '',
          offerType: data.offerType || '',
          offerOther: data.offerOther || '',
          pricePoint: data.pricePoint || '',
          monthlyRevenue: data.monthlyRevenue || '',
          monthlyConversations: data.monthlyConversations || '',
          salesSetup: data.salesSetup || '',
          needs: data.needs || [],
          timeline: data.timeline || '',
          investment: data.investment || '',
          setupFee: data.setupFee || '',
          decisionMakers: data.decisionMakers || '',
        })
        if (data.offerOther) setOtherText(data.offerOther)
        if (!initialId && data.stepReached) {
          const found = STEPS.indexOf(data.stepReached)
          if (found >= 0) {
            const next = Math.min(found + 1, STEPS.length - 1)
            indexRef.current = next
            setIndex(next)
          }
        }
      })
      .catch(() => undefined)
  }, [entry, index, initialId, stitch])

  useEffect(() => {
    if (id) idRef.current = id
  }, [id])

  useEffect(() => {
    const raw = window.sessionStorage.getItem('cr_apply_draft')
    if (!raw) return
    try {
      const saved = JSON.parse(raw) as { answers?: Answers; index?: number; phone?: string; dial?: string; otherText?: string }
      queueMicrotask(() => {
        if (saved.answers) setAnswers((current) => ({ ...saved.answers, ...current }))
        if (typeof saved.phone === 'string') setPhone((current) => current || saved.phone || '')
        if (typeof saved.dial === 'string' && saved.dial) setDial(saved.dial)
        if (typeof saved.otherText === 'string') setOtherText((current) => current || saved.otherText || '')
        if (!initialId && typeof saved.index === 'number' && saved.index > 0 && saved.index < STEPS.length) {
          indexRef.current = saved.index
          setIndex(saved.index)
        }
      })
    } catch {
      window.sessionStorage.removeItem('cr_apply_draft')
    }
  }, [initialId])

  useEffect(() => {
    window.sessionStorage.setItem('cr_apply_draft', JSON.stringify({ answers, index, phone, dial, otherText }))
  }, [answers, index, phone, dial, otherText])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    function onPageHide() {
      const applicationId = idRef.current
      if (completed.current || !applicationId) return
      const step = STEPS[indexRef.current]
      const payload = JSON.stringify({ id: applicationId, step })
      if (navigator.sendBeacon) navigator.sendBeacon('/api/apply/abandon', new Blob([payload], { type: 'application/json' }))
      if (identified.current) track('apply_abandoned', { last_step: step }, { transport: 'sendBeacon' })
    }
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const options = optionsFor(STEPS[index], setupFeeOptions)
      const number = Number(event.key)
      if (!options || number < 1 || number > options.length) return
      event.preventDefault()
      void choose(options[number - 1].value)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function go(next: number) {
    setError('')
    indexRef.current = next
    setIndex(next)
    started.current = Date.now()
    track('apply_step_viewed', { step_id: STEPS[next], step_index: next })
  }

  async function persist(partial: Record<string, unknown>, nextIndex?: number) {
    setPending(true)
    setError('')
    const response = await fetch(id ? '/api/apply/save' : '/api/apply/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        email: partial.email,
        entry,
        ...partial,
        stepReached: STEPS[index],
        attribution: readAttribution(),
        analyticsConsent: consentGranted(),
        company_fax: '',
      }),
    })
    const data = (await response.json().catch(() => ({}))) as { id?: string; error?: string; next?: string }
    setPending(false)
    if (!response.ok) {
      setError(data.error || 'We could not save that. Try again.')
      return
    }
    const email = typeof partial.email === 'string' ? partial.email : undefined
    if (data.id && !id) {
      setId(data.id)
      window.localStorage.setItem('cr_application_id', data.id)
      stitch(data.id, email)
      track('lead_partial_saved', { applicationId: data.id })
    } else if (email && id) {
      stitch(id, email)
    }
    if (STEPS[index] === 'email' && !data.next && email && !emailSubmitted.current) {
      emailSubmitted.current = true
      track('apply_email_submitted', { entry, email_domain_type: emailDomainType(email) })
    }
    track('apply_step_completed', {
      step_id: STEPS[index],
      answer: sanitizeStepAnswer(partial),
      time_on_step_ms: Date.now() - started.current,
    })
    if (data.next) {
      completed.current = true
      window.location.href = data.next
      return
    }
    if (typeof nextIndex === 'number') go(nextIndex)
  }

  async function choose(value: string) {
    const step = STEPS[index]
    if (step === 'offer' && value === 'other') {
      setAnswers((current) => ({ ...current, offerType: value }))
      return
    }
    const key = keyFor(step)
    setAnswers((current) => ({ ...current, [key]: value }))
    await persist({ [key]: value, ...(step === 'offer' ? { offerOther: '' } : {}) }, index + 1)
  }

  async function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '')
    setAnswers((current) => ({ ...current, email }))
    await persist({ email }, 1)
  }

  function toggleNeed(value: string) {
    const current = Array.isArray(answers.needs) ? answers.needs : []
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    setAnswers((state) => ({ ...state, needs: next }))
  }

  async function finish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fullPhone = `${dial === '+other' ? '' : dial}${String(form.get('phone') || '')}`
    setPending(true)
    const response = await fetch('/api/apply/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...answers,
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        phone: fullPhone,
        website: form.get('website'),
        company: form.get('company'),
        notes: form.get('notes'),
        consentSms: consent,
        consentMarketing: marketing,
        analyticsConsent: consentGranted(),
        company_fax: form.get('company_fax') || '',
      }),
    })
    const data = (await response.json().catch(() => ({}))) as {
      error?: string
      next?: string
      tier?: string
      score?: number
    }
    setPending(false)
    if (!response.ok || !data.next) {
      setError(data.error || 'We could not score that yet.')
      return
    }
    completed.current = true
    window.sessionStorage.removeItem('cr_apply_draft')
    track('application_submitted', { tier: data.tier, score: data.score, next: data.next })
    setPersonProperties({
      tier: data.tier,
      score: data.score,
      offer_type: typeof answers.offerType === 'string' ? answers.offerType : '',
    })
    window.location.href = data.next
  }

  const step = STEPS[index]
  const options = optionsFor(step, setupFeeOptions)

  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted">
          <span>
            Step {index + 1} of {STEPS.length}
          </span>
          <span>{Math.round(((index + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-stone"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={index + 1}
          aria-label="Application progress"
        >
          <div className="h-full bg-rouge transition-[width] duration-200" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {index > 0 && (
          <button
          type="button"
          className="mb-6 inline-flex h-11 items-center text-base text-muted underline"
          onClick={() => {
            track('apply_back_clicked', { step_id: step })
            go(index - 1)
          }}
        >
          Back
        </button>
      )}

      {step === 'email' && (
        <form onSubmit={submitEmail} className="space-y-4">
          <h1 className="font-serif text-4xl tracking-[-0.04em]">See if we&apos;re a fit.</h1>
          <p className="text-lg text-muted">Where should we send the result? A no is a useful answer.</p>
          <label className="block text-sm" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" enterKeyHint="next" required defaultValue={String(answers.email || '')} className="h-12 w-full rounded-2xl border border-stone bg-white px-4 text-base" />
          <button className="inline-flex h-12 min-w-11 items-center rounded-full bg-rouge px-5 text-base font-medium text-white" disabled={pending}>
            Start my application
          </button>
          <p className="text-sm text-muted">About 90 seconds. A few quick taps.</p>
        </form>
      )}

      {step === 'offer' && (
        <Step title="What do you sell?" hint="The offer a buyer would actually pay for." options={OFFER_OPTIONS} selected={String(answers.offerType || '')} onChoose={choose} />
      )}
      {step === 'offer' && answers.offerType === 'other' && (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            void persist({ offerType: 'other', offerOther: otherText }, index + 1)
          }}
        >
          <label htmlFor="offerOther" className="text-sm">
            What is it? Optional.
          </label>
          <input id="offerOther" value={otherText} onChange={(event) => setOtherText(event.target.value)} enterKeyHint="next" className="h-12 w-full rounded-2xl border border-stone px-4 text-base" />
          <button className="h-12 rounded-full bg-rouge px-5 text-sm text-white">Continue</button>
        </form>
      )}

      {step === 'price' && <Step title="What does a buyer usually pay?" hint="The typical price of the main offer. This is how we see whether a team can carry it." options={PRICE_OPTIONS} selected={String(answers.pricePoint || '')} onChoose={choose} />}
      {step === 'revenue' && <Step title="What comes in each month, roughly?" hint="An honest band is more useful than a round number." options={REVENUE_OPTIONS} selected={String(answers.monthlyRevenue || '')} onChoose={choose} />}
      {step === 'conversations' && (
        <Step
          title="How many real sales conversations happen in a month?"
          hint="Booked calls, demo requests, or qualified inbound. Not a hope."
          options={CONVERSATION_OPTIONS}
          selected={String(answers.monthlyConversations || '')}
          onChoose={choose}
        />
      )}
      {step === 'setup' && <Step title="Who runs those conversations today?" options={SETUP_OPTIONS} selected={String(answers.salesSetup || '')} onChoose={choose} />}
      {step === 'needs' && (
        <div>
          <h1 className="font-serif text-4xl tracking-[-0.04em]">What would you like off your plate?</h1>
          <p className="mt-2 text-muted">Choose any that apply.</p>
          <div className="mt-6 grid gap-3">
            {NEED_OPTIONS.map((option, optionIndex) => {
              const selected = Array.isArray(answers.needs) && answers.needs.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleNeed(option.value)}
                  className={`min-h-14 rounded-2xl border px-4 py-4 text-left text-base ${selected ? 'border-ink bg-white' : 'border-stone bg-white/70'}`}
                >
                  <span className="mr-3 text-muted">{optionIndex + 1}</span>
                  {option.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-12 min-w-11 items-center rounded-full bg-rouge px-5 text-base text-white"
            onClick={() => {
              const needs = Array.isArray(answers.needs) ? answers.needs : []
              if (!needs.length) {
                setError('Pick at least one.')
                return
              }
              void persist({ needs }, index + 1)
            }}
          >
            Continue
          </button>
        </div>
      )}
      {step === 'timeline' && <Step title="When would you want this in place?" hint="Researching is an honest answer. It changes the route, not the respect." options={TIMELINE_OPTIONS} selected={String(answers.timeline || '')} onChoose={choose} />}
      {step === 'setupFee' && (
        <div>
          <h1 className="font-serif text-4xl tracking-[-0.04em]">Can you pay a one-off setup fee?</h1>
          <p className="mt-3 max-w-xl leading-7 text-muted">
            After that, the model is commission on cash collected. There is no monthly retainer. The setup amount and the commission percentage are still to be confirmed, in writing, before you pay.
          </p>
          <OptionList options={setupFeeOptions} selected={String(answers.setupFee || '')} onChoose={choose} />
        </div>
      )}
      {step === 'decisionMakers' && (
        <Step
          title="Who else would be part of a decision like this?"
          options={DECISION_OPTIONS}
          selected={String(answers.decisionMakers || '')}
          onChoose={choose}
        />
      )}
      {step === 'contact' && (
        <form onSubmit={finish} className="space-y-4">
          <h1 className="font-serif text-4xl tracking-[-0.04em]">How should we reach you?</h1>
          <p className="text-muted">So we can confirm a time, if the fit is there. No sequence of chase messages.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="First name" name="firstName" autoComplete="given-name" />
            <Field label="Last name" name="lastName" autoComplete="family-name" />
          </div>
          <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
            <label className="text-sm">
              Country
              <select value={dial} onChange={(event) => setDial(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-stone bg-white px-3">
                {DIAL_CODES.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Mobile
              <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" enterKeyHint="next" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-stone px-4 text-base" />
            </label>
          </div>
          <Field label="Company or website" name="website" autoComplete="url" required={false} placeholder="acme.com" />
          <label className="block text-sm">
            What made you look at this now? One line is plenty.
            <textarea name="notes" maxLength={300} enterKeyHint="done" className="mt-1 min-h-24 w-full rounded-2xl border border-stone px-4 py-3 text-base" />
          </label>
          <label className="flex items-start gap-3 text-sm leading-6">
            <input type="checkbox" className="mt-1" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
            <span>
              I agree to be contacted about this application by email and text. Message rates may apply. Read the{' '}
              <a className="underline" href="/privacy">
                privacy policy
              </a>
              .
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6">
            <input type="checkbox" className="mt-1" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            <span>Send the occasional note on sales team design. Optional.</span>
          </label>
          <input name="company_fax" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <button className="h-12 rounded-full bg-rouge px-5 text-sm font-medium text-white" disabled={pending}>
            {pending ? 'Scoring…' : 'See my result'}
          </button>
        </form>
      )}

      {options && step !== 'offer' && step !== 'needs' && step !== 'setupFee' ? null : null}
      {error && <p className="mt-4 text-sm text-wine">{error}</p>}
      <p className="mt-10 text-xs leading-5 text-muted">Your answers are private. No spam. Takes about 90 seconds.</p>
    </div>
  )
}

function Step({
  title,
  hint,
  options,
  selected,
  onChoose,
}: {
  title: string
  hint?: string
  options: Option[]
  selected: string
  onChoose: (value: string) => void
}) {
  return (
    <div>
      <h1 className="font-serif text-4xl tracking-[-0.04em]">{title}</h1>
      {hint && <p className="mt-2 text-muted">{hint}</p>}
      <OptionList options={options} selected={selected} onChoose={onChoose} />
    </div>
  )
}

function OptionList({ options, selected, onChoose }: { options: Option[]; selected: string; onChoose: (value: string) => void }) {
  return (
    <div className="mt-6 grid gap-3" role="listbox" aria-label="Choices">
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="option"
          aria-selected={selected === option.value}
          onClick={() => onChoose(option.value)}
          className={`min-h-14 rounded-2xl border px-4 py-4 text-left text-base ${selected === option.value ? 'border-ink bg-white' : 'border-stone bg-white/70 hover:border-ink'}`}
        >
          <span className="mr-3 text-muted">{index + 1}</span>
          {option.label}
        </button>
      ))}
    </div>
  )
}

function Field({
  label,
  name,
  autoComplete,
  required = true,
  placeholder,
}: {
  label: string
  name: string
  autoComplete: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block text-sm">
      {label}
      <input name={name} required={required} autoComplete={autoComplete} inputMode={name === 'website' ? 'url' : 'text'} enterKeyHint="next" placeholder={placeholder} className="mt-1 h-12 w-full rounded-2xl border border-stone bg-white px-4 text-base" />
    </label>
  )
}

function keyFor(step: (typeof STEPS)[number]): string {
  if (step === 'offer') return 'offerType'
  if (step === 'price') return 'pricePoint'
  if (step === 'revenue') return 'monthlyRevenue'
  if (step === 'conversations') return 'monthlyConversations'
  if (step === 'setup') return 'salesSetup'
  if (step === 'timeline') return 'timeline'
  if (step === 'setupFee') return 'setupFee'
  if (step === 'decisionMakers') return 'decisionMakers'
  return step
}

function optionsFor(step: (typeof STEPS)[number], setupFee: Option[]): Option[] | null {
  if (step === 'offer') return OFFER_OPTIONS
  if (step === 'price') return PRICE_OPTIONS
  if (step === 'revenue') return REVENUE_OPTIONS
  if (step === 'conversations') return CONVERSATION_OPTIONS
  if (step === 'setup') return SETUP_OPTIONS
  if (step === 'needs') return NEED_OPTIONS
  if (step === 'timeline') return TIMELINE_OPTIONS
  if (step === 'setupFee') return setupFee
  if (step === 'decisionMakers') return DECISION_OPTIONS
  return null
}

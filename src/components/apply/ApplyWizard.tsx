'use client'

import { useEffect, useRef, useState } from 'react'
import { consentGranted, readAttribution } from '@/components/site/EmailCapture'
import { track } from '@/components/analytics/track'
import {
  CONVERSATION_OPTIONS,
  DIAL_CODES,
  NEED_OPTIONS,
  OFFER_OPTIONS,
  PRICE_OPTIONS,
  REVENUE_OPTIONS,
  SETUP_OPTIONS,
  TIMELINE_OPTIONS,
  type Option,
} from '@/lib/options'
import type { InvestmentBands } from '@/lib/settings'

const STEPS = ['email', 'offer', 'price', 'revenue', 'conversations', 'setup', 'needs', 'timeline', 'investment', 'contact'] as const

type Answers = Record<string, string | string[]>

export function ApplyWizard({
  initialId = '',
  initialStep = '1',
  entry = 'apply_page',
  bands,
  defaultDial,
}: {
  initialId?: string
  initialStep?: string
  entry?: string
  bands: InvestmentBands
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

  const investmentOptions: Option[] = [
    { value: 'under_low', label: bands.low },
    { value: 'mid', label: bands.mid },
    { value: 'high', label: bands.high },
    { value: 'performance_only', label: 'Performance only (commission only)' },
    { value: 'not_sure', label: 'Not sure yet. Show me the options.' },
  ]

  useEffect(() => {
    if (viewed.current) return
    viewed.current = true
    track('apply_started', { entry, variant: 'email_first' })
    track('apply_step_viewed', { step_id: STEPS[index], step_index: index })
    const stored = window.localStorage.getItem('cr_application_id')
    const resumeId = initialId || stored || ''
    if (!resumeId) return
    void fetch(`/api/apply/resume?id=${resumeId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.id) return
        setId(data.id)
        window.localStorage.setItem('cr_application_id', data.id)
        if (data.next) {
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
        })
        if (data.offerOther) setOtherText(data.offerOther)
        if (!initialId && data.stepReached) {
          const found = STEPS.indexOf(data.stepReached)
          if (found >= 0) setIndex(Math.min(found + 1, STEPS.length - 1))
        }
      })
      .catch(() => undefined)
  }, [entry, index, initialId])

  useEffect(() => {
    function onHide() {
      if (document.visibilityState === 'hidden' && id) {
        const payload = JSON.stringify({ id, step: STEPS[index] })
        if (navigator.sendBeacon) navigator.sendBeacon('/api/apply/abandon', new Blob([payload], { type: 'application/json' }))
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [id, index])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const options = optionsFor(STEPS[index], investmentOptions)
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
    if (data.id && !id) {
      setId(data.id)
      window.localStorage.setItem('cr_application_id', data.id)
      track('lead_partial_saved', { applicationId: data.id })
    }
    track('apply_step_completed', {
      step_id: STEPS[index],
      answer: partial,
      time_on_step_ms: Date.now() - started.current,
    })
    if (data.next) {
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
    const data = (await response.json().catch(() => ({}))) as { error?: string; next?: string }
    setPending(false)
    if (!response.ok || !data.next) {
      setError(data.error || 'We could not score that yet.')
      return
    }
    window.location.href = data.next
  }

  const step = STEPS[index]
  const options = optionsFor(step, investmentOptions)

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
          className="mb-6 text-sm text-muted underline"
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
          <h1 className="font-serif text-4xl tracking-[-0.04em]">Let&apos;s see if we&apos;re a fit.</h1>
          <p className="text-lg text-muted">Where should we send your fit result?</p>
          <label className="block text-sm" htmlFor="email">
            Work email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={String(answers.email || '')} className="h-12 w-full rounded-2xl border border-stone bg-white px-4" />
          <button className="h-12 rounded-full bg-rouge px-5 text-sm font-medium text-white" disabled={pending}>
            Start my application
          </button>
          <p className="text-sm text-muted">About 90 seconds. A few quick taps.</p>
        </form>
      )}

      {step === 'offer' && (
        <Step title="What do you sell?" options={OFFER_OPTIONS} selected={String(answers.offerType || '')} onChoose={choose} />
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
          <input id="offerOther" value={otherText} onChange={(event) => setOtherText(event.target.value)} className="h-12 w-full rounded-2xl border border-stone px-4" />
          <button className="h-12 rounded-full bg-rouge px-5 text-sm text-white">Continue</button>
        </form>
      )}

      {step === 'price' && <Step title="What does a client pay you?" hint="The typical price of the main offer." options={PRICE_OPTIONS} selected={String(answers.pricePoint || '')} onChoose={choose} />}
      {step === 'revenue' && <Step title="Monthly revenue right now?" options={REVENUE_OPTIONS} selected={String(answers.monthlyRevenue || '')} onChoose={choose} />}
      {step === 'conversations' && (
        <Step
          title="How many sales conversations come in each month?"
          hint="Booked calls, demo requests, or qualified inbound leads."
          options={CONVERSATION_OPTIONS}
          selected={String(answers.monthlyConversations || '')}
          onChoose={choose}
        />
      )}
      {step === 'setup' && <Step title="Who handles sales today?" options={SETUP_OPTIONS} selected={String(answers.salesSetup || '')} onChoose={choose} />}
      {step === 'needs' && (
        <div>
          <h1 className="font-serif text-4xl tracking-[-0.04em]">What do you want off your plate?</h1>
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
                  className={`min-h-12 rounded-2xl border px-4 py-4 text-left ${selected ? 'border-ink bg-white' : 'border-stone bg-white/70'}`}
                >
                  <span className="mr-3 text-muted">{optionIndex + 1}</span>
                  {option.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="mt-4 h-12 rounded-full bg-rouge px-5 text-sm text-white"
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
      {step === 'timeline' && <Step title="When do you want this running?" options={TIMELINE_OPTIONS} selected={String(answers.timeline || '')} onChoose={choose} />}
      {step === 'investment' && (
        <div>
          <h1 className="font-serif text-4xl tracking-[-0.04em]">Which range fits your plan?</h1>
          <p className="mt-3 max-w-xl leading-7 text-muted">
            Our engagements combine a setup and a monthly management fee with commission on cash collected.
          </p>
          {bands.placeholder && (
            <p className="mt-3 text-sm text-wine">These bands are placeholders. Replace them in Site settings before you send traffic.</p>
          )}
          <OptionList options={investmentOptions} selected={String(answers.investment || '')} onChoose={choose} />
        </div>
      )}
      {step === 'contact' && (
        <form onSubmit={finish} className="space-y-4">
          <h1 className="font-serif text-4xl tracking-[-0.04em]">Your details</h1>
          <p className="text-muted">So your closer can text a confirmation.</p>
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
              <input name="phone" required autoComplete="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-stone px-4" />
            </label>
          </div>
          <Field label="Company or website" name="website" autoComplete="url" required={false} placeholder="acme.com" />
          <label className="block text-sm">
            Anything we should know?
            <textarea name="notes" maxLength={300} className="mt-1 min-h-24 w-full rounded-2xl border border-stone px-4 py-3" />
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

      {options && step !== 'offer' && step !== 'needs' && step !== 'investment' ? null : null}
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
          className={`min-h-12 rounded-2xl border px-4 py-4 text-left ${selected === option.value ? 'border-ink bg-white' : 'border-stone bg-white/70 hover:border-ink'}`}
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
      <input name={name} required={required} autoComplete={autoComplete} placeholder={placeholder} className="mt-1 h-12 w-full rounded-2xl border border-stone bg-white px-4" />
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
  if (step === 'investment') return 'investment'
  return step
}

function optionsFor(step: (typeof STEPS)[number], investment: Option[]): Option[] | null {
  if (step === 'offer') return OFFER_OPTIONS
  if (step === 'price') return PRICE_OPTIONS
  if (step === 'revenue') return REVENUE_OPTIONS
  if (step === 'conversations') return CONVERSATION_OPTIONS
  if (step === 'setup') return SETUP_OPTIONS
  if (step === 'needs') return NEED_OPTIONS
  if (step === 'timeline') return TIMELINE_OPTIONS
  if (step === 'investment') return investment
  return null
}

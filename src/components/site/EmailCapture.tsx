'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/components/analytics/track'

export function EmailCapture({
  location,
  entry,
  button = 'Check if you qualify',
  compact = false,
}: {
  location: string
  entry: string
  button?: string
  compact?: boolean
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    track('cta_clicked', { location, page: window.location.pathname, variant: 'email' })
    const response = await fetch('/api/apply/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        entry,
        attribution: readAttribution(),
        analyticsConsent: consentGranted(),
        company_fax: '',
      }),
    })
    const data = (await response.json().catch(() => ({}))) as { id?: string; error?: string }
    setPending(false)
    if (!response.ok || !data.id) {
      setError(data.error || 'Enter a real work email to start.')
      return
    }
    window.localStorage.setItem('cr_application_id', data.id)
    router.push(`/apply?step=2&id=${data.id}&entry=${entry}`)
  }

  return (
    <form onSubmit={onSubmit} className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-3 sm:flex-row'}>
      <label className="sr-only" htmlFor={`email-${location}`}>
        Work email
      </label>
      <input
        id={`email-${location}`}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Work email"
        className="h-12 w-full rounded-full border border-stone bg-white px-4 text-base outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-12 shrink-0 rounded-full bg-rouge px-5 text-sm font-medium text-white hover:bg-wine disabled:opacity-60"
      >
        {pending ? 'Starting…' : button}
      </button>
      {error && <p className="text-sm text-wine sm:basis-full">{error}</p>}
    </form>
  )
}

export function readAttribution() {
  if (typeof window === 'undefined') return {}
  const first = parse(window.localStorage.getItem('cr_first_touch'))
  const last = parse(window.localStorage.getItem('cr_last_touch'))
  return {
    ...first,
    lastUtmSource: last.utmSource || '',
    lastUtmMedium: last.utmMedium || '',
    lastUtmCampaign: last.utmCampaign || '',
    referrer: first.referrer || document.referrer || '',
    landingPage: first.landingPage || '',
    lastBlogPost: window.localStorage.getItem('cr_last_post') || '',
    device: window.innerWidth < 768 ? 'mobile' : 'desktop',
  }
}

function parse(value: string | null): Record<string, string> {
  if (!value) return {}
  try {
    return JSON.parse(value) as Record<string, string>
  } catch {
    return {}
  }
}

export function consentGranted(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('cr_consent=granted')
}

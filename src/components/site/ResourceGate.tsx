'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { consentGranted } from './EmailCapture'
import { track } from '@/components/analytics/track'

export function ResourceGate({
  slug,
  title,
  scorecard,
  unlocked = false,
  children,
}: {
  slug: string
  title: string
  scorecard: boolean
  unlocked?: boolean
  children: React.ReactNode
}) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const remembered = useSyncExternalStore(
    () => () => {},
    () => window.localStorage.getItem(`cr_guide_${slug}`) === '1',
    () => false,
  )
  const open = unlocked || remembered || submitted

  useEffect(() => {
    track('lead_magnet_view', { resource: slug, page: window.location.pathname })
  }, [slug])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '')
    if (form.get('consent') !== 'yes') {
      setError('Tick the box so we can email the guide.')
      return
    }
    const response = await fetch('/api/apply/magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        resource: slug,
        page: window.location.pathname,
        analyticsConsent: consentGranted(),
        marketingConsent: true,
      }),
    })
    const data = (await response.json()) as { error?: string; id?: string }
    if (!response.ok) {
      setError(data.error || 'Use a real email.')
      return
    }
    window.localStorage.setItem(`cr_guide_${slug}`, '1')
    setSubmitted(true)
    track('lead_magnet_optin', { resource: slug, page: window.location.pathname })
    track('lead_magnet_submitted', { resource: slug, page: window.location.pathname })
    track('nurture_resource_downloaded', { resource: slug })
    if (scorecard && data.id) {
      window.localStorage.setItem('cr_application_id', data.id)
      router.push(`/apply?step=2&id=${data.id}&entry=scorecard`)
    }
  }

  if (open) return <div className="mt-8">{children}</div>

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-2xl border border-stone bg-white p-5">
      <p className="text-sm text-muted">
        {scorecard
          ? 'These are the same questions as the application. Leave your email to continue. The result is a next step, not a promise.'
          : `Leave your email to read ${title}. We will also send the link. Unsubscribe any time.`}
      </p>
      <input name="email" type="email" required autoComplete="email" placeholder="Email" className="h-12 w-full rounded-xl border border-stone px-4" />
      <label className="flex items-start gap-2 text-sm text-muted">
        <input name="consent" type="checkbox" value="yes" className="mt-1" />
        <span>Email me this guide. I can unsubscribe in one click. This is separate from analytics cookies.</span>
      </label>
      <button className="h-12 rounded-xl bg-rouge px-5 text-sm text-white">{scorecard ? 'Start the scorecard' : 'Email me the guide'}</button>
      {error && <p className="text-sm text-wine">{error}</p>}
    </form>
  )
}

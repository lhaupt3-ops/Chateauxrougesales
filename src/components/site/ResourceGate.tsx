'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { consentGranted } from './EmailCapture'
import { track } from '@/components/analytics/track'

export function ResourceGate({
  slug,
  title,
  scorecard,
  children,
}: {
  slug: string
  title: string
  scorecard: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get('email') || '')
    const response = await fetch('/api/apply/magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resource: slug, page: window.location.pathname, analyticsConsent: consentGranted() }),
    })
    const data = (await response.json()) as { error?: string; id?: string }
    if (!response.ok) {
      setError(data.error || 'Use a real email.')
      return
    }
    track('lead_magnet_submitted', { resource: slug, page: window.location.pathname })
    track('nurture_resource_downloaded', { resource: slug })
    if (scorecard && data.id) {
      window.localStorage.setItem('cr_application_id', data.id)
      router.push(`/apply?step=2&id=${data.id}&entry=scorecard`)
      return
    }
    setOpen(true)
  }

  if (open) return <div className="mt-8">{children}</div>

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-2xl border border-stone bg-white p-5">
      <p className="text-sm text-muted">
        {scorecard
          ? 'This scorecard is the application. Leave your email and continue the questions. A strong score books a call.'
          : `Leave your email to read ${title}. The draft below is a working version, not a client case.`}
      </p>
      <input name="email" type="email" required autoComplete="email" placeholder="Work email" className="h-12 w-full rounded-full border border-stone px-4" />
      <button className="h-12 rounded-full bg-rouge px-5 text-sm text-white">{scorecard ? 'Start the scorecard' : 'Read it'}</button>
      {error && <p className="text-sm text-wine">{error}</p>}
    </form>
  )
}

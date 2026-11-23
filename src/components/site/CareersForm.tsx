'use client'

import { useState } from 'react'

export function CareersForm() {
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/apply/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        notes: form.get('notes'),
      }),
    })
    const data = (await response.json()) as { error?: string }
    if (!response.ok) {
      setError(data.error || 'Could not send that.')
      return
    }
    setDone(true)
  }

  if (done) return <p className="mt-6">Received. We will write if a seat opens. This is not an offer.</p>

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3">
      <input name="firstName" required placeholder="First name" autoComplete="given-name" className="h-12 w-full rounded-2xl border border-stone px-4" />
      <input name="lastName" required placeholder="Last name" autoComplete="family-name" className="h-12 w-full rounded-2xl border border-stone px-4" />
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className="h-12 w-full rounded-2xl border border-stone px-4" />
      <textarea name="notes" required maxLength={300} placeholder="What you sell today, in a few lines." className="min-h-28 w-full rounded-2xl border border-stone px-4 py-3" />
      <button className="h-12 rounded-xl bg-ink px-5 text-sm text-ivory">Send</button>
      {error && <p className="text-sm text-wine">{error}</p>}
    </form>
  )
}

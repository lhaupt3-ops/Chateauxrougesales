'use client'

import { useState } from 'react'
import { track } from '@/components/analytics/track'

export function WaitlistForm({ id, reason }: { id: string; reason: string }) {
  const [done, setDone] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    await fetch('/api/apply/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reason }),
    })
    track('waitlist_joined', { reason })
    setDone(true)
  }

  if (done) return <p className="mt-8 text-sm">You are on the list. We will write when the fit is closer.</p>

  return (
    <form onSubmit={onSubmit} className="mt-8 rounded-2xl bg-ink p-5 text-ivory">
      <h2 className="font-serif text-2xl">Stay on the list</h2>
      <p className="mt-2 text-sm text-ivory/75">Optional. We will write when the offer, the revenue or the lead flow has moved. You can ignore it. We will not chase.</p>
      <button className="mt-4 h-11 rounded-full bg-ivory px-4 text-sm text-ink">Keep my place</button>
    </form>
  )
}

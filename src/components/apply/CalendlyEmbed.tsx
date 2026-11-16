'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/components/analytics/track'

type Prefill = {
  name: string
  email: string
  a1: string
  a2: string
  a3: string
  utm: Record<string, string>
}

export function CalendlyEmbed({
  url,
  eventType,
  applicationId,
  prefill,
  preview,
}: {
  url: string
  eventType: 'strategy' | 'fit'
  applicationId: string
  prefill: Prefill
  preview: boolean
}) {
  const parent = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (preview || !parent.current) return
    const node = parent.current
    const run = () => {
      const calendly = (window as unknown as { Calendly?: { initInlineWidget: (args: unknown) => void } }).Calendly
      if (!calendly) return
      node.innerHTML = ''
      calendly.initInlineWidget({
        url,
        parentElement: node,
        prefill: {
          name: prefill.name,
          email: prefill.email,
          customAnswers: { a1: prefill.a1, a2: prefill.a2, a3: prefill.a3 },
        },
        utm: {
          utmSource: prefill.utm.utmSource,
          utmMedium: prefill.utm.utmMedium,
          utmCampaign: prefill.utm.utmCampaign,
          utmContent: applicationId,
          utmTerm: prefill.utm.utmTerm,
        },
      })
    }
    const existing = document.querySelector('script[data-calendly="true"]')
    if (existing) {
      run()
    } else {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.dataset.calendly = 'true'
      script.onload = run
      document.body.appendChild(script)
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== 'https://calendly.com') return
      const data = event.data as { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } }
      if (!data?.event) return
      if (data.event === 'calendly.event_type_viewed') track('calendly_viewed', { event_type: eventType })
      if (data.event === 'calendly.date_and_time_selected') track('calendly_time_selected', { event_type: eventType })
      if (data.event === 'calendly.event_scheduled') {
        track('call_booked', { event_type: eventType, source: 'embed' })
        void fetch('/api/apply/booked', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: applicationId,
            eventType,
            eventUri: data.payload?.event?.uri,
            inviteeUri: data.payload?.invitee?.uri,
          }),
        }).then(() => {
          router.push(`/apply/confirmed?id=${applicationId}`)
        })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [applicationId, eventType, prefill, preview, router, url])

  async function previewBook() {
    const response = await fetch('/api/apply/booked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: applicationId, eventType, preview: true }),
    })
    const data = (await response.json()) as { next?: string; error?: string }
    if (data.next) router.push(data.next)
  }

  if (preview) {
    return (
      <div className="flex min-h-[720px] flex-col justify-between rounded-3xl border border-dashed border-gold bg-white p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-wine">Calendar</p>
          <h2 className="mt-3 font-serif text-3xl">Times are not on this page yet.</h2>
          <p className="mt-3 leading-7 text-muted">
            We will email you a link to choose a time for the {eventType === 'fit' ? '15-minute fit call' : 'strategy call'}. Your name, email and answers are already saved.
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            <div><dt className="text-muted">Name</dt><dd>{prefill.name || '—'}</dd></div>
            <div><dt className="text-muted">Email</dt><dd>{prefill.email}</dd></div>
            <div><dt className="text-muted">Answers</dt><dd className="leading-6">{prefill.a1}</dd></div>
          </dl>
        </div>
        <button type="button" onClick={previewBook} className="mt-6 h-12 rounded-full bg-ink px-5 text-sm text-ivory">
          Preview the confirmation page
        </button>
      </div>
    )
  }

  return <div ref={parent} className="min-h-[720px] overflow-hidden rounded-3xl border border-stone bg-white" />
}

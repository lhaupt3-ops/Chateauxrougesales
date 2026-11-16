'use client'

import posthog from 'posthog-js'

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!document.cookie.includes('cr_consent=granted')) return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.capture(event, properties)
}

'use client'

import posthog from 'posthog-js'
import { emailDomainType } from '@/lib/site'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export const CTA_LOCATIONS = ['header', 'mobile_nav', 'hero', 'guide_footer', 'post_inline', 'pricing'] as const
export type CtaLocation = (typeof CTA_LOCATIONS)[number]

type TrackOptions = {
  transport?: 'sendBeacon'
}

function consentGranted(): boolean {
  return typeof document !== 'undefined' && document.cookie.includes('cr_consent=granted')
}

/** Loads PostHog only after analytics consent. Persistence stays localStorage+cookie. */
export function ensurePosthog(): boolean {
  if (typeof window === 'undefined' || !consentGranted() || !KEY) return false
  if (!posthog.__loaded) {
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: false,
      persistence: 'localStorage+cookie',
    })
  }
  return Boolean(posthog.__loaded)
}

export function track(event: string, properties?: Record<string, unknown>, options?: TrackOptions) {
  if (!ensurePosthog()) return
  posthog.capture(
    event,
    properties,
    options?.transport ? { transport: options.transport, send_instantly: true } : undefined,
  )
}

export function readPostSlug(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('cr_last_post') || ''
}

export function capturePageview(pathname: string) {
  if (!ensurePosthog()) return
  posthog.capture('$pageview', {
    path: pathname,
    $current_url: window.location.href,
  })
}

export function identifyApplication(applicationId: string, email?: string): boolean {
  if (!applicationId || !ensurePosthog()) return false
  const domainType = email && email.includes('@') ? emailDomainType(email) : undefined
  posthog.identify(applicationId, domainType ? { email_domain_type: domainType } : undefined)
  return true
}

export function setPersonProperties(properties: Record<string, unknown>) {
  if (!ensurePosthog()) return
  posthog.setPersonProperties(properties)
}

export function trackCta(location: CtaLocation) {
  track('cta_clicked', {
    location,
    page: window.location.pathname,
    variant: 'button',
    target: '/apply',
    post_slug: readPostSlug(),
  })
}

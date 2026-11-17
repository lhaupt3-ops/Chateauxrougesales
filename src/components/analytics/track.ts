'use client'

import { emailDomainType } from '@/lib/site'

type PostHog = typeof import('posthog-js').default

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export const CTA_LOCATIONS = ['header', 'mobile_nav', 'hero', 'guide_footer', 'post_inline', 'pricing'] as const
export type CtaLocation = (typeof CTA_LOCATIONS)[number]

type TrackOptions = {
  transport?: 'sendBeacon'
}

let client: PostHog | null = null
let loading: Promise<PostHog | null> | null = null
const queue: Array<(posthog: PostHog) => void> = []

function consentGranted(): boolean {
  return typeof document !== 'undefined' && document.cookie.includes('cr_consent=granted')
}

function flush(posthog: PostHog) {
  const pending = queue.splice(0)
  for (const job of pending) job(posthog)
}

function loadAfterConsent(): Promise<PostHog | null> {
  if (typeof window === 'undefined' || !consentGranted() || !KEY) return Promise.resolve(null)
  if (client) return Promise.resolve(client)
  if (!loading) {
    loading = import('posthog-js')
      .then((mod) => {
        const posthog = mod.default
        if (!posthog.__loaded) {
          posthog.init(KEY, {
            api_host: HOST,
            capture_pageview: false,
            persistence: 'localStorage+cookie',
          })
        }
        client = posthog
        flush(posthog)
        return posthog
      })
      .catch(() => {
        loading = null
        queue.splice(0)
        return null
      })
  }
  return loading
}

function whenReady(job: (posthog: PostHog) => void) {
  if (!consentGranted() || !KEY) return
  if (client) {
    job(client)
    return
  }
  queue.push(job)
  void loadAfterConsent()
}

/** True only once PostHog is already loaded. Events before consent are dropped. */
export function ensurePosthog(): boolean {
  if (!consentGranted() || !KEY) return false
  void loadAfterConsent()
  return Boolean(client?.__loaded)
}

export function track(event: string, properties?: Record<string, unknown>, options?: TrackOptions) {
  whenReady((posthog) => {
    posthog.capture(event, properties, options?.transport ? { transport: options.transport, send_instantly: true } : undefined)
  })
}

export function readPostSlug(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('cr_last_post') || ''
}

export function capturePageview(pathname: string) {
  whenReady((posthog) => {
    posthog.capture('$pageview', {
      path: pathname,
      $current_url: window.location.href,
    })
  })
}

export function identifyApplication(applicationId: string, email?: string): boolean {
  if (!applicationId || !consentGranted() || !KEY) return false
  const domainType = email && email.includes('@') ? emailDomainType(email) : undefined
  whenReady((posthog) => {
    posthog.identify(applicationId, domainType ? { email_domain_type: domainType } : undefined)
  })
  return true
}

export function setPersonProperties(properties: Record<string, unknown>) {
  whenReady((posthog) => {
    posthog.setPersonProperties(properties)
  })
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

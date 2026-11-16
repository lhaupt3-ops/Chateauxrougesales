const OPTION_KEYS = new Set([
  'offerType',
  'pricePoint',
  'monthlyRevenue',
  'monthlyConversations',
  'salesSetup',
  'needs',
  'timeline',
  'investment',
])

const PII_KEYS = new Set(['email', 'phone', 'firstName', 'lastName', 'website', 'notes'])

function text(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

function field(doc: object, key: string): unknown {
  return (doc as Record<string, unknown>)[key]
}

/** Option values only. Drops free text and contact fields from step answers. */
export function sanitizeStepAnswer(answer: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(answer)) {
    if (PII_KEYS.has(key) || !OPTION_KEYS.has(key)) continue
    if (Array.isArray(value)) {
      const options = value.filter((item): item is string => typeof item === 'string' && item.length > 0)
      if (options.length) clean[key] = options
      continue
    }
    if (typeof value === 'string' && value) clean[key] = value
  }
  return clean
}

/**
 * Event properties copied from the stored application, plus `$set_once` first-touch UTMs.
 * Stored `utmSource` / `utmMedium` / `utmCampaign` / `landingPage` / `referrer` are first touch.
 */
export function applicationEventProperties(doc: object): Record<string, unknown> {
  const utm_source = text(field(doc, 'utmSource'))
  const utm_medium = text(field(doc, 'utmMedium'))
  const utm_campaign = text(field(doc, 'utmCampaign'))
  const landing_page = text(field(doc, 'landingPage'))
  const referrer = text(field(doc, 'referrer'))
  const firstTouch = {
    initial_utm_source: utm_source,
    initial_utm_medium: utm_medium,
    initial_utm_campaign: utm_campaign,
    initial_landing_page: landing_page,
    initial_referrer: referrer,
  }
  const setOnce = Object.fromEntries(Object.entries(firstTouch).filter(([, value]) => value))
  return {
    utm_source,
    utm_medium,
    utm_campaign,
    landing_page,
    referrer,
    last_blog_post: text(field(doc, 'lastBlogPost')),
    device: text(field(doc, 'device')),
    entry: text(field(doc, 'entry')),
    ...(Object.keys(setOnce).length ? { $set_once: setOnce } : {}),
  }
}

export function leadTimeHours(meetingStartAt: string | undefined): number | undefined {
  if (!meetingStartAt) return undefined
  const start = new Date(meetingStartAt).getTime()
  if (!Number.isFinite(start)) return undefined
  return (start - Date.now()) / 36e5
}

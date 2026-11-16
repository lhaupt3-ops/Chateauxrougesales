export type CalendlyTimes = { start: string; end?: string }

const EVENT_URI = /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9-]+$/
const INVITEE_URI = /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9-]+\/invitees\/[A-Za-z0-9-]+$/

export async function fetchCalendlyEventTimes(eventUri: string, inviteeUri = ''): Promise<CalendlyTimes | null> {
  const token = process.env.CALENDLY_API_TOKEN
  if (!token) return null

  let eventUrl = eventUri.trim()
  if (!EVENT_URI.test(eventUrl) && INVITEE_URI.test(inviteeUri.trim())) {
    const invitee = await calendlyGet(inviteeUri.trim(), token)
    const linked = invitee?.resource?.event
    if (typeof linked === 'string') eventUrl = linked
  }
  if (!EVENT_URI.test(eventUrl)) return null

  const event = await calendlyGet(eventUrl, token)
  const start = event?.resource?.start_time
  const end = event?.resource?.end_time
  if (typeof start !== 'string' || !start) return null
  return { start, end: typeof end === 'string' && end ? end : undefined }
}

async function calendlyGet(url: string, token: string): Promise<{ resource?: { event?: string; start_time?: string; end_time?: string } } | null> {
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!response.ok) return null
    return (await response.json()) as { resource?: { event?: string; start_time?: string; end_time?: string } }
  } catch {
    return null
  }
}

import { createHmac, timingSafeEqual } from 'crypto'
import { findByPublicId } from '@/lib/apply-server'
import { captureServer } from '@/lib/analytics-server'
import { getPayloadClient } from '@/lib/payload'
import { notifyApplicant, notifyApplication } from '@/lib/notify'

export async function POST(request: Request) {
  const raw = await request.text()
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
  if (!signingKey) {
    if (process.env.VERCEL_ENV === 'production') {
      return Response.json({ error: 'Calendly signing key is not set.' }, { status: 503 })
    }
  } else if (!verify(raw, request.headers.get('calendly-webhook-signature'), signingKey)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(raw) as {
    event?: string
    payload?: {
      email?: string
      uri?: string
      tracking?: { utm_content?: string }
      scheduled_event?: { uri?: string; start_time?: string; name?: string }
    }
  }
  const payload = body.payload
  if (!payload) return Response.json({ ok: true })
  const publicId = payload.tracking?.utm_content || ''
  let doc = publicId ? await findByPublicId(publicId) : null
  if (!doc && payload.email) {
    const client = await getPayloadClient()
    const found = await client.find({
      collection: 'applications',
      where: { email: { equals: payload.email } },
      sort: '-createdAt',
      limit: 1,
      overrideAccess: true,
    })
    doc = (found.docs[0] as unknown as typeof doc) || null
  }
  if (!doc) return Response.json({ ok: true, matched: false })

  const client = await getPayloadClient()
  const canceled = body.event === 'invitee.canceled'
  const updated = await client.update({
    collection: 'applications',
    id: doc.id,
    overrideAccess: true,
    data: canceled
      ? { status: 'complete', bookingStatus: 'canceled' }
      : {
          status: 'booked',
          bookingStatus: 'scheduled',
          calendlyEventUri: payload.scheduled_event?.uri || '',
          calendlyInviteeUri: payload.uri || '',
          meetingStartAt: payload.scheduled_event?.start_time,
          bookedAt: new Date().toISOString(),
          priorityCall: false,
        },
  })
  if (!canceled) {
    await notifyApplication(updated as never, 'booked')
    await notifyApplicant(updated as never, 'booked')
    await captureServer(String(doc.publicId), 'call_booked', { source: 'webhook', event_type: doc.eventType || 'strategy' }, Boolean(doc.analyticsConsent))
  }
  return Response.json({ ok: true, matched: true })
}

function verify(raw: string, header: string | null, key: string): boolean {
  if (!header) return false
  const parts = Object.fromEntries(header.split(',').map((part) => part.split('=')))
  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) return false
  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(age) || age > 180) return false
  const expected = createHmac('sha256', key).update(`${timestamp}.${raw}`).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}

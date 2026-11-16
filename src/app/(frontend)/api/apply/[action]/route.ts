import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { scoreApplication } from '@/lib/scoring'
import {
  answerSummary,
  findByPublicId,
  investmentLabel,
  isCalendlyUrl,
  pickWritable,
  rateLimit,
  requestCountry,
  resultPath,
  setApplicationCookie,
} from '@/lib/apply-server'
import { captureServer } from '@/lib/analytics-server'
import { emailDomainType, isDisposableEmail, isValidEmail, normalizeWebsite } from '@/lib/site'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/settings'
import { notifyApplicant, notifyApplication } from '@/lib/notify'

type Body = Record<string, unknown>

async function readBody(request: Request): Promise<Body> {
  const type = request.headers.get('content-type') || ''
  if (type.includes('application/json')) return (await request.json()) as Body
  const form = await request.formData()
  return Object.fromEntries(form.entries())
}

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}

export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params
  if (!rateLimit(`${clientIp(request)}:${action}`)) {
    return NextResponse.json({ error: 'Too many attempts. Wait a few minutes and try again.' }, { status: 429 })
  }
  const body = await readBody(request)
  if (typeof body.company_fax === 'string' && body.company_fax.trim()) {
    return NextResponse.json({ error: 'Could not submit that.' }, { status: 400 })
  }
  if (action === 'start') return start(request, body)
  if (action === 'save') return save(body)
  if (action === 'complete') return complete(body)
  if (action === 'booked') return booked(body)
  if (action === 'waitlist') return waitlist(body)
  if (action === 'abandon') return abandon(body)
  if (action === 'magnet') return magnet(body)
  if (action === 'careers') return careers(body)
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function GET(request: Request, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params
  const id = new URL(request.url).searchParams.get('id') || ''
  if (action === 'resume') return resume(id)
  if (action === 'ics') return ics(id)
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

async function start(request: Request, body: Body) {
  const email = String(body.email || '').trim().toLowerCase()
  if (!isValidEmail(email) || isDisposableEmail(email)) {
    return NextResponse.json({ error: 'Use a real email address. Temporary inboxes are blocked.' }, { status: 400 })
  }
  const payload = await getPayloadClient()
  const attribution = (body.attribution || {}) as Record<string, string>
  const publicId = randomUUID()
  const doc = await payload.create({
    collection: 'applications',
    overrideAccess: true,
    data: {
      publicId,
      email,
      status: 'partial',
      entry: String(body.entry || 'apply_page'),
      source: String(body.entry || 'apply_page'),
      stepReached: 'email',
      analyticsConsent: Boolean(body.analyticsConsent),
      country: await requestCountry(),
      utmSource: attribution.utmSource || '',
      utmMedium: attribution.utmMedium || '',
      utmCampaign: attribution.utmCampaign || '',
      utmTerm: attribution.utmTerm || '',
      utmContent: attribution.utmContent || '',
      lastUtmSource: attribution.lastUtmSource || '',
      lastUtmMedium: attribution.lastUtmMedium || '',
      lastUtmCampaign: attribution.lastUtmCampaign || '',
      referrer: attribution.referrer || '',
      landingPage: attribution.landingPage || '',
      lastBlogPost: attribution.lastBlogPost || '',
      device: attribution.device || '',
    },
  })
  await setApplicationCookie(publicId)
  await captureServer(
    publicId,
    'lead_partial_saved',
    { applicationId: publicId, emailDomainType: emailDomainType(email) },
    Boolean(body.analyticsConsent),
  )
  const wantsJson = (request.headers.get('content-type') || '').includes('application/json')
  if (!wantsJson) {
    return NextResponse.redirect(new URL(`/apply?step=2&id=${publicId}`, request.url), 303)
  }
  return NextResponse.json({ id: publicId, recordId: doc.id })
}

async function save(body: Body) {
  const doc = await findByPublicId(String(body.id || ''))
  if (!doc) return NextResponse.json({ error: 'We could not find that application. Start again.' }, { status: 404 })
  if (doc.status !== 'partial') return NextResponse.json({ id: doc.publicId, status: doc.status, next: resultPath(doc) })
  const payload = await getPayloadClient()
  await payload.update({
    collection: 'applications',
    id: doc.id,
    overrideAccess: true,
    data: pickWritable(body),
  })
  return NextResponse.json({ ok: true })
}

async function complete(body: Body) {
  const doc = await findByPublicId(String(body.id || ''))
  if (!doc) return NextResponse.json({ error: 'Start again so we have your email.' }, { status: 404 })
  const data = pickWritable(body)
  if (!data.firstName || !data.lastName) {
    return NextResponse.json({ error: 'Add your first and last name.' }, { status: 400 })
  }
  const phone = String(data.phone || '').replace(/[^\d+]/g, '')
  if (phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ error: 'Add a mobile number so we can confirm the call.' }, { status: 400 })
  }
  if (!data.consentSms) {
    return NextResponse.json({ error: 'Consent to be contacted about this application is required.' }, { status: 400 })
  }
  const website = data.website ? normalizeWebsite(String(data.website)) : ''
  if (data.website && !website) {
    return NextResponse.json({ error: 'That website does not look right. Try acme.com.' }, { status: 400 })
  }
  const settings = await getSettings()
  const answers = {
    offerType: String(data.offerType || doc.offerType || ''),
    offerOther: String(data.offerOther || doc.offerOther || ''),
    pricePoint: String(data.pricePoint || doc.pricePoint || ''),
    monthlyRevenue: String(data.monthlyRevenue || doc.monthlyRevenue || ''),
    monthlyConversations: String(data.monthlyConversations || doc.monthlyConversations || ''),
    timeline: String(data.timeline || doc.timeline || ''),
    investment: String(data.investment || doc.investment || ''),
    needs: (Array.isArray(data.needs) ? data.needs : Array.isArray(doc.needs) ? doc.needs : []) as string[],
  }
  const scored = scoreApplication(answers)
  const payload = await getPayloadClient()
  const updated = await payload.update({
    collection: 'applications',
    id: doc.id,
    overrideAccess: true,
    data: {
      ...data,
      phone,
      website,
      ...answers,
      investmentLabel: investmentLabel(answers.investment, {
        low: settings.bandLowLabel,
        mid: settings.bandMidLabel,
        high: settings.bandHighLabel,
      }),
      status: 'complete',
      score: scored.score,
      tier: scored.tier,
      reasons: scored.reasons,
      tags: scored.tags,
      scoringVersion: scored.scoringVersion,
      completedAt: new Date().toISOString(),
      stepReached: 'contact',
      priorityCall: scored.tier !== 'not_yet',
    },
  })
  const next = resultPath(updated as never)
  await notifyApplication(updated as never, 'complete')
  await notifyApplicant(updated as never, 'complete')
  const consent = Boolean(data.analyticsConsent || doc.analyticsConsent)
  await captureServer(String(doc.publicId), 'application_submitted', {
    score: scored.score,
    tier: scored.tier,
    offerType: answers.offerType,
    pricePoint: answers.pricePoint,
    revenue: answers.monthlyRevenue,
    conversations: answers.monthlyConversations,
    timeline: answers.timeline,
    investment: answers.investment,
  }, consent)
  await captureServer(String(doc.publicId), 'route_assigned', { tier: scored.tier, reasons: scored.reasons }, consent)
  return NextResponse.json({ ok: true, tier: scored.tier, score: scored.score, next })
}

async function booked(body: Body) {
  const doc = await findByPublicId(String(body.id || ''))
  if (!doc) return NextResponse.json({ error: 'Unknown application' }, { status: 404 })
  const settings = await getSettings()
  const eventType = body.eventType === 'fit' || doc.tier === 'review' || body.override === true ? 'fit' : 'strategy'
  if (doc.tier === 'qualified') {
    // qualified leads stay on the strategy calendar unless they were explicitly reviewing
  }
  const liveUrl = eventType === 'fit' ? settings.calendlyFitUrl : settings.calendlyStrategyUrl
  if (body.preview && isCalendlyUrl(liveUrl)) {
    return NextResponse.json({ error: 'The live calendar is connected. Book there.' }, { status: 400 })
  }
  const startAt = body.preview
    ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    : typeof body.meetingStartAt === 'string'
      ? body.meetingStartAt
      : undefined
  const payload = await getPayloadClient()
  const updated = await payload.update({
    collection: 'applications',
    id: doc.id,
    overrideAccess: true,
    data: {
      status: 'booked',
      bookingStatus: 'scheduled',
      eventType: doc.tier === 'qualified' && !body.preview ? 'strategy' : eventType,
      calendlyEventUri: String(body.eventUri || ''),
      calendlyInviteeUri: String(body.inviteeUri || ''),
      bookedAt: new Date().toISOString(),
      meetingStartAt: startAt,
      priorityCall: false,
    },
  })
  await notifyApplication(updated as never, 'booked')
  await notifyApplicant(updated as never, 'booked')
  const leadTime = startAt ? (new Date(startAt).getTime() - Date.now()) / 36e5 : undefined
  await captureServer(
    String(doc.publicId),
    'call_booked',
    { event_type: eventType, lead_time_hours: leadTime, source: body.preview ? 'preview' : 'embed' },
    Boolean(doc.analyticsConsent),
  )
  return NextResponse.json({ ok: true, next: `/apply/confirmed?id=${doc.publicId}` })
}

async function waitlist(body: Body) {
  const doc = await findByPublicId(String(body.id || ''))
  if (!doc) return NextResponse.json({ error: 'Unknown application' }, { status: 404 })
  const payload = await getPayloadClient()
  await payload.update({
    collection: 'applications',
    id: doc.id,
    overrideAccess: true,
    data: { waitlist: true, status: 'nurture', nurtureReason: String(body.reason || doc.tier || 'not_yet') },
  })
  await captureServer(String(doc.publicId), 'waitlist_joined', { reason: body.reason || doc.tier }, Boolean(doc.analyticsConsent))
  return NextResponse.json({ ok: true })
}

async function abandon(body: Body) {
  const doc = await findByPublicId(String(body.id || ''))
  if (!doc) return NextResponse.json({ ok: true })
  await captureServer(
    String(doc.publicId),
    'apply_abandoned',
    { last_step: body.step || doc.stepReached },
    Boolean(doc.analyticsConsent),
  )
  return NextResponse.json({ ok: true })
}

async function magnet(body: Body) {
  const email = String(body.email || '').trim().toLowerCase()
  if (!isValidEmail(email) || isDisposableEmail(email)) {
    return NextResponse.json({ error: 'Use a real email address.' }, { status: 400 })
  }
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'applications',
    where: { email: { equals: email } },
    sort: '-createdAt',
    limit: 1,
    overrideAccess: true,
  })
  const resource = String(body.resource || '')
  let doc = existing.docs[0]
  if (!doc) {
    doc = await payload.create({
      collection: 'applications',
      overrideAccess: true,
      data: {
        publicId: randomUUID(),
        email,
        status: 'nurture',
        source: 'lead_magnet',
        resourceSlug: resource,
        landingPage: String(body.page || ''),
        analyticsConsent: Boolean(body.analyticsConsent),
      },
    })
  } else if (!doc.resourceSlug) {
    doc = await payload.update({
      collection: 'applications',
      id: doc.id,
      overrideAccess: true,
      data: { resourceSlug: resource, source: doc.source || 'lead_magnet' },
    })
  }
  await notifyApplication(doc as never, 'magnet')
  await captureServer(String(doc.publicId || doc.id), 'lead_magnet_submitted', { resource, page: body.page }, Boolean(body.analyticsConsent))
  return NextResponse.json({ ok: true, id: doc.publicId })
}

async function careers(body: Body) {
  const email = String(body.email || '').trim().toLowerCase()
  if (!isValidEmail(email)) return NextResponse.json({ error: 'Add a real email.' }, { status: 400 })
  const payload = await getPayloadClient()
  const doc = await payload.create({
    collection: 'applications',
    overrideAccess: true,
    data: {
      publicId: randomUUID(),
      email,
      firstName: String(body.firstName || ''),
      lastName: String(body.lastName || ''),
      notes: String(body.notes || '').slice(0, 300),
      status: 'nurture',
      source: 'careers',
      offerType: 'other',
      offerOther: 'Careers enquiry',
    },
  })
  await notifyApplication(doc as never, 'careers')
  return NextResponse.json({ ok: true })
}

async function resume(id: string) {
  const doc = await findByPublicId(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    id: doc.publicId,
    status: doc.status,
    tier: doc.tier,
    stepReached: doc.stepReached,
    email: doc.email,
    firstName: doc.firstName,
    offerType: doc.offerType,
    offerOther: doc.offerOther,
    pricePoint: doc.pricePoint,
    monthlyRevenue: doc.monthlyRevenue,
    monthlyConversations: doc.monthlyConversations,
    salesSetup: doc.salesSetup,
    needs: doc.needs || [],
    timeline: doc.timeline,
    investment: doc.investment,
    next: doc.status === 'partial' ? null : resultPath(doc),
  })
}

async function ics(id: string) {
  const doc = await findByPublicId(id)
  if (!doc?.meetingStartAt) return NextResponse.json({ error: 'No meeting time yet.' }, { status: 404 })
  const start = new Date(String(doc.meetingStartAt))
  const end = new Date(start.getTime() + 30 * 60 * 1000)
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const summary = await answerSummary(doc)
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Chateaux Rouge//Application//EN',
    'BEGIN:VEVENT',
    `UID:${doc.publicId}@chateauxrouge`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    'SUMMARY:Chateaux Rouge sales call',
    `DESCRIPTION:${summary.replace(/\n/g, ' ')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="chateaux-rouge.ics"',
    },
  })
}

import { cookies, headers } from 'next/headers'
import { getPayloadClient } from './payload'
import {
  CONVERSATION_OPTIONS,
  INVESTMENT_VALUES,
  labelFor,
  NEED_OPTIONS,
  OFFER_OPTIONS,
  PRICE_OPTIONS,
  REVENUE_OPTIONS,
  SETUP_OPTIONS,
  TIMELINE_OPTIONS,
} from './options'
import { getSettings } from './settings'

export type ApplicationDoc = Record<string, unknown> & { id: number | string; publicId?: string }

const WRITABLE = [
  'offerType',
  'offerOther',
  'pricePoint',
  'monthlyRevenue',
  'monthlyConversations',
  'salesSetup',
  'needs',
  'timeline',
  'investment',
  'setupFee',
  'decisionMakers',
  'notes',
  'firstName',
  'lastName',
  'phone',
  'website',
  'company',
  'consentSms',
  'consentMarketing',
  'analyticsConsent',
  'stepReached',
] as const

export function pickWritable(input: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  for (const key of WRITABLE) {
    if (key in input) data[key] = input[key]
  }
  if (typeof data.notes === 'string') data.notes = data.notes.slice(0, 300)
  if (typeof data.offerOther === 'string') data.offerOther = data.offerOther.slice(0, 160)
  return data
}

export async function findByPublicId(publicId: string): Promise<ApplicationDoc | null> {
  if (!publicId) return null
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'applications',
    where: { publicId: { equals: publicId } },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  return (result.docs[0] as unknown as ApplicationDoc | undefined) || null
}

export async function requestCountry(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get('x-vercel-ip-country') || headerStore.get('cf-ipcountry') || ''
}

export async function setApplicationCookie(publicId: string) {
  const jar = await cookies()
  jar.set('cr_application', publicId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function investmentLabel(
  value: string,
  bands: { low: string; mid: string; high: string; top: string },
): string {
  if (value === INVESTMENT_VALUES.under3k) return 'Under $3,000/mo'
  if (value === INVESTMENT_VALUES.band1) return bands.low
  if (value === INVESTMENT_VALUES.band2) return bands.mid
  if (value === INVESTMENT_VALUES.band3) return bands.high
  if (value === INVESTMENT_VALUES.band4) return bands.top
  // Legacy values keep the labels they were saved under, not the shifted bands.
  if (value === INVESTMENT_VALUES.underLow) return 'Under $5,000/mo'
  if (value === INVESTMENT_VALUES.mid) return bands.mid
  if (value === INVESTMENT_VALUES.high) return '$10,000/mo or more'
  if (value === INVESTMENT_VALUES.performance) return 'Performance only (commission only)'
  if (value === INVESTMENT_VALUES.unsure) return 'Not sure yet'
  return value
}

export async function answerSummary(doc: ApplicationDoc): Promise<string> {
  const settings = await getSettings()
  const needs = Array.isArray(doc.needs) ? (doc.needs as string[]) : []
  return [
    labelFor(OFFER_OPTIONS, String(doc.offerType || '')),
    doc.offerOther,
    labelFor(PRICE_OPTIONS, String(doc.pricePoint || '')),
    labelFor(REVENUE_OPTIONS, String(doc.monthlyRevenue || '')),
    labelFor(CONVERSATION_OPTIONS, String(doc.monthlyConversations || '')),
    labelFor(SETUP_OPTIONS, String(doc.salesSetup || '')),
    needs.map((need) => labelFor(NEED_OPTIONS, need)).join(', '),
    labelFor(TIMELINE_OPTIONS, String(doc.timeline || '')),
    doc.investmentLabel || investmentLabel(String(doc.investment || ''), {
      low: settings.bandLowLabel,
      mid: settings.bandMidLabel,
      high: settings.bandHighLabel,
      top: settings.bandTopLabel,
    }),
  ]
    .filter((part) => typeof part === 'string' && part.trim())
    .join(' | ')
}

export function resultPath(doc: ApplicationDoc, options?: { discoveryCallEnabled?: boolean }): string {
  const id = String(doc.publicId || '')
  if (doc.status === 'booked') return `/apply/confirmed?id=${id}`
  if (doc.tier === 'not_yet' || doc.status === 'nurture') return `/apply/next-steps?id=${id}`
  if (doc.tier === 'review') {
    return options?.discoveryCallEnabled ? `/apply/book?id=${id}&type=fit` : `/apply/next-steps?id=${id}&path=guide`
  }
  if (doc.tier === 'qualified') return `/apply/book?id=${id}`
  return `/apply?id=${id}`
}

export function isCalendlyUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && (parsed.hostname === 'calendly.com' || parsed.hostname.endsWith('.calendly.com'))
  } catch {
    return false
  }
}

const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit = 30, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((time) => now - time < windowMs)
  recent.push(now)
  hits.set(key, recent)
  return recent.length <= limit
}

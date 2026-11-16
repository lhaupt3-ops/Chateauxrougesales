import { emailShell, sendEmail } from './email'
import {
  CONVERSATION_OPTIONS,
  labelFor,
  NEED_OPTIONS,
  OFFER_OPTIONS,
  PRICE_OPTIONS,
  REVENUE_OPTIONS,
  SETUP_OPTIONS,
  TIMELINE_OPTIONS,
} from './options'
import { absoluteUrl } from './site'
import type { ApplicationDoc } from './apply-server'
import { getSettings } from './settings'

function line(label: string, value: unknown): string {
  if (value == null || value === '') return ''
  const text = Array.isArray(value) ? value.join(', ') : String(value)
  return `${label}: ${text}`
}

export async function notifyApplication(doc: ApplicationDoc, kind: 'complete' | 'booked' | 'magnet' | 'careers') {
  const settings = await getSettings()
  const to = process.env.NOTIFY_EMAIL || settings.notifyEmail
  const name = [doc.firstName, doc.lastName].filter(Boolean).join(' ') || String(doc.email || 'Lead')
  const offer = labelFor(OFFER_OPTIONS, String(doc.offerType || ''))
  const price = labelFor(PRICE_OPTIONS, String(doc.pricePoint || ''))
  const revenue = labelFor(REVENUE_OPTIONS, String(doc.monthlyRevenue || ''))
  const adminUrl = absoluteUrl(`/admin/collections/applications/${doc.id}`)
  const reasons = Array.isArray(doc.reasons) ? (doc.reasons as string[]).join('\n') : ''
  const subject =
    kind === 'booked'
      ? `[Booked] ${name}`
      : kind === 'magnet'
        ? `[Magnet] ${doc.email}`
        : kind === 'careers'
          ? `[Careers] ${name}`
          : `[${String(doc.tier || 'lead')}] New application: ${name}, ${offer}, ${price}, ${revenue}`

  const text = [
    subject,
    '',
    line('Email', doc.email),
    line('Phone', doc.phone),
    line('Website', doc.website),
    line('Offer', offer),
    line('Other', doc.offerOther),
    line('Price', price),
    line('Revenue', revenue),
    line('Conversations', labelFor(CONVERSATION_OPTIONS, String(doc.monthlyConversations || ''))),
    line('Setup', labelFor(SETUP_OPTIONS, String(doc.salesSetup || ''))),
    line('Needs', Array.isArray(doc.needs) ? (doc.needs as string[]).map((need) => labelFor(NEED_OPTIONS, need)).join(', ') : ''),
    line('Timeline', labelFor(TIMELINE_OPTIONS, String(doc.timeline || ''))),
    line('Investment', doc.investmentLabel || doc.investment),
    line('Score', doc.score),
    line('Tier', doc.tier),
    line('Meeting', doc.meetingStartAt),
    '',
    'Reasons',
    reasons,
    '',
    line('Landing page', doc.landingPage),
    line('Last post', doc.lastBlogPost),
    line('Source', doc.utmSource),
    line('Campaign', doc.utmCampaign),
    line('Referrer', doc.referrer),
    '',
    adminUrl,
  ]
    .filter(Boolean)
    .join('\n')

  await sendEmail({
    to,
    from: settings.resendFrom,
    subject,
    text,
    html: emailShell(`<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">${escapeHtml(text)}</pre>`),
  })
}

export async function notifyApplicant(doc: ApplicationDoc, kind: 'complete' | 'booked' | 'partial' | 'unbooked') {
  const settings = await getSettings()
  const email = String(doc.email || '')
  if (!email) return
  const id = String(doc.publicId || '')
  const first = String(doc.firstName || 'there')
  const link =
    kind === 'partial'
      ? absoluteUrl(`/apply?id=${id}`)
      : kind === 'booked'
        ? absoluteUrl(`/apply/confirmed?id=${id}`)
        : absoluteUrl(doc.tier === 'not_yet' ? `/apply/next-steps?id=${id}` : `/apply/book?id=${id}`)

  const subject =
    kind === 'booked'
      ? 'You are booked with Chateaux Rouge'
      : kind === 'partial'
        ? 'Finish your Chateaux Rouge application'
        : kind === 'unbooked'
          ? 'Your Chateaux Rouge time is still open'
          : 'Your Chateaux Rouge fit result'

  const text = `Hi ${first},\n\n${
    kind === 'booked'
      ? `You are booked${doc.meetingStartAt ? ` for ${doc.meetingStartAt}` : ''}. Lock it in here: ${link}`
      : kind === 'partial'
        ? `You started an application and stopped. It is saved. Continue here: ${link}`
        : kind === 'unbooked'
          ? `Your application is in, and a time is still open. Pick one here: ${link}`
          : `Your result is ready. Open it here: ${link}`
  }\n\nChateaux Rouge`

  await sendEmail({
    to: email,
    from: settings.resendFrom,
    subject,
    text,
    html: emailShell(`<p style="font-family:Georgia,serif;font-size:18px;line-height:1.5;">${escapeHtml(text).replace(/\n/g, '<br/>')}</p>`),
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

import type { ApplicationDoc } from './apply-server'
import { renderEmail, type EmailRow } from './email-layout'
import { FLAGSHIP_TITLE, SCORECARD_SLUG, guideTarget, type RequestedGuide } from './guide-link'
import { explainReasons } from './reason-labels'
import { absoluteUrl } from './site'
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

export type ApplicantKind = 'complete' | 'booked' | 'partial' | 'unbooked' | 'waitlist' | 'magnet'
export type OwnerKind = 'complete' | 'booked' | 'magnet' | 'careers'

export type BuiltEmail = {
  subject: string
  html: string
  text: string
  replyTo?: string
}

function inviteOthers(doc: ApplicationDoc): string {
  const who = String(doc.decisionMakers || '')
  if (!who || who === 'just_me') return ''
  return ' Bring the other person who would decide. The call is more useful if they can hear it.'
}

const TIER_LABELS: Record<string, string> = {
  qualified: 'Qualified',
  review: 'Review',
  not_yet: 'Not yet',
}

export function applicantEmail(doc: ApplicationDoc, kind: ApplicantKind, requested?: RequestedGuide): BuiltEmail {
  const first = String(doc.firstName || 'there')
  const id = String(doc.publicId || '')
  const when = formatWhen(doc.meetingStartAt)
  const guide = requested?.slug
    ? guideTarget(requested.slug, [{ slug: requested.slug, title: requested.title }], id)
    : guideTarget(String(doc.resourceSlug || ''), [], id)
  const link =
    kind === 'partial'
      ? absoluteUrl(`/apply?id=${id}`)
      : kind === 'booked'
        ? absoluteUrl(`/apply/confirmed?id=${id}`)
        : kind === 'waitlist'
          ? absoluteUrl('/pricing')
          : kind === 'magnet'
            ? absoluteUrl(guide.path)
            : absoluteUrl(doc.tier === 'not_yet' ? `/apply/next-steps?id=${id}` : `/apply/book?id=${id}`)

  const copy = {
    complete: {
      subject: 'Your Chateaux Rouge fit result',
      preheader: 'Your result is ready. Open it when you have a minute.',
      eyebrow: 'Application',
      heading: `Your result is ready, ${first}.`,
      paragraphs: ['The questions are scored. Open the result for the next step. If the fit is there, you can book. If it is not, the page says so plainly.'],
      cta: 'See my result',
    },
    booked: {
      subject: 'You are booked with Chateaux Rouge',
      preheader: when ? `Your call is on the calendar for ${when}.` : 'Your call is booked. Add it to your calendar.',
      eyebrow: 'Booking',
      heading: `You are booked, ${first}.`,
      paragraphs: [
        when
          ? `The call is set for ${when}. It is 30 minutes. The point is clarity, and not a fit is a fine outcome. Any terms are in writing before you pay.${inviteOthers(doc)}`
          : `The time is in your Calendly email. It is 30 minutes. Not a fit is a fine outcome. Any terms are in writing before you pay.${inviteOthers(doc)}`,
      ],
      cta: 'Open the confirmation',
    },
    partial: {
      subject: 'Finish your Chateaux Rouge application',
      preheader: 'Your application is saved. It takes about a minute to finish.',
      eyebrow: 'Application',
      heading: 'Your application is still open.',
      paragraphs: [`Hi ${first}. You started and stopped. The answers you already gave are saved.`],
      cta: 'Continue the application',
    },
    unbooked: {
      subject: 'Your Chateaux Rouge time is still open',
      preheader: 'A time is still open on the calendar.',
      eyebrow: 'Booking',
      heading: 'A time is still open.',
      paragraphs: [`Hi ${first}. Your application is in. Pick a time that you will actually make.`],
      cta: 'Pick a time',
    },
    waitlist: {
      subject: 'You are on the Chateaux Rouge list',
      preheader: 'We will write when the fit is closer.',
      eyebrow: 'Waitlist',
      heading: `You are on the list, ${first}.`,
      paragraphs: ['We will write when the offer, the revenue, or the lead flow has moved. You can ignore the note. We will not chase.'],
      cta: 'Read how we charge',
    },
    magnet: guide.slug === SCORECARD_SLUG
      ? {
          subject: 'Your closer readiness scorecard',
          preheader: 'One page. Eight yes or no checks. Print it or keep the PDF.',
          eyebrow: 'Scorecard',
          heading: 'Your scorecard is ready.',
          paragraphs: ['The guide stays open on the site. This note is the one-page scorecard: mark yes or no, then read what the count means. Two or more nos means fix those before you hire a closer.'],
          cta: 'Open the scorecard',
        }
      : {
          subject: 'Your Chateaux Rouge guide',
          preheader: 'The guide is linked below.',
          eyebrow: 'Guide',
          heading: 'Your guide is ready.',
          paragraphs: [`${guide.title || FLAGSHIP_TITLE} is linked below.`],
          cta: 'Open the guide',
        },
  }[kind]

  const rendered = renderEmail({
    preheader: copy.preheader,
    eyebrow: copy.eyebrow,
    heading: copy.heading,
    paragraphs: copy.paragraphs,
    cta: { label: copy.cta, href: link },
  })
  return { subject: copy.subject, ...rendered }
}

export function ownerEmail(doc: ApplicationDoc, kind: OwnerKind, requested?: RequestedGuide): BuiltEmail {
  const name = [doc.firstName, doc.lastName].filter(Boolean).join(' ') || String(doc.email || 'Lead')
  const offer = labelFor(OFFER_OPTIONS, String(doc.offerType || ''))
  const price = labelFor(PRICE_OPTIONS, String(doc.pricePoint || ''))
  const subject =
    kind === 'booked'
      ? `Call booked with ${name}`
      : kind === 'magnet'
        ? (requested?.slug || doc.resourceSlug) === SCORECARD_SLUG
          ? `Scorecard request from ${doc.email || name}`
          : `Guide request from ${doc.email || name}`
        : kind === 'careers'
          ? `Careers enquiry from ${name}`
          : `New application from ${name}`
  const heading =
    kind === 'booked' ? `${name} booked a call` : kind === 'magnet' ? ((requested?.slug || doc.resourceSlug) === SCORECARD_SLUG ? 'A scorecard was requested' : 'A guide was requested') : kind === 'careers' ? 'A careers enquiry arrived' : `New application from ${name}`
  const rows = compactRows([
    ['Email', doc.email],
    ['Phone', doc.phone],
    ['Website', doc.website || doc.company],
    ['Offer', offer && doc.offerOther ? `${offer} (${doc.offerOther})` : offer || doc.offerOther],
    ['Price', price],
    ['Revenue', labelFor(REVENUE_OPTIONS, String(doc.monthlyRevenue || ''))],
    ['Conversations', labelFor(CONVERSATION_OPTIONS, String(doc.monthlyConversations || ''))],
    ['Setup', labelFor(SETUP_OPTIONS, String(doc.salesSetup || ''))],
    ['Needs', Array.isArray(doc.needs) ? (doc.needs as string[]).map((need) => labelFor(NEED_OPTIONS, need)).filter(Boolean).join(', ') : ''],
    ['Timeline', labelFor(TIMELINE_OPTIONS, String(doc.timeline || ''))],
    ['Investment', doc.investmentLabel || doc.investment],
    ['Score', doc.score],
    ['Tier', doc.tier ? TIER_LABELS[String(doc.tier)] || String(doc.tier) : ''],
    ['Meeting', formatWhen(doc.meetingStartAt)],
    ['Notes', doc.notes],
    ['Landing page', doc.landingPage],
    ['Last post', doc.lastBlogPost],
    ['Source', doc.utmSource],
    ['Campaign', doc.utmCampaign],
  ])
  const reasons = explainReasons(doc.reasons)
  const adminUrl = absoluteUrl(`/admin/collections/applications/${doc.id}`)
  const rendered = renderEmail({
    preheader: subject,
    eyebrow: 'Sales desk',
    heading,
    paragraphs: reasons.length ? ['How the score was built:'] : [],
    rows,
    bullets: reasons,
    cta: { label: 'Open in admin', href: adminUrl },
  })
  const replyTo = typeof doc.email === 'string' && doc.email.includes('@') ? doc.email : undefined
  return { subject, replyTo, ...rendered }
}

function compactRows(pairs: [string, unknown][]): EmailRow[] {
  return pairs.flatMap(([label, value]) => {
    if (value == null || value === '') return []
    return [{ label, value: String(value) }]
  })
}

function formatWhen(value: unknown): string {
  if (value == null || value === '') return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC'
}

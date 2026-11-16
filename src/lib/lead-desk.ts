import {
  CONVERSATION_OPTIONS,
  INVESTMENT_VALUES,
  NEED_OPTIONS,
  OFFER_OPTIONS,
  PRICE_OPTIONS,
  REVENUE_OPTIONS,
  SETUP_FEE_OPTIONS,
  SETUP_OPTIONS,
  TIMELINE_OPTIONS,
  labelFor,
  type Option,
} from './options'

const LEGACY_INVESTMENT: Option[] = [
  { value: INVESTMENT_VALUES.under3k, label: 'Under $3,000/mo' },
  { value: INVESTMENT_VALUES.band1, label: '$3,000–$5,000/mo' },
  { value: INVESTMENT_VALUES.band2, label: '$5,000–$10,000/mo' },
  { value: INVESTMENT_VALUES.band3, label: '$10,000–$20,000/mo' },
  { value: INVESTMENT_VALUES.band4, label: '$20,000+/mo' },
  { value: INVESTMENT_VALUES.underLow, label: 'Under $5,000/mo' },
  { value: INVESTMENT_VALUES.mid, label: '$5,000–$10,000/mo' },
  { value: INVESTMENT_VALUES.high, label: '$10,000/mo or more' },
  { value: INVESTMENT_VALUES.performance, label: 'Performance only' },
  { value: INVESTMENT_VALUES.unsure, label: 'Not sure yet' },
]

export function displayName(first?: string | null, last?: string | null, email?: string | null): string {
  const name = [first, last].map((part) => (part || '').trim()).filter(Boolean).join(' ')
  return name || (email || '').trim() || 'Untitled'
}

export function scoreBandLabel(tier?: string | null): string {
  if (tier === 'qualified') return 'Qualified'
  if (tier === 'review') return 'Review'
  if (tier === 'not_yet') return 'Not yet'
  return ''
}

export function answerLabel(options: Option[], value: unknown): string {
  if (Array.isArray(value)) {
    const labels = value.map((item) => labelFor(options, String(item))).filter(Boolean)
    return labels.join(', ')
  }
  if (value == null || value === '') return 'Not answered'
  return labelFor(options, String(value)) || String(value)
}

export type FitGroup = { title: string; rows: { question: string; answer: string }[] }

export function fitGroups(data: Record<string, unknown>): FitGroup[] {
  return [
    {
      title: 'Business',
      rows: [
        { question: 'Company', answer: text(data.company) },
        { question: 'Website', answer: text(data.website) },
        { question: 'Offer', answer: answerLabel(OFFER_OPTIONS, data.offerType) },
        { question: 'Offer, in their words', answer: text(data.offerOther) },
      ],
    },
    {
      title: 'Offer',
      rows: [{ question: 'Price point', answer: answerLabel(PRICE_OPTIONS, data.pricePoint) }],
    },
    {
      title: 'Revenue',
      rows: [{ question: 'Monthly revenue', answer: answerLabel(REVENUE_OPTIONS, data.monthlyRevenue) }],
    },
    {
      title: 'Lead flow',
      rows: [
        { question: 'Sales conversations a month', answer: answerLabel(CONVERSATION_OPTIONS, data.monthlyConversations) },
        { question: 'Who runs sales today', answer: answerLabel(SETUP_OPTIONS, data.salesSetup) },
      ],
    },
    {
      title: 'Setup-fee readiness',
      rows: [
        { question: 'Can they pay a setup fee?', answer: answerLabel(SETUP_FEE_OPTIONS, data.setupFee) },
        { question: 'Older monthly budget', answer: data.investment ? answerLabel(LEGACY_INVESTMENT, data.investment) : 'Not asked' },
      ],
    },
    {
      title: 'Goals',
      rows: [
        { question: 'What they want', answer: answerLabel(NEED_OPTIONS, data.needs) },
        { question: 'Timeline', answer: answerLabel(TIMELINE_OPTIONS, data.timeline) },
      ],
    },
  ]
}

export function nextAction(input: {
  status?: string | null
  tier?: string | null
  meetingStartAt?: string | null
  nextFollowUpAt?: string | null
  outcome?: string | null
  now?: Date
}): string {
  if (input.outcome === 'won') return 'No further action. The outcome is won.'
  if (input.outcome === 'lost') return 'No further action. The outcome is lost.'
  if (input.outcome === 'no_show' || input.status === 'no_show') return 'They missed the call. Rebook or record a lost outcome.'
  const now = input.now ?? new Date()
  if (input.nextFollowUpAt && new Date(input.nextFollowUpAt).getTime() <= now.getTime()) {
    return 'The follow-up date has passed. Contact them or move the date.'
  }
  if (input.status === 'partial') return 'The application is unfinished. Use the partial follow-up, or call if you already know them.'
  if (input.status === 'booked' || input.meetingStartAt) return 'A call is booked. Prepare from the fit answers and write notes after.'
  if (input.tier === 'qualified') return 'Qualified and not booked. Send the strategy-call link.'
  if (input.tier === 'review') return 'Send the free guide. Offer a call only when discovery calls are switched on.'
  if (input.tier === 'not_yet' || input.status === 'nurture') return 'Not a strategy call yet. The guide and nurture path apply. Set a follow-up date if you will check back.'
  return 'Read the fit answers and set a next follow-up date.'
}

export function sequenceActivity(log: unknown): { at: string; text: string }[] {
  if (!Array.isArray(log)) return []
  return log
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as { key?: unknown; at?: unknown; sent?: unknown }
      const at = typeof row.at === 'string' ? row.at : ''
      if (!at) return null
      const key = typeof row.key === 'string' ? row.key : 'email'
      const sent = row.sent === false ? 'Not sent' : 'Sent'
      return { at, text: `${sent} ${key}` }
    })
    .filter((item): item is { at: string; text: string } => Boolean(item))
}

export function bookingFromApplication(doc: Record<string, unknown>): {
  who: string
  email: string
  when: string | null
  status: 'scheduled' | 'canceled' | 'no_show' | 'completed'
  calendlyUrl: string
} | null {
  const when = typeof doc.meetingStartAt === 'string' ? doc.meetingStartAt : null
  const status = typeof doc.status === 'string' ? doc.status : ''
  const bookingStatus = typeof doc.bookingStatus === 'string' ? doc.bookingStatus : ''
  const outcome = typeof doc.outcome === 'string' ? doc.outcome : ''
  const relevant = Boolean(when) || status === 'booked' || bookingStatus === 'scheduled' || bookingStatus === 'canceled' || status === 'no_show'
  if (!relevant) return null
  let callStatus: 'scheduled' | 'canceled' | 'no_show' | 'completed' = 'scheduled'
  if (bookingStatus === 'canceled') callStatus = 'canceled'
  else if (outcome === 'no_show' || status === 'no_show') callStatus = 'no_show'
  else if (outcome === 'won') callStatus = 'completed'
  return {
    who: textOrEmpty(doc.name) || displayName(textOrEmpty(doc.firstName), textOrEmpty(doc.lastName), textOrEmpty(doc.email)),
    email: textOrEmpty(doc.email),
    when,
    status: callStatus,
    calendlyUrl: textOrEmpty(doc.calendlyEventUri),
  }
}

export function subscriberFromApplication(doc: Record<string, unknown>): {
  email: string
  name: string
  kind: 'waitlist' | 'guide' | 'marketing'
  unsubscribed: boolean
  source: string
} | null {
  const email = textOrEmpty(doc.email)
  if (!email) return null
  const waitlist = doc.waitlist === true
  const guide = doc.source === 'lead_magnet' || Boolean(doc.resourceSlug)
  const marketing = doc.marketingConsent === true || doc.consentMarketing === true
  if (!waitlist && !guide && !marketing) return null
  const kind = waitlist ? 'waitlist' : guide ? 'guide' : 'marketing'
  return {
    email,
    name: displayName(textOrEmpty(doc.firstName), textOrEmpty(doc.lastName), email),
    kind,
    unsubscribed: doc.emailUnsubscribed === true,
    source: textOrEmpty(doc.source),
  }
}

function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return 'Not answered'
  return value.trim()
}

function textOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

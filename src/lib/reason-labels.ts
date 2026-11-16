import { labelFor, CONVERSATION_OPTIONS, INVESTMENT_VALUES, PRICE_OPTIONS, REVENUE_OPTIONS, TIMELINE_OPTIONS, type Option } from './options'

const FACTS: Record<string, { title: string; options?: Option[] }> = {
  price: { title: 'Price', options: PRICE_OPTIONS },
  revenue: { title: 'Monthly revenue', options: REVENUE_OPTIONS },
  conversations: { title: 'Sales conversations', options: CONVERSATION_OPTIONS },
  timeline: { title: 'Timeline', options: TIMELINE_OPTIONS },
  investment: {
    title: 'Investment',
    options: [
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
    ],
  },
}

const NOTES: Record<string, string> = {
  'hard:price_under_1000': 'Hard rule: the offer is under $1,000',
  'hard:b2b_low_price_review': 'Hard rule: a B2B offer under $1,000 is held for review',
  'hard:pre_revenue_and_no_conversations': 'Hard rule: pre-revenue, with no sales conversations',
  'hard:investment_under_3000': 'Hard rule: the budget is under $3,000 a month',
  'hard:flagged_offer_review': 'Hard rule: the offer needs a person to review it',
  'note:flagged_offer_already_not_yet': 'The offer was flagged, and the score was already not yet',
  'modifier:researching_demoted': 'The timeline is research only, so a qualified score moved to review',
  'tag:lead_gen_required': 'They asked for appointment setting and have no conversations yet',
}

export function explainReason(reason: string): string {
  if (NOTES[reason]) return NOTES[reason]
  const scored = reason.match(/^([a-z]+):([^:]+):\+(\d+)$/)
  if (!scored) return reason.replace(/[_:+]/g, ' ').replace(/\s+/g, ' ').trim()
  const [, key, value, points] = scored
  const fact = FACTS[key]
  const title = fact?.title || key
  if (value === 'missing') return `${title}: not answered (+${points})`
  const label = fact?.options ? labelFor(fact.options, value) : value
  return `${title}: ${label} (+${points})`
}

export function explainReasons(reasons: unknown): string[] {
  if (!Array.isArray(reasons)) return []
  return reasons.map((reason) => explainReason(String(reason))).filter(Boolean)
}

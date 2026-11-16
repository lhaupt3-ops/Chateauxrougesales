import { INVESTMENT_VALUES } from './options'

export const SCORING_VERSION = '2'

export type ApplicationAnswers = {
  offerType?: string | null
  offerOther?: string | null
  pricePoint?: string | null
  monthlyRevenue?: string | null
  monthlyConversations?: string | null
  timeline?: string | null
  investment?: string | null
  needs?: string[] | null
}

export type Tier = 'qualified' | 'review' | 'not_yet'

export type ScoreResult = {
  score: number
  tier: Tier
  reasons: string[]
  tags: string[]
  scoringVersion: string
}

const PRICE_POINTS: Record<string, number> = {
  under_1000: 0,
  '1000_2999': 2,
  '3000_9999': 4,
  '10000_24999': 5,
  '25000_plus': 5,
}

const REVENUE_POINTS: Record<string, number> = {
  pre_revenue: 0,
  under_10k: 1,
  '10k_30k': 3,
  '30k_100k': 4,
  '100k_250k': 5,
  '250k_plus': 5,
}

const CONVERSATION_POINTS: Record<string, number> = {
  none: 0,
  '1_10': 1,
  '11_30': 3,
  '31_80': 4,
  '80_plus': 4,
}

const TIMELINE_POINTS: Record<string, number> = {
  asap: 3,
  this_month: 3,
  '1_3_months': 1,
  researching: 0,
}

const INVESTMENT_POINTS: Record<string, number> = {
  [INVESTMENT_VALUES.under3k]: 0,
  [INVESTMENT_VALUES.band1]: 2,
  [INVESTMENT_VALUES.band2]: 3,
  [INVESTMENT_VALUES.band3]: 3,
  [INVESTMENT_VALUES.band4]: 3,
  [INVESTMENT_VALUES.underLow]: 1,
  [INVESTMENT_VALUES.mid]: 3,
  [INVESTMENT_VALUES.high]: 3,
  [INVESTMENT_VALUES.performance]: 1,
  [INVESTMENT_VALUES.unsure]: 1,
}

const FLAGGED = [
  /mlm/i,
  /multi-?level/i,
  /crypto/i,
  /bitcoin/i,
  /guaranteed returns/i,
  /casino/i,
  /gambling/i,
  /payday/i,
  /pyramid/i,
  /escort/i,
  /\bporn/i,
  /firearm/i,
  /get-rich/i,
]

function points(table: Record<string, number>, value: string | null | undefined, reasons: string[], key: string): number {
  if (!value || !(value in table)) {
    reasons.push(`${key}:missing:+0`)
    return 0
  }
  const scored = table[value] ?? 0
  reasons.push(`${key}:${value}:+${scored}`)
  return scored
}

export function isFlaggedOffer(text: string | null | undefined): boolean {
  if (!text) return false
  return FLAGGED.some((pattern) => pattern.test(text))
}

export function scoreApplication(answers: ApplicationAnswers): ScoreResult {
  const reasons: string[] = []
  const tags: string[] = []
  const score =
    points(PRICE_POINTS, answers.pricePoint, reasons, 'price') +
    points(REVENUE_POINTS, answers.monthlyRevenue, reasons, 'revenue') +
    points(CONVERSATION_POINTS, answers.monthlyConversations, reasons, 'conversations') +
    points(TIMELINE_POINTS, answers.timeline, reasons, 'timeline') +
    points(INVESTMENT_POINTS, answers.investment, reasons, 'investment')

  let tier: Tier = score >= 13 ? 'qualified' : score >= 8 ? 'review' : 'not_yet'

  const priceTooLow = answers.pricePoint === 'under_1000'
  const noMotion = answers.monthlyRevenue === 'pre_revenue' && answers.monthlyConversations === 'none'

  if (priceTooLow && answers.offerType !== 'b2b') {
    tier = 'not_yet'
    reasons.push('hard:price_under_1000')
  } else if (priceTooLow && answers.offerType === 'b2b') {
    tier = 'review'
    reasons.push('hard:b2b_low_price_review')
  }

  if (noMotion) {
    tier = 'not_yet'
    reasons.push('hard:pre_revenue_and_no_conversations')
  }

  if (answers.investment === INVESTMENT_VALUES.under3k) {
    tier = 'not_yet'
    reasons.push('hard:investment_under_3000')
  }

  const flagged = answers.offerType === 'other' && isFlaggedOffer(answers.offerOther)
  if (flagged && tier !== 'not_yet') {
    tier = 'review'
    reasons.push('hard:flagged_offer_review')
  } else if (flagged) {
    reasons.push('note:flagged_offer_already_not_yet')
  }

  if (answers.timeline === 'researching' && tier === 'qualified') {
    tier = 'review'
    reasons.push('modifier:researching_demoted')
  }

  const needs = answers.needs || []
  if (needs.includes('setting') && answers.monthlyConversations === 'none') {
    tags.push('lead_gen_required')
    reasons.push('tag:lead_gen_required')
  }

  return { score, tier, reasons, tags, scoringVersion: SCORING_VERSION }
}

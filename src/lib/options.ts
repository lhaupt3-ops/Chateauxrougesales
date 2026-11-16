export type Option = { value: string; label: string; hint?: string }

export const OFFER_OPTIONS: Option[] = [
  { value: 'coaching', label: 'Coaching or consulting' },
  { value: 'course', label: 'Course, community, or info-product' },
  { value: 'agency', label: 'Done-for-you service or agency' },
  { value: 'b2b', label: 'B2B service or software' },
  { value: 'other', label: 'Another high-ticket offer' },
]

export const PRICE_OPTIONS: Option[] = [
  { value: 'under_1000', label: 'Under $1,000' },
  { value: '1000_2999', label: '$1,000–$2,999' },
  { value: '3000_9999', label: '$3,000–$9,999' },
  { value: '10000_24999', label: '$10,000–$24,999' },
  { value: '25000_plus', label: '$25,000+' },
]

export const REVENUE_OPTIONS: Option[] = [
  { value: 'pre_revenue', label: 'Pre-revenue / just launching' },
  { value: 'under_10k', label: 'Under $10k/mo' },
  { value: '10k_30k', label: '$10k–$30k/mo' },
  { value: '30k_100k', label: '$30k–$100k/mo' },
  { value: '100k_250k', label: '$100k–$250k/mo' },
  { value: '250k_plus', label: '$250k+/mo' },
]

export const CONVERSATION_OPTIONS: Option[] = [
  { value: 'none', label: 'None yet. I need lead flow too.' },
  { value: '1_10', label: '1–10' },
  { value: '11_30', label: '11–30' },
  { value: '31_80', label: '31–80' },
  { value: '80_plus', label: '80+' },
]

export const SETUP_OPTIONS: Option[] = [
  { value: 'founder', label: 'I take every call myself' },
  { value: 'small_team', label: '1–2 reps or closers' },
  { value: 'managed_team', label: 'A team with a manager' },
  { value: 'agency', label: 'An agency or outsourced partner' },
  { value: 'nobody', label: 'Nobody, consistently' },
]

export const NEED_OPTIONS: Option[] = [
  { value: 'closing', label: 'Closing the calls' },
  { value: 'setting', label: 'Booking and qualifying leads' },
  { value: 'followup', label: 'Following up no-shows and maybes' },
  { value: 'full', label: 'The whole sales function, run and managed' },
  { value: 'audit', label: 'Not sure. Audit us first' },
]

export const TIMELINE_OPTIONS: Option[] = [
  { value: 'asap', label: 'As soon as possible (within 2 weeks)' },
  { value: 'this_month', label: 'This month' },
  { value: '1_3_months', label: 'In 1–3 months' },
  { value: 'researching', label: 'Just researching for now' },
]

export const INVESTMENT_VALUES = {
  under3k: 'under_3k',
  band1: '3k_5k',
  band2: '5k_10k',
  band3: '10k_20k',
  band4: '20k_plus',
  // Legacy answers from before the $3,000 floor. Kept so older applications still score and display.
  underLow: 'under_low',
  mid: 'mid',
  high: 'high',
  performance: 'performance_only',
  unsure: 'not_sure',
} as const

export const DIAL_CODES = [
  { value: '+1', label: 'US/CA +1' },
  { value: '+44', label: 'UK +44' },
  { value: '+61', label: 'AU +61' },
  { value: '+353', label: 'IE +353' },
  { value: '+64', label: 'NZ +64' },
  { value: '+33', label: 'FR +33' },
  { value: '+49', label: 'DE +49' },
  { value: '+971', label: 'AE +971' },
  { value: '+65', label: 'SG +65' },
  { value: '+other', label: 'Other' },
] as const

const COUNTRY_DIAL: Record<string, string> = {
  US: '+1',
  CA: '+1',
  GB: '+44',
  AU: '+61',
  IE: '+353',
  NZ: '+64',
  FR: '+33',
  DE: '+49',
  AE: '+971',
  SG: '+65',
}

export function dialFromCountry(country: string | null | undefined): string {
  if (!country) return '+1'
  return COUNTRY_DIAL[country.toUpperCase()] || '+1'
}

export function labelFor(options: Option[], value: string | null | undefined): string {
  if (!value) return ''
  return options.find((option) => option.value === value)?.label || value
}

export const PILLARS = [
  { value: 'done-for-you-sales-team', label: 'Done-for-you sales team', href: '/services/done-for-you-sales-team' },
  { value: 'high-ticket-closers', label: 'High-ticket closers', href: '/services/high-ticket-closers' },
  { value: 'appointment-setting', label: 'Appointment setting', href: '/services/appointment-setting' },
  { value: 'sales-audit', label: 'Sales audit', href: '/services/sales-audit' },
  { value: 'coaches-and-consultants', label: 'Coaches and consultants', href: '/who-we-help/coaches-and-consultants' },
  { value: 'course-creators-and-info-products', label: 'Course creators', href: '/who-we-help/course-creators-and-info-products' },
  { value: 'agencies-and-b2b-services', label: 'Agencies and B2B services', href: '/who-we-help/agencies-and-b2b-services' },
  { value: 'how-it-works', label: 'How it works', href: '/how-it-works' },
  { value: 'pricing', label: 'Pricing', href: '/pricing' },
] as const

export function pillarHref(value: string | null | undefined): string | null {
  if (!value) return null
  return PILLARS.find((pillar) => pillar.value === value)?.href || null
}

export function pillarLabel(value: string | null | undefined): string {
  if (!value) return ''
  return PILLARS.find((pillar) => pillar.value === value)?.label || value
}

import { getPayloadClient } from './payload'
import { usableResendFrom } from './resend-from'

export type InvestmentBands = {
  low: string
  mid: string
  high: string
  top: string
  placeholder: boolean
}

export type SiteSettings = {
  notifyEmail: string
  calendlyStrategyUrl: string
  calendlyFitUrl: string
  resendFrom: string
  guaranteeText: string
  noticeText: string
  timelineText: string
  bandLowLabel: string
  bandMidLabel: string
  bandHighLabel: string
  bandTopLabel: string
  bandsArePlaceholder: boolean
  startingFrom: string
  capacityPerMonth: string
  closerName: string
  closerRole: string
  introVideoUrl: string
  contactEmail: string
  linkedIn: string
  youtube: string
  xUrl: string
  instagram: string
}

export const defaultSettings: SiteSettings = {
  notifyEmail: process.env.NOTIFY_EMAIL || '',
  calendlyStrategyUrl: process.env.CALENDLY_STRATEGY_URL || '',
  calendlyFitUrl: process.env.CALENDLY_FIT_URL || '',
  resendFrom: process.env.RESEND_FROM || 'Chateaux Rouge <notifications@example.com>',
  guaranteeText:
    'Placeholder: unconfirmed. Do not publish a guarantee until the agreement can keep it. A kept promise might be a written replacement standard or a fee condition. It will not be a close rate or a revenue number.',
  noticeText:
    'Placeholder: unconfirmed. The working shape is an initial term, then month to month. The notice period belongs in the agreement, not on the site, until it is real.',
  timelineText: 'Working target, not confirmed: first covered calls once operations locks a date. This sentence is a draft.',
  bandLowLabel: '$3,000–$5,000/mo',
  bandMidLabel: '$5,000–$10,000/mo',
  bandHighLabel: '$10,000–$20,000/mo',
  bandTopLabel: '$20,000+/mo',
  bandsArePlaceholder: true,
  startingFrom: '',
  capacityPerMonth: '',
  closerName: 'Your strategist',
  closerRole: 'Sales lead',
  introVideoUrl: '',
  contactEmail: '',
  linkedIn: '',
  youtube: '',
  xUrl: '',
  instagram: '',
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayloadClient()
    const global = (await payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: true,
    })) as Partial<SiteSettings> | null
    if (!global) return defaultSettings
    return {
      notifyEmail: text(global.notifyEmail, process.env.NOTIFY_EMAIL || ''),
      calendlyStrategyUrl: text(global.calendlyStrategyUrl, process.env.CALENDLY_STRATEGY_URL || ''),
      calendlyFitUrl: text(global.calendlyFitUrl, process.env.CALENDLY_FIT_URL || ''),
      resendFrom: usableResendFrom(global.resendFrom, process.env.RESEND_FROM || defaultSettings.resendFrom),
      guaranteeText: text(global.guaranteeText, defaultSettings.guaranteeText),
      noticeText: text(global.noticeText, defaultSettings.noticeText),
      timelineText: text(global.timelineText, defaultSettings.timelineText),
      bandLowLabel: text(global.bandLowLabel, defaultSettings.bandLowLabel),
      bandMidLabel: text(global.bandMidLabel, defaultSettings.bandMidLabel),
      bandHighLabel: text(global.bandHighLabel, defaultSettings.bandHighLabel),
      bandTopLabel: text(global.bandTopLabel, defaultSettings.bandTopLabel),
      bandsArePlaceholder: global.bandsArePlaceholder !== false,
      startingFrom: text(global.startingFrom, ''),
      capacityPerMonth: text(global.capacityPerMonth, ''),
      closerName: text(global.closerName, defaultSettings.closerName),
      closerRole: text(global.closerRole, defaultSettings.closerRole),
      introVideoUrl: text(global.introVideoUrl, ''),
      contactEmail: text(global.contactEmail, ''),
      linkedIn: text(global.linkedIn, ''),
      youtube: text(global.youtube, ''),
      xUrl: text(global.xUrl, ''),
      instagram: text(global.instagram, ''),
    }
  } catch (error) {
    console.error('[settings] using defaults', error)
    return defaultSettings
  }
}

export function bandsFromSettings(settings: SiteSettings): InvestmentBands {
  return {
    low: settings.bandLowLabel,
    mid: settings.bandMidLabel,
    high: settings.bandHighLabel,
    top: settings.bandTopLabel,
    placeholder: settings.bandsArePlaceholder,
  }
}

const DEFAULT_STRATEGIST_NAME = 'Your strategist'

export function configuredStrategistName(settings: SiteSettings): string {
  const name = settings.closerName.trim()
  if (!name || name === DEFAULT_STRATEGIST_NAME) return ''
  return name
}

export function smsSendingConfigured(): boolean {
  return Boolean(process.env.SMS_FROM_NUMBER || process.env.TWILIO_ACCOUNT_SID || process.env.SMS_PROVIDER)
}

export function calendarConfirmationCopy(settings: SiteSettings): string {
  const name = configuredStrategistName(settings)
  if (name && smsSendingConfigured()) {
    return `Add the hold to your calendar. Reply YES to the text from ${name} so we know the number is right.`
  }
  return 'Add the call to your calendar. Calendly has emailed you a confirmation.'
}

export function isOperatorPlaceholder(value: string | null | undefined): boolean {
  if (!value || !value.trim()) return true
  return /^\s*placeholder\b/i.test(value)
}

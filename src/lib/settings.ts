import { unstable_cache } from 'next/cache'
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
  guaranteeIsPlaceholder: boolean
  noticeText: string
  noticeIsPlaceholder: boolean
  timelineText: string
  bandLowLabel: string
  bandMidLabel: string
  bandHighLabel: string
  bandTopLabel: string
  bandsArePlaceholder: boolean
  setupFeeLabel: string
  setupFeeIsPlaceholder: boolean
  commissionLabel: string
  commissionIsPlaceholder: boolean
  discoveryCallEnabled: boolean
  nurtureEnabled: boolean
  careersIsPlaceholder: boolean
  legalName: string
  legalEmail: string
  legalCountry: string
  governingLaw: string
  governingLawIsPlaceholder: boolean
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
  metaAdsEnabled: boolean
  metaPixelId: string
  linkedinAdsEnabled: boolean
  linkedinPartnerId: string
  googleAdsEnabled: boolean
  googleAdsId: string
  googleConversionLabel: string
}

export const defaultSettings: SiteSettings = {
  notifyEmail: process.env.NOTIFY_EMAIL || '',
  calendlyStrategyUrl: process.env.CALENDLY_STRATEGY_URL || '',
  calendlyFitUrl: process.env.CALENDLY_FIT_URL || '',
  resendFrom: process.env.RESEND_FROM || 'Chateaux Rouge <notifications@example.com>',
  guaranteeText:
    'Placeholder: unconfirmed. Do not publish a guarantee until the agreement can keep it. A kept promise might be a written replacement standard or a fee condition. It will not be a close rate or a revenue number.',
  guaranteeIsPlaceholder: true,
  noticeText:
    'To be confirmed. The term and the notice period are set in the written agreement.',
  noticeIsPlaceholder: true,
  timelineText: 'To be confirmed.',
  bandLowLabel: '$3,000–$5,000/mo',
  bandMidLabel: '$5,000–$10,000/mo',
  bandHighLabel: '$10,000–$20,000/mo',
  bandTopLabel: '$20,000+/mo',
  bandsArePlaceholder: true,
  setupFeeLabel: '',
  setupFeeIsPlaceholder: true,
  commissionLabel: '',
  commissionIsPlaceholder: true,
  discoveryCallEnabled: false,
  nurtureEnabled: false,
  careersIsPlaceholder: true,
  legalName: 'Lasse Haupt',
  legalEmail: 'lhaupt3@gmail.com',
  legalCountry: 'Australia',
  governingLaw: '',
  governingLawIsPlaceholder: true,
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
  metaAdsEnabled: false,
  metaPixelId: '',
  linkedinAdsEnabled: false,
  linkedinPartnerId: '',
  googleAdsEnabled: false,
  googleAdsId: '',
  googleConversionLabel: '',
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export const getSettings = unstable_cache(async function getSettings(): Promise<SiteSettings> {
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
      guaranteeIsPlaceholder: global.guaranteeIsPlaceholder !== false,
      noticeText: text(global.noticeText, defaultSettings.noticeText),
      noticeIsPlaceholder: global.noticeIsPlaceholder !== false,
      timelineText: text(global.timelineText, defaultSettings.timelineText),
      bandLowLabel: text(global.bandLowLabel, defaultSettings.bandLowLabel),
      bandMidLabel: text(global.bandMidLabel, defaultSettings.bandMidLabel),
      bandHighLabel: text(global.bandHighLabel, defaultSettings.bandHighLabel),
      bandTopLabel: text(global.bandTopLabel, defaultSettings.bandTopLabel),
      bandsArePlaceholder: global.bandsArePlaceholder !== false,
      setupFeeLabel: text(global.setupFeeLabel, ''),
      setupFeeIsPlaceholder: global.setupFeeIsPlaceholder !== false,
      commissionLabel: text(global.commissionLabel, ''),
      commissionIsPlaceholder: global.commissionIsPlaceholder !== false,
      discoveryCallEnabled: global.discoveryCallEnabled === true,
      nurtureEnabled: global.nurtureEnabled === true,
      careersIsPlaceholder: global.careersIsPlaceholder !== false,
      legalName: text(global.legalName, defaultSettings.legalName),
      legalEmail: text(global.legalEmail, defaultSettings.legalEmail),
      legalCountry: text(global.legalCountry, defaultSettings.legalCountry),
      governingLaw: text(global.governingLaw, ''),
      governingLawIsPlaceholder: global.governingLawIsPlaceholder !== false,
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
      metaAdsEnabled: global.metaAdsEnabled === true && Boolean(text(global.metaPixelId, '')),
      metaPixelId: text(global.metaPixelId, ''),
      linkedinAdsEnabled: global.linkedinAdsEnabled === true && Boolean(text(global.linkedinPartnerId, '')),
      linkedinPartnerId: text(global.linkedinPartnerId, ''),
      googleAdsEnabled: global.googleAdsEnabled === true && Boolean(text(global.googleAdsId, '')),
      googleAdsId: text(global.googleAdsId, ''),
      googleConversionLabel: text(global.googleConversionLabel, ''),
    }
  } catch (error) {
    console.error('[settings] using defaults', error)
    return defaultSettings
  }
}, ['site-settings'], { tags: ['site-settings'] })

export function confirmedOrPending(value: string, isPlaceholder: boolean): string {
  const trimmed = value.trim()
  if (isPlaceholder || !trimmed || isOperatorPlaceholder(trimmed)) return 'To be confirmed'
  return trimmed
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

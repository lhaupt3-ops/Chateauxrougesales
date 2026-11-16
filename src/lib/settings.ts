import { getPayloadClient } from './payload'

export type InvestmentBands = {
  low: string
  mid: string
  high: string
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
    'Placeholder: we replace a closer who is not a fit, you keep your CRM, your data and your recordings, and the engagement moves month to month after the initial term. Replace this in Admin → Site settings before launch.',
  noticeText:
    'Placeholder: an initial term, then month to month with written notice. Confirm the real terms in Site settings and in the agreement.',
  timelineText: 'About 14 days to first covered calls, once operations confirms that number.',
  bandLowLabel: 'Under $5,000/mo',
  bandMidLabel: '$5,000–$10,000/mo',
  bandHighLabel: '$10,000/mo or more',
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
      resendFrom: text(global.resendFrom, process.env.RESEND_FROM || defaultSettings.resendFrom),
      guaranteeText: text(global.guaranteeText, defaultSettings.guaranteeText),
      noticeText: text(global.noticeText, defaultSettings.noticeText),
      timelineText: text(global.timelineText, defaultSettings.timelineText),
      bandLowLabel: text(global.bandLowLabel, defaultSettings.bandLowLabel),
      bandMidLabel: text(global.bandMidLabel, defaultSettings.bandMidLabel),
      bandHighLabel: text(global.bandHighLabel, defaultSettings.bandHighLabel),
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
    placeholder: settings.bandsArePlaceholder,
  }
}

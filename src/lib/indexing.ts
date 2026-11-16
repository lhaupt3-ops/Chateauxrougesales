import { getPayloadClient } from './payload'
import { isOperatorPlaceholder, type SiteSettings } from './settings'

export function pricingIsIndexable(settings: Pick<SiteSettings, 'setupFeeIsPlaceholder' | 'commissionIsPlaceholder' | 'setupFeeLabel' | 'commissionLabel'>): boolean {
  if (settings.setupFeeIsPlaceholder || settings.commissionIsPlaceholder) return false
  const setup = settings.setupFeeLabel.trim()
  const commission = settings.commissionLabel.trim()
  if (!setup || !commission) return false
  if (isOperatorPlaceholder(setup) || isOperatorPlaceholder(commission)) return false
  return true
}

export function careersIsIndexable(settings: Pick<SiteSettings, 'careersIsPlaceholder'>): boolean {
  return settings.careersIsPlaceholder === false
}

export function authorIsIndexable(
  author: { name?: string | null; bio?: string | null; credentials?: string | null },
  publishedCount: number,
): boolean {
  if (publishedCount < 1) return false
  const blob = `${author.name || ''} ${author.bio || ''} ${author.credentials || ''}`
  return !/\bplaceholder\b/i.test(blob)
}

export async function countPublishedPosts(): Promise<number> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.count({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      overrideAccess: true,
    })
    return result.totalDocs
  } catch {
    return 0
  }
}

export async function countRealResults(): Promise<number> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.count({
      collection: 'case-studies',
      where: { and: [{ _status: { equals: 'published' } }, { illustrative: { not_equals: true } }] },
      overrideAccess: true,
    })
    return result.totalDocs
  } catch {
    return 0
  }
}

export function publicCopy(value: string): string {
  return value
    .replace(/this sentence is a draft\.?/gi, 'To be confirmed.')
    .replace(/lawyer review is still pending\.?/gi, 'To be confirmed.')
    .replace(/lawyer review pending\.?/gi, 'To be confirmed.')
    .replace(/\bSite settings\b/g, 'the agreement')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .trim()
}

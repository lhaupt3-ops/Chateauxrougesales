import type { Payload } from 'payload'
import { absoluteUrl } from './site'

export const FLAGSHIP_GUIDE = 'are-you-ready-for-closers'
export const SCORECARD_SLUG = 'closer-readiness-scorecard'
export const FLAGSHIP_TITLE = 'Are you actually ready for closers?'
export const SCORECARD_TITLE = 'Closer readiness scorecard'

export type GuideTarget = { slug: string; title: string; path: string }
export type RequestedGuide = { slug: string; title: string }

export function guideTarget(raw: string, publishedCms: readonly { slug: string; title: string }[] = [], publicId = ''): GuideTarget {
  const slug = raw.trim()
  const cms = publishedCms.find((item) => item.slug === slug)
  const known = slug === SCORECARD_SLUG || slug === FLAGSHIP_GUIDE || Boolean(cms)
  const chosen = known && slug ? slug : FLAGSHIP_GUIDE
  const title = chosen === SCORECARD_SLUG ? SCORECARD_TITLE : chosen === FLAGSHIP_GUIDE ? FLAGSHIP_TITLE : cms?.title || FLAGSHIP_TITLE
  const query = publicId ? `?id=${encodeURIComponent(publicId)}` : ''
  return { slug: chosen, title, path: `/resources/${chosen}${query}` }
}

export function guideEmailUrl(raw: string, publicId: string, publishedCms: readonly { slug: string; title: string }[] = []): string {
  return absoluteUrl(guideTarget(raw, publishedCms, publicId).path)
}

export async function resolveGuideRequest(payload: Payload, raw: string, publicId: string): Promise<GuideTarget> {
  const slug = raw.trim()
  let published: { slug: string; title: string }[] = []
  if (slug && slug !== SCORECARD_SLUG && slug !== FLAGSHIP_GUIDE) {
    const found = await payload.find({
      collection: 'resources',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      overrideAccess: true,
    })
    const doc = found.docs[0]
    if (doc?.slug) published = [{ slug: String(doc.slug), title: String(doc.title || doc.slug) }]
  }
  return guideTarget(slug, published, publicId)
}

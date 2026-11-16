import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'
import { lexicalToText, readingTimeMinutes } from '@/lib/lexical'
import { slugify } from '@/lib/slug'

type Doc = {
  id?: string | number
  title?: string
  slug?: string
  _status?: string
  excerpt?: string
  heroImage?: unknown
  heroImageAlt?: string
  authors?: unknown
  category?: unknown
  body?: unknown
  seo?: { metaDescription?: string }
  publishedAt?: string
  substantiveUpdateAt?: string
  readingTime?: number
}

export function fillSlug<T extends { slug?: unknown; title?: unknown; clientName?: unknown }>(args: {
  data?: T
  originalDoc?: { slug?: unknown }
}): T {
  const next = { ...(args.data || {}) } as T
  if (!next.slug && typeof next.title === 'string') next.slug = slugify(next.title)
  if (!next.slug && typeof next.clientName === 'string') next.slug = slugify(next.clientName)
  if (typeof next.slug === 'string') next.slug = slugify(next.slug)
  if (!next.slug && typeof args.originalDoc?.slug === 'string') next.slug = args.originalDoc.slug
  return next
}

export const preparePost: CollectionBeforeChangeHook = ({ data }) => {
  const next = { ...data } as Doc
  if (next.body) {
    next.readingTime = readingTimeMinutes(lexicalToText(next.body))
  }
  if (next._status === 'published' && !next.publishedAt) {
    next.publishedAt = new Date().toISOString()
  }
  if (next._status === 'published') {
    const missing: string[] = []
    if (!next.heroImage) missing.push('a hero image')
    if (!next.heroImageAlt) missing.push('hero image alt text')
    if (!next.excerpt) missing.push('an excerpt')
    if (!next.seo?.metaDescription) missing.push('a meta description')
    if (!next.authors || (Array.isArray(next.authors) && next.authors.length === 0)) missing.push('an author')
    if (!next.category) missing.push('a category')
    if (missing.length) {
      throw new Error(`Publish blocked. Add ${missing.join(', ')} first.`)
    }
  }
  return next
}

export function revalidatePostPaths(slug?: string | null) {
  revalidatePath('/blog')
  revalidatePath('/blog/rss.xml')
  revalidateTag('posts', 'max')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export const revalidatePost: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  try {
    revalidatePostPaths(typeof doc.slug === 'string' ? doc.slug : null)
    if (previousDoc && typeof previousDoc.slug === 'string' && previousDoc.slug !== doc.slug) {
      revalidatePostPaths(previousDoc.slug)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (!message.includes('static generation store missing')) console.error('[revalidate] post', error)
  }
  return doc
}

export const rememberSlugRedirect: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  if (operation !== 'update') return doc
  const fromSlug = typeof previousDoc?.slug === 'string' ? previousDoc.slug : ''
  const toSlug = typeof doc?.slug === 'string' ? doc.slug : ''
  if (!fromSlug || !toSlug || fromSlug === toSlug) return doc
  const from = `/blog/${fromSlug}`
  const to = `/blog/${toSlug}`
  const existing = await req.payload.find({
    collection: 'redirects',
    where: { from: { equals: from } },
    limit: 1,
    overrideAccess: true,
    req,
  })
  if (existing.docs[0]) {
    await req.payload.update({
      collection: 'redirects',
      id: existing.docs[0].id,
      data: { to: { type: 'custom', url: to }, type: '301' },
      overrideAccess: true,
      req,
    })
  } else {
    await req.payload.create({
      collection: 'redirects',
      data: { from, to: { type: 'custom', url: to }, type: '301' },
      overrideAccess: true,
      req,
    })
  }
  return doc
}

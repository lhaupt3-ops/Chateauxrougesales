import type { MetadataRoute } from 'next'
import { allGuides } from '@/content/guides'
import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

const STATIC = [
  '/',
  '/services',
  '/who-we-help',
  '/how-it-works',
  '/pricing',
  '/results',
  '/compare',
  '/about',
  '/blog',
  '/careers',
  '/privacy',
  '/terms',
  '/apply',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUpdated = new Date('2026-11-16T00:00:00.000Z')
  const entries: MetadataRoute.Sitemap = [
    ...STATIC.map((path) => ({ url: absoluteUrl(path), lastModified: siteUpdated })),
    ...allGuides.map((guide) => ({ url: absoluteUrl(guide.path), lastModified: siteUpdated })),
  ]
  try {
    const payload = await getPayloadClient()
    const posts = await payload.find({
      collection: 'posts',
      where: { and: [{ _status: { equals: 'published' } }, { 'seo.noindex': { not_equals: true } }] },
      limit: 500,
      depth: 0,
      overrideAccess: true,
    })
    for (const post of posts.docs) {
      const modified = post.substantiveUpdateAt || post.publishedAt || post.updatedAt
      entries.push({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: modified ? new Date(modified) : siteUpdated })
    }
    const categories = await payload.find({ collection: 'categories', limit: 100, overrideAccess: true })
    for (const category of categories.docs) {
      if (category.seo?.noindex) continue
      entries.push({ url: absoluteUrl(`/blog/category/${category.slug}`), lastModified: new Date(category.updatedAt) })
    }
    const authors = await payload.find({ collection: 'authors', limit: 100, overrideAccess: true })
    for (const author of authors.docs) {
      entries.push({ url: absoluteUrl(`/authors/${author.slug}`), lastModified: new Date(author.updatedAt) })
    }
    const studies = await payload.find({
      collection: 'case-studies',
      where: { _status: { equals: 'published' } },
      limit: 100,
      overrideAccess: true,
    })
    for (const study of studies.docs) {
      if (study.seo?.noindex) continue
      entries.push({ url: absoluteUrl(`/results/${study.slug}`), lastModified: new Date(study.updatedAt) })
    }
    const resources = await payload.find({
      collection: 'resources',
      where: { _status: { equals: 'published' } },
      limit: 50,
      overrideAccess: true,
    })
    for (const resource of resources.docs) {
      entries.push({ url: absoluteUrl(`/resources/${resource.slug}`), lastModified: new Date(resource.updatedAt) })
    }
  } catch (error) {
    console.error('[sitemap]', error)
  }
  return entries
}

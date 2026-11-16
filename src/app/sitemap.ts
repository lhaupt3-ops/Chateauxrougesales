import type { MetadataRoute } from 'next'
import { allGuides } from '@/content/guides'
import { authorIsIndexable, careersIsIndexable, countPublishedPosts, countRealResults, pricingIsIndexable } from '@/lib/indexing'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/settings'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings()
  const [postCount, resultCount] = await Promise.all([countPublishedPosts(), countRealResults()])
  let siteUpdated = new Date()
  const entries: MetadataRoute.Sitemap = []
  const staticPaths = ['/', '/services', '/who-we-help', '/how-it-works', '/compare', '/about', '/privacy', '/terms', '/resources', '/resources/are-you-ready-for-closers']
  if (pricingIsIndexable(settings)) staticPaths.push('/pricing')
  if (postCount > 0) staticPaths.push('/blog')
  if (resultCount > 0) staticPaths.push('/results')
  if (careersIsIndexable(settings)) staticPaths.push('/careers')

  try {
    const payload = await getPayloadClient()
    const global = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
    if (global.updatedAt) siteUpdated = new Date(global.updatedAt)
    entries.push(...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: siteUpdated })))
    entries.push(...allGuides.map((guide) => ({ url: absoluteUrl(guide.path), lastModified: siteUpdated })))

    if (postCount > 0) {
      const posts = await payload.find({
        collection: 'posts',
        where: { and: [{ _status: { equals: 'published' } }, { 'seo.noindex': { not_equals: true } }] },
        limit: 500,
        depth: 0,
        overrideAccess: true,
      })
      for (const post of posts.docs) {
        const modified = post.updatedAt || post.substantiveUpdateAt || post.publishedAt
        entries.push({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: modified ? new Date(modified) : siteUpdated })
      }
      const categories = await payload.find({ collection: 'categories', limit: 100, overrideAccess: true })
      for (const category of categories.docs) {
        if (category.seo?.noindex) continue
        const inCategory = await payload.count({
          collection: 'posts',
          where: { and: [{ _status: { equals: 'published' } }, { category: { equals: category.id } }] },
          overrideAccess: true,
        })
        if (inCategory.totalDocs < 1) continue
        entries.push({ url: absoluteUrl(`/blog/category/${category.slug}`), lastModified: new Date(category.updatedAt) })
      }
      const authors = await payload.find({ collection: 'authors', limit: 100, overrideAccess: true })
      for (const author of authors.docs) {
        const written = await payload.count({
          collection: 'posts',
          where: { and: [{ _status: { equals: 'published' } }, { authors: { equals: author.id } }] },
          overrideAccess: true,
        })
        if (!authorIsIndexable(author, written.totalDocs)) continue
        entries.push({ url: absoluteUrl(`/authors/${author.slug}`), lastModified: new Date(author.updatedAt) })
      }
    }

    if (resultCount > 0) {
      const studies = await payload.find({
        collection: 'case-studies',
        where: { and: [{ _status: { equals: 'published' } }, { illustrative: { not_equals: true } }] },
        limit: 100,
        overrideAccess: true,
      })
      for (const study of studies.docs) {
        if (study.seo?.noindex) continue
        entries.push({ url: absoluteUrl(`/results/${study.slug}`), lastModified: new Date(study.updatedAt) })
      }
    }
  } catch (error) {
    console.error('[sitemap]', error)
    if (!entries.length) {
      entries.push(...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: siteUpdated })))
    }
  }
  return entries
}

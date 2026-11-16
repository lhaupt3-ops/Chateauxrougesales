import { draftMode } from 'next/headers'
import { getPayloadClient } from './payload'

export async function publishedPosts({
  page = 1,
  limit = 9,
  category,
  tag,
  query,
}: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  query?: string
}) {
  const payload = await getPayloadClient()
  const where: Record<string, unknown> = { _status: { equals: 'published' } }
  if (category) where['category.slug'] = { equals: category }
  if (tag) where['tags.slug'] = { equals: tag }
  if (query) {
    where.or = [{ title: { contains: query } }, { excerpt: { contains: query } }]
  }
  return payload.find({
    collection: 'posts',
    where: where as never,
    sort: '-publishedAt',
    page,
    limit,
    depth: 1,
    overrideAccess: true,
  })
}

export async function getPost(slug: string) {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft: isEnabled,
    overrideAccess: true,
  })
  const post = result.docs[0]
  if (!post) return null
  if (!isEnabled && post._status !== 'published') return null
  return post
}

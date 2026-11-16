import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export async function GET() {
  let items = ''
  try {
    const payload = await getPayloadClient()
    const posts = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
      overrideAccess: true,
    })
    items = posts.docs
      .map((post) => {
        const link = absoluteUrl(`/blog/${post.slug}`)
        return `<item><title><![CDATA[${post.title}]]></title><link>${link}</link><guid>${link}</guid><description><![CDATA[${post.excerpt || ''}]]></description></item>`
      })
      .join('')
  } catch {
    items = ''
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Chateaux Rouge</title><link>${absoluteUrl('/blog')}</link><description>Essays on high-ticket sales teams.</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

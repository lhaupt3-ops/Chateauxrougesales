import { getPayloadClient } from './payload'
import { fallbackFaqs, type Faq } from '@/content/faqs'

type Doc = Record<string, unknown>

export async function getFaqs(placement: string): Promise<Faq[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faqs',
      where: { placement: { contains: placement } },
      sort: 'order',
      limit: 20,
      overrideAccess: true,
    })
    const faqs = result.docs
      .map((doc) => {
        const row = doc as unknown as Doc
        return { question: String(row.question || ''), answer: String(row.answer || '') }
      })
      .filter((faq) => faq.question && faq.answer)
    if (faqs.length) return faqs
  } catch (error) {
    console.error('[faqs]', error)
  }
  return fallbackFaqs[placement] || fallbackFaqs.home || []
}

export async function getLatestPosts(limit = 3): Promise<{ title: string; slug: string }[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit,
      depth: 0,
      overrideAccess: true,
    })
    return result.docs
      .map((doc) => {
        const row = doc as unknown as Doc
        return { title: String(row.title || ''), slug: String(row.slug || '') }
      })
      .filter((post) => post.slug)
  } catch {
    return []
  }
}

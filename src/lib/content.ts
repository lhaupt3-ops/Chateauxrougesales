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

export type ProofResult = {
  metric: string
  before: string
  after: string
  timeframe: string
}

export type ProofStudy = {
  slug: string
  clientName: string
  quote: string
  person: string
  illustrative: boolean
  results: ProofResult[]
}

export async function getPublishedProof(): Promise<ProofStudy[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'case-studies',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 12,
      depth: 0,
      overrideAccess: true,
    })
    return result.docs.flatMap((doc) => {
      const row = doc as unknown as Doc
      const slug = typeof row.slug === 'string' ? row.slug : ''
      if (!slug) return []
      const results = Array.isArray(row.results)
        ? row.results.flatMap((item) => {
            if (!item || typeof item !== 'object') return []
            const metric = item as Doc
            const after = typeof metric.after === 'string' ? metric.after : ''
            const name = typeof metric.metric === 'string' ? metric.metric : ''
            if (!name || !after) return []
            return [
              {
                metric: name,
                before: typeof metric.before === 'string' ? metric.before : '',
                after,
                timeframe: typeof metric.timeframe === 'string' ? metric.timeframe : '',
              },
            ]
          })
        : []
      return [
        {
          slug,
          clientName: typeof row.clientName === 'string' ? row.clientName : slug,
          quote: typeof row.quote === 'string' ? row.quote : '',
          person: typeof row.person === 'string' ? row.person : '',
          illustrative: row.illustrative === true,
          results,
        },
      ]
    })
  } catch (error) {
    console.error('[proof]', error)
    return []
  }
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

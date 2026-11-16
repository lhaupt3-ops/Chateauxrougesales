import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return pageMetadata({ title: 'Case study · Chateaux Rouge', description: 'A named client result.', path: `/results/${slug}` })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    overrideAccess: true,
  })
  const study = result.docs[0]
  if (!study) notFound()
  const metrics = Array.isArray(study.results) ? study.results : []
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Results', path: '/results' }, { name: study.clientName, path: `/results/${slug}` }]} />
      <h1 className="mt-8 font-serif text-5xl">{study.clientName}</h1>
      <p className="mt-4 text-muted">{study.offerPriceBand}</p>
      <h2 className="mt-8 font-serif text-3xl">The problem</h2>
      <p className="mt-2 leading-7 text-muted">{study.challenge}</p>
      <h2 className="mt-8 font-serif text-3xl">What we did</h2>
      <p className="mt-2 leading-7 text-muted">{study.solution}</p>
      <h2 className="mt-8 font-serif text-3xl">The numbers</h2>
      <ul className="mt-3 space-y-2">
        {metrics.map((metric) => (
          <li key={String(metric.metric)}>
            {metric.metric}: {metric.before ? `${metric.before} → ` : ''}{metric.after} {metric.timeframe ? `(${metric.timeframe})` : ''}
          </li>
        ))}
      </ul>
      {study.quote && <blockquote className="mt-8 border-l-2 border-gold pl-4 font-serif text-2xl">{study.quote}</blockquote>}
    </article>
  )
}

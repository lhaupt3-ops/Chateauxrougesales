import Link from 'next/link'
import { Breadcrumbs, Placeholder } from '@/components/site/ui'
import { countRealResults } from '@/lib/indexing'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export async function generateMetadata() {
  const count = await countRealResults()
  return pageMetadata({
    title: SEO.results.title,
    description: count
      ? 'Client results published with permission: the name, the metric and the time window.'
      : 'A case appears here only after a client approves the name, the metric and the time window.',
    path: '/results',
    noindex: count < 1,
  })
}

export default async function ResultsPage() {
  let studies: { slug?: string | null; clientName: string; offerPriceBand?: string | null; illustrative?: boolean | null }[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'case-studies',
      where: { _status: { equals: 'published' } },
      overrideAccess: true,
      limit: 24,
    })
    studies = result.docs as unknown as typeof studies
  } catch {
    studies = []
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Results', path: '/results' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">Results</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Nothing here is a result yet. A card needs a client name, a metric, a before and after, and the time window, all approved in writing. Until that exists, the placeholders stay.
      </p>
      {studies.length === 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Placeholder title="Cash collected" body="The figure, the currency and the window. Not an average." />
          <Placeholder title="Close rate" body="Before and after, on a named offer." />
          <Placeholder title="The person" body="A name and a role, with permission. No stock portraits." />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {studies.map((study) => (
            <Link key={study.slug} href={`/results/${study.slug}`} className="rounded-2xl border border-stone p-5">
              {study.illustrative && <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-wine">Illustrative example</p>}
              <h2 className="mt-2 font-serif text-2xl">{study.clientName}</h2>
              <p className="mt-2 text-sm text-muted">{study.offerPriceBand}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

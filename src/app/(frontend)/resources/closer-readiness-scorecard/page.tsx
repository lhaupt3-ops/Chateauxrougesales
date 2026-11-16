import { ScorecardGate } from '@/components/site/ScorecardGate'
import { Breadcrumbs } from '@/components/site/ui'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: SEO.scorecard.title,
  description: SEO.scorecard.description,
  path: '/resources/closer-readiness-scorecard',
  noindex: true,
})

export default async function ScorecardPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id = '' } = await searchParams
  const doc = id ? await findByPublicId(id) : null
  const unlocked = Boolean(doc && doc.resourceSlug === 'closer-readiness-scorecard')
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          { name: 'Closer readiness scorecard', path: '/resources/closer-readiness-scorecard' },
        ]}
      />
      <p className="mt-8 text-xs uppercase tracking-[0.16em] text-wine">Scorecard</p>
      <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] md:text-5xl">Closer readiness scorecard</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        The same eight checks as the free guide, on one page you can score and print. It does not predict revenue.
      </p>
      <ScorecardGate unlocked={unlocked} publicId={id} />
    </article>
  )
}

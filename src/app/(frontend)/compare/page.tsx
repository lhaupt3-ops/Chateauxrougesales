import Link from 'next/link'
import { comparisons } from '@/content/guides'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'

export const metadata = pageMetadata({
  title: SEO.compare.title,
  description: SEO.compare.description,
  path: '/compare',
})

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">Comparisons</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Three decisions founders actually make. None of them include a fake savings calculator.
      </p>
      <div className="mt-10 grid gap-4">
        {comparisons.map((item) => (
          <Link key={item.path} href={item.path} className="rounded-2xl border border-stone p-6 hover:border-ink">
            <h2 className="font-serif text-3xl">{item.h1}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{item.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

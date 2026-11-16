import Link from 'next/link'
import { verticals } from '@/content/guides'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Who we help · Chateaux Rouge',
  description: 'Sales teams for coaches, course creators, and agencies or B2B service firms with high-ticket offers.',
  path: '/who-we-help',
})

export default function WhoWeHelpPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Who we help', path: '/who-we-help' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">Who we help</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        The offer changes. The problem is usually the same: the founder is still the sales department. These pages say how the work differs by market.
      </p>
      <div className="mt-10 grid gap-4">
        {verticals.map((vertical) => (
          <Link key={vertical.path} href={vertical.path} className="rounded-2xl border border-stone bg-white/70 p-6 hover:border-ink">
            <h2 className="font-serif text-3xl">{vertical.h1}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{vertical.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

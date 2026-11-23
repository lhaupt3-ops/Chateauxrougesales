import Link from 'next/link'
import { services } from '@/content/guides'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'

export const metadata = pageMetadata({
  title: SEO.services.title,
  description: SEO.services.description,
  path: '/services',
})

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]} />
      <h1 className="mt-8 font-serif text-5xl">Services</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Four ways to buy the work. Most founders want the full team. The others exist so you can start with the seat you actually need.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Link key={service.path} href={service.path} className="rounded-2xl border border-stone bg-white/70 p-6 hover:border-ink">
            <p className="kicker">{service.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl">{service.h1}</h2>
            <p className="mt-3 leading-7 text-muted">{service.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

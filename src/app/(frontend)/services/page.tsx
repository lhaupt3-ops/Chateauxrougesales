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
        Two things are available today, and both are done by me. Two more are planned for later, and they are listed so you can see what is not on offer yet.
      </p>
      <h2 className="mt-10 kicker">Available now</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {services
          .filter((service) => service.status !== 'later')
          .map((service) => (
            <Link key={service.path} href={service.path} className="rounded-2xl border border-stone bg-white/70 p-6 hover:border-ink">
              <p className="kicker">{service.eyebrow}</p>
              <h3 className="mt-3 font-serif text-3xl">{service.h1}</h3>
              <p className="mt-3 leading-7 text-muted">{service.dek}</p>
            </Link>
          ))}
      </div>
      <h2 className="mt-12 kicker">Later, not available yet</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {services
          .filter((service) => service.status === 'later')
          .map((service) => (
            <Link key={service.path} href={service.path} className="rounded-2xl border border-dashed border-stone p-6 hover:border-ink">
              <p className="kicker">{service.eyebrow}</p>
              <h3 className="mt-3 font-serif text-2xl">{service.h1}</h3>
              <p className="mt-3 leading-7 text-muted">{service.dek}</p>
            </Link>
          ))}
      </div>
    </div>
  )
}

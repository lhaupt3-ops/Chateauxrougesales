import Link from 'next/link'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export const metadata = pageMetadata({
  title: SEO.resources.title,
  description: SEO.resources.description,
  path: '/resources',
})

export default async function ResourcesPage() {
  const payload = await getPayloadClient()
  const result = await payload
    .find({
      collection: 'resources',
      where: { _status: { equals: 'published' } },
      limit: 20,
      overrideAccess: true,
    })
    .catch(() => null)
  const extras = (result?.docs || []).filter((doc) => doc.slug && doc.slug !== 'are-you-ready-for-closers')
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }]} />
      <p className="mt-8 kicker">Resources</p>
      <h1 className="mt-3 font-serif text-5xl">Read this before you hire</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        The long guide is on this page’s first link. You can read it without an email. The one-page scorecard is the piece we email. Shorter notes underneath still ask for an address.
      </p>
      <Link href="/resources/are-you-ready-for-closers" className="mt-8 block rounded-3xl bg-ink p-8 text-ivory">
        <p className="kicker text-gold-ink">Free guide</p>
        <h2 className="mt-2 font-serif text-4xl">Are you actually ready for closers?</h2>
        <p className="mt-3 max-w-xl leading-7 text-ivory/80">A scorecard of the sales process, the two conversations, setter versus closer, and the red flags that mean you should wait.</p>
      </Link>
      {extras.length > 0 && (
        <ul className="mt-8 space-y-3">
          {extras.map((doc) => (
            <li key={doc.slug}>
              <Link href={`/resources/${doc.slug}`} className="block rounded-2xl border border-stone p-4 hover:border-ink">
                <span className="font-medium">{doc.title}</span>
                {doc.description && <span className="mt-1 block text-sm text-muted">{doc.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

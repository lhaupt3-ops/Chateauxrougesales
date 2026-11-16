import { notFound } from 'next/navigation'
import { ResourceGate } from '@/components/site/ResourceGate'
import { RichText } from '@/components/blog/RichText'
import { Breadcrumbs } from '@/components/site/ui'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { brandTitle } from '@/lib/seo-titles'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  const resource = result.docs[0]
  const title = brandTitle(resource?.title ? String(resource.title) : 'A note for founders')
  const description = resource?.description
    ? String(resource.description).slice(0, 155)
    : 'A short guide from Chateaux Rouge. Leave an email and read it.'
  return pageMetadata({
    title,
    description,
    path: `/resources/${slug}`,
    noindex: true,
  })
}

export default async function ResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { slug } = await params
  const { id = '' } = await searchParams
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'resources',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    overrideAccess: true,
  })
  const resource = result.docs[0]
  if (!resource) notFound()
  const application = id ? await findByPublicId(id) : null
  const unlocked = Boolean(application && application.resourceSlug === slug)
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          { name: String(resource.title), path: `/resources/${slug}` },
        ]}
      />
      <p className="mt-8 text-xs uppercase tracking-[0.16em] text-wine">Note</p>
      <h1 className="mt-3 font-serif text-5xl">{resource.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{resource.description}</p>
      <ResourceGate slug={slug} scorecard={resource.kind === 'scorecard'} title={resource.title} unlocked={unlocked}>
        <RichText data={resource.body} />
      </ResourceGate>
    </article>
  )
}

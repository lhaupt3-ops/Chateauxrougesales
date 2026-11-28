import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { services } from '@/content/guides'
import { pageMetadata } from '@/lib/metadata'
import { brandTitle } from '@/lib/seo-titles'

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = services.find((item) => item.slug === slug)
  if (!guide) return {}
  return pageMetadata({ title: brandTitle(guide.metaTitle), description: guide.metaDescription.slice(0, 155), path: guide.path, noindex: guide.status === 'later' })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = services.find((item) => item.slug === slug)
  if (!guide) notFound()
  return <GuidePage guide={guide} />
}

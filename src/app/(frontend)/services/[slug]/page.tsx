import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { services } from '@/content/guides'
import { pageMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = services.find((item) => item.slug === slug)
  if (!guide) return {}
  return pageMetadata({ title: `${guide.metaTitle} · Chateaux Rouge`, description: guide.metaDescription, path: guide.path })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = services.find((item) => item.slug === slug)
  if (!guide) notFound()
  return <GuidePage guide={guide} />
}

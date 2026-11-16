import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { verticals } from '@/content/guides'
import { pageMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return verticals.map((vertical) => ({ slug: vertical.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = verticals.find((item) => item.slug === slug)
  if (!guide) return {}
  return pageMetadata({ title: `${guide.metaTitle} · Chateaux Rouge`, description: guide.metaDescription, path: guide.path })
}

export default async function VerticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = verticals.find((item) => item.slug === slug)
  if (!guide) notFound()
  return <GuidePage guide={guide} />
}

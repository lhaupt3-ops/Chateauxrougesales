import type { Metadata } from 'next'
import { absoluteUrl, getSiteUrl, isProductionIndexable, SITE_NAME } from './site'

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  image,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  noindex?: boolean
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const indexable = isProductionIndexable() && !noindex
  const canonical = absoluteUrl(path)
  const og = image || `/og?title=${encodeURIComponent(title)}&eyebrow=${encodeURIComponent(SITE_NAME)}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [og],
    },
  }
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: 'Chateaux Rouge · Your sales team, installed and run' },
    description:
      'Setters, closers and a sales lead who own your high-ticket pipeline, from the first reply to cash collected.',
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    openGraph: { siteName: SITE_NAME, type: 'website' },
  }
}

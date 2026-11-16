import type { Metadata } from 'next'
import { BRAND_OG_URL } from './brand'
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
  const og = image || '/brand/social/og-image-1200x630.png'
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
    title: { absolute: 'Outsourced high-ticket closing for founders | Chateaux Rouge' },
    description:
      'A managed sales team for founders who have outgrown taking every call. Setters, closers and a sales lead. Honest calls. You keep the data.',
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    icons: {
      icon: [
        { url: '/brand/favicon/favicon.ico', sizes: '48x48' },
        { url: '/brand/favicon/icon.svg', type: 'image/svg+xml' },
        { url: '/brand/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/brand/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/brand/favicon/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: BRAND_OG_URL, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', images: [BRAND_OG_URL] },
  }
}

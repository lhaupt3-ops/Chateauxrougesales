import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { fontVariables } from '@/app/fonts'
import { AttributionCapture } from '@/components/analytics/Analytics'
import { AdTags } from '@/components/analytics/AdTags'
import { DeferredAnalytics } from '@/components/analytics/DeferredAnalytics'
import { StickyApply } from '@/components/blog/StickyApply'
import { Footer, Header } from '@/components/site/chrome'
import { NavigationProgress } from '@/components/site/NavigationProgress'
import { JsonLd } from '@/components/site/JsonLd'
import { getLatestPosts } from '@/lib/content'
import { rootMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'
import { BRAND_ICON_URL } from '@/lib/brand'
import { absoluteUrl, SITE_NAME } from '@/lib/site'
import './globals.css'

const VercelAnalytics = dynamic(() => import('@vercel/analytics/next').then((mod) => mod.Analytics))
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights))

export const metadata: Metadata = rootMetadata()

export const viewport: Viewport = {
  themeColor: '#B01430',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'overlays-content',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, posts] = await Promise.all([getSettings(), getLatestPosts(3)])
  const socials = [
    settings.linkedIn ? { href: settings.linkedIn, label: 'LinkedIn' } : null,
    settings.youtube ? { href: settings.youtube, label: 'YouTube' } : null,
    settings.xUrl ? { href: settings.xUrl, label: 'X' } : null,
    settings.instagram ? { href: settings.instagram, label: 'Instagram' } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item))

  return (
    <html lang="en" className={fontVariables}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: absoluteUrl('/'),
            logo: BRAND_ICON_URL,
            description: 'A founder-led sales service for high-ticket offers: the founder installs the call process and takes the calls. The client keeps the CRM, the data and the recordings.',
            email: settings.contactEmail || undefined,
            contactPoint: settings.contactEmail
              ? { '@type': 'ContactPoint', email: settings.contactEmail, contactType: 'customer support' }
              : undefined,
            sameAs: settings.linkedIn ? [settings.linkedIn] : [],
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: absoluteUrl('/'),
          }}
        />
        <Header />
        <main id="content">{children}</main>
        <Footer posts={posts} socials={socials} />
        <StickyApply />
        <AttributionCapture />
        {settings.metaAdsEnabled || settings.linkedinAdsEnabled || settings.googleAdsEnabled ? (
          <AdTags
            metaPixelId={settings.metaAdsEnabled ? settings.metaPixelId : ''}
            linkedinPartnerId={settings.linkedinAdsEnabled ? settings.linkedinPartnerId : ''}
            googleAdsId={settings.googleAdsEnabled ? settings.googleAdsId : ''}
            googleConversionLabel={settings.googleAdsEnabled ? settings.googleConversionLabel : ''}
          />
        ) : null}
        <DeferredAnalytics />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

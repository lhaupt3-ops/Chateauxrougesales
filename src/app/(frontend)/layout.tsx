import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics, AttributionCapture, ConsentBanner } from '@/components/analytics/Analytics'
import { Footer, Header } from '@/components/site/chrome'
import { JsonLd } from '@/components/site/JsonLd'
import { getLatestPosts } from '@/lib/content'
import { rootMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'
import { absoluteUrl, SITE_NAME } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-fraunces' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = rootMetadata()

export const viewport: Viewport = {
  themeColor: '#f7f3ee',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, posts] = await Promise.all([getSettings(), getLatestPosts(3)])
  const socials = [
    settings.linkedIn ? { href: settings.linkedIn, label: 'LinkedIn' } : null,
    settings.youtube ? { href: settings.youtube, label: 'YouTube' } : null,
    settings.xUrl ? { href: settings.xUrl, label: 'X' } : null,
    settings.instagram ? { href: settings.instagram, label: 'Instagram' } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item))

  const sameAs = socials.map((social) => social.href)

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: absoluteUrl('/'),
            logo: absoluteUrl('/logo-mark.png'),
            description: 'A managed sales team for high-ticket offers. The client keeps the CRM, the data and the recordings.',
            email: settings.contactEmail || undefined,
            sameAs,
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
        <AttributionCapture />
        <Analytics />
        <ConsentBanner />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

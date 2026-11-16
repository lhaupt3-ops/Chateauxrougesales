import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics, AttributionCapture, ConsentBanner } from '@/components/analytics/Analytics'
import { ApplyHeader } from '@/components/site/chrome'
import { rootMetadata } from '@/lib/metadata'
import '../(frontend)/globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', preload: true, adjustFontFallback: true, variable: '--font-inter' })

export const metadata: Metadata = rootMetadata()
export const viewport: Viewport = {
  themeColor: '#B01430',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'overlays-content',
}

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ApplyHeader />
        <main id="content">{children}</main>
        <AttributionCapture />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  )
}

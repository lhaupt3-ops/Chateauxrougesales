import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics, AttributionCapture, ConsentBanner } from '@/components/analytics/Analytics'
import { ApplyHeader } from '@/components/site/chrome'
import { rootMetadata } from '@/lib/metadata'
import '../(frontend)/globals.css'

const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-fraunces' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = rootMetadata()
export const viewport: Viewport = { themeColor: '#f7f3ee', width: 'device-width', initialScale: 1 }

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
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

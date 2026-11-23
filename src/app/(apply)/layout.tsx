import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { fontVariables } from '@/app/fonts'
import { AttributionCapture } from '@/components/analytics/Analytics'
import { DeferredAnalytics } from '@/components/analytics/DeferredAnalytics'
import { ApplyHeader } from '@/components/site/chrome'
import { NavigationProgress } from '@/components/site/NavigationProgress'
import { rootMetadata } from '@/lib/metadata'
import '../(frontend)/globals.css'

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
    <html lang="en" className={fontVariables}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ApplyHeader />
        <main id="content">{children}</main>
        <AttributionCapture />
        <DeferredAnalytics />
      </body>
    </html>
  )
}

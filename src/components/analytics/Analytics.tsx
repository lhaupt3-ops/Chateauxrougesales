'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { capturePageview } from '@/components/analytics/track'

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    capturePageview(pathname)
    if (!document.cookie.includes('cr_consent=granted') || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    if (pathname.startsWith('/blog/') && pathname.split('/').length === 3) {
      const slug = pathname.split('/')[2]
      if (slug && !['category', 'tag', 'page', 'rss.xml'].includes(slug)) {
        window.localStorage.setItem('cr_last_post', slug)
      }
    }
  }, [pathname])

  return null
}

export function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const touch = {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmTerm: params.get('utm_term') || '',
      utmContent: params.get('utm_content') || '',
      referrer: document.referrer || '',
      landingPage: `${window.location.pathname}${window.location.search}`,
    }
    if (!window.localStorage.getItem('cr_first_touch')) {
      window.localStorage.setItem('cr_first_touch', JSON.stringify(touch))
    }
    if (touch.utmSource) window.localStorage.setItem('cr_last_touch', JSON.stringify(touch))
  }, [])
  return null
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!document.cookie.includes('cr_consent=')) setVisible(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  if (!visible) return null

  function choose(value: 'granted' | 'denied') {
    document.cookie = `cr_consent=${value}; path=/; max-age=15552000; samesite=lax`
    setVisible(false)
    if (value === 'granted') window.location.reload()
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone bg-ivory/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-muted">Analytics cookies show which pages lead to booked calls.</p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose('denied')} className="inline-flex min-h-11 items-center rounded-full border border-stone px-3 text-sm">
            Essential only
          </button>
          <button type="button" onClick={() => choose('granted')} className="inline-flex min-h-11 items-center rounded-full bg-ink px-3 text-sm text-ivory">
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  )
}

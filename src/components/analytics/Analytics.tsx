'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!KEY || !document.cookie.includes('cr_consent=granted')) return
    if (!posthog.__loaded) {
      posthog.init(KEY, {
        api_host: HOST,
        capture_pageview: false,
        persistence: 'localStorage+cookie',
      })
    }
    posthog.capture('$pageview', { path: pathname })
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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone bg-ivory/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm leading-6 text-muted">
          We use analytics cookies to see which pages lead to booked calls. Essential site cookies still run if you decline.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => choose('denied')} className="rounded-full border border-stone px-4 py-2 text-sm">
            Essential only
          </button>
          <button type="button" onClick={() => choose('granted')} className="rounded-full bg-ink px-4 py-2 text-sm text-ivory">
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  )
}

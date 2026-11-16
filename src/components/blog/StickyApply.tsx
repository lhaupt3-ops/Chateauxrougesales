'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { readPostSlug, track } from '@/components/analytics/track'

export function StickyApply() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setShow(height > 0 && window.scrollY / height > 0.4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone bg-ivory/95 p-3 md:hidden">
      <Link
        href="/apply"
        onClick={() =>
          track('cta_clicked', {
            location: 'sticky',
            page: window.location.pathname,
            variant: 'button',
            target: '/apply',
            post_slug: readPostSlug(),
          })
        }
        className="block rounded-full bg-rouge py-3 text-center text-sm font-medium text-white"
      >
        See if we&apos;re a fit
      </Link>
    </div>
  )
}

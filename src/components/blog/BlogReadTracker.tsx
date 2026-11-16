'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/components/analytics/track'

export function BlogReadTracker({ slug, category }: { slug: string; category: string }) {
  const marks = useRef(new Set<number>())
  const started = useRef(0)

  useEffect(() => {
    started.current = Date.now()
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const depth = height > 0 ? Math.round((window.scrollY / height) * 100) : 100
      for (const mark of [25, 50, 75, 100]) {
        if (depth >= mark && !marks.current.has(mark)) {
          marks.current.add(mark)
          track('blog_read', { slug, category, scroll_depth: mark, read_time: Date.now() - started.current })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [category, slug])

  return null
}

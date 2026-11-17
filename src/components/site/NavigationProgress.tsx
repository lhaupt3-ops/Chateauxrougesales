'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shouldStart(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false
  const raw = anchor.getAttribute('href')
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return false
  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return false
  }
  if (url.origin !== window.location.origin) return false
  if (url.pathname.startsWith('/admin')) return false
  return url.pathname !== window.location.pathname || url.search !== window.location.search
}

export function NavigationProgress() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const route = `${pathname}?${search}`
  const seen = useRef(route)
  const started = useRef(false)
  const [running, setRunning] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    function start() {
      started.current = true
      setRunning(true)
      setWidth(reducedMotion() ? 100 : 18)
    }
    function onClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement) || !shouldStart(anchor, event)) return
      start()
    }
    function onPop() {
      start()
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  useEffect(() => {
    if (!running || reducedMotion()) return
    const timer = window.setInterval(() => {
      setWidth((current) => (current >= 90 ? current : current + Math.max(1, (90 - current) * 0.12)))
    }, 180)
    const giveUp = window.setTimeout(() => {
      started.current = false
      setRunning(false)
    }, 8000)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(giveUp)
    }
  }, [running])

  useEffect(() => {
    if (seen.current === route) return
    if (!started.current) {
      seen.current = route
      return
    }
    const wait = reducedMotion() ? 0 : 180
    queueMicrotask(() => setWidth(100))
    const timer = window.setTimeout(() => {
      seen.current = route
      started.current = false
      setRunning(false)
      setWidth(0)
    }, wait)
    return () => window.clearTimeout(timer)
  }, [route])

  if (!running || pathname.startsWith('/admin')) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-rouge motion-reduce:transition-none"
      style={{ width: `${width}%` }}
      aria-hidden="true"
    />
  )
}

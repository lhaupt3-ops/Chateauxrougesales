'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ApplyLink } from './ApplyLink'

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const pathname = usePathname()
  const path = useRef(pathname)

  useEffect(() => {
    if (path.current === pathname) return
    path.current = pathname
    queueMicrotask(() => setOpen(false))
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    const html = document.documentElement
    const body = document.body
    const previousHtml = html.style.overflow
    const previousBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    const root = panel.current
    const focusable = () => [...(root?.querySelectorAll<HTMLElement>('a, button') || [])]
    focusable()[0]?.focus({ preventScroll: true })

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !root) return
      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const toggle = button.current
    return () => {
      html.style.overflow = previousHtml
      body.style.position = previousBody.position
      body.style.top = previousBody.top
      body.style.left = previousBody.left
      body.style.right = previousBody.right
      body.style.width = previousBody.width
      body.style.overflow = previousBody.overflow
      document.removeEventListener('keydown', onKey)
      html.style.scrollBehavior = 'auto'
      window.scrollTo(0, scrollY)
      html.style.scrollBehavior = ''
      toggle?.focus({ preventScroll: true })
    }
  }, [open])

  function close() {
    setOpen(false)
  }

  const menu = open
    ? createPortal(
        <div className="fixed inset-0 z-[80] h-[100dvh] bg-ink/40" onClick={close}>
          <div
            ref={panel}
            id={titleId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto overscroll-contain bg-ivory px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <button type="button" className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-stone px-3" onClick={close}>
                Close
              </button>
            </div>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Mobile">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="flex min-h-11 items-center rounded-xl px-3 text-base hover:bg-white" onClick={close}>
                  {item.label}
                </Link>
              ))}
              <ApplyLink
                location="mobile_nav"
                onClick={close}
                className="flex min-h-11 items-center justify-center rounded-full bg-rouge px-3 text-base font-medium text-white"
              >
                See if we&apos;re a fit
              </ApplyLink>
            </nav>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div className="md:hidden">
      <button
        ref={button}
        type="button"
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-stone px-3 text-base"
        aria-expanded={open}
        aria-controls={titleId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {menu}
    </div>
  )
}

'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ApplyLink } from './ApplyLink'

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const root = panel.current
    const items = () => [...(root?.querySelectorAll<HTMLElement>('a, button') || [])]
    items()[0]?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !root) return
      const focusable = items()
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

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
      {open && (
        <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)}>
          <div
            ref={panel}
            id={titleId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-ivory px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <button type="button" className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-stone px-3" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Mobile">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="flex min-h-11 items-center rounded-xl px-3 text-base hover:bg-white" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <ApplyLink location="mobile_nav" className="flex min-h-11 items-center justify-center rounded-full bg-rouge px-3 text-base font-medium text-white">
                See if we&apos;re a fit
              </ApplyLink>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

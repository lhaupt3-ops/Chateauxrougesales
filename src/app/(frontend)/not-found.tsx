import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <p className="kicker">404</p>
      <h1 className="mt-3 font-serif text-5xl">That page is not here.</h1>
      <p className="mt-4 text-muted">Try a search, or start from one of the pages that explains the work.</p>
      <form action="/search" className="mt-6 flex gap-2">
        <label className="sr-only" htmlFor="q">Search</label>
        <input id="q" name="q" className="h-12 flex-1 rounded-xl border border-stone px-4" />
        <button className="h-12 rounded-xl bg-ink px-4 text-sm text-ivory">Search</button>
      </form>
      <ul className="mt-6 space-y-2 text-sm">
        <li><Link className="underline" href="/services/high-ticket-closers">Founder-led closing</Link></li>
        <li><Link className="underline" href="/services/high-ticket-closers">High-ticket closers</Link></li>
        <li><Link className="underline" href="/pricing">How we charge</Link></li>
        <li><Link className="underline" href="/blog">Journal</Link></li>
      </ul>
    </div>
  )
}

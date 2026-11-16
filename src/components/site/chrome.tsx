import Link from 'next/link'
import { ApplyLink } from './ApplyLink'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/who-we-help', label: 'Who we help' },
  { href: '/results', label: 'Results' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/resources/are-you-ready-for-closers', label: 'Guide' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone/80 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ApplyLink
            location="header"
            dataCta="nav"
            className="hidden h-11 items-center rounded-full bg-rouge px-4 text-base font-medium text-white hover:bg-wine md:inline-flex"
          >
            See if we&apos;re a fit
          </ApplyLink>
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  )
}

const FOOTER = [
  {
    title: 'Services',
    links: [
      ['/services/done-for-you-sales-team', 'Done-for-you sales team'],
      ['/services/high-ticket-closers', 'High-ticket closers'],
      ['/services/appointment-setting', 'Appointment setting'],
      ['/services/sales-audit', 'Sales audit'],
    ],
  },
  {
    title: 'Who we help',
    links: [
      ['/who-we-help/coaches-and-consultants', 'Coaches and consultants'],
      ['/who-we-help/course-creators-and-info-products', 'Course creators'],
      ['/who-we-help/agencies-and-b2b-services', 'Agencies and B2B'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['/how-it-works', 'How it works'],
      ['/pricing', 'How we charge'],
      ['/compare', 'Comparisons'],
      ['/results', 'Results'],
      ['/about', 'About'],
      ['/careers', 'Careers'],
      ['/blog', 'Journal'],
      ['/resources', 'Resources'],
      ['/resources/are-you-ready-for-closers', 'Ready for closers?'],
    ],
  },
]

export function Footer({
  posts,
  socials,
}: {
  posts: { title: string; slug: string }[]
  socials: { href: string; label: string }[]
}) {
  return (
    <footer className="mt-20 border-t border-stone bg-ink text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <Logo tone="ivory" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-ivory/75">
            Setters, closers and a sales lead, installed and run for high-ticket offers.
          </p>
        </div>
        {FOOTER.map((column) => (
          <div key={column.title}>
            <p className="text-xs uppercase tracking-[0.16em] text-gold">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-ivory/80 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {posts.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-8 text-sm text-ivory/70">
          <p className="text-xs uppercase tracking-[0.16em] text-gold">Latest from the journal</p>
          <ul className="mt-3 flex flex-col gap-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="hover:text-white">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-base text-ivory/80">
          <p>© {new Date().getFullYear()} Chateaux Rouge</p>
          <div className="flex gap-4">
            {socials.map((social) => (
              <a key={social.href} href={social.href} className="hover:text-white">
                {social.label}
              </a>
            ))}
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function ApplyHeader() {
  return (
    <header className="border-b border-stone/80 bg-ivory">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Logo />
        <p className="text-xs text-muted">Private · about 90 seconds</p>
      </div>
    </header>
  )
}

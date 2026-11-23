import Link from 'next/link'
import type { Guide } from '@/content/guides'
import { ApplyLink } from '@/components/site/ApplyLink'
import { CallOutline } from '@/components/site/CallOutline'
import { EmailCapture } from '@/components/site/EmailCapture'
import { JsonLd } from '@/components/site/JsonLd'
import { Breadcrumbs, FaqList } from '@/components/site/ui'
import { absoluteUrl, SITE_NAME } from '@/lib/site'

export function GuidePage({ guide }: { guide: Guide }) {
  const crumbs = [
    { name: 'Home', path: '/' },
    {
      name: guide.kind === 'service' ? 'Services' : guide.kind === 'vertical' ? 'Who we help' : 'Compare',
      path: guide.kind === 'service' ? '/services' : guide.kind === 'vertical' ? '/who-we-help' : '/compare',
    },
    { name: guide.h1, path: guide.path },
  ]

  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={crumbs} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: guide.h1,
          serviceType: guide.eyebrow,
          description: guide.dek,
          url: absoluteUrl(guide.path),
          provider: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
          areaServed: ['AU', 'GB', 'US'],
        }}
      />
      <p className="mt-8 kicker">{guide.eyebrow}</p>
      <h1 className="mt-3 max-w-4xl font-serif text-4xl md:text-6xl">{guide.h1}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{guide.dek}</p>
      {guide.kind === 'service' && <CallOutline />}
      <div className="mt-8 max-w-xl">
        <EmailCapture location="guide" entry="guide_inline" />
        <p className="mt-2 text-sm text-muted">About 90 seconds. No pitch deck. You keep the recordings.</p>
      </div>
      <div className="mt-12 max-w-3xl">
        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-serif text-3xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-8 text-muted">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      <section className="mt-14">
        <h2 className="font-serif text-3xl">Go deeper</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {guide.related.map((item) =>
            item.href === '/apply' ? (
              <ApplyLink key={item.href} location="guide_footer" className="rounded-2xl border border-stone bg-white/70 p-5 hover:border-ink">
                <p className="font-medium">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </ApplyLink>
            ) : (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-stone bg-white/70 p-5 hover:border-ink">
                <p className="font-medium">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </Link>
            ),
          )}
        </div>
      </section>
      <FaqList faqs={guide.faqs} />
      <div className="mt-14 max-w-xl">
        <h2 className="font-serif text-3xl">See if we&apos;re a fit</h2>
        <p className="mt-3 text-muted">About 90 seconds. No pitch deck. You keep the recordings.</p>
        <ApplyLink
          location="guide_footer"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-rouge px-5 text-sm font-medium text-white hover:bg-wine"
        >
          See if we&apos;re a fit
        </ApplyLink>
      </div>
    </article>
  )
}

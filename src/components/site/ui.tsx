import Link from 'next/link'
import { JsonLd } from './JsonLd'
import { absoluteUrl } from '@/lib/site'

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
  return (
    <>
      <JsonLd data={data} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === items.length - 1 ? (
                <span className="text-ink">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-ink">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

export function FaqList({ faqs, includeSchema = true }: { faqs: { question: string; answer: string }[]; includeSchema?: boolean }) {
  if (!faqs.length) return null
  return (
    <section className="mt-16">
      <h2 className="font-serif text-3xl tracking-[-0.03em]">Questions worth asking first</h2>
      {includeSchema && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }}
        />
      )}
      <div className="mt-6 divide-y divide-stone border-y border-stone">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="cursor-pointer list-none text-lg font-medium">{faq.question}</summary>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Placeholder({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gold/80 bg-white/60 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-wine">Placeholder</p>
      <p className="mt-2 font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = 'ink',
}: {
  eyebrow?: string
  title: string
  body?: string
  tone?: 'ink' | 'light'
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className={`text-xs uppercase tracking-[0.16em] ${tone === 'light' ? 'text-gold' : 'text-wine'}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-2 font-serif text-3xl tracking-[-0.03em] md:text-4xl ${tone === 'light' ? 'text-ivory' : ''}`}>{title}</h2>
      {body && <p className={`mt-3 text-lg leading-8 ${tone === 'light' ? 'text-ivory/75' : 'text-muted'}`}>{body}</p>}
    </div>
  )
}

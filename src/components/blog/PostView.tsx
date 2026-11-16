import Link from 'next/link'
import { ApplyLink } from '@/components/site/ApplyLink'
import { RichText, TableOfContents } from './RichText'
import { EmailCapture } from '@/components/site/EmailCapture'
import { FaqList, Breadcrumbs } from '@/components/site/ui'
import { JsonLd } from '@/components/site/JsonLd'
import { absoluteUrl, SITE_NAME } from '@/lib/site'
import { pillarHref, pillarLabel } from '@/lib/options'
import { BlogReadTracker } from './BlogReadTracker'

type Media = { url?: string; alt?: string; width?: number; height?: number } | number | null
type Author = { name?: string; slug?: string; role?: string; url?: string }
type Post = Record<string, unknown>

export function PostView({ post, related }: { post: Post; related: { title?: string; slug?: string }[] }) {
  const title = String(post.title || '')
  const slug = String(post.slug || '')
  const authors = (Array.isArray(post.authors) ? post.authors : []) as Author[]
  const category = post.category as { name?: string; slug?: string } | undefined
  const pillar = typeof post.pillar === 'string' ? post.pillar : ''
  const takeaways = Array.isArray(post.keyTakeaways) ? (post.keyTakeaways as { text?: string }[]) : []
  const faqs = Array.isArray(post.faq) ? (post.faq as { question: string; answer: string }[]) : []
  const sources = Array.isArray(post.sources) ? (post.sources as { label?: string; url?: string }[]) : []
  const hero = post.heroImage as Media
  const published = post.publishedAt ? new Date(String(post.publishedAt)) : null
  const updated = post.substantiveUpdateAt ? new Date(String(post.substantiveUpdateAt)) : null
  const cta = (post.cta || {}) as { variant?: string; heading?: string; body?: string; resource?: { slug?: string } }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/blog' },
          { name: title, path: `/blog/${slug}` },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: post.excerpt,
          datePublished: published?.toISOString(),
          dateModified: (updated || published)?.toISOString(),
          mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
          author: authors.map((author) => ({
            '@type': 'Person',
            name: author.name,
            url: author.slug ? absoluteUrl(`/authors/${author.slug}`) : undefined,
          })),
          publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: absoluteUrl('/logo-mark.png') } },
          image: hero && typeof hero === 'object' && hero.url ? absoluteUrl(hero.url) : undefined,
        }}
      />
      {String(post._status) === 'draft' && (
        <p className="mt-6 rounded-full bg-gold/30 px-3 py-1 text-xs uppercase tracking-[0.14em]">Draft preview. Not published.</p>
      )}
      <h1 className="mt-6 font-serif text-4xl tracking-[-0.04em] md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{String(post.excerpt || '')}</p>
      <p className="mt-4 text-sm text-muted">
        {authors.map((author) => (
          <Link key={author.slug} href={`/authors/${author.slug}`} className="underline">
            {author.name}
          </Link>
        ))}
        {published ? ` · ${published.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
        {updated ? ` · Updated ${updated.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
        {post.readingTime ? ` · ${post.readingTime} min read` : ''}
      </p>
      {hero && typeof hero === 'object' && hero.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.url} alt={String(post.heroImageAlt || hero.alt || '')} width={hero.width || 1200} height={hero.height || 675} fetchPriority="high" decoding="async" className="mt-8 h-auto w-full rounded-3xl" />
      )}
      {takeaways.length > 0 && (
        <div className="mt-8 rounded-2xl bg-ink p-5 text-ivory">
          <p className="text-xs uppercase tracking-[0.14em] text-gold">In short</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {takeaways.map((item) => (
              <li key={item.text}>{item.text}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8">
        <TableOfContents data={post.body} />
      </div>
      <div className="mt-6">
        <RichText data={post.body} />
      </div>
      <p className="mt-8 text-base">
        <Link href="/resources/are-you-ready-for-closers" className="underline">
          Free guide: are you ready for closers?
        </Link>
        <span className="text-muted"> · </span>
        <ApplyLink location="post_inline" className="underline">
          See if we&apos;re a fit
        </ApplyLink>
      </p>
      {cta.heading && (
        <div className="mt-10 rounded-2xl border border-stone p-5">
          <h2 className="font-serif text-3xl">{cta.heading}</h2>
          {cta.body && <p className="mt-2 text-muted">{cta.body}</p>}
          <div className="mt-4">
            {cta.variant === 'lead-magnet' && cta.resource?.slug ? (
              <Link href={`/resources/${cta.resource.slug}`} className="underline">
                Get the guide
              </Link>
            ) : (
              <EmailCapture location="blog_end" entry="blog" compact />
            )}
          </div>
        </div>
      )}
      {pillarHref(pillar) && (
        <p className="mt-8 text-sm">
          Part of{' '}
          <Link href={pillarHref(pillar) || '/services'} className="underline">
            {pillarLabel(pillar)}
          </Link>
          .
        </p>
      )}
      {category?.slug && (
        <p className="mt-2 text-sm">
          Filed under{' '}
          <Link className="underline" href={`/blog/category/${category.slug}`}>
            {category.name}
          </Link>
          .
        </p>
      )}
      {sources.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Sources</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} className="underline">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <FaqList faqs={faqs} />
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Keep reading</h2>
          <ul className="mt-3 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link className="underline" href={`/blog/${item.slug}`}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <BlogReadTracker slug={slug} category={category?.slug || ''} />
    </article>
  )
}

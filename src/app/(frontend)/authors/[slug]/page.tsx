import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/site/JsonLd'
import { authorIsIndexable } from '@/lib/indexing'
import { pageMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const authors = await payload.find({ collection: 'authors', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  const author = authors.docs[0]
  const written = author
    ? await payload.count({
        collection: 'posts',
        where: { and: [{ _status: { equals: 'published' } }, { authors: { equals: author.id } }] },
        overrideAccess: true,
      })
    : { totalDocs: 0 }
  const name = author?.name || 'Author'
  return pageMetadata({
    title: `${name} · Chateaux Rouge`,
    description: author?.bio ? String(author.bio).slice(0, 155) : 'Author profile for the Chateaux Rouge journal.',
    path: `/authors/${slug}`,
    noindex: !author || !authorIsIndexable(author, written.totalDocs),
  })
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const authors = await payload.find({ collection: 'authors', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  const author = authors.docs[0]
  if (!author) notFound()
  const posts = await payload.find({
    collection: 'posts',
    where: { and: [{ _status: { equals: 'published' } }, { authors: { equals: author.id } }] },
    limit: 20,
    overrideAccess: true,
  })
  const sameAs = Array.isArray(author.sameAs) ? author.sameAs.map((item) => (typeof item === 'object' && item ? item.url : '')).filter(Boolean) : []
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: author.name,
            description: author.bio,
            jobTitle: author.role,
            url: absoluteUrl(`/authors/${slug}`),
            sameAs,
          },
        }}
      />
      <p className="text-xs uppercase tracking-[0.16em] text-wine">{author.role}</p>
      <h1 className="mt-3 font-serif text-5xl">{author.name}</h1>
      <p className="mt-4 leading-8 text-muted">{author.bio}</p>
      {author.credentials && <p className="mt-4 text-sm text-muted">{author.credentials}</p>}
      <h2 className="mt-10 font-serif text-2xl">Published work</h2>
      <ul className="mt-3 space-y-2">
        {posts.docs.map((post) => (
          <li key={post.id}>
            <Link className="underline" href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      {posts.docs.length === 0 && <p className="mt-3 text-sm text-muted">Nothing published under this byline yet.</p>}
    </article>
  )
}

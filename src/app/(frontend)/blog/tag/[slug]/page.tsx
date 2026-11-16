import Link from 'next/link'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'
import { publishedPosts } from '@/lib/posts'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await publishedPosts({ tag: slug, limit: 24 }).catch(() => null)
  const thin = !posts || posts.docs.length < 3
  return pageMetadata({
    title: `#${slug.replace(/-/g, ' ')} · Chateaux Rouge`,
    description: `Posts tagged ${slug.replace(/-/g, ' ')}.`,
    path: `/blog/tag/${slug}`,
    noindex: thin,
  })
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const tags = await payload.find({ collection: 'tags', where: { slug: { equals: slug } }, limit: 1 })
  if (!tags.docs[0]) notFound()
  const posts = await publishedPosts({ tag: slug, limit: 24 })
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">{tags.docs[0].name}</h1>
      <ul className="mt-6 space-y-3">
        {posts.docs.map((post) => (
          <li key={post.id}>
            <Link className="underline" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

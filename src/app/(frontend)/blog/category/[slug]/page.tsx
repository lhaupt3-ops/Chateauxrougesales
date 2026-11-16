import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/blog/RichText'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'
import { publishedPosts } from '@/lib/posts'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return pageMetadata({
    title: `${slug.replace(/-/g, ' ')} · Chateaux Rouge`,
    description: `Essays filed under ${slug.replace(/-/g, ' ')}.`,
    path: `/blog/category/${slug}`,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const categories = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  const category = categories.docs[0]
  if (!category) notFound()
  const posts = await publishedPosts({ category: slug, limit: 24 })
  const seo = category.seo as { noindex?: boolean } | undefined
  void seo
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/blog' },
          { name: category.name, path: `/blog/category/${slug}` },
        ]}
      />
      <h1 className="mt-8 font-serif text-5xl">{category.name}</h1>
      <div className="mt-4">
        <RichText data={category.intro} />
      </div>
      <ul className="mt-8 space-y-4">
        {posts.docs.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`} className="font-serif text-2xl underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      {posts.docs.length === 0 && <p className="mt-6 text-muted">Published essays in this category will appear here.</p>}
    </div>
  )
}

import { notFound } from 'next/navigation'
import { PostView } from '@/components/blog/PostView'
import { pageMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'
import { getPost } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug).catch(() => null)
  if (!post) return {}
  const seo = (post.seo || {}) as { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; noindex?: boolean; ogImage?: { url?: string; alt?: string } }
  const title = seo.metaTitle || String(post.title)
  const description = seo.metaDescription || String(post.excerpt || '')
  const image = seo.ogImage && typeof seo.ogImage === 'object' ? seo.ogImage.url : undefined
  return pageMetadata({
    title: title.length > 60 ? title.slice(0, 60) : `${title} · Chateaux Rouge`.slice(0, 70),
    description: description.slice(0, 155),
    path: seo.canonicalUrl || `/blog/${slug}`,
    noindex: Boolean(seo.noindex) || post._status !== 'published',
    image,
    type: 'article',
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug).catch(() => null)
  if (!post) notFound()
  let related = (Array.isArray(post.relatedPosts) ? post.relatedPosts : []) as { title?: string; slug?: string }[]
  related = related.filter((item) => item && typeof item === 'object' && item.slug)
  if (related.length === 0 && post.category && typeof post.category === 'object') {
    const payload = await getPayloadClient()
    const more = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { 'category.slug': { equals: (post.category as { slug?: string }).slug } },
          { slug: { not_equals: slug } },
        ],
      },
      limit: 3,
      depth: 0,
      overrideAccess: true,
    })
    related = more.docs.map((doc) => ({ title: doc.title, slug: doc.slug || '' }))
  }
  return <PostView post={post as unknown as Record<string, unknown>} related={related} />
}

void absoluteUrl

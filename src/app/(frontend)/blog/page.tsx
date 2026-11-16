import Link from 'next/link'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { publishedPosts } from '@/lib/posts'

export const revalidate = 3600

export const metadata = pageMetadata({
  title: 'Journal · Chateaux Rouge',
  description: 'Essays on sales teams as a service, closer pay, hiring, and show rate. Written for founders, not job seekers.',
  path: '/blog',
})

export default async function BlogIndex() {
  let posts: { docs: Record<string, unknown>[]; totalPages: number } = { docs: [], totalPages: 1 }
  try {
    const result = await publishedPosts({ page: 1 })
    posts = { docs: result.docs as unknown as Record<string, unknown>[], totalPages: result.totalPages }
  } catch (error) {
    console.error(error)
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Journal', path: '/blog' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">Journal</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Buyer guides only. Drafts stay in the back office until a real author publishes them. Nothing here is a closer job ad.
      </p>
      {posts.docs.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-gold p-6 text-muted">
          No published essays yet. Three draft examples are in the admin, marked as drafts, so the template can be checked before anything goes live.
        </p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {posts.docs.map((post) => (
            <Link key={String(post.slug)} href={`/blog/${post.slug}`} className="rounded-2xl border border-stone bg-white/70 p-5">
              <h2 className="font-serif text-2xl">{String(post.title)}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{String(post.excerpt || '')}</p>
            </Link>
          ))}
        </div>
      )}
      {posts.totalPages > 1 && (
        <Link href="/blog/page/2" className="mt-8 inline-block text-sm underline">
          Next page
        </Link>
      )}
    </div>
  )
}

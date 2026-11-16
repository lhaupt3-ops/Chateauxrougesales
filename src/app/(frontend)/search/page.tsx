import Link from 'next/link'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { publishedPosts } from '@/lib/posts'
import { allGuides } from '@/content/guides'

export const metadata = pageMetadata({
  title: SEO.search.title,
  description: SEO.search.description,
  path: '/search',
  noindex: true,
})

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const query = q.trim()
  const pages = query
    ? allGuides.filter((guide) => `${guide.h1} ${guide.dek}`.toLowerCase().includes(query.toLowerCase()))
    : []
  let posts: { title?: string | null; slug?: string | null }[] = []
  if (query) {
    try {
      const result = await publishedPosts({ query, limit: 20 })
      posts = result.docs as typeof posts
    } catch {
      posts = []
    }
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-5xl">Search</h1>
      <form className="mt-6 flex gap-2" action="/search">
        <label className="sr-only" htmlFor="q">Search</label>
        <input id="q" name="q" defaultValue={query} className="h-12 flex-1 rounded-full border border-stone px-4" />
        <button className="h-12 rounded-full bg-ink px-5 text-sm text-ivory">Search</button>
      </form>
      {query && posts.length === 0 && pages.length === 0 && <p className="mt-8 text-muted">Nothing published matches that.</p>}
      <ul className="mt-8 space-y-3">
        {pages.map((page) => (
          <li key={page.path}><Link className="underline" href={page.path}>{page.h1}</Link></li>
        ))}
        {posts.map((post) => (
          <li key={post.slug}><Link className="underline" href={`/blog/${post.slug}`}>{post.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}

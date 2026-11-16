import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { pageMetadata } from '@/lib/metadata'
import { publishedPosts } from '@/lib/posts'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ pageNumber: string }> }) {
  const { pageNumber } = await params
  return pageMetadata({
    title: `Journal, page ${pageNumber} · Chateaux Rouge`,
    description: 'Older essays from the Chateaux Rouge journal.',
    path: `/blog/page/${pageNumber}`,
  })
}

export default async function BlogPageNumber({ params }: { params: Promise<{ pageNumber: string }> }) {
  const { pageNumber } = await params
  const page = Number(pageNumber)
  if (!Number.isFinite(page) || page < 1) notFound()
  if (page === 1) redirect('/blog')
  const result = await publishedPosts({ page })
  if (page > result.totalPages && result.totalPages > 0) notFound()
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl">Journal, page {page}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {result.docs.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-stone p-5">
            <h2 className="font-serif text-2xl">{post.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

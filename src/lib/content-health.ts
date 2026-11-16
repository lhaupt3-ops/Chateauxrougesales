export type DeskPost = {
  id: number | string
  title?: string | null
  _status?: string | null
  publishedAt?: string | null
  heroImage?: unknown
  heroImageAlt?: string | null
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null
  cta?: { heading?: string | null } | null
  relatedPosts?: unknown[] | null
}

export type ContentGap = { id: number | string; title: string; gaps: string[] }

const DAY = 86400000

export function contentDesk(posts: DeskPost[], now: Date) {
  const drafts = posts.filter((post) => post._status !== 'published')
  const scheduled = drafts.filter((post) => post.publishedAt && new Date(post.publishedAt).getTime() > now.getTime())
  const recent = posts.filter((post) => {
    if (post._status !== 'published' || !post.publishedAt) return false
    return now.getTime() - new Date(post.publishedAt).getTime() <= 14 * DAY
  })
  const missing: ContentGap[] = posts
    .map((post) => {
      const gaps: string[] = []
      if (!post.seo?.metaTitle) gaps.push('meta title')
      if (!post.seo?.metaDescription) gaps.push('meta description')
      if (!post.heroImage) gaps.push('cover image')
      if (!post.heroImageAlt) gaps.push('cover alt text')
      if (!post.cta?.heading) gaps.push('call to action')
      if (!post.relatedPosts?.length) gaps.push('internal link')
      return { id: post.id, title: post.title || 'Untitled', gaps }
    })
    .filter((post) => post.gaps.length > 0)
  return { drafts, scheduled, recent, missing }
}

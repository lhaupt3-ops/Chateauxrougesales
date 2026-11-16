import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { normalizePath } from '@/lib/slug'

type RedirectHit = { to: string; code: number }
let cache: { at: number; map: Map<string, RedirectHit> } | null = null

async function redirectMap(): Promise<Map<string, RedirectHit>> {
  if (cache && Date.now() - cache.at < 60_000) return cache.map
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'redirects',
    limit: 500,
    depth: 1,
    overrideAccess: true,
  })
  const map = new Map<string, RedirectHit>()
  for (const doc of result.docs) {
    const from = normalizePath(String(doc.from || ''))
    const toGroup = doc.to as { type?: string; url?: string; reference?: { relationTo?: string; value?: { slug?: string } | string } } | undefined
    let to = ''
    if (toGroup?.type === 'custom' && toGroup.url) to = toGroup.url
    if (toGroup?.type === 'reference' && toGroup.reference && typeof toGroup.reference.value === 'object') {
      const slug = toGroup.reference.value.slug
      if (slug && toGroup.reference.relationTo === 'posts') to = `/blog/${slug}`
      if (slug && toGroup.reference.relationTo === 'resources') to = `/resources/${slug}`
      if (slug && toGroup.reference.relationTo === 'case-studies') to = `/results/${slug}`
    }
    if (from && to) map.set(from, { to, code: Number(doc.type) === 308 ? 308 : 301 })
  }
  cache = { at: Date.now(), map }
  return map
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-cr-path', pathname)

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  try {
    const map = await redirectMap()
    const hit = map.get(normalizePath(pathname))
    if (hit && normalizePath(hit.to) !== normalizePath(pathname)) {
      const destination = hit.to.startsWith('http') ? hit.to : new URL(hit.to, request.url).toString()
      return NextResponse.redirect(destination, hit.code)
    }
  } catch (error) {
    console.error('[redirects]', error)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

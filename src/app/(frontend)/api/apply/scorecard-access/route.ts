import { NextResponse } from 'next/server'
import { SCORECARD_SLUG } from '@/content/scorecard'
import { findByPublicId, rateLimit } from '@/lib/apply-server'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}

export async function GET(request: Request) {
  if (!rateLimit(`${clientIp(request)}:scorecard-access`)) {
    return NextResponse.json({ unlocked: false }, { status: 429, headers: noStore })
  }
  const id = new URL(request.url).searchParams.get('id')?.trim() || ''
  const doc = id ? await findByPublicId(id) : null
  return NextResponse.json({ unlocked: doc?.resourceSlug === SCORECARD_SLUG }, { headers: noStore })
}

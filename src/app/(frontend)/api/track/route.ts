import { NextResponse } from 'next/server'
import { captureAnonymous } from '@/lib/analytics-server'

export const dynamic = 'force-dynamic'

const ALLOWED = new Set([
  'page_view',
  'scorecard_started',
  'scorecard_completed',
  'application_submitted',
  'qualified',
  'not_qualified',
  'booking_clicked',
])

const FUNNEL = new Set(['/', '/apply', '/apply/book', '/apply/next-steps', '/resources/closer-readiness-scorecard', '/resources/are-you-ready-for-closers'])

export async function POST(request: Request) {
  const consent = (request.headers.get('cookie') || '').includes('cr_consent=granted')
  if (consent) return NextResponse.json({ skipped: true }, { headers: { 'Cache-Control': 'no-store' } })
  const body = (await request.json().catch(() => null)) as { event?: string; path?: string } | null
  const event = body?.event || ''
  const path = (body?.path || '').split('?')[0]
  if (!ALLOWED.has(event)) return NextResponse.json({ ok: false }, { status: 400 })
  if (event === 'page_view' && !FUNNEL.has(path)) return NextResponse.json({ ok: true })
  await captureAnonymous(`anon-${event}`, event, { path })
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}

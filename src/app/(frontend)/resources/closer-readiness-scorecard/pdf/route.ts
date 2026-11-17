import { SCORECARD_SLUG } from '@/content/scorecard'
import { findByPublicId } from '@/lib/apply-server'
import { scorecardPdfBytes } from '@/lib/scorecard-pdf'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id') || ''
  const doc = id ? await findByPublicId(id) : null
  if (!doc || doc.resourceSlug !== SCORECARD_SLUG) {
    return new Response('Leave your email on the scorecard page first.', { status: 401 })
  }
  const bytes = scorecardPdfBytes()
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="closer-readiness-scorecard.pdf"',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}

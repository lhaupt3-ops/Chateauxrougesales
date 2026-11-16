import { getPayloadClient } from '@/lib/payload'
import { roleOf } from '@/access/roles'
import { sendSequencePreview } from '@/lib/sequences'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || roleOf(user) !== 'admin' || !user.email) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 })
  }
  const body = (await request.json().catch(() => ({}))) as { kind?: string }
  const kind = body.kind === 'partial' || body.kind === 'qualified' || body.kind === 'nurture' ? body.kind : 'nurture'
  const sent = await sendSequencePreview(payload, user.email, kind)
  return Response.json({
    ok: true,
    to: user.email,
    kind,
    messages: sent,
    note: 'Preview sends even when nurtureEnabled is off. Live sequences do not.',
  })
}

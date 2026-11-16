import { roleOf } from '@/access/roles'
import { getPayloadClient } from '@/lib/payload'
import { SALES_STATUSES } from '@/lib/sales-queue'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  const role = roleOf(user)
  if (!user || (role !== 'admin' && role !== 'sales')) return Response.json({ error: 'Sales or admin only.' }, { status: 401 })
  const body = (await request.json().catch(() => ({}))) as { id?: string | number; status?: string }
  const status = String(body.status || '')
  if (!SALES_STATUSES.includes(status as (typeof SALES_STATUSES)[number]) || body.id == null) {
    return Response.json({ error: 'Choose a status from the list.' }, { status: 400 })
  }
  const next = status as (typeof SALES_STATUSES)[number]
  try {
    await payload.update({
      collection: 'applications',
      id: body.id,
      data: { status: next },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not saved.'
    return Response.json({ error: message }, { status: 403 })
  }
  return Response.json({ ok: true })
}

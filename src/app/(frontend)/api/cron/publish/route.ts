import { authorizeCron } from '@/lib/cron-auth'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: Request) {
  const denied = authorizeCron(request)
  if (denied) return denied

  const payload = await getPayloadClient()
  try {
    await payload.jobs.run()
  } catch (error) {
    console.error('[cron] publish', error)
    return Response.json({ ok: false }, { status: 500 })
  }

  return Response.json({ ok: true })
}

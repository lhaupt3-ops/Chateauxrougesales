import { authorizeCron } from '@/lib/cron-auth'
import { getPayloadClient } from '@/lib/payload'
import { sendDueSequenceEmails } from '@/lib/sequences'

export async function GET(request: Request) {
  const denied = authorizeCron(request)
  if (denied) return denied
  const payload = await getPayloadClient()
  try {
    await payload.jobs.run()
  } catch (error) {
    console.error('[cron] jobs', error)
  }
  const sequence = await sendDueSequenceEmails(payload)
  return Response.json({
    partialSent: 0,
    unbookedSent: 0,
    sequenceSent: sequence.sent,
    sequencesSkipped: sequence.skipped,
  })
}

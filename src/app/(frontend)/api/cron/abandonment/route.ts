import { authorizeCron } from '@/lib/cron-auth'
import { getPayloadClient } from '@/lib/payload'
import { notifyApplicant } from '@/lib/notify'

export async function GET(request: Request) {
  const denied = authorizeCron(request)
  if (denied) return denied
  const payload = await getPayloadClient()
  const now = Date.now()
  const partials = await payload.find({
    collection: 'applications',
    where: {
      and: [{ status: { equals: 'partial' } }, { partialReminderSentAt: { exists: false } }],
    },
    limit: 50,
    overrideAccess: true,
  })
  let partialSent = 0
  for (const doc of partials.docs) {
    const created = new Date(doc.createdAt).getTime()
    if (now - created < 30 * 60 * 1000) continue
    await notifyApplicant(doc as never, 'partial')
    await payload.update({
      collection: 'applications',
      id: doc.id,
      overrideAccess: true,
      data: { partialReminderSentAt: new Date().toISOString() },
    })
    partialSent += 1
  }

  const unbooked = await payload.find({
    collection: 'applications',
    where: {
      and: [
        { status: { equals: 'complete' } },
        { tier: { in: ['qualified', 'review'] } },
        { unbookedReminderSentAt: { exists: false } },
      ],
    },
    limit: 50,
    overrideAccess: true,
  })
  let unbookedSent = 0
  for (const doc of unbooked.docs) {
    const completed = doc.completedAt ? new Date(doc.completedAt).getTime() : 0
    if (!completed || now - completed < 60 * 60 * 1000) continue
    await notifyApplicant(doc as never, 'unbooked')
    await payload.update({
      collection: 'applications',
      id: doc.id,
      overrideAccess: true,
      data: { unbookedReminderSentAt: new Date().toISOString(), priorityCall: true },
    })
    unbookedSent += 1
  }

  try {
    await payload.jobs.run()
  } catch (error) {
    console.error('[cron] jobs', error)
  }

  return Response.json({ partialSent, unbookedSent })
}

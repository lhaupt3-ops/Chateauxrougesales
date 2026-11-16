import type { CollectionAfterChangeHook } from 'payload'
import { bookingFromApplication, subscriberFromApplication } from '@/lib/lead-desk'

type SyncContext = { skipWorkerSync?: boolean }

export const syncWorkerRecords: CollectionAfterChangeHook = async ({ doc, req }) => {
  if ((req.context as SyncContext | undefined)?.skipWorkerSync) return doc
  const applicationId = typeof doc.id === 'number' ? doc.id : Number(doc.id)
  try {
    const booking = bookingFromApplication(doc as Record<string, unknown>)
    if (booking) {
      await upsert(req, 'bookings', applicationId, booking)
    }
    const subscriber = subscriberFromApplication(doc as Record<string, unknown>)
    if (subscriber) {
      await upsert(req, 'subscribers', applicationId, subscriber)
    }
  } catch (error) {
    console.error('[worker-sync] application', error)
  }
  return doc
}

export const syncBookingStatus: CollectionAfterChangeHook = async ({ doc, req }) => {
  if ((req.context as SyncContext | undefined)?.skipWorkerSync) return doc
  const applicationId = relationId(doc.application)
  if (!applicationId) return doc
  const data: Record<string, unknown> = {}
  if (doc.status === 'canceled') data.bookingStatus = 'canceled'
  if (doc.status === 'scheduled') data.bookingStatus = 'scheduled'
  if (doc.status === 'no_show') data.outcome = 'no_show'
  if (doc.status === 'completed') data.outcome = 'won'
  if (doc.when) data.meetingStartAt = doc.when
  if (!Object.keys(data).length) return doc
  try {
    await req.payload.update({
      collection: 'applications',
      id: applicationId,
      data,
      overrideAccess: true,
      req,
      context: { skipWorkerSync: true },
    })
  } catch (error) {
    console.error('[worker-sync] booking', error)
  }
  return doc
}

async function upsert(
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
  collection: 'bookings' | 'subscribers',
  applicationId: number,
  data: Record<string, unknown>,
) {
  const existing = await req.payload.find({
    collection,
    where: { application: { equals: applicationId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const context = { skipWorkerSync: true }
  if (existing.docs[0]) {
    await req.payload.update({
      collection,
      id: existing.docs[0].id,
      data: data as never,
      overrideAccess: true,
      req,
      context,
    })
    return
  }
  await req.payload.create({
    collection,
    data: { ...data, application: applicationId } as never,
    overrideAccess: true,
    req,
    context,
  })
}

function relationId(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value)
  if (value && typeof value === 'object' && 'id' in value) return relationId((value as { id?: unknown }).id)
  return null
}

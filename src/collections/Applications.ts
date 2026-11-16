import type { CollectionConfig, Where } from 'payload'
import { isAdmin, isAdminOrSales } from '@/access/roles'
import { roleOf } from '@/access/roles'

const select = (options: { value: string; label: string }[]) => options

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'email',
    group: 'Sales',
    defaultColumns: ['email', 'status', 'tier', 'score', 'offerType', 'createdAt'],
    description: 'Every application is stored here. Signed-in admins and sales can download CSV at /api/applications/export.',
    listSearchableFields: ['email', 'firstName', 'lastName', 'website', 'company'],
  },
  access: {
    read: isAdminOrSales,
    create: isAdmin,
    update: isAdminOrSales,
    delete: isAdmin,
  },
  fields: [
    { name: 'publicId', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'partial',
      index: true,
      options: select([
        { value: 'partial', label: 'Partial' },
        { value: 'complete', label: 'Complete' },
        { value: 'booked', label: 'Booked' },
        { value: 'no_show', label: 'No-show' },
        { value: 'won', label: 'Won' },
        { value: 'lost', label: 'Lost' },
        { value: 'nurture', label: 'Nurture' },
      ]),
    },
    {
      name: 'tier',
      type: 'select',
      options: select([
        { value: 'qualified', label: 'Qualified' },
        { value: 'review', label: 'Review' },
        { value: 'not_yet', label: 'Not yet' },
      ]),
    },
    { name: 'score', type: 'number' },
    { name: 'reasons', type: 'json' },
    { name: 'tags', type: 'json' },
    { name: 'scoringVersion', type: 'text' },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'offerType', type: 'text' },
    { name: 'offerOther', type: 'text' },
    { name: 'pricePoint', type: 'text' },
    { name: 'monthlyRevenue', type: 'text' },
    { name: 'monthlyConversations', type: 'text' },
    { name: 'salesSetup', type: 'text' },
    { name: 'needs', type: 'json' },
    { name: 'timeline', type: 'text' },
    { name: 'investment', type: 'text' },
    { name: 'investmentLabel', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'utmSource', type: 'text' },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'utmTerm', type: 'text' },
    { name: 'utmContent', type: 'text' },
    { name: 'lastUtmSource', type: 'text' },
    { name: 'lastUtmMedium', type: 'text' },
    { name: 'lastUtmCampaign', type: 'text' },
    { name: 'referrer', type: 'text' },
    { name: 'landingPage', type: 'text' },
    { name: 'lastBlogPost', type: 'text' },
    { name: 'device', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'entry', type: 'text' },
    { name: 'calendlyEventUri', type: 'text' },
    { name: 'calendlyInviteeUri', type: 'text' },
    { name: 'eventType', type: 'select', options: ['strategy', 'fit'] },
    { name: 'bookingStatus', type: 'select', defaultValue: 'none', options: ['none', 'scheduled', 'canceled'] },
    { name: 'bookedAt', type: 'date' },
    { name: 'meetingStartAt', type: 'date' },
    { name: 'consentSms', type: 'checkbox', defaultValue: false },
    { name: 'consentMarketing', type: 'checkbox', defaultValue: false },
    { name: 'analyticsConsent', type: 'checkbox', defaultValue: false },
    { name: 'completedAt', type: 'date' },
    { name: 'stepReached', type: 'text' },
    { name: 'waitlist', type: 'checkbox', defaultValue: false },
    { name: 'nurtureReason', type: 'text' },
    { name: 'priorityCall', type: 'checkbox', defaultValue: false },
    { name: 'partialReminderSentAt', type: 'date' },
    { name: 'unbookedReminderSentAt', type: 'date' },
    { name: 'source', type: 'text' },
    { name: 'resourceSlug', type: 'text' },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        const role = roleOf(req.user)
        if (role !== 'admin' && role !== 'sales') {
          return Response.json({ error: 'Sign in as admin or sales to export.' }, { status: 401 })
        }
        const where = {} as Where
        const result = await req.payload.find({
          collection: 'applications',
          limit: 5000,
          depth: 0,
          overrideAccess: false,
          req,
          where,
          sort: '-createdAt',
        })
        const columns = [
          'createdAt',
          'status',
          'tier',
          'score',
          'email',
          'firstName',
          'lastName',
          'phone',
          'website',
          'offerType',
          'pricePoint',
          'monthlyRevenue',
          'monthlyConversations',
          'salesSetup',
          'timeline',
          'investment',
          'landingPage',
          'lastBlogPost',
          'utmSource',
          'utmCampaign',
          'meetingStartAt',
        ]
        const lines = [columns.join(',')]
        for (const doc of result.docs) {
          const row = doc as unknown as Record<string, unknown>
          lines.push(
            columns
              .map((column) => {
                const value = row[column]
                const text = value == null ? '' : String(value)
                return `"${text.replace(/"/g, '""')}"`
              })
              .join(','),
          )
        }
        return new Response(lines.join('\n'), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="applications.csv"',
          },
        })
      },
    },
  ],
}

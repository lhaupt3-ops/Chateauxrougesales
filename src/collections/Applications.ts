import type { CollectionBeforeChangeHook, CollectionConfig, Where } from 'payload'
import { hideFromEditor, isAdmin, isAdminOrSales, isAdminOrSalesField, roleOf } from '@/access/roles'
import { displayName, scoreBandLabel } from '@/lib/lead-desk'
import { syncWorkerRecords } from './worker-sync'

const locked = { readOnly: true, description: 'Set by the application. Closers do not edit this.' }

const prepareApplication: CollectionBeforeChangeHook = ({ data }) => {
  const next = { ...data }
  next.name = displayName(
    typeof next.firstName === 'string' ? next.firstName : '',
    typeof next.lastName === 'string' ? next.lastName : '',
    typeof next.email === 'string' ? next.email : '',
  )
  next.scoreBand = scoreBandLabel(typeof next.tier === 'string' ? next.tier : '')
  if (next.assignee && !next.assignedTo) next.assignedTo = next.assignee
  if (!next.assignee && next.assignedTo) next.assignee = next.assignedTo
  if (!next.posthogDistinctId && typeof next.publicId === 'string') next.posthogDistinctId = next.publicId
  return next
}

const callVisible = (data: Record<string, unknown> | undefined) =>
  data?.status === 'booked' || data?.bookingStatus === 'scheduled' || data?.bookingStatus === 'canceled' || Boolean(data?.meetingStartAt)

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'name',
    group: 'Sales',
    hidden: hideFromEditor,
    defaultColumns: ['name', 'company', 'scoreBand', 'status', 'meetingStartAt', 'nextFollowUpAt', 'submittedAt'],
    listSearchableFields: ['name', 'email', 'company'],
    description: 'Work one lead at a time. Status, assignee, follow-up date, and outcome are in the sidebar. Fit answers are labels, not raw keys.',
    components: {
      beforeList: ['@/components/admin/ApplicationListPresets'],
    },
  },
  defaultSort: '-createdAt',
  access: {
    read: isAdminOrSales,
    create: isAdmin,
    update: isAdminOrSales,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [prepareApplication],
    afterChange: [syncWorkerRecords],
  },
  fields: [
    {
      name: 'leadSummary',
      type: 'ui',
      admin: { components: { Field: '@/components/admin/LeadSummary' } },
    },
    { name: 'name', type: 'text', admin: { readOnly: true, hidden: true, description: 'Built from the first and last name. Used as the title in the list.' } },
    {
      name: 'scoreBand',
      type: 'text',
      label: 'Score band',
      admin: { readOnly: true, hidden: true, description: 'Qualified, review, or not yet. Filled from the score.' },
    },
    {
      name: 'submittedAt',
      type: 'date',
      virtual: true,
      label: 'Submitted',
      admin: { readOnly: true, hidden: true, description: 'When the application was started.' },
      hooks: { afterRead: [({ siblingData }) => siblingData?.createdAt] },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fit answers',
          fields: [
            { name: 'fitAnswers', type: 'ui', admin: { components: { Field: '@/components/admin/FitAnswers' } } },
            {
              type: 'collapsible',
              label: 'Raw stored answers',
              admin: { initCollapsed: true, description: 'The keys the scorer stored. Read-only.' },
              fields: [
                { name: 'offerType', type: 'text', admin: locked },
                { name: 'offerOther', type: 'text', admin: locked },
                { name: 'pricePoint', type: 'text', admin: locked },
                { name: 'monthlyRevenue', type: 'text', admin: locked },
                { name: 'monthlyConversations', type: 'text', admin: locked },
                { name: 'salesSetup', type: 'text', admin: locked },
                { name: 'needs', type: 'json', admin: locked },
                { name: 'timeline', type: 'text', admin: locked },
                { name: 'setupFee', type: 'text', admin: locked },
                {
                  name: 'decisionMakers',
                  type: 'select',
                  options: [
                    { label: 'Just me', value: 'just_me' },
                    { label: 'Me and a partner or co-founder', value: 'partner' },
                    { label: 'A team or board', value: 'team' },
                  ],
                  admin: { readOnly: true, description: 'Who else would be part of the decision. Not used in the score.' },
                },
                { name: 'investment', type: 'text', admin: { ...locked, description: 'Older monthly budget band. Not asked on new applications.' } },
                { name: 'investmentLabel', type: 'text', admin: locked },
              ],
            },
          ],
        },
        {
          label: 'Contact & booking',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text', admin: { description: 'Used in the list title and emails.' } },
                { name: 'lastName', type: 'text', admin: { description: 'Used with the first name.' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', required: true, index: true, admin: { description: 'Where follow-ups are sent. Search the list by this.' } },
                { name: 'phone', type: 'text', admin: { description: 'Shown as a tel link in the summary.' } },
              ],
            },
            { name: 'company', type: 'text', admin: { description: 'Shown next to the name. Searchable.' } },
            { name: 'website', type: 'text', admin: { description: 'Their site, if they gave one.' } },
            {
              type: 'row',
              admin: { condition: (_data, sibling) => callVisible(sibling) },
              fields: [
                {
                  name: 'meetingStartAt',
                  type: 'date',
                  label: 'Booked call',
                  admin: { description: 'Start time. The list and summary show it in your timezone.', date: { pickerAppearance: 'dayAndTime' } },
                },
                {
                  name: 'meetingEndAt',
                  type: 'date',
                  admin: { readOnly: true, description: 'End time from Calendly.', date: { pickerAppearance: 'dayAndTime' } },
                },
              ],
            },
            {
              name: 'bookingStatus',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Not booked', value: 'none' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Canceled', value: 'canceled' },
              ],
              admin: { description: 'Scheduled means a time is on the calendar. Canceled means they or we removed it.' },
            },
            {
              name: 'eventType',
              type: 'select',
              options: [
                { label: 'Strategy call', value: 'strategy' },
                { label: 'Fit call', value: 'fit' },
              ],
              admin: { readOnly: true, description: 'Strategy is the 30-minute call. Fit is the 15-minute call, only when that switch is on.' },
            },
            { name: 'calendlyEventUri', type: 'text', admin: { readOnly: true, description: 'Calendly reference for this booking.' } },
            { name: 'calendlyInviteeUri', type: 'text', admin: { readOnly: true, hidden: true } },
            { name: 'bookedAt', type: 'date', admin: { readOnly: true, description: 'When the booking was recorded.' } },
          ],
        },
        {
          label: 'Notes & activity',
          fields: [
            {
              name: 'callNotes',
              type: 'textarea',
              access: { update: isAdminOrSalesField },
              admin: { description: 'What happened on the call. Write this after you hang up.' },
            },
            {
              name: 'objections',
              type: 'textarea',
              access: { update: isAdminOrSalesField },
              admin: { description: 'The objections they raised, in their words.' },
            },
            {
              name: 'internalNotes',
              type: 'textarea',
              access: { update: isAdminOrSalesField },
              admin: { description: 'Anything the next person on this lead should know. Not sent to the lead.' },
            },
            { name: 'notes', type: 'textarea', admin: { readOnly: true, description: 'Notes captured outside the call, including career enquiries. Read-only.' } },
            { name: 'activityLog', type: 'ui', admin: { components: { Field: '@/components/admin/ActivityLog' } } },
          ],
        },
        {
          label: 'Tracking',
          fields: [
            {
              type: 'collapsible',
              label: 'Source, score, and request',
              admin: { initCollapsed: true, description: 'System values. Read-only. The PostHog distinct id is the public id.' },
              fields: [
                { name: 'publicId', type: 'text', unique: true, index: true, admin: { ...locked, description: 'Also the PostHog distinct id for this lead.' } },
                { name: 'posthogDistinctId', type: 'text', admin: { ...locked, description: 'Copied from the public id. This is the id PostHog uses.' } },
                { name: 'scoringVersion', type: 'text', admin: locked },
                { name: 'score', type: 'number', admin: locked },
                {
                  name: 'tier',
                  type: 'select',
                  options: [
                    { label: 'Qualified', value: 'qualified' },
                    { label: 'Review', value: 'review' },
                    { label: 'Not yet', value: 'not_yet' },
                  ],
                  admin: locked,
                },
                { name: 'reasons', type: 'json', admin: locked },
                { name: 'tags', type: 'json', admin: { ...locked, hidden: true } },
                { type: 'row', fields: [
                  { name: 'utmSource', type: 'text', admin: locked },
                  { name: 'utmMedium', type: 'text', admin: locked },
                  { name: 'utmCampaign', type: 'text', admin: locked },
                ] },
                { type: 'row', fields: [
                  { name: 'utmTerm', type: 'text', admin: locked },
                  { name: 'utmContent', type: 'text', admin: locked },
                  { name: 'referrer', type: 'text', admin: locked },
                ] },
                { name: 'landingPage', type: 'text', admin: locked },
                { name: 'lastBlogPost', type: 'text', admin: locked },
                { name: 'ipAddress', type: 'text', admin: { ...locked, description: 'IP address captured when they started the application.' } },
                { name: 'userAgent', type: 'text', admin: { ...locked, description: 'Browser captured when they started the application.' } },
                { name: 'device', type: 'text', admin: locked },
                { name: 'country', type: 'text', admin: locked },
                { name: 'entry', type: 'text', admin: locked },
                { name: 'source', type: 'text', admin: locked },
                { name: 'resourceSlug', type: 'text', admin: locked },
                { name: 'stepReached', type: 'text', admin: locked },
                { name: 'sequenceKind', type: 'select', options: ['none', 'nurture', 'partial', 'qualified'], admin: locked },
                { name: 'sequenceLog', type: 'json', admin: { ...locked, hidden: true } },
                { name: 'unsubscribeToken', type: 'text', admin: { ...locked, hidden: true } },
                { name: 'emailUnsubscribed', type: 'checkbox', defaultValue: false, admin: locked },
                { name: 'marketingConsent', type: 'checkbox', defaultValue: false, admin: locked },
                { name: 'consentMarketing', type: 'checkbox', defaultValue: false, admin: locked },
                { name: 'consentSms', type: 'checkbox', defaultValue: false, admin: locked },
                { name: 'analyticsConsent', type: 'checkbox', defaultValue: false, admin: locked },
                { name: 'waitlist', type: 'checkbox', defaultValue: false, admin: { readOnly: true, description: 'On if they asked to be told when the fit is closer.' } },
                { name: 'nurtureReason', type: 'text', admin: locked },
                { name: 'nurtureEnrolledAt', type: 'date', admin: locked },
                { name: 'priorityCall', type: 'checkbox', defaultValue: false, admin: locked },
                { name: 'partialReminderSentAt', type: 'date', admin: locked },
                { name: 'unbookedReminderSentAt', type: 'date', admin: locked },
                { name: 'completedAt', type: 'date', admin: locked },
                { name: 'lastUtmSource', type: 'text', admin: { ...locked, hidden: true } },
                { name: 'lastUtmMedium', type: 'text', admin: { ...locked, hidden: true } },
                { name: 'lastUtmCampaign', type: 'text', admin: { ...locked, hidden: true } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'partial',
      index: true,
      options: [
        { label: 'Partial', value: 'partial' },
        { label: 'Complete', value: 'complete' },
        { label: 'Booked', value: 'booked' },
        { label: 'No-show', value: 'no_show' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'Nurture', value: 'nurture' },
      ],
      access: { update: isAdminOrSalesField },
      admin: {
        position: 'sidebar',
        description: 'Quick status change. Partial is unfinished, complete is scored, booked has a time, nurture is the guide path.',
      },
    },
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      access: { update: isAdminOrSalesField },
      admin: { position: 'sidebar', description: 'Who owns the next action on this lead.' },
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users', admin: { hidden: true, readOnly: true } },
    {
      name: 'nextFollowUpAt',
      type: 'date',
      label: 'Next follow-up',
      access: { update: isAdminOrSalesField },
      admin: {
        position: 'sidebar',
        description: 'When you will next look at this lead. The summary says if the date has passed.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'outcome',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'No-show', value: 'no_show' },
      ],
      access: { update: isAdminOrSalesField },
      admin: { position: 'sidebar', description: 'The result after the conversation. Open means you have not decided.' },
    },
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
          'name',
          'company',
          'status',
          'scoreBand',
          'outcome',
          'tier',
          'score',
          'email',
          'phone',
          'nextFollowUpAt',
          'meetingStartAt',
          'assignee',
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

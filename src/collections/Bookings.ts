import type { CollectionConfig } from 'payload'
import { hideFromEditor, isAdmin, isAdminOrSales } from '@/access/roles'
import { syncBookingStatus } from './worker-sync'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Booking', plural: 'Bookings' },
  admin: {
    useAsTitle: 'who',
    group: 'Sales',
    hidden: hideFromEditor,
    defaultColumns: ['who', 'when', 'status', 'application'],
    listSearchableFields: ['who', 'email'],
    description: 'Calls that already have a time. Open the application for the fit answers and notes. Change the status here after the call.',
  },
  defaultSort: 'when',
  access: {
    read: isAdminOrSales,
    create: isAdmin,
    update: isAdminOrSales,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'who',
      type: 'text',
      required: true,
      admin: { readOnly: true, description: 'Copied from the application. Edit the name there.' },
    },
    { name: 'email', type: 'email', admin: { readOnly: true, description: 'Use this to find the person. The application has the phone number.' } },
    {
      name: 'when',
      type: 'date',
      admin: {
        description: 'Start time from Calendly. Shown in your local timezone in the admin.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'No-show', value: 'no_show' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { description: 'No-show and completed also update the outcome on the application.' },
    },
    {
      name: 'calendlyUrl',
      type: 'text',
      admin: { readOnly: true, description: 'Calendly event reference. Read-only.' },
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'applications',
      required: true,
      unique: true,
      admin: { description: 'Open this for the fit answers, notes, and follow-up date.' },
    },
  ],
  hooks: {
    afterChange: [syncBookingStatus],
  },
}

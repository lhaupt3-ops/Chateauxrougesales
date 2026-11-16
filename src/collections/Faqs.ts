import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor } from '@/access/roles'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Journal',
    hidden: hideFromSales,
    defaultColumns: ['question', 'placement', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'placement',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'How it works', value: 'how-it-works' },
        { label: 'Done-for-you sales team', value: 'done-for-you-sales-team' },
        { label: 'High-ticket closers', value: 'high-ticket-closers' },
        { label: 'Appointment setting', value: 'appointment-setting' },
        { label: 'Sales audit', value: 'sales-audit' },
        { label: 'Coaches', value: 'coaches-and-consultants' },
        { label: 'Course creators', value: 'course-creators-and-info-products' },
        { label: 'Agencies', value: 'agencies-and-b2b-services' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

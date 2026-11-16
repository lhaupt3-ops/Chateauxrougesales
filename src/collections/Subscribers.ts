import type { CollectionConfig } from 'payload'
import { hideFromEditor, isAdmin, isAdminOrSales } from '@/access/roles'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: {
    useAsTitle: 'email',
    group: 'Sales',
    hidden: hideFromEditor,
    defaultColumns: ['name', 'email', 'kind', 'unsubscribed', 'application'],
    listSearchableFields: ['name', 'email'],
    description: 'Waitlist, guide opt-ins, and people who agreed to marketing email. Uncheck them here if they should not be emailed. Sending still waits on the nurture switch in Site settings.',
  },
  defaultSort: '-createdAt',
  access: {
    read: isAdminOrSales,
    create: isAdmin,
    update: isAdminOrSales,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', admin: { description: 'Who this address belongs to.' } },
    { name: 'email', type: 'email', required: true, admin: { description: 'The address the sequences use.' } },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'waitlist',
      options: [
        { label: 'Waitlist', value: 'waitlist' },
        { label: 'Guide', value: 'guide' },
        { label: 'Marketing', value: 'marketing' },
      ],
      admin: { description: 'Waitlist asked to hear back. Guide left an email for the free guide. Marketing ticked the consent box.' },
    },
    {
      name: 'unsubscribed',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'On means the sequences must not email this address. One-click unsubscribe sets this too.' },
    },
    { name: 'source', type: 'text', admin: { readOnly: true, description: 'Where the address came from. Read-only.' } },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'applications',
      unique: true,
      admin: { description: 'The application this address belongs to, when there is one.' },
    },
  ],
}

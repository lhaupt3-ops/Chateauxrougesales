import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor } from '@/access/roles'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'updatedAt'],
    group: 'Journal',
    hidden: hideFromSales,
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea', required: true },
    { name: 'credentials', type: 'textarea' },
    { name: 'headshot', type: 'upload', relationTo: 'media' },
    {
      name: 'sameAs',
      type: 'array',
      labels: { singular: 'Profile link', plural: 'Profile links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'expertise',
      type: 'array',
      fields: [{ name: 'topic', type: 'text', required: true }],
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'System',
    hidden: hideFromSales,
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    imageSizes: [
      { name: 'card', width: 960, height: 640, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Required. Describe the image for screen readers and search.' },
    },
  ],
}

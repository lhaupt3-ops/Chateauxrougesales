import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor } from '@/access/roles'
import { articleEditor } from '@/fields/lexical'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
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
    {
      name: 'intro',
      type: 'richText',
      editor: articleEditor,
      admin: { description: '150–300 words. Shown at the top of the category hub.' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 60 },
        { name: 'metaDescription', type: 'textarea', maxLength: 155 },
        { name: 'noindex', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}

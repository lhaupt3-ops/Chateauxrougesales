import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor, publishedOrContentTeam } from '@/access/roles'
import { articleEditor } from '@/fields/lexical'
import { fillSlug } from './hooks'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    group: 'Proof',
    hidden: hideFromSales,
  },
  access: {
    read: publishedOrContentTeam,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'guide',
      options: [
        { label: 'Interactive scorecard', value: 'scorecard' },
        { label: 'Guide', value: 'guide' },
      ],
    },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', editor: articleEditor },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 60 },
        { name: 'metaDescription', type: 'textarea', maxLength: 155 },
        { name: 'noindex', type: 'checkbox' },
      ],
    },
  ],
  hooks: { beforeValidate: [fillSlug] },
}

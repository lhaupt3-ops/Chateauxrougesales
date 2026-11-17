import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor, publishedOrContentTeam } from '@/access/roles'
import { pingIndexNow } from '@/lib/indexnow'
import { slugify } from '@/lib/slug'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'clientName',
    group: 'Proof',
    hidden: hideFromSales,
    description: 'Only publish a case when you have permission and real numbers.',
  },
  access: {
    read: publishedOrContentTeam,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: true }, maxPerDoc: 20 },
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'permission',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Required before publish. Confirms the client allowed their name and numbers.' },
    },
    {
      name: 'illustrative',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Tick when these numbers are an example, not a client result. The public card shows an Illustrative example label.',
      },
    },
    {
      name: 'vertical',
      type: 'select',
      options: [
        { label: 'Coaches and consultants', value: 'coaches' },
        { label: 'Course creators', value: 'courses' },
        { label: 'Agencies and B2B', value: 'agencies' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'offerPriceBand', type: 'text' },
    { name: 'challenge', type: 'textarea', required: true },
    { name: 'solution', type: 'textarea', required: true },
    {
      name: 'results',
      type: 'array',
      fields: [
        { name: 'metric', type: 'text', required: true },
        { name: 'before', type: 'text' },
        { name: 'after', type: 'text', required: true },
        { name: 'timeframe', type: 'text' },
      ],
    },
    { name: 'quote', type: 'textarea' },
    { name: 'person', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'videoUrl', type: 'text' },
    { name: 'publishedAt', type: 'date' },
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (!data.slug && typeof data.clientName === 'string') data.slug = slugify(data.clientName)
        if (typeof data.slug === 'string') data.slug = slugify(data.slug)
        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data?._status === 'published' && !data.permission) {
          throw new Error('Publish blocked. Tick permission only when the client has approved this case.')
        }
        if (data?._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag('proof', 'max')
        } catch (error) {
          const message = error instanceof Error ? error.message : ''
          if (!message.includes('static generation store missing')) console.error('[revalidate] proof', error)
        }
        if (doc?._status === 'published' && doc.illustrative !== true && doc.seo?.noindex !== true && typeof doc.slug === 'string') {
          void pingIndexNow([`/results/${doc.slug}`, '/results'])
        }
        return doc
      },
    ],
  },
}

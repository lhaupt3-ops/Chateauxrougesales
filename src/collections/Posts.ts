import type { CollectionConfig } from 'payload'
import { hideFromSales, isAdminOrEditor, publishedOrContentTeam } from '@/access/roles'
import { articleEditor } from '@/fields/lexical'
import { PILLARS } from '@/lib/options'
import { fillSlug, preparePost, rememberSlugRedirect, revalidatePost } from './hooks'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'publishedAt', 'authors', 'seoStatus'],
    listSearchableFields: ['title', 'slug'],
    description: 'Editors work here. The SEO column says what is missing before a post can be published.',
    group: 'Journal',
    hidden: hideFromSales,
    preview: (data) => {
      const slug = typeof data?.slug === 'string' ? data.slug : ''
      const secret = process.env.PREVIEW_SECRET || 'dev-preview'
      return `/next/preview?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(`/blog/${slug || 'draft'}`)}`
    },
  },
  defaultSort: '-updatedAt',
  access: {
    read: publishedOrContentTeam,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'The headline in the journal and in the admin list.' } },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Changing a published slug creates a 301 redirect.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 200,
              admin: { description: 'Up to 200 characters. Used on cards and as a meta fallback.' },
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'heroImageAlt', type: 'text' },
            {
              name: 'keyTakeaways',
              type: 'array',
              labels: { singular: 'Takeaway', plural: 'Key takeaways' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'body', type: 'richText', editor: articleEditor, required: true },
            {
              name: 'faq',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            {
              name: 'sources',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'cta',
              type: 'group',
              fields: [
                {
                  name: 'variant',
                  type: 'select',
                  defaultValue: 'card',
                  options: [
                    { label: 'Inline fit check', value: 'inline-fit-check' },
                    { label: 'Card', value: 'card' },
                    { label: 'Lead magnet', value: 'lead-magnet' },
                  ],
                },
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'resource', type: 'relationship', relationTo: 'resources' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  maxLength: 60,
                  admin: { description: '60 characters maximum, including the brand if you add it.' },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 155,
                  admin: { description: '155 characters maximum. Required before publish.' },
                },
                { name: 'canonicalUrl', type: 'text' },
                { name: 'noindex', type: 'checkbox', defaultValue: false },
                { name: 'ogImage', type: 'upload', relationTo: 'media' },
                { name: 'ogImageAlt', type: 'text' },
                {
                  name: 'primaryKeyword',
                  type: 'text',
                  admin: { description: 'Internal only. Never rendered on the page.' },
                },
                { name: 'secondaryKeywords', type: 'text' },
                {
                  name: 'serpPreview',
                  type: 'ui',
                  admin: { components: { Field: '@/components/admin/SeoPreview' } },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: { position: 'sidebar', description: 'The byline. At least one author is required before publish.' },
    },
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'authors',
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'pillar',
      type: 'select',
      options: PILLARS.map((pillar) => ({ label: pillar.label, value: pillar.value })),
      admin: {
        position: 'sidebar',
        description: 'The money page this essay supports. Service pages live in code, so this is a mapped select rather than a document relation.',
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
      admin: { position: 'sidebar', description: 'Up to 3. If empty, the page fills siblings from the same category.' },
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'When it went or will go live. A future date on a draft is the schedule.' },
    },
    {
      name: 'seoStatus',
      type: 'text',
      label: 'SEO',
      admin: { readOnly: true, position: 'sidebar', description: 'Ready, or the SEO fields still missing. Updated on save.' },
    },
    {
      name: 'substantiveUpdateAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set this only when the essay materially changes. It is the "Updated" date and the sitemap lastmod.',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Computed from the body.' },
    },
  ],
  hooks: {
    beforeValidate: [fillSlug],
    beforeChange: [preparePost],
    afterChange: [rememberSlugRedirect, revalidatePost],
  },
}

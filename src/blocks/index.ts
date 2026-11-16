import type { Block } from 'payload'

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'note',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Warning', value: 'warning' },
      ],
    },
    { name: 'text', type: 'textarea', required: true },
  ],
}

export const Takeaways: Block = {
  slug: 'takeaways',
  labels: { singular: 'Key takeaways', plural: 'Key takeaways' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'In-article CTA', plural: 'In-article CTAs' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'card',
      options: [
        { label: 'Inline fit check', value: 'inline-fit-check' },
        { label: 'Card', value: 'card' },
        { label: 'Lead magnet', value: 'lead-magnet' },
      ],
    },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'resource', type: 'relationship', relationTo: 'resources' },
  ],
}

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
  ],
}

export const StatBlock: Block = {
  slug: 'stat',
  labels: { singular: 'Stat', plural: 'Stats' },
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
    { name: 'sourceUrl', type: 'text', required: true },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    { name: 'url', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}

export const TableBlock: Block = {
  slug: 'table',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    { name: 'caption', type: 'text' },
    {
      name: 'headers',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [{ name: 'value', type: 'text' }],
        },
      ],
    },
  ],
}

export const articleBlocks = [Callout, Takeaways, CtaBlock, QuoteBlock, StatBlock, VideoBlock, TableBlock]

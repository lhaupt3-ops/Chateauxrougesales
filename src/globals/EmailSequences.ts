import type { GlobalConfig } from 'payload'
import { hideFromSales, isAdminOrEditor } from '@/access/roles'

export const EmailSequences: GlobalConfig = {
  slug: 'email-sequences',
  label: 'Email sequences',
  admin: {
    group: 'Email',
    hidden: hideFromSales,
    description:
      'Edit the subject and body of each step. Editors can change this copy. Only an admin can turn sending on, with nurtureEnabled in Site settings. Nothing is sent while that switch is off.',
  },
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'steps',
      type: 'array',
      admin: { description: 'Keys are fixed: nurture-1 to nurture-5, partial-1 to partial-3, qualified-1 to qualified-3. Leave a step out to use the code default. The first boot copies the defaults in when this list is empty.' },
      fields: [
        { name: 'key', type: 'text', required: true, admin: { description: 'Leave this key as it is. The sender matches on it.' } },
        { name: 'delayHours', type: 'number', required: true, min: 0, admin: { description: 'Hours after they enter the sequence before this email can send.' } },
        { name: 'subject', type: 'text', required: true, admin: { description: 'Inbox subject. Do not start it with a bracket tag.' } },
        { name: 'heading', type: 'text', required: true, admin: { description: 'The heading inside the email.' } },
        { name: 'body', type: 'textarea', required: true, admin: { description: 'Paragraphs separated by a blank line. The guide and apply links are added for you.' } },
      ],
    },
  ],
}

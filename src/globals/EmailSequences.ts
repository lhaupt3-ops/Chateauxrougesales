import type { GlobalConfig } from 'payload'
import { isAdmin, roleOf } from '@/access/roles'

export const EmailSequences: GlobalConfig = {
  slug: 'email-sequences',
  label: 'Email sequences',
  admin: {
    group: 'System',
    hidden: ({ user }) => roleOf(user) !== 'admin',
    description:
      'Copy for the nurture and follow-up emails. Nothing is sent until Site settings → nurtureEnabled is on. Send a preview to yourself with POST /api/admin/sequence-preview while logged in as an admin.',
  },
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'steps',
      type: 'array',
      admin: { description: 'Keys are fixed: nurture-1 to nurture-5, partial-1 to partial-3, qualified-1 to qualified-3. Leave a step out to use the code default. The first boot copies the defaults in when this list is empty.' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'delayHours', type: 'number', required: true, min: 0 },
        { name: 'subject', type: 'text', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}

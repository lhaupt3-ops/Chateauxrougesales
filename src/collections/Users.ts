import type { CollectionConfig } from 'payload'
import { adminOnly, isAdmin, isAdminField } from '@/access/roles'
import { renderEmail } from '@/lib/email-layout'
import { absoluteUrl } from '@/lib/site'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Reset your Chateaux Rouge password',
      generateEmailHTML: (args) => {
        const token = args?.token || ''
        const address = typeof args?.user?.email === 'string' ? args.user.email : 'your account'
        return renderEmail({
          preheader: 'Choose a new password for the Chateaux Rouge back office.',
          eyebrow: 'Back office',
          heading: 'Reset your password',
          paragraphs: [
            `We received a request to reset the password for ${address}. The link works for one hour.`,
            'If you did not ask for this, you can ignore the email. The password stays as it is.',
          ],
          cta: { label: 'Choose a new password', href: absoluteUrl(`/admin/reset/${token}`) },
        }).html
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    hidden: adminOnly,
    group: 'System',
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => Boolean(req.user),
    update: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Sales', value: 'sales' },
      ],
      access: { update: isAdminField },
      admin: {
        description: 'Admins manage the whole back office. Editors run the journal. Sales can read and update applications only.',
      },
    },
  ],
}

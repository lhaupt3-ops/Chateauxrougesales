import type { CollectionConfig } from 'payload'
import { adminOnly, isAdmin, isAdminField } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
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

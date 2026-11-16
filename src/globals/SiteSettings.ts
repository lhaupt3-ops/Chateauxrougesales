import { revalidatePath } from 'next/cache'
import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { isAdmin, isAdminField, roleOf } from '@/access/roles'

const revalidateSiteSettings: GlobalAfterChangeHook = () => {
  try {
    revalidatePath('/')
    revalidatePath('/pricing')
    revalidatePath('/', 'layout')
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (!message.includes('static generation store missing')) console.error('[revalidate] site settings', error)
  }
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'System',
    hidden: ({ user }) => roleOf(user) !== 'admin',
    description: 'Calendly links, notification email, guarantee copy, and the investment bands shown on the application. Placeholders stay visible until you replace them.',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      name: 'notifyEmail',
      type: 'email',
      admin: { description: 'Completed applications are emailed here. Falls back to NOTIFY_EMAIL.' },
      access: { read: isAdminField },
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'resendFrom', type: 'text', admin: { description: 'Example: Chateaux Rouge <hello@yourdomain.com>' } },
    { name: 'calendlyStrategyUrl', type: 'text', admin: { description: '30–45 min strategy call. Full https://calendly.com/... URL.' } },
    { name: 'calendlyFitUrl', type: 'text', admin: { description: '15 min fit call URL.' } },
    { name: 'introVideoUrl', type: 'text', admin: { description: 'Direct video file or YouTube URL for the confirmation page.' } },
    { name: 'closerName', type: 'text', defaultValue: 'Your strategist' },
    { name: 'closerRole', type: 'text', defaultValue: 'Sales lead' },
    { name: 'guaranteeText', type: 'textarea', required: true },
    {
      name: 'guaranteeIsPlaceholder',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Keep this on until a lawyer has reviewed the guarantee. While it is on, the public site shows a draft notice instead of the text above.' },
    },
    { name: 'noticeText', type: 'textarea', required: true },
    {
      name: 'noticeIsPlaceholder',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Keep this on until the term and notice period are confirmed. While it is on, the public site does not print the text above.' },
    },
    { name: 'timelineText', type: 'textarea', required: true },
    { name: 'bandLowLabel', type: 'text', required: true, defaultValue: '$3,000–$5,000/mo' },
    { name: 'bandMidLabel', type: 'text', required: true, defaultValue: '$5,000–$10,000/mo' },
    { name: 'bandHighLabel', type: 'text', required: true, defaultValue: '$10,000–$20,000/mo' },
    { name: 'bandTopLabel', type: 'text', required: true, defaultValue: '$20,000+/mo' },
    {
      name: 'bandsArePlaceholder',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Keep this on until the bands are the real commercial ranges.' },
    },
    { name: 'startingFrom', type: 'text', admin: { description: 'Optional. Shown on the pricing page only after you set it. Example: $5,000 setup.' } },
    { name: 'capacityPerMonth', type: 'text', admin: { description: 'Leave blank to hide scarcity. Example: 4. Only enter a number you will honour.' } },
    { name: 'linkedIn', type: 'text' },
    { name: 'youtube', type: 'text' },
    { name: 'xUrl', type: 'text', label: 'X / Twitter' },
    { name: 'instagram', type: 'text' },
  ],
}

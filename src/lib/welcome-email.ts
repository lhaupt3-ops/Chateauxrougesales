import { renderEmail } from './email-layout'

const ROLE_COPY: Record<string, string> = {
  admin: 'You can see the whole back office: the funnel, applications, the journal, and site settings.',
  editor: 'You can draft and publish the journal, proof, and media. Sales and site settings stay with an admin.',
  sales: 'You can work the application pipeline. Content and site settings stay hidden.',
}

export function welcomeMessage(input: { name: string; role: string }): { subject: string; html: string; text: string } {
  const role = input.role === 'editor' || input.role === 'sales' ? input.role : 'admin'
  const rendered = renderEmail({
    preheader: 'Your Chateaux Rouge back office login is ready.',
    eyebrow: 'Back office',
    heading: `Welcome, ${input.name || 'there'}.`,
    paragraphs: [
      `Your role is ${role}. ${ROLE_COPY[role]}`,
      'An admin set your first password separately. It is not in this email. The first time you sign in, you will choose a new one.',
      'Use the button to open the back office.',
    ],
    cta: { label: 'Open the back office', href: 'https://chateauxrouge.com/admin' },
  })
  return { subject: 'Your Chateaux Rouge back office login', ...rendered }
}

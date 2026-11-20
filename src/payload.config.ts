import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter, type ResendAdapterArgs } from '@payloadcms/email-resend'
import type { EmailAdapter } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { blockDeleteUntilPassword, blockGlobalWritesUntilPassword, blockWritesUntilPassword } from './access/password-gate'
import { adminOnly, isAdmin, isAdminOrEditor } from './access/roles'
import { Applications } from './collections/Applications'
import { Bookings } from './collections/Bookings'
import { Subscribers } from './collections/Subscribers'
import { Authors } from './collections/Authors'
import { CaseStudies } from './collections/CaseStudies'
import { Categories } from './collections/Categories'
import { Faqs } from './collections/Faqs'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Resources } from './collections/Resources'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { EmailSequences } from './globals/EmailSequences'
import { Funnel } from './globals/Funnel'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'
import { plainTextFromHtml } from './lib/email-layout'
import { resendFromIdentity } from './lib/resend-from'
import { getSiteUrl } from './lib/site'
import { skipSeedOnThisCommand } from './lib/payload'
import { seed } from './seed'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const collections = [Users, Media, Authors, Categories, Tags, Posts, CaseStudies, Resources, Faqs, Applications, Bookings, Subscribers]
for (const collection of collections) {
  collection.hooks = {
    ...collection.hooks,
    beforeChange: [...(collection.hooks?.beforeChange || []), blockWritesUntilPassword],
    beforeDelete: [...(collection.hooks?.beforeDelete || []), blockDeleteUntilPassword],
  }
}
for (const global of [SiteSettings, EmailSequences, Funnel]) {
  global.hooks = {
    ...global.hooks,
    beforeChange: [...(global.hooks?.beforeChange || []), blockGlobalWritesUntilPassword],
  }
}
const siteUrl = getSiteUrl()
const resendKey = process.env.RESEND_API_KEY?.trim() || ''
const resendFrom = resendFromIdentity(process.env.RESEND_FROM)

function resendWithPlainText(args: ResendAdapterArgs): EmailAdapter {
  const factory = resendAdapter(args)
  return (options) => {
    const adapter = factory(options)
    return {
      ...adapter,
      sendEmail: (message) => {
        const existing = typeof message.text === 'string' ? message.text.trim() : ''
        const text = existing || plainTextFromHtml(String(message.html || ''))
        const replyTo = message.replyTo || process.env.NOTIFY_EMAIL || args.defaultFromAddress
        return adapter.sendEmail({ ...message, text, replyTo })
      },
    }
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· Chateaux Rouge',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: '/brand/favicon/icon.svg' },
        { rel: 'icon', type: 'image/png', url: '/brand/favicon/favicon-32x32.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', url: '/brand/favicon/apple-touch-icon.png' },
      ],
      openGraph: {
        images: [{ url: '/brand/social/og-image-1200x630.png' }],
      },
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      beforeLogin: ['@/components/admin/BeforeLogin'],
      beforeDashboard: ['@/components/admin/Overview'],
      providers: ['@/components/admin/PasswordGate'],
      views: {
        setPassword: {
          Component: '@/components/admin/SetPassword',
          path: '/set-password',
        },
      },
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections,
  globals: [SiteSettings, EmailSequences, Funnel],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-replace-in-every-environment',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  email: resendKey
    ? resendWithPlainText({
        defaultFromAddress: resendFrom.address,
        defaultFromName: resendFrom.name,
        apiKey: resendKey,
      })
    : undefined,
  serverURL: siteUrl,
  cors: [siteUrl],
  csrf: [siteUrl],
  plugins: [
    redirectsPlugin({
      collections: ['posts', 'case-studies', 'resources'],
      redirectTypes: ['301', '308'],
      overrides: {
        admin: {
          group: 'System',
          hidden: adminOnly,
        },
        access: {
          create: isAdminOrEditor,
          update: isAdminOrEditor,
          delete: isAdmin,
        },
      },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    }),
  ],
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        return req.headers.get('authorization') === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
  onInit: async (payload) => {
    if (skipSeedOnThisCommand()) return
    await seed(payload)
  },
})

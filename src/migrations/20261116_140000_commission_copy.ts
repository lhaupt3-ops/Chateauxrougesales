import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { refreshMethodologyCopy } from '../seed/methodology'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      setupFeeIsPlaceholder: true,
      commissionIsPlaceholder: true,
      discoveryCallEnabled: false,
      nurtureEnabled: false,
      governingLawIsPlaceholder: true,
      legalName: 'Lasse Haupt',
      legalEmail: 'lhaupt3@gmail.com',
      legalCountry: 'Australia',
    },
  })
  await refreshMethodologyCopy(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Copy and placeholder flags are not reversed.
}

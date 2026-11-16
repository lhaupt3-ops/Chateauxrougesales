import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { refreshMethodologyCopy } from '../seed/methodology'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await refreshMethodologyCopy(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Copy updates are not reversed. The previous sentences were drafts.
}

import * as migration_20261116_034034_initial from './20261116_034034_initial';
import * as migration_20261116_044713_blob_storage_columns from './20261116_044713_blob_storage_columns';
import * as migration_20261116_045040_proof_bands_and_meeting_end from './20261116_045040_proof_bands_and_meeting_end';
import * as migration_20261116_060000_owner_admin_sender_and_test_leads from './20261116_060000_owner_admin_sender_and_test_leads';

export const migrations = [
  {
    up: migration_20261116_034034_initial.up,
    down: migration_20261116_034034_initial.down,
    name: '20261116_034034_initial',
  },
  {
    up: migration_20261116_044713_blob_storage_columns.up,
    down: migration_20261116_044713_blob_storage_columns.down,
    name: '20261116_044713_blob_storage_columns',
  },
  {
    up: migration_20261116_045040_proof_bands_and_meeting_end.up,
    down: migration_20261116_045040_proof_bands_and_meeting_end.down,
    name: '20261116_045040_proof_bands_and_meeting_end'
  },
  {
    up: migration_20261116_060000_owner_admin_sender_and_test_leads.up,
    down: migration_20261116_060000_owner_admin_sender_and_test_leads.down,
    name: '20261116_060000_owner_admin_sender_and_test_leads'
  },
];

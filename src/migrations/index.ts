import * as migration_20261116_034034_initial from './20261116_034034_initial';
import * as migration_20261116_044713_blob_storage_columns from './20261116_044713_blob_storage_columns';
import * as migration_20261116_045040_proof_bands_and_meeting_end from './20261116_045040_proof_bands_and_meeting_end';
import * as migration_20261116_051838_placeholder_flags from './20261116_051838_placeholder_flags';
import * as migration_20261116_055921_commission_model from './20261116_055921_commission_model';
import * as migration_20261116_060000_owner_admin_sender_and_test_leads from './20261116_060000_owner_admin_sender_and_test_leads';
import * as migration_20261116_061547_user_password_gate from './20261116_061547_user_password_gate';
import * as migration_20261116_120000_methodology_copy from './20261116_120000_methodology_copy';
import * as migration_20261116_130000_rewrite_drafts from './20261116_130000_rewrite_drafts';
import * as migration_20261116_140000_commission_copy from './20261116_140000_commission_copy';
import * as migration_20261116_063511_closer_desk from './20261116_063511_closer_desk';
import * as migration_20261116_065147_decision_makers_and_careers_index from './20261116_065147_decision_makers_and_careers_index';

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
    name: '20261116_045040_proof_bands_and_meeting_end',
  },
  {
    up: migration_20261116_051838_placeholder_flags.up,
    down: migration_20261116_051838_placeholder_flags.down,
    name: '20261116_051838_placeholder_flags',
  },
  {
    up: migration_20261116_055921_commission_model.up,
    down: migration_20261116_055921_commission_model.down,
    name: '20261116_055921_commission_model',
  },
  {
    up: migration_20261116_060000_owner_admin_sender_and_test_leads.up,
    down: migration_20261116_060000_owner_admin_sender_and_test_leads.down,
    name: '20261116_060000_owner_admin_sender_and_test_leads',
  },
  {
    up: migration_20261116_061547_user_password_gate.up,
    down: migration_20261116_061547_user_password_gate.down,
    name: '20261116_061547_user_password_gate',
  },
  {
    up: migration_20261116_120000_methodology_copy.up,
    down: migration_20261116_120000_methodology_copy.down,
    name: '20261116_120000_methodology_copy',
  },
  {
    up: migration_20261116_130000_rewrite_drafts.up,
    down: migration_20261116_130000_rewrite_drafts.down,
    name: '20261116_130000_rewrite_drafts',
  },
  {
    up: migration_20261116_140000_commission_copy.up,
    down: migration_20261116_140000_commission_copy.down,
    name: '20261116_140000_commission_copy',
  },
  {
    up: migration_20261116_063511_closer_desk.up,
    down: migration_20261116_063511_closer_desk.down,
    name: '20261116_063511_closer_desk',
  },
  {
    up: migration_20261116_065147_decision_makers_and_careers_index.up,
    down: migration_20261116_065147_decision_makers_and_careers_index.down,
    name: '20261116_065147_decision_makers_and_careers_index',
  },
];

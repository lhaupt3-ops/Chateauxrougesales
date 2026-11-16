import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config })
}

export function skipSeedOnThisCommand(): boolean {
  const args = process.argv.join(' ')
  return args.includes('migrate') || args.includes('generate:')
}

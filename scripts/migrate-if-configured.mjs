import { spawnSync } from 'node:child_process'

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

if (!url) {
  console.log(
    'DATABASE_URL and POSTGRES_URL are unset. Skipping payload migrate. Production still applies migrations when the server connects.',
  )
  process.exit(0)
}

const result = spawnSync('payload', ['migrate'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation --max-old-space-size=4096',
  },
})

process.exit(result.status ?? 1)

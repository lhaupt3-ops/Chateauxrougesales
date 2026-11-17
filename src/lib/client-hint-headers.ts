const CLIENT_HINT = 'sec-ch-prefers-color-scheme'

export type HeaderRule = {
  source: string
  headers?: { key: string; value: string }[]
  [key: string]: unknown
}

/** Keep Payload's color-scheme client hints on the admin route. Public routes must not send Critical-CH. */
export function scopeClientHintHeaders<T extends HeaderRule>(rules: T[]): T[] {
  return rules.flatMap((rule) => {
    const headers = rule.headers ?? []
    if (rule.source !== '/:path*') return [rule]
    const kept: { key: string; value: string }[] = []
    const hints: { key: string; value: string }[] = []
    for (const header of headers) {
      const key = header.key.toLowerCase()
      if (key === 'vary') {
        const tokens = header.value.split(',').map((token) => token.trim()).filter(Boolean)
        const hintTokens = tokens.filter((token) => token.toLowerCase() === CLIENT_HINT)
        const otherTokens = tokens.filter((token) => token.toLowerCase() !== CLIENT_HINT)
        if (hintTokens.length) hints.push({ key: header.key, value: hintTokens.join(', ') })
        if (otherTokens.length) kept.push({ key: header.key, value: otherTokens.join(', ') })
        else if (!hintTokens.length) kept.push(header)
        continue
      }
      if ((key === 'accept-ch' || key === 'critical-ch') && header.value.toLowerCase().includes(CLIENT_HINT)) {
        hints.push(header)
        continue
      }
      kept.push(header)
    }
    if (!hints.length) return [rule]
    return [
      ...(kept.length ? [{ ...rule, headers: kept }] : []),
      { ...rule, source: '/:path(admin|admin/.*)', headers: hints },
    ]
  })
}

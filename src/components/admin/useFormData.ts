'use client'

import { useAllFormFields } from '@payloadcms/ui'

export function useFormData(): Record<string, unknown> {
  const [fields] = useAllFormFields()
  const data: Record<string, unknown> = {}
  for (const [key, field] of Object.entries(fields)) {
    if (field && typeof field === 'object' && 'value' in field) data[key] = field.value
  }
  return data
}

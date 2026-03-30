import { z } from 'zod'
import { fallback } from '@tanstack/zod-adapter'

export const searchDefaults = { page: 1 } as const

export const searchSchema = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  tags: z.string().optional(),
  page: fallback(z.number().int().positive(), 1).default(1),
})

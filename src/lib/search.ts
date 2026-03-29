import { z } from 'zod'

export const searchDefaults = { page: 1 } as const

export const searchSchema = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  tags: z.string().optional(),
  page: z.number().int().positive().catch(1),
})

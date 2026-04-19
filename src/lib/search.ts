import { z } from 'zod'

export const vendorDirectorySearchSchema = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  features: z.string().optional(),
})

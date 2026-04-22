import { z } from 'zod'

export const vendorDirectorySearchSchema = z.object({
  q: z.string().optional(),
  features: z.string().optional(),
  peptide: z.string().optional(),
})

export const peptideDirectorySearchSchema = z.object({
  q: z.string().optional(),
  categories: z.string().optional(),
  vendor: z.string().optional(),
})

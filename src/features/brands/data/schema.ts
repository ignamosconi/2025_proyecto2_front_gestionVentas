import { z } from 'zod'

const brandSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
})
export type Brand = z.infer<typeof brandSchema>

export const brandListSchema = z.array(brandSchema)

import { z } from 'zod';

// ── List products query ───────────────────────────────────────────────────
export const listProductsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// ── Create product ────────────────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  image_url: z.string().url('Must be a valid URL').optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
});

// ── Update product (all fields optional) ─────────────────────────────────
export const updateProductSchema = createProductSchema.partial();

export type ListProductsInput = z.infer<typeof listProductsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

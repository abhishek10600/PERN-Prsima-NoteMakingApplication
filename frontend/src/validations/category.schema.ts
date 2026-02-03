import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Max 100 characters"),
  color: z.string().max(20, "Max 20 characters").optional(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

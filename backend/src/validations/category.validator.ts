import { z } from "zod";

export const createCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, "category name is required")
      .max(100, "Category name must be at most 100 characters"),

    color: z
      .string()
      .max(20, "color code must be at most 20 characters")
      .optional(),
  })
  .strict();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

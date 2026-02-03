import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),

  description: z.string().optional(),

  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Due date must be a valid date",
    }),

  // IMPORTANT: keep as string in form, convert later to number in FormData
  categoryId: z.string().optional(),
});

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;

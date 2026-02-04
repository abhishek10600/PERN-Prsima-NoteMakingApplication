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

export const updateTodoSchema = z
  .object({
    title: z.string().max(255).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),

    dueDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Due date must be a valid date",
      }),

    // keep string in form
    categoryId: z.string().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.completed !== undefined ||
      data.dueDate !== undefined ||
      data.categoryId !== undefined,
    {
      message: "Provide at least one field to update",
    },
  );

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;

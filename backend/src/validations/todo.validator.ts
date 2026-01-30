import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "title is required").max(255),
  description: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "dueDate must be a valid date",
    }),
  categoryId: z.number().int().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z
  .object({
    title: z.string().max(255).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    dueDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "dueDate must be a valid date",
      }),
    categoryId: z.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.completed !== undefined ||
      data.dueDate !== undefined ||
      data.categoryId !== undefined,
    {
      message: "Provide atlease one field to update",
    }
  )
  .strict();

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

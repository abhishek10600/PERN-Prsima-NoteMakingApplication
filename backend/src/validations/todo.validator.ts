import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "title is required").max(255),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  categoryId: z.number().int().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

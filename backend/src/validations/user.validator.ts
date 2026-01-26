import { z } from "zod";

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "username must be at least 3 characters")
      .max(255),

    email: z.email("invalid email address"),

    password: z.string().min(6, "password must be at least 6 characters"),

    country: z.string().min(2).optional(),

    age: z.number().int().min(13, "age must be at least 13").optional(),
  })
  .strict();

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

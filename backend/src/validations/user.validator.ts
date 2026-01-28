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

export const loginUserSchema = z
  .object({
    email: z.email("invalid email address").optional(),
    username: z.string().optional(),
    password: z.string(),
  })
  .refine((data) => data.email || data.username, {
    message: "either email or username is required",
    path: ["email"],
  })
  .refine((d) => !(d.email && d.username), {
    message: "provide either email or username, not both",
  })
  .strict();

export type LoginUserInput = z.infer<typeof loginUserSchema>;

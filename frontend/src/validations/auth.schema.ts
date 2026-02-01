import { z } from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be 6 characters long"),
});

export const loginUserSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type LoginUserFormData = z.infer<typeof loginUserSchema>;

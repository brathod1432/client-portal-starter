import { z } from "zod";

/**
 * Centralized validation schemas. These run on the client for UX, but the
 * same schemas should be reused on the server (route handlers / API) so
 * validation is enforced at the trust boundary — see docs/security-implementation.md.
 */

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name").max(80),
    company: z.string().min(2, "Company is required").max(120),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(12, "Use at least 12 characters")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a symbol"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Give your ticket a descriptive subject")
    .max(120, "Keep the subject under 120 characters"),
  category: z.enum([
    "technical",
    "billing",
    "account",
    "feature_request",
    "general",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z
    .string()
    .min(20, "Please add at least 20 characters of detail")
    .max(4000, "Description is too long"),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  title: z.string().max(80).optional(),
  phone: z
    .string()
    .max(30)
    .regex(/^[0-9+()\-\s]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  timezone: z.string().min(1, "Select a timezone"),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const messageSchema = z.object({
  body: z.string().min(1, "Message cannot be empty").max(4000),
});
export type MessageInput = z.infer<typeof messageSchema>;

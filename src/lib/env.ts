import { z } from "zod";

/**
 * Validated, typed access to public environment variables. Fails fast at
 * startup if the environment is misconfigured. Only NEXT_PUBLIC_* values are
 * included here since this module may be imported on the client; server-only
 * secrets must be validated in a separate server-only module.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Client Portal"),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid public environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid public environment configuration");
}

export const env = parsed.data;

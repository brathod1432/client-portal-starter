import {
  loginSchema,
  registerSchema,
  createTicketSchema,
} from "@/lib/validations";

describe("validation schemas", () => {
  it("accepts a valid login", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
      remember: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
      remember: false,
    });
    expect(result.success).toBe(false);
  });

  it("enforces a strong password on registration", () => {
    const weak = registerSchema.safeParse({
      name: "Jane Doe",
      company: "Acme",
      email: "jane@acme.com",
      password: "weak",
      confirmPassword: "weak",
      acceptTerms: true,
    });
    expect(weak.success).toBe(false);
  });

  it("requires matching passwords", () => {
    const mismatch = registerSchema.safeParse({
      name: "Jane Doe",
      company: "Acme",
      email: "jane@acme.com",
      password: "StrongPass123!",
      confirmPassword: "DifferentPass123!",
      acceptTerms: true,
    });
    expect(mismatch.success).toBe(false);
  });

  it("requires accepting the terms", () => {
    const noTerms = registerSchema.safeParse({
      name: "Jane Doe",
      company: "Acme",
      email: "jane@acme.com",
      password: "StrongPass123!",
      confirmPassword: "StrongPass123!",
      acceptTerms: false,
    });
    expect(noTerms.success).toBe(false);
  });

  it("requires a minimum ticket description length", () => {
    const short = createTicketSchema.safeParse({
      subject: "Help please",
      category: "technical",
      priority: "high",
      description: "too short",
    });
    expect(short.success).toBe(false);
  });
});

import { test, expect } from "@playwright/test";

import { login, type DemoRole } from "./utils";

test.describe("Authentication", () => {
  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("invalid credentials show a generic error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password", { exact: true }).fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("password show/hide toggle works", async ({ page }) => {
    await page.goto("/login");
    const pwd = page.getByLabel("Password", { exact: true });
    await pwd.fill("secret123");
    await expect(pwd).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(pwd).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(pwd).toHaveAttribute("type", "password");
  });

  test("account locks after repeated failed attempts", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("client@acme.example");
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Password", { exact: true }).fill("wrong-pass");
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForTimeout(700);
    }
    await expect(
      page.getByRole("button", { name: /locked — retry in/i }),
    ).toBeDisabled();
  });

  const roles: DemoRole[] = [
    "Client",
    "Support Agent",
    "Account Manager",
    "Administrator",
  ];
  for (const role of roles) {
    test(`demo account signs in: ${role}`, async ({ page }) => {
      await login(page, role);
      await expect(page).toHaveURL(/\/dashboard/);
    });
  }

  test("sign out returns to login", async ({ page }) => {
    await login(page, "Client");
    await page.getByRole("button", { name: /open account menu/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await page.waitForURL("**/login");
  });

  test("registration validates and then succeeds", async ({ page }) => {
    await page.goto("/register");
    // Submitting empty surfaces validation errors.
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText(/please enter your full name/i)).toBeVisible();

    await page.getByLabel("Full name").fill("Jamie Rivera");
    await page.getByLabel("Company").fill("Rivera Consulting");
    await page.getByLabel("Work email").fill("jamie@rivera.example");
    await page.getByLabel("Password", { exact: true }).fill("StrongPass123!");
    await page.getByLabel("Confirm password").fill("StrongPass123!");
    await page.getByRole("checkbox", { name: /accept terms/i }).check();
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard");
    await expect(
      page.getByRole("heading", { name: /welcome back, jamie/i }),
    ).toBeVisible();
  });

  test("forgot password shows a neutral confirmation", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("client@acme.example");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(
      page.getByRole("heading", { name: /check your email/i }),
    ).toBeVisible();
  });
});

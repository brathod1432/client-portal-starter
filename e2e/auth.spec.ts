import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Authentication", () => {
  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("invalid credentials show an error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password", { exact: true }).fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("a demo account can sign in and reach the dashboard", async ({
    page,
  }) => {
    await login(page, "Client");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("a signed-in user can sign out", async ({ page }) => {
    await login(page, "Client");
    await page.getByRole("button", { name: /open account menu/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await page.waitForURL("**/login");
  });
});

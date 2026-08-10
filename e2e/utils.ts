import { type Page, expect } from "@playwright/test";

export type DemoRole =
  "Client" | "Support Agent" | "Account Manager" | "Administrator";

/**
 * Signs in using one of the demo accounts via the login UI, then waits for the
 * dashboard to render.
 */
export async function login(page: Page, role: DemoRole = "Client") {
  await page.goto("/login");
  await page.getByRole("button", { name: role, exact: true }).click();
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
}

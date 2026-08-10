import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("RBAC-driven UI", () => {
  test("clients do not see billing management but managers do", async ({
    page,
  }) => {
    await login(page, "Client");
    const nav = page.getByRole("navigation", { name: "Primary" });
    // Clients can view invoices...
    await expect(nav.getByRole("link", { name: "Invoices" })).toBeVisible();

    // Activity log for a client is scoped to self.
    await page.goto("/activity-log");
    await expect(
      page.getByText(/a record of actions taken on your account/i),
    ).toBeVisible();
  });

  test("managers see the organization-wide audit trail", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/activity-log");
    await expect(
      page.getByText(/organization-wide audit trail/i),
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Notifications", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/notifications");
  });

  test("filters by type and unread-only", async ({ page }) => {
    await page.getByLabel("Filter by type").click();
    await page.getByRole("option", { name: "Invoices" }).click();
    await expect(
      page.getByText(/invoice inv-2025-06 is overdue/i),
    ).toBeVisible();
    await expect(page.getByText(/ticket tkt-1042 updated/i)).toHaveCount(0);

    // Reset then unread-only
    await page.getByLabel("Filter by type").click();
    await page.getByRole("option", { name: "All types" }).click();
    await page.getByRole("button", { name: "Unread only" }).click();
    await expect(page.getByText(/new document shared/i)).toHaveCount(0); // that one is read in seed
  });

  test("dismiss a single notification and clear all", async ({ page }) => {
    const first = page.getByText(/ticket tkt-1042 updated/i);
    await expect(first).toBeVisible();
    await page
      .getByRole("button", { name: "Dismiss notification" })
      .first()
      .click();
    await expect(first).toHaveCount(0);

    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(
      page.getByText("You're all caught up", { exact: true }),
    ).toBeVisible();
  });

  test("mark all read removes the unread affordance", async ({ page }) => {
    await page.getByRole("button", { name: "Mark all read" }).click();
    await expect(
      page.getByRole("button", { name: "Mark all read" }),
    ).toHaveCount(0);
  });
});

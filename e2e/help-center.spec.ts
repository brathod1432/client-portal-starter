import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Help center", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Client");
    await page.goto("/help-center");
  });

  test("search filters the FAQ", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Help center" }),
    ).toBeVisible();
    await page.getByLabel("Search help articles").fill("pay an invoice");
    await expect(
      page.getByRole("button", { name: /how do i pay an invoice/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /how do i raise a support ticket/i }),
    ).toHaveCount(0);
  });

  test("expands an FAQ answer", async ({ page }) => {
    await page
      .getByRole("button", { name: /how is my data protected/i })
      .click();
    await expect(page.getByText(/role-based permissions/i)).toBeVisible();
  });

  test("support shortcuts navigate", async ({ page }) => {
    await page.getByRole("link", { name: /open a ticket/i }).click();
    await expect(page).toHaveURL(/\/tickets\/new/);
  });
});

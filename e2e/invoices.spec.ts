import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Invoices / billing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Client");
    await page.goto("/invoices");
  });

  test("shows billing summary and transaction history", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Billing & invoices" }),
    ).toBeVisible();
    await expect(page.getByText("Outstanding")).toBeVisible();
    await expect(page.getByText("Paid year-to-date")).toBeVisible();
    await expect(page.getByText("INV-2025-08")).toBeVisible();
  });

  test("opens invoice detail with line items", async ({ page }) => {
    await page.getByRole("button", { name: "View INV-2025-08" }).click();
    await expect(
      page.getByRole("heading", { name: "Invoice INV-2025-08" }),
    ).toBeVisible();
    await expect(page.getByText("Managed Support — August")).toBeVisible();
    await expect(page.getByText("Total")).toBeVisible();
  });

  test("downloads a receipt for a paid invoice", async ({ page }) => {
    await page.getByRole("button", { name: "View INV-2025-07" }).click();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download receipt" }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("INV-2025-07-receipt");
  });

  test("exports invoices to CSV", async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("invoices.csv");
  });

  test("pays a pending invoice", async ({ page }) => {
    const row = page.getByRole("row", { name: /INV-2025-08/ });
    await row.getByRole("button", { name: "Pay" }).click();
    await expect(
      page.getByRole("heading", { name: "Pay invoice INV-2025-08" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Pay now" }).click();
    await expect(page.getByText(/payment received/i)).toBeVisible();
    // The paid invoice no longer offers a Pay button in its row.
    await expect(row.getByRole("button", { name: "Pay" })).toHaveCount(0);
  });
});

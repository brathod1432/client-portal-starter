import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Documents", () => {
  test("filter, search, versions and download (manager)", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/documents");

    await expect(
      page.getByText("Master Services Agreement 2025.pdf"),
    ).toBeVisible();

    // Category filter
    await page
      .getByRole("group", { name: "Filter documents by category" })
      .getByRole("button", { name: "compliance" })
      .click();
    await expect(page.getByText("SOC 2 Gap Assessment.xlsx")).toBeVisible();
    await expect(
      page.getByText("Master Services Agreement 2025.pdf"),
    ).toHaveCount(0);

    // Search (reset category first)
    await page
      .getByRole("group", { name: "Filter documents by category" })
      .getByRole("button", { name: "all" })
      .click();
    await page.getByLabel("Search documents").fill("performance");
    await expect(page.getByText("June Performance Report.pdf")).toBeVisible();

    // Version history dialog
    await page
      .getByRole("button", {
        name: /version history for june performance report/i,
      })
      .click();
    await expect(
      page.getByRole("heading", { name: "Version history" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    // Download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download" }).first().click(),
    ]);
    expect(download.suggestedFilename()).toContain(".txt");
  });

  test("manager can upload; clients cannot", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/documents");
    await page.getByRole("button", { name: "Upload" }).click();
    await expect(page.getByText(/file uploaded/i)).toBeVisible();

    await login(page, "Client");
    await page.goto("/documents");
    await expect(page.getByRole("button", { name: "Upload" })).toHaveCount(0);
  });

  test("row-level access hides restricted documents from clients", async ({
    page,
  }) => {
    await login(page, "Client");
    await page.goto("/documents");
    // Compliance doc is manager/admin only.
    await expect(page.getByText("SOC 2 Gap Assessment.xlsx")).toHaveCount(0);
    // Client-visible doc is present.
    await expect(
      page.getByText("Master Services Agreement 2025.pdf"),
    ).toBeVisible();
  });
});

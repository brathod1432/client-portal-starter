import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Activity log", () => {
  test("client sees a self-scoped log", async ({ page }) => {
    await login(page, "Client");
    await page.goto("/activity-log");
    await expect(
      page.getByText(/a record of actions taken on your account/i),
    ).toBeVisible();
  });

  test("manager sees the org-wide audit trail and can export it", async ({
    page,
  }) => {
    await login(page, "Account Manager");
    await page.goto("/activity-log");
    await expect(
      page.getByText(/organization-wide audit trail/i),
    ).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("activity-log.csv");
  });

  test("filters activity by type", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/activity-log");
    await page.getByLabel("Filter activity by type").click();
    await page.getByRole("option", { name: "Signed in" }).click();
    await expect(page.getByText(/signed in/i).first()).toBeVisible();
  });
});

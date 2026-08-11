import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Account Manager");
  });

  test("shows KPI widgets", async ({ page }) => {
    await expect(page.getByText("Active projects")).toBeVisible();
    await expect(page.getByText("Open tickets")).toBeVisible();
    await expect(page.getByText("Outstanding balance")).toBeVisible();
    await expect(page.getByText("Unread messages")).toBeVisible();
  });

  test("shows core panels", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Projects overview" }),
    ).toBeVisible();
    await expect(page.getByText("Quick actions")).toBeVisible();
    await expect(page.getByText("Account status")).toBeVisible();
    await expect(page.getByText("Upcoming tasks")).toBeVisible();
    await expect(page.getByText("Recent activity")).toBeVisible();
    await expect(page.getByText("Announcements")).toBeVisible();
  });

  test("onboarding checklist can be dismissed", async ({ page }) => {
    await expect(page.getByText("Get started")).toBeVisible();
    await page
      .getByRole("button", { name: /dismiss getting started/i })
      .click();
    await expect(page.getByText("Get started")).toHaveCount(0);
  });

  test("quick action navigates to new ticket", async ({ page }) => {
    await page
      .getByRole("link", { name: /new ticket/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/tickets\/new/);
  });

  test("projects overview links to a project", async ({ page }) => {
    await page
      .getByRole("link", { name: /store network modernization/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/projects\/prj_/);
  });
});

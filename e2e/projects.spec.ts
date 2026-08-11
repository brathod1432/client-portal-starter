import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Projects", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/projects");
  });

  test("lists projects with summary cards", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Projects", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText("Active engagements")).toBeVisible();
    await expect(page.getByText("Store Network Modernization")).toBeVisible();
  });

  test("search narrows the list", async ({ page }) => {
    await page.getByLabel("Search projects").fill("compliance");
    await expect(page.getByText("Compliance Readiness — SOC 2")).toBeVisible();
    await expect(page.getByText("Store Network Modernization")).toHaveCount(0);
  });

  test("status filter narrows the list", async ({ page }) => {
    await page.getByLabel("Filter by status").click();
    await page.getByRole("option", { name: "Completed" }).click();
    await expect(
      page.getByText("24/7 Managed Support Onboarding"),
    ).toBeVisible();
    await expect(page.getByText("Store Network Modernization")).toHaveCount(0);
  });

  test("opens a project detail with milestones", async ({ page }) => {
    await page.getByText("Store Network Modernization").click();
    await expect(page).toHaveURL(/\/projects\/prj_001/);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.getByText("Milestones")).toBeVisible();
    await expect(page.getByText("Budget utilization")).toBeVisible();
    // Breadcrumb back to list
    await page.getByRole("link", { name: "Projects" }).first().click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});

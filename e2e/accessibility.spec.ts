import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { login } from "./utils";

const routes = [
  "/dashboard",
  "/projects",
  "/tickets",
  "/documents",
  "/invoices",
];

test.describe("Accessibility (axe)", () => {
  test("login page has no serious/critical violations", async ({ page }) => {
    await page.goto("/login");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });

  for (const route of routes) {
    test(`${route} has no serious/critical violations`, async ({ page }) => {
      await login(page, "Account Manager");
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const serious = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );
      expect(serious).toEqual([]);
    });
  }
});

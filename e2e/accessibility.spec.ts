import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { login } from "./utils";

async function scan(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  return results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
}

const publicRoutes = ["/login", "/register", "/forgot-password"];
const portalRoutes = [
  "/dashboard",
  "/projects",
  "/projects/prj_001",
  "/tickets",
  "/tickets/new",
  "/tickets/tkt_1042",
  "/documents",
  "/invoices",
  "/messages",
  "/notifications",
  "/profile",
  "/settings",
  "/help-center",
  "/activity-log",
  "/showcase",
];

test.describe("Accessibility (axe) — public", () => {
  for (const route of publicRoutes) {
    test(`${route} has no serious/critical violations`, async ({ page }) => {
      await page.goto(route);
      expect(await scan(page)).toEqual([]);
    });
  }
});

test.describe("Accessibility (axe) — portal", () => {
  for (const route of portalRoutes) {
    test(`${route} has no serious/critical violations`, async ({ page }) => {
      await login(page, "Account Manager");
      await page.goto(route);
      // Let async widgets (charts, tables) settle.
      await page.waitForTimeout(400);
      expect(await scan(page)).toEqual([]);
    });
  }
});

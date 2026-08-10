import { test } from "@playwright/test";

import { login } from "./utils";

/**
 * Captures reference screenshots into docs/screenshots for the README and repo
 * viewers. Run with: npm run screenshots
 */

const shots: { path: string; file: string; wait?: string }[] = [
  { path: "/dashboard", file: "dashboard" },
  { path: "/projects", file: "projects" },
  { path: "/projects/prj_001", file: "project-detail" },
  { path: "/tickets", file: "tickets" },
  { path: "/tickets/tkt_1042", file: "ticket-detail" },
  { path: "/documents", file: "documents" },
  { path: "/invoices", file: "invoices" },
  { path: "/messages", file: "messages" },
  { path: "/notifications", file: "notifications" },
  { path: "/activity-log", file: "activity-log" },
  { path: "/settings", file: "settings" },
  { path: "/profile", file: "profile" },
  { path: "/help-center", file: "help-center" },
  { path: "/showcase", file: "showcase" },
];

test.describe("Reference screenshots", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("capture authenticated pages (light)", async ({ page }) => {
    await login(page, "Account Manager");
    for (const shot of shots) {
      await page.goto(shot.path);
      await page.waitForTimeout(900);
      await page.screenshot({
        path: `docs/screenshots/${shot.file}.png`,
        fullPage: true,
      });
    }
  });

  test("capture login and dark dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(600);
    await page.screenshot({
      path: "docs/screenshots/login.png",
      fullPage: true,
    });

    await login(page, "Administrator");
    // Toggle dark theme via the header control.
    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await page.waitForTimeout(700);
    await page.screenshot({
      path: "docs/screenshots/dashboard-dark.png",
      fullPage: true,
    });
  });
});

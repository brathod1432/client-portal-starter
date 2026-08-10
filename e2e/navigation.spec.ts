import { test, expect } from "@playwright/test";

import { login } from "./utils";

const pages = [
  { link: "Projects", heading: "Projects" },
  { link: "Tickets", heading: "Support tickets" },
  { link: "Documents", heading: "Documents" },
  { link: "Invoices", heading: "Billing & invoices" },
  { link: "Messages", heading: "Messages" },
  { link: "Notifications", heading: "Notifications" },
  { link: "Help Center", heading: "Help center" },
];

test.describe("Navigation", () => {
  test("can navigate the primary modules", async ({ page }) => {
    await login(page, "Account Manager");
    for (const p of pages) {
      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: p.link })
        .first()
        .click();
      await expect(
        page.getByRole("heading", { name: p.heading, level: 1 }),
      ).toBeVisible();
    }
  });

  test("can create a ticket end-to-end", async ({ page }) => {
    await login(page, "Client");
    await page.goto("/tickets/new");
    await page.getByLabel("Subject").fill("Playwright test ticket");
    await page
      .getByLabel("Description")
      .fill("This ticket was created by an automated end-to-end test run.");
    await page.getByRole("button", { name: "Submit ticket" }).click();
    await expect(
      page.getByRole("heading", { name: "Playwright test ticket" }),
    ).toBeVisible();
  });
});

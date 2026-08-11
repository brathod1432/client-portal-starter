import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Tickets", () => {
  test("lists tickets with an SLA overdue indicator", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/tickets");
    await expect(
      page.getByRole("heading", { name: "Support tickets" }),
    ).toBeVisible();
    await expect(page.getByText("TKT-1042")).toBeVisible();
    await expect(page.getByText("Overdue").first()).toBeVisible();
  });

  test("search and status filter narrow the list", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/tickets");
    await page.getByLabel("Search tickets").fill("duplicate charge");
    await expect(page.getByText("TKT-1035")).toBeVisible();
    await expect(page.getByText("TKT-1042")).toHaveCount(0);

    await page.getByLabel("Search tickets").fill("");
    await page.getByLabel("Filter by status").click();
    await page.getByRole("option", { name: "Open", exact: true }).click();
    await expect(page.getByText("TKT-1030")).toBeVisible();
    await expect(page.getByText("TKT-1035")).toHaveCount(0);
  });

  test("exports tickets to CSV", async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/tickets");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("tickets.csv");
  });

  test("creates a ticket with an attachment end-to-end", async ({ page }) => {
    await login(page, "Client");
    await page.goto("/tickets/new");
    await page.getByLabel("Subject").fill("Kiosk screen frozen at Store 214");
    await page
      .getByLabel("Description")
      .fill(
        "The self-service kiosk at Store 214 freezes on the welcome screen every morning.",
      );
    await page.setInputFiles('input[type="file"]', {
      name: "kiosk-photo.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-bytes"),
    });
    await expect(page.getByText("kiosk-photo.png")).toBeVisible();
    await page.getByRole("button", { name: "Submit ticket" }).click();
    await expect(
      page.getByRole("heading", { name: "Kiosk screen frozen at Store 214" }),
    ).toBeVisible();
    await expect(page.getByText("kiosk-photo.png")).toBeVisible();
  });

  test("agent can comment, assign and resolve, then CSAT appears", async ({
    page,
  }) => {
    await login(page, "Account Manager");
    await page.goto("/tickets/tkt_1042");

    // Reply
    await page.getByLabel("Add a reply").fill("Replacement dispatched today.");
    await page.getByRole("button", { name: "Send reply" }).click();
    await expect(page.getByText("Replacement dispatched today.")).toBeVisible();

    // Agent actions present for a manager
    await expect(page.getByText("Agent actions")).toBeVisible();
    await page.getByRole("button", { name: /assign to me/i }).click();
    await expect(page.getByText(/assigned to/i).first()).toBeVisible();

    // Resolve via the quick action
    await page.getByRole("button", { name: /mark resolved/i }).click();

    // CSAT prompt appears once resolved
    await expect(page.getByText("How did we do?")).toBeVisible();
    await page.getByRole("button", { name: "Rate 5 out of 5" }).click();
    await expect(page.getByText(/you rated this/i)).toBeVisible();
  });

  test("clients do not see agent actions", async ({ page }) => {
    await login(page, "Client");
    await page.goto("/tickets/tkt_1030");
    await expect(page.getByText("Agent actions")).toHaveCount(0);
    // But can still reply
    await expect(page.getByLabel("Add a reply")).toBeVisible();
  });
});

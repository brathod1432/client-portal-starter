import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("App shell", () => {
  test("command palette opens with Ctrl+K and navigates", async ({ page }) => {
    await login(page, "Account Manager");
    await page.keyboard.press("Control+k");
    const input = page.getByLabel("Search commands");
    await expect(input).toBeVisible();
    await input.fill("Invoices");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/invoices/);
  });

  test("command palette opens from the header search button", async ({
    page,
  }) => {
    await login(page, "Account Manager");
    await page.getByRole("button", { name: "Search the portal" }).click();
    await expect(page.getByLabel("Search commands")).toBeVisible();
  });

  test("keyboard shortcuts dialog opens with ?", async ({ page }) => {
    await login(page, "Account Manager");
    await page.keyboard.press("?");
    await expect(
      page.getByRole("heading", { name: "Keyboard shortcuts" }),
    ).toBeVisible();
  });

  test("help menu exposes support shortcuts", async ({ page }) => {
    await login(page, "Account Manager");
    await page.getByRole("button", { name: "Help and support" }).click();
    await page.getByRole("menuitem", { name: /open a ticket/i }).click();
    await expect(page).toHaveURL(/\/tickets\/new/);
  });

  test("theme toggle switches to dark", async ({ page }) => {
    await login(page, "Account Manager");
    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("role switcher changes what the nav exposes", async ({ page }) => {
    await login(page, "Administrator");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Invoices" })).toBeVisible();

    await page.getByRole("button", { name: /demo role/i }).click();
    await page.getByRole("menuitemradio", { name: "Support Agent" }).click();
    // Agents have no invoices:view permission, so the item disappears.
    await expect(nav.getByRole("link", { name: "Invoices" })).toHaveCount(0);
  });
});

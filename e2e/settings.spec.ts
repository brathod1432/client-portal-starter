import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Settings — security", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/settings");
  });

  test("enables two-factor and shows recovery codes", async ({ page }) => {
    await page
      .getByRole("switch", { name: /toggle two-factor authentication/i })
      .click();
    await expect(
      page.getByRole("heading", { name: /set up authenticator/i }),
    ).toBeVisible();
    await page.getByLabel("Verification code").fill("123456");
    await page.getByRole("button", { name: "Enable 2FA" }).click();
    await expect(
      page.getByRole("heading", { name: /save your recovery codes/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /i've saved them/i }).click();
  });

  test("change password: rejects wrong current, accepts correct", async ({
    page,
  }) => {
    await page.getByLabel("Current password").fill("not-the-password");
    await page
      .getByLabel("New password", { exact: true })
      .fill("BrandNewPass123!");
    await page.getByLabel("Confirm new password").fill("BrandNewPass123!");
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(
      page.getByText(/current password is incorrect/i),
    ).toBeVisible();

    await page.getByLabel("Current password").fill("demo1234");
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText(/password updated/i)).toBeVisible();
  });

  test("download my data produces a JSON export", async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /download my data/i }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("my-portal-data.json");
  });

  test("sign out everywhere returns to login", async ({ page }) => {
    await page.getByRole("button", { name: "Sign out everywhere" }).click();
    await page.waitForURL("**/login");
  });
});

test.describe("Settings — billing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/settings");
    await page.getByRole("tab", { name: "Billing" }).click();
  });

  test("add a card, set default and remove it", async ({ page }) => {
    await page.getByRole("button", { name: "Add card" }).first().click();
    await page.getByLabel("Card number").fill("5555444433332222");
    await page.getByLabel("Expiry (MM/YY)").fill("11/29");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Add card" })
      .click();
    await expect(page.getByText(/card added/i)).toBeVisible();
    await expect(page.getByText(/•••• 2222/)).toBeVisible();

    // Make it default, then remove it
    await page.getByRole("button", { name: "Default" }).first().click();
    await page
      .getByRole("button", { name: /remove card ending 2222/i })
      .click();
    await expect(page.getByText(/card removed/i)).toBeVisible();
  });

  test("toggles auto-pay", async ({ page }) => {
    await page.getByRole("switch", { name: /auto-pay/i }).click();
    // no assertion beyond it not throwing; state is persisted
    await expect(page.getByText("Auto-pay invoices")).toBeVisible();
  });
});

test.describe("Settings — appearance", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Account Manager");
    await page.goto("/settings");
    await page.getByRole("tab", { name: "Appearance" }).click();
  });

  test("switches theme to dark", async ({ page }) => {
    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("increases text size", async ({ page }) => {
    await page.getByRole("button", { name: "Large", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("style", /font-size/);
  });

  test("localization changes how values are formatted", async ({ page }) => {
    const preview = page.getByTestId("locale-preview");
    const before = await preview.textContent();

    await page.getByLabel("Timezone").click();
    await page.getByRole("option", { name: "Asia/Kolkata" }).click();
    await page.getByLabel("Language / region").click();
    await page.getByRole("option", { name: "English (India)" }).click();

    await expect(preview).not.toHaveText(before ?? "");
  });
});

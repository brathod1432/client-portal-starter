import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Messages", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Client");
    await page.goto("/messages");
  });

  test("lists conversations and opens a thread", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
    await page.getByRole("button", { name: /store 118 connectivity/i }).click();
    await expect(
      page.getByText(/replacement is being couriered/i),
    ).toBeVisible();
  });

  test("sends a reply in a conversation", async ({ page }) => {
    await page.getByRole("button", { name: /store 118 connectivity/i }).click();
    const box = page.getByLabel("Message", { exact: true });
    await box.fill("Thanks for the update — please confirm once installed.");
    await box.press("Enter");
    // The message appears in the thread (and as the list preview) — assert at
    // least one is visible.
    await expect(
      page
        .getByText("Thanks for the update — please confirm once installed.")
        .last(),
    ).toBeVisible();
  });

  test("starts a new conversation", async ({ page }) => {
    await page.getByRole("button", { name: "New message" }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: "New message" }),
    ).toBeVisible();
    await dialog.getByLabel("Subject").fill("Question about September invoice");
    await dialog
      .getByLabel("Message")
      .fill("Could you break down the September managed-support line?");
    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByText(/conversation started/i)).toBeVisible();
    await expect(
      page
        .getByRole("button", { name: /question about september invoice/i })
        .first(),
    ).toBeVisible();
  });
});

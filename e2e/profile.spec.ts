import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Profile", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Client");
    await page.goto("/profile");
  });

  test("shows identity and last sign-in", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page.getByText("Ava Thompson").first()).toBeVisible();
    await expect(page.getByText("Last sign-in")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /not you\? review account activity/i }),
    ).toBeVisible();
  });

  test("saves personal information", async ({ page }) => {
    await page.getByLabel("Job title").fill("Head of Operations");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText(/profile updated/i)).toBeVisible();
  });

  test("uploads an avatar", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', {
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-avatar"),
    });
    await expect(page.getByText(/profile photo updated/i)).toBeVisible();
  });
});

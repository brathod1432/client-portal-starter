import { test, expect } from "@playwright/test";

import { login } from "./utils";

test.describe("Showcase", () => {
  test("renders the industry adaptations", async ({ page }) => {
    await login(page, "Client");
    await page.goto("/showcase");
    await expect(page.getByRole("heading", { name: "Showcase" })).toBeVisible();
    for (const vertical of [
      "Legal Firm Portal",
      "Healthcare Portal",
      "Logistics Portal",
      "Financial Portal",
      "Insurance Portal",
      "Consulting Portal",
      "Property Management Portal",
      "Education Portal",
    ]) {
      await expect(page.getByText(vertical)).toBeVisible();
    }
  });
});

import { type Page, expect } from "@playwright/test";

export type DemoRole =
  "Client" | "Support Agent" | "Account Manager" | "Administrator";

/**
 * Signs in using one of the demo accounts via the login UI, then waits for the
 * dashboard to render.
 */
export async function login(page: Page, role: DemoRole = "Client") {
  // Pre-acknowledge the privacy notice so the bottom-right banner never
  // overlaps controls during automated interaction.
  await page.addInitScript(() => {
    localStorage.setItem(
      "cps.settings",
      JSON.stringify({ state: { consentAcknowledged: true }, version: 0 }),
    );
  });
  await page.goto("/login");
  await page.getByRole("button", { name: role, exact: true }).click();
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
}

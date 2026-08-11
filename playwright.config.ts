import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for end-to-end, accessibility and screenshot tests.
 * Boots the production server automatically. See docs/testing.md.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // A single Next server backs the whole suite; cap concurrency so a large
  // parallel run doesn't overwhelm it and cause navigation timeouts.
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI ? "html" : "list",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Dedicated port so e2e never collides with a dev server on :3000.
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

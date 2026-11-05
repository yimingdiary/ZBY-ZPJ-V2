import { defineConfig } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH = new URL(
  "./.cache/ms-playwright",
  import.meta.url,
).pathname;
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:4321", channel: "chromium" },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: true,
  },
  reporter: "list",
});

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  webServer: {
    command: "PLAYWRIGHT_WRITE_THROUGH_MOCK=1 pnpm exec next dev --port 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});

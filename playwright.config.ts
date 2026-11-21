import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 8899);

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  expect: { timeout: 15_000, toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"]],
  snapshotPathTemplate: "tests/screenshots/{projectName}/{arg}{ext}",
  use: { baseURL: `http://127.0.0.1:${PORT}/`, channel: "chrome", colorScheme: "light", deviceScaleFactor: 1 },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } }, grepInvert: /@phone/ },
    { name: "phone", use: { ...devices["Pixel 7"], channel: "chrome", deviceScaleFactor: 1 }, grep: /@phone/ },
  ],
  webServer: {
    command: process.env.SERVE ?? `pnpm exec vite build --logLevel warn && pnpm exec vite preview --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false, // (always the build of what's here now)
    timeout: 120_000,
  },
});

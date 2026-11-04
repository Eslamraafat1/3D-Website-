import { defineConfig, devices } from '@playwright/test';

// E2E tests run against the live deployment by default.
// Override with: BASE_URL=http://localhost:3000 npm test (CI runs them against a local production build).
// CHROMIUM_PATH lets you reuse an existing Chromium binary instead of `npx playwright install`.
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.BASE_URL || 'https://3-d-website-seven-xi.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      // SwiftShader keeps the WebGL hero renderable on GPU-less CI runners.
      args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    },
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});

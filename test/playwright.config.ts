import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'dot' : 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    // React Base
    {
      name: 'chromium-base',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
    },
    // Vue
    // {
    //   name: 'chromium-vue',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'http://localhost:3002',
    //   },
    // },
    // Svelte
    // {
    //   name: 'chromium-svelte',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'http://localhost:3000',
    //   },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})

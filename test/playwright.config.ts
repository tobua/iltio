import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 2,
  workers: process.env.CI ? 1 : 1,
  reporter: process.env.CI ? 'dot' : 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    // React
    {
      name: 'chromium-react',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    // Vue
    {
      name: 'chromium-vue',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
    },
    // Svelte
    {
      name: 'chromium-svelte',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3002',
      },
    },
    // React Base
    {
      name: 'chromium-base',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3003',
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: [
    // React
    {
      command: 'npm run dev --prefix ../demo/vite -- --port 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
    // Vue
    {
      command: 'npm run dev --prefix ../demo/frameworks/vue -- --port 3001',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
    },
    // Svelte
    {
      command: 'npm run dev --prefix ../demo/frameworks/svelte -- --port 3002',
      url: 'http://localhost:3002',
      reuseExistingServer: !process.env.CI,
    },
    // React Base
    {
      command: 'npm start --prefix ../demo/frameworks/base -- --port 3003 --headless',
      url: 'http://localhost:3003',
      reuseExistingServer: !process.env.CI,
    },
  ],
})

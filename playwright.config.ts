import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * Tests critical user flows to prevent regressions
 */
export default defineConfig({
  testDir: './e2e',
  
  // Run tests sequentially for critical flows
  fullyParallel: false,
  
  // Fail if test.only is committed
  forbidOnly: !!process.env.CI,
  
  // Retry on CI, don't retry locally
  retries: process.env.CI ? 2 : 0,
  
  // Single worker for sequential execution
  workers: 1,
  
  // HTML reporter for test results
  reporter: 'html',
  
  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Timeout for actions
    actionTimeout: 15000,
  },

  // Test projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

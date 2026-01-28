# E2E Testing with Playwright

## Overview

End-to-end (E2E) tests validate critical user flows to prevent regressions. These tests run against a live development server and simulate real user interactions.

## Test Structure

### Critical Flow Test
Location: `e2e/critical-flow.spec.ts`

Tests the complete user journey:
1. **Registration** - New user signup
2. **Login** - User authentication
3. **Publish Vehicle** - Create vehicle with image upload
4. **Verification** - Confirm data persistence

### Test Scenarios

#### 1. Happy Path
- User successfully completes registration
- Logs in with credentials
- Creates a vehicle with all required fields
- Verifies vehicle appears in "My Vehicles"

#### 2. Validation Tests
- Invalid file upload handling
- Required field validation
- Form submission prevention

## Running Tests

### Local Development

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all E2E tests
npx playwright test

# Run tests with UI
npx playwright test --ui

# Run specific test file
npx playwright test e2e/critical-flow.spec.ts

# Debug mode
npx playwright test --debug
```

### CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master`

Configuration: `.github/workflows/ci.yml`

## Test Configuration

File: `playwright.config.ts`

Key settings:
- **Sequential execution**: Tests run one at a time for reliability
- **Retries**: 2 retries in CI, 0 locally
- **Timeouts**: 15s for actions, 120s for server startup
- **Artifacts**: Screenshots and videos on failure

## Fixtures

Directory: `e2e/fixtures/`

Required test files:
- `test-car.jpg` - Valid vehicle image (< 5MB)
- `test-car.png` - Alternative image format
- `large-file.exe` - Invalid file for negative testing

## Debugging Failed Tests

### 1. View Test Report
```bash
npx playwright show-report
```

### 2. Inspect Screenshots
Located in `test-results/` after test failures

### 3. Watch Videos
Video recordings saved for failed tests (if enabled)

### 4. Debug Specific Test
```bash
npx playwright test --debug e2e/critical-flow.spec.ts
```

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  
  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/path');
    
    // Interact
    await page.fill('input[name="field"]', 'value');
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic selectors**: `text=`, `role=`, `testid=`
2. **Wait for navigation**: Use `waitForURL()` instead of arbitrary timeouts
3. **Expect visibility**: Always assert elements are visible before interacting
4. **Cleanup**: Reset state between tests
5. **Isolate tests**: Don't depend on previous test state

## Common Selectors

```typescript
// By text content
page.locator('text=Login')

// By role (accessible)
page.getByRole('button', { name: 'Submit' })

// By test ID (recommended)
page.getByTestId('user-profile')

// By placeholder
page.getByPlaceholder('Enter email')

// By label
page.getByLabel('Email address')

// CSS selector (last resort)
page.locator('input[name="email"]')
```

## Handling Authentication

### Option 1: Login in Test
```typescript
test('requires auth', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
  
  // Now test authenticated feature
});
```

### Option 2: Setup Authentication State
```typescript
// playwright.config.ts
projects: [
  {
    name: 'authenticated',
    use: { 
      storageState: 'auth.json' // Saved login state
    },
  }
]
```

## Performance Considerations

### Parallel vs Sequential
- **Sequential** (current): Reliable, slower
- **Parallel**: Fast, may have race conditions

To enable parallel:
```typescript
// playwright.config.ts
fullyParallel: true,
workers: 4,
```

### Test Timeout Management
```typescript
// Global timeout
test.setTimeout(60000);

// Per-test timeout
test('slow test', async ({ page }) => {
  test.setTimeout(120000);
  // ...
});
```

## Troubleshooting

### Tests Pass Locally, Fail in CI

**Possible causes:**
1. **Timing issues**: Add explicit waits
2. **Environment variables**: Check CI secrets
3. **Database state**: Ensure clean state per test
4. **Browser differences**: Test in CI browser locally

**Solution:**
```bash
# Run in CI mode locally
CI=true npx playwright test
```

### Element Not Found

**Error:**
```
Locator.click: Error: strict mode violation: locator('button') resolved to 2 elements
```

**Solution:**
```typescript
// Be more specific
await page.locator('button[type="submit"]').first().click();
```

### Upload Tests Failing

**Causes:**
- Missing fixture files
- Invalid file paths
- File size limits

**Solution:**
```typescript
const filePath = path.join(__dirname, 'fixtures', 'test-car.jpg');
await page.locator('input[type="file"]').setInputFiles(filePath);
```

## Maintenance

### Update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install chromium
```

### Clean Test Artifacts
```bash
rm -rf test-results/
rm -rf playwright-report/
```

### Review Flaky Tests
Tests that occasionally fail should be:
1. Made more deterministic
2. Have explicit waits added
3. Split into smaller, focused tests

## CI Integration

### GitHub Actions Workflow

```yaml
e2e-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

### Viewing CI Reports

1. Go to GitHub Actions tab
2. Click on failed workflow
3. Download "playwright-report" artifact
4. Extract and open `index.html`

## Future Enhancements

Potential improvements:
- **Visual regression testing**: Compare screenshots
- **API mocking**: Intercept network requests
- **Performance metrics**: Measure page load times
- **Accessibility testing**: Automated a11y checks
- **Cross-browser testing**: Firefox, Safari, mobile

## Related Files

- **Config**: `playwright.config.ts`
- **Tests**: `e2e/critical-flow.spec.ts`
- **CI**: `.github/workflows/ci.yml`
- **Fixtures**: `e2e/fixtures/`

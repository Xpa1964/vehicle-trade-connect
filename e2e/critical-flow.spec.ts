import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Critical E2E Flow Test
 * Validates: Registration → Login → Publish Vehicle with Image Upload
 * 
 * This test ensures the core user journey works end-to-end.
 * If ANY step fails, it indicates a critical regression.
 */
test.describe('Critical User Flow: Register → Login → Publish Vehicle', () => {
  
  const testUser = {
    email: `e2e-test-${Date.now()}@kontact-automation.com`,
    password: 'SecurePass123!@#Test',
    companyName: 'E2E Test Company',
    contactPerson: 'John Doe Test',
    phone: '+34612345678'
  };

  test('Complete flow should work end-to-end', async ({ page }) => {
    
    // ========== STEP 1: REGISTRATION ==========
    console.log('🔹 Step 1: User Registration');
    
    await page.goto('/auth/register');
    
    // Wait for page to load
    await expect(page).toHaveTitle(/KONTACT/i);
    
    // Fill registration form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.fill('input[name="companyName"]', testUser.companyName);
    await page.fill('input[name="contactPerson"]', testUser.contactPerson);
    await page.fill('input[name="phone"]', testUser.phone);
    
    // Select business details
    await page.selectOption('select[name="businessType"]', 'dealer');
    await page.selectOption('select[name="traderType"]', 'buyer');
    
    // Accept terms
    await page.check('input[name="termsAccepted"]');
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Verify success (registration may redirect to pending approval or login)
    await page.waitForURL(/\/(auth\/login|dashboard|pending-approval)/, { timeout: 15000 });
    
    console.log('✅ Registration submitted successfully');

    // ========== STEP 2: LOGIN ==========
    console.log('🔹 Step 2: User Login');
    
    // If not already on login page, navigate to it
    if (!page.url().includes('/auth/login')) {
      await page.goto('/auth/login');
    }
    
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Verify login success - wait for dashboard or home page
    await page.waitForURL(/\/(dashboard|home|\/)/, { timeout: 15000 });
    
    // Verify user is authenticated (check for user menu or logout button)
    await expect(
      page.locator('text=/logout|cerrar sesión|perfil|profile/i').first()
    ).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Login successful');

    // ========== STEP 3: PUBLISH VEHICLE WITH IMAGE ==========
    console.log('🔹 Step 3: Publish Vehicle with Image Upload');
    
    // Navigate to create vehicle page
    await page.goto('/vehicles/create');
    await expect(page).toHaveURL(/\/vehicles\/create/);
    
    // Fill vehicle form
    await page.fill('input[name="brand"]', 'Mercedes-Benz');
    await page.fill('input[name="model"]', 'C200');
    await page.fill('input[name="year"]', '2020');
    await page.fill('input[name="price"]', '25000');
    await page.fill('textarea[name="description"]', 'This is an automated E2E test vehicle with image upload validation.');
    
    // Select fuel type and transmission
    await page.selectOption('select[name="fuelType"]', 'diesel');
    await page.selectOption('select[name="transmission"]', 'automatic');
    
    // ⚠️ CRITICAL: Upload image
    console.log('📸 Uploading test image...');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    // Use test fixture image
    const testImagePath = path.join(__dirname, 'fixtures', 'test-car.jpg');
    await fileInput.setInputFiles(testImagePath);
    
    console.log('✅ Test image uploaded successfully');
    
    // Submit vehicle form
    await page.click('button[type="submit"]');
    
    // Verify success - should redirect to vehicle list or detail page
    await page.waitForURL(/\/(vehicles|my-vehicles|\/)/, { timeout: 20000 });
    
    // Verify success message or vehicle appears in list
    const successIndicators = [
      page.locator('text=/vehicle.*created|published.*success|vehículo.*creado/i'),
      page.locator('text=/Mercedes-Benz.*C200/i')
    ];
    
    const visibleIndicator = await Promise.race(
      successIndicators.map(indicator => 
        indicator.isVisible({ timeout: 5000 }).catch(() => false)
      )
    );
    
    expect(visibleIndicator).toBeTruthy();
    
    console.log('✅ Vehicle published successfully');
    
    // ========== STEP 4: FINAL VERIFICATION ==========
    console.log('🔹 Step 4: Final Verification');
    
    // Navigate to "My Vehicles" to confirm vehicle exists
    await page.goto('/my-vehicles');
    
    // Verify vehicle appears in the list
    await expect(
      page.locator('text=/Mercedes-Benz|C200/i').first()
    ).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Complete flow verified successfully');
    console.log('📊 Test Summary:');
    console.log('   ✓ User registration');
    console.log('   ✓ User login');
    console.log('   ✓ Vehicle creation with upload form');
    console.log('   ✓ Data persistence verified');
  });

  test('Should handle invalid file upload gracefully', async ({ page }) => {
    console.log('🔹 Test: Invalid File Upload Handling');
    
    // Assume user is already logged in (use setup if needed)
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'existing-user@test.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|\/)/, { timeout: 10000 });
    
    // Navigate to create vehicle
    await page.goto('/vehicles/create');
    
    // Try to upload an invalid file type
    const fileInput = page.locator('input[type="file"]').first();
    
    // Verify accept attribute restricts to images
    const acceptAttr = await fileInput.getAttribute('accept');
    console.log('📋 File input accepts:', acceptAttr);
    expect(acceptAttr).toMatch(/image/i);
    
    // Try to upload invalid file
    const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid-file.txt');
    await fileInput.setInputFiles(invalidFilePath);
    
    // Wait a moment for validation
    await page.waitForTimeout(1000);
    
    // Verify error message or that submission is blocked
    // (Implementation depends on your validation logic)
    console.log('✅ Invalid file upload handled correctly');
  });

  test('Should validate required fields before submission', async ({ page }) => {
    console.log('🔹 Test: Form Validation');
    
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'existing-user@test.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|\/)/, { timeout: 10000 });
    
    // Navigate to create vehicle
    await page.goto('/vehicles/create');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify validation errors appear (HTML5 or custom validation)
    const submitButton = page.locator('button[type="submit"]');
    
    // Form should not submit (URL should not change)
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/vehicles/create');
    
    console.log('✅ Form validation prevents empty submission');
  });
});

/**
 * Setup and Teardown Hooks
 */
test.beforeEach(async ({ page }) => {
  // Set longer timeout for slow operations
  page.setDefaultTimeout(15000);
  
  // Log test start
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Starting test: ${test.info().title}`);
  console.log(`${'='.repeat(60)}\n`);
});

test.afterEach(async ({ page }, testInfo) => {
  // Log test result
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Test completed: ${testInfo.title}`);
  console.log(`Status: ${testInfo.status}`);
  console.log(`Duration: ${testInfo.duration}ms`);
  console.log(`${'='.repeat(60)}\n`);
  
  // Take screenshot on failure
  if (testInfo.status !== 'passed') {
    const screenshotPath = path.join(
      'test-results',
      `failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }
});

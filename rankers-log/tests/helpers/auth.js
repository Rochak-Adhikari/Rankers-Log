import { expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load E2E environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.e2e') });

/**
 * Login helper for E2E tests
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function login(page) {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error('E2E_EMAIL and E2E_PASSWORD must be set in .env.e2e file');
  }

  // Navigate to login page
  await page.goto('/auth/login');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Fill in credentials using data-testid selectors
  await page.getByTestId('auth-email').fill(email);
  await page.getByTestId('auth-password').fill(password);

  // Click login button
  await page.getByTestId('auth-submit-login').click();

  // Wait for redirect to feed or feed container to be visible
  await Promise.race([
    page.waitForURL('**/feed', { timeout: 15000 }),
    page.waitForSelector('[data-testid="open-composer"]', { timeout: 15000 })
  ]);

  // Verify we're logged in by checking for navigation elements
  await expect(page.getByTestId('nav-feed')).toBeVisible({ timeout: 10000 });
}

/**
 * Logout helper for E2E tests
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function logout(page) {
  // Implementation depends on your logout flow
  // For now, just clear cookies and local storage
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Check if user is logged in
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>}
 */
export async function isLoggedIn(page) {
  try {
    await page.getByTestId('nav-feed').waitFor({ state: 'visible', timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

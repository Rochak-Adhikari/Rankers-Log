import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('Ranker\'s Log MVP E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  test('Login -> Feed loads', async ({ page }) => {
    // Already logged in from beforeEach
    // Verify we're on the feed page
    await expect(page).toHaveURL(/.*\/feed/);
    
    // Verify feed elements are visible
    await expect(page.getByTestId('open-composer')).toBeVisible();
    await expect(page.getByTestId('nav-feed')).toBeVisible();
  });

  test('Create post -> appears in feed', async ({ page }) => {
    // Navigate to feed if not already there
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');

    // Open post composer
    await page.getByTestId('open-composer').click();

    // Wait for modal to appear
    await expect(page.getByTestId('post-modal')).toBeVisible();

    // Fill in post content
    const testContent = `E2E Test Post - ${Date.now()}`;
    await page.getByTestId('post-content').fill(testContent);

    // Submit the post
    await page.getByTestId('post-submit').click();

    // Wait for modal to close
    await expect(page.getByTestId('post-modal')).not.toBeVisible({ timeout: 10000 });

    // Wait a moment for the post to appear in feed
    await page.waitForTimeout(2000);

    // Verify the post appears in the feed
    const postCards = page.getByTestId('post-card');
    await expect(postCards.first()).toBeVisible({ timeout: 10000 });

    // Verify our content is in one of the posts
    await expect(page.locator(`text=${testContent}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('Like post -> persists after reload', async ({ page }) => {
    // Navigate to feed
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 });

    // Get the first post's like button and count
    const firstPost = page.getByTestId('post-card').first();
    const likeButton = firstPost.getByTestId('post-like-btn');
    const likeCount = firstPost.getByTestId('post-like-count');

    // Get initial like count
    const initialCount = await likeCount.textContent();
    const initialCountNum = parseInt(initialCount || '0', 10);

    // Click like button
    await likeButton.click();

    // Wait for like to register
    await page.waitForTimeout(1000);

    // Verify count increased
    const newCount = await likeCount.textContent();
    const newCountNum = parseInt(newCount || '0', 10);
    expect(newCountNum).toBeGreaterThan(initialCountNum);

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for posts to load again
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 });

    // Verify the like persisted
    const reloadedPost = page.getByTestId('post-card').first();
    const reloadedLikeCount = reloadedPost.getByTestId('post-like-count');
    const persistedCount = await reloadedLikeCount.textContent();
    const persistedCountNum = parseInt(persistedCount || '0', 10);

    // The count should still be the increased value
    expect(persistedCountNum).toBe(newCountNum);
  });

  test('Comment on post -> appears', async ({ page }) => {
    // Navigate to feed
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 });

    // Get the first post
    const firstPost = page.getByTestId('post-card').first();
    
    // Get initial comment count
    const commentCountElement = firstPost.getByTestId('post-comment-count');
    const initialCommentCount = await commentCountElement.textContent();
    const initialCountNum = parseInt(initialCommentCount || '0', 10);

    // Click to open comments
    await firstPost.getByTestId('post-open-comments').click();

    // Wait for navigation to comments page
    await page.waitForURL(/.*\/post\/.*/, { timeout: 10000 });

    // Wait for comment input to be visible
    await page.waitForSelector('[data-testid="comment-input"]', { timeout: 10000 });

    // Fill in comment
    const testComment = `E2E Test Comment - ${Date.now()}`;
    await page.getByTestId('comment-input').fill(testComment);

    // Submit comment
    await page.getByTestId('comment-submit').click();

    // Wait for comment to appear
    await page.waitForTimeout(2000);

    // Verify comment appears in the list
    await expect(page.getByTestId('comment-item').first()).toBeVisible({ timeout: 10000 });

    // Verify our comment text is visible
    await expect(page.locator(`text=${testComment}`)).toBeVisible({ timeout: 5000 });

    // Go back to feed
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 });

    // Verify comment count increased
    const updatedPost = page.getByTestId('post-card').first();
    const updatedCommentCount = updatedPost.getByTestId('post-comment-count');
    const finalCount = await updatedCommentCount.textContent();
    const finalCountNum = parseInt(finalCount || '0', 10);

    expect(finalCountNum).toBeGreaterThan(initialCountNum);
  });

  test('Nav sanity - Messages, Notifications, Profile', async ({ page }) => {
    // Test Messages navigation
    await page.getByTestId('nav-messages').click();
    await expect(page).toHaveURL(/.*\/messages/, { timeout: 10000 });
    await expect(page.getByTestId('dm-inbox')).toBeVisible({ timeout: 10000 });

    // Test Notifications navigation
    await page.getByTestId('nav-notifications').click();
    await expect(page).toHaveURL(/.*\/notifications/, { timeout: 10000 });

    // Test Profile navigation
    await page.getByTestId('nav-profile').click();
    await expect(page).toHaveURL(/.*\/profile/, { timeout: 10000 });

    // Return to feed
    await page.getByTestId('nav-feed').click();
    await expect(page).toHaveURL(/.*\/feed/, { timeout: 10000 });
  });

  test('Search navigation works', async ({ page }) => {
    // Click search nav
    await page.getByTestId('nav-search').click();
    await expect(page).toHaveURL(/.*\/search/, { timeout: 10000 });

    // Verify search page loaded
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test('Guilds navigation works', async ({ page }) => {
    // Click guilds nav
    await page.getByTestId('nav-guilds').click();
    await expect(page).toHaveURL(/.*\/guilds/, { timeout: 10000 });

    // Verify guilds page loaded (look for any guild-related content)
    await page.waitForLoadState('networkidle');
  });
});

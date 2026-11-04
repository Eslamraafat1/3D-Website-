import { test, expect } from '@playwright/test';
import { isMobile, openPrimaryNav, trackErrors } from './helpers.js';

test.describe('Home & navigation', () => {
  test('home renders the hero, primary CTA and no console errors', async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto('/en');
    expect(res.status()).toBe(200);
    await expect(page).toHaveTitle(/MONOLITH®/);
    const hero = page.getByRole('heading', { level: 1 });
    await expect(hero).toContainText('WE SHAPE');
    await expect(hero).toContainText('OUTLASTS US.');
    await expect(page.getByRole('link', { name: 'Explore our work' })).toBeVisible();
    await page.mouse.wheel(0, 2500); // exercise scroll-driven sections
    await page.waitForTimeout(800);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('unprefixed paths redirect to a locale (proxy.ts)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await page.goto('/work');
    await expect(page).toHaveURL(/\/en\/work$/);
  });

  test('Arabic visitors are redirected to /ar via Accept-Language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'ar', extraHTTPHeaders: { 'Accept-Language': 'ar' } });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/ar$/);
    await context.close();
  });

  test('primary navigation reaches every section page', async ({ page }, testInfo) => {
    const pages = [['Work', /\/en\/work$/, 'Work'], ['Studio', /\/en\/studio$/], ['Approach', /\/en\/approach$/], ['Journal', /\/en\/journal$/], ['Contact', /\/en\/contact$/]];
    await page.goto('/en');
    for (const [name, url] of pages) {
      const nav = await openPrimaryNav(page, testInfo);
      await nav.getByRole('link', { name: new RegExp(`^${name}`) }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      if (!isMobile(testInfo)) {
        await expect(nav.getByRole('link', { name: new RegExp(`^${name}`) })).toHaveAttribute('aria-current', 'page');
      }
    }
  });

  test('theme toggle switches and persists across reloads', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/en/studio');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  });

  test('skip link moves focus to main content', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), 'keyboard flow');
    await page.goto('/en/studio');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

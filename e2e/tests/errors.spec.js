import { test, expect } from '@playwright/test';

test.describe('404 handling', () => {
  test('unknown route answers 404 with the styled, noindexed not-found page', async ({ page }) => {
    const res = await page.goto('/en/this-page-does-not-exist');
    expect(res.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist.');
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
    await page.getByRole('link', { name: 'Return home' }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test('unknown project slug renders the not-found page (not an empty case study)', async ({ page }) => {
    await page.goto('/en/work/not-a-real-project');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist.');
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
  });

  test('Arabic 404 is localised', async ({ page }) => {
    await page.goto('/ar/journal/not-a-real-article');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('هذه الصفحة غير موجودة.');
  });
});

test.describe('Reduced motion', () => {
  test('content is visible immediately and the intro curtain is skipped', async ({ page }) => {
    // emulateMedia is applied reliably on every Chromium build; the `reducedMotion` context
    // option was not honoured by the browser Playwright 1.48 installs on CI.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en');
    await expect(page.locator('.curtain')).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // No WebGL canvas: the static SVG artwork is used instead.
    await expect(page.locator('section[aria-labelledby="hero-title"] canvas')).toHaveCount(0);
  });
});

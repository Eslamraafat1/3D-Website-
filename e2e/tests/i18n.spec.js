import { test, expect } from '@playwright/test';

test.describe('Bilingual EN / AR (RTL)', () => {
  for (const [lang, dir] of [['en', 'ltr'], ['ar', 'rtl']]) {
    test(`/${lang} is server-rendered with lang="${lang}" dir="${dir}"`, async ({ request }) => {
      const html = await (await request.get(`/${lang}/work`)).text();
      expect(html).toMatch(new RegExp(`<html[^>]*lang="${lang}"[^>]*dir="${dir}"`));
    });
  }

  test('language switch keeps the current page and flips direction', async ({ page }) => {
    await page.goto('/en/work/desert-observatory');
    await page.getByRole('link', { name: 'Switch language to Arabic' }).click();
    await expect(page).toHaveURL(/\/ar\/work\/desert-observatory$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('مرصد الصحراء');

    await page.getByRole('link', { name: 'Switch language to English' }).click();
    await expect(page).toHaveURL(/\/en\/work\/desert-observatory$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('the chosen language is remembered for unprefixed URLs', async ({ page }) => {
    await page.goto('/en/studio');
    await page.getByRole('link', { name: 'Switch language to Arabic' }).click();
    await expect(page).toHaveURL(/\/ar\/studio$/);
    await page.goto('/approach');
    await expect(page).toHaveURL(/\/ar\/approach$/);
  });

  test('Arabic form validation messages are localised', async ({ page }) => {
    await page.goto('/ar/contact', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'أرسل الاستفسار' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'يرجى تصحيح الحقول المظلَّلة.' })).toBeVisible();
  });
});

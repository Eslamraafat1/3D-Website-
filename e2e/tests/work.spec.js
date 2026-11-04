import { test, expect } from '@playwright/test';
import { trackErrors } from './helpers.js';

const status = (page) => page.getByRole('status').filter({ hasText: /Showing/ });

test.describe('Work archive', () => {
  test('lists all projects and filters by category, mirrored in the URL', async ({ page }) => {
    await page.goto('/en/work');
    await expect(status(page)).toHaveText('Showing 8 of 8 projects');

    await page.getByRole('group', { name: 'Category' }).getByRole('button', { name: 'Residential' }).click();
    await expect(status(page)).toHaveText('Showing 3 of 8 projects');
    await expect(page).toHaveURL(/[?&]category=residential/);
    await expect(page.getByRole('group', { name: 'Category' }).getByRole('button', { name: 'Residential' })).toHaveAttribute('aria-pressed', 'true');

    // State is restored from a shared URL.
    await page.reload();
    await expect(status(page)).toHaveText('Showing 3 of 8 projects');

    await page.getByRole('button', { name: 'Clear filters' }).first().click();
    await expect(status(page)).toHaveText('Showing 8 of 8 projects');
    await expect(page).not.toHaveURL(/category=/);
  });

  test('location filter + search, then the empty state', async ({ page }) => {
    await page.goto('/en/work');
    await page.getByLabel('Location').selectOption('Italy');
    await expect(status(page)).toHaveText('Showing 3 of 8 projects');
    await expect(page).toHaveURL(/location=Italy/);

    await page.getByRole('searchbox', { name: 'Search projects' }).fill('quarry');
    await expect(status(page)).toHaveText('Showing 1 of 8 projects');
    await expect(page.getByRole('link', { name: /Quarry Hotel/ }).first()).toBeVisible();

    await page.getByRole('searchbox', { name: 'Search projects' }).fill('no such building');
    await expect(page.getByText('No projects match these filters.')).toBeVisible();
  });

  test('list view sorted by name A–Z', async ({ page }) => {
    await page.goto('/en/work?view=list&sort=name');
    await expect(page.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Sort')).toHaveValue('name');
    const titles = await page.locator('main ul a[href*="/en/work/"] .display').allTextContents();
    expect(titles.length).toBe(8);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'en')));
  });

  test('opening a case study from the archive', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/en/work?view=list');
    await page.getByRole('link', { name: /House of Silence/ }).first().click();
    await expect(page).toHaveURL(/\/en\/work\/house-of-silence$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('House of Silence');
    await expect(page.getByRole('heading', { name: 'Brief' })).toBeAttached();
    await expect(page.getByRole('link', { name: /Start a project inquiry/ })).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('case study previous / next navigation', async ({ page }) => {
    await page.goto('/en/work/house-of-silence');
    const pager = page.getByRole('navigation', { name: 'Previous project / Next project' });
    const next = pager.getByRole('link', { name: /Next project/ });
    const href = await next.getAttribute('href');
    expect(href).toMatch(/^\/en\/work\/[a-z0-9-]+$/);
    expect(href).not.toBe('/en/work/house-of-silence');
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('journal article opens from the journal index', async ({ page }) => {
    await page.goto('/en/journal');
    const first = page.locator('main a[href^="/en/journal/"]').first();
    const href = await first.getAttribute('href');
    await first.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('time[datetime]').first()).toBeAttached();
  });
});

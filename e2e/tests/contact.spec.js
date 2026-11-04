import { test, expect } from '@playwright/test';

test.describe('Contact — inquiry form (demo, nothing is sent)', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for hydration: the form is a controlled React component.
    await page.goto('/en/contact', { waitUntil: 'networkidle' });
  });

  test('empty submit shows an error summary and marks required fields invalid', async ({ page }) => {
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    const summary = page.getByRole('alert').filter({ hasText: 'Please correct the highlighted fields.' });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    for (const label of ['Name *', 'Email *', 'Project location *', 'Project description *']) {
      await expect(page.getByLabel(label)).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(page.getByText('Please enter your name.').first()).toBeVisible();
    await expect(page.getByText('Please choose a project type.').first()).toBeVisible();
  });

  test('validates email format and a minimum description length', async ({ page }) => {
    const email = page.getByLabel('Email *');
    await email.fill('not-an-email');
    await email.blur();
    await expect(page.locator('#email-err')).toHaveText('Enter a valid email address, such as name@example.com.');
    await email.fill('ada@example.com');
    await expect(page.locator('#email-err')).toHaveCount(0);
    await expect(email).not.toHaveAttribute('aria-invalid', 'true');

    const desc = page.getByLabel('Project description *');
    await desc.fill('Too short');
    await desc.blur();
    await expect(page.locator('#description-err')).toBeVisible();
  });

  test('a valid inquiry reaches the success state with a reference', async ({ page }) => {
    await page.getByLabel('Name *').fill('Ada Lovelace');
    await page.getByLabel('Email *').fill('ada@example.com');
    await page.getByLabel('Project type *').selectOption('cultural');
    await page.getByLabel('Project location *').fill('Lisbon, Portugal');
    await page.getByLabel('Project description *').fill('A small public library carved into a hillside, with natural light from above.');
    await page.getByRole('checkbox').check();
    await expect(page.getByRole('checkbox')).toBeChecked();
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.getByRole('button', { name: 'Sending…' })).toBeVisible();
    const done = page.getByRole('status').filter({ hasText: 'Thank you' });
    await expect(done).toBeVisible();
    await expect(done).toContainText(/MN-\d{5}-\d{2}/);
    await done.getByRole('button', { name: 'Send another inquiry' }).click();
    await expect(page.getByLabel('Name *')).toHaveValue('');
  });
});

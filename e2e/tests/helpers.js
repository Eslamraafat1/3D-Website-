import { expect } from '@playwright/test';

/** Parses every JSON-LD block on the page. */
export async function jsonLd(page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b)).flat();
}

/** Flattens @graph containers so each node can be searched by @type. */
export const nodes = (docs) => docs.flatMap((d) => d['@graph'] ?? [d]);
export const hasType = (node, type) => [].concat(node['@type']).includes(type);

/** Collects console errors and uncaught exceptions for the lifetime of the page. */
export function trackErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    // Headless GPU noise from the WebGL hero, not an application error.
    if (/WebGL|GPU stall|GL_|swiftshader/i.test(text)) return;
    errors.push(text);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

export const isMobile = (testInfo) => testInfo.project.name.startsWith('mobile');

/** Opens the primary navigation (inline on desktop, dialog on mobile) and returns its locator. */
export async function openPrimaryNav(page, testInfo, label = 'Primary navigation') {
  if (isMobile(testInfo)) {
    await page.getByRole('button', { name: /open menu|افتح القائمة/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    return dialog.getByRole('navigation', { name: label });
  }
  return page.getByRole('banner').getByRole('navigation', { name: label });
}

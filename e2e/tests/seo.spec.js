import { test, expect } from '@playwright/test';
import { hasType, jsonLd, nodes } from './helpers.js';

// SEO output is identical on every viewport, so these run once (desktop project only).
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chrome', 'viewport-independent');
});

const absoluteHttps = (url) => {
  expect(url, 'must be an absolute https URL').toMatch(/^https:\/\//);
  expect(url, 'must never point to localhost or a placeholder domain').not.toMatch(/localhost|127\.0\.0\.1|\.example\b/);
};

test.describe('Technical SEO', () => {
  for (const path of ['/en', '/ar', '/en/work', '/en/work/house-of-silence', '/ar/journal/the-weight-of-light']) {
    test(`${path}: canonical, hreflang and Open Graph are absolute production URLs`, async ({ page }) => {
      await page.goto(path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      absoluteHttps(canonical);
      expect(new URL(canonical).pathname).toBe(path);

      const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((ls) => Object.fromEntries(ls.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')])));
      expect(Object.keys(alternates).sort()).toEqual(['ar', 'en', 'x-default']);
      Object.values(alternates).forEach(absoluteHttps);

      absoluteHttps(await page.locator('meta[property="og:url"]').getAttribute('content'));
      absoluteHttps(await page.locator('meta[property="og:image"]').first().getAttribute('content'));
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
    });
  }

  test('Open Graph image is a 1200×630 PNG', async ({ page, request }) => {
    await page.goto('/en/work');
    const url = new URL(await page.locator('meta[property="og:image"]').first().getAttribute('content'));
    const res = await request.get(url.pathname + url.search);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toBe('image/png');
    await expect(page.locator('meta[property="og:image:width"]').first()).toHaveAttribute('content', '1200');
  });

  test('site-wide JSON-LD: studio (marked fictional) + WebSite, without address or phone', async ({ page }) => {
    await page.goto('/en');
    const graph = nodes(await jsonLd(page));
    const org = graph.find((n) => hasType(n, 'Organization'));
    expect(hasType(org, 'ProfessionalService')).toBe(true);
    expect(org.disambiguatingDescription).toMatch(/fictional/i);
    expect(org.address).toBeUndefined();
    expect(org.telephone).toBeUndefined();
    const site = graph.find((n) => hasType(n, 'WebSite'));
    expect(site.inLanguage).toBe('en');
    expect(site.publisher['@id']).toBe(org['@id']);
  });

  test('case study exposes CreativeWork + BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/en/work/house-of-silence');
    const graph = nodes(await jsonLd(page));
    const work = graph.find((n) => hasType(n, 'CreativeWork'));
    expect(work.name).toBe('House of Silence');
    absoluteHttps(work.url);
    const crumbs = graph.find((n) => hasType(n, 'BreadcrumbList'));
    expect(crumbs.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(new URL(crumbs.itemListElement[2].item).pathname).toBe('/en/work/house-of-silence');
  });

  test('journal article exposes BlogPosting JSON-LD', async ({ page }) => {
    await page.goto('/en/journal/the-weight-of-light');
    const post = nodes(await jsonLd(page)).find((n) => hasType(n, 'BlogPosting'));
    expect(post.headline).toBeTruthy();
    expect(post.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  test('robots.txt allows crawling and references the absolute sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toMatch(/Allow: \//);
    const sitemap = body.match(/Sitemap: (\S+)/)[1];
    absoluteHttps(sitemap);
    expect(sitemap).toMatch(/\/sitemap\.xml$/);
  });

  test('sitemap.xml lists every page in both languages with hreflang alternates', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    // 6 section pages + 8 projects + 4 articles, × 2 locales
    expect(locs).toHaveLength(36);
    locs.forEach(absoluteHttps);
    expect(locs.some((l) => l.endsWith('/ar/work/house-of-silence'))).toBe(true);
    expect(xml).toContain('hreflang="ar"');
  });
});

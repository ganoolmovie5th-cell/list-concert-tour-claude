import { test, expect } from '@playwright/test';

// Fetch a text resource using fetch() from inside the browser context. The
// site sits behind a CDN that challenges datacenter IPs (e.g. CI runners); a
// request made from a real browser context carries the cleared challenge
// cookies, so it returns the raw body instead of a challenge page. (page.goto
// on XML would render Chromium's XML viewer, mangling the raw text.)
async function fetchText(page: import('@playwright/test').Page, path: string) {
  // Establish a browser session first so CDN challenge cookies are set.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  return page.evaluate(async (p) => {
    const r = await fetch(p, { headers: { accept: 'text/plain,*/*' } });
    return { status: r.status, text: await r.text() };
  }, path);
}

// ─────────────────────────────────────────────────────────────────
// Concert listings
// ─────────────────────────────────────────────────────────────────
test.describe('Concert listings', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ConcertID/i);
  });

  test('single H1 with selector h1.hero-title and expected text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.locator('h1.hero-title');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Konser');
  });

  test('concert grid renders at least one card after JS hydration', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.concert-card', { timeout: 15_000 });
    await expect(page.locator('.concert-card').first()).toBeVisible();
  });

  test('navbar internal links resolve correctly', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav.navbar');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Konser' })).toHaveAttribute('href', '#concerts');
    await expect(nav.getByRole('link', { name: 'Mendatang' })).toHaveAttribute('href', '#upcoming');
    await expect(nav.getByRole('link', { name: 'Venue' })).toHaveAttribute('href', '#venues');
    await expect(nav.getByRole('link', { name: 'Tentang' })).toHaveAttribute('href', '#about');
  });
});

// ─────────────────────────────────────────────────────────────────
// Sitemap
// ─────────────────────────────────────────────────────────────────
test.describe('Sitemap', () => {
  test('sitemap.xml reachable and is valid XML', async ({ page }) => {
    const { status, text } = await fetchText(page, '/sitemap.xml');
    expect(status).toBe(200);
    expect(text).toContain('<?xml');
    expect(text).toContain('<urlset');
  });

  test('sitemap contains exactly 4 URLs', async ({ page }) => {
    const { text } = await fetchText(page, '/sitemap.xml');
    const locs = text.match(/<loc>/g);
    // /about dan /contact sengaja dikeluarkan: keduanya stub redirect ber-noindex
    expect(locs, 'Expected 4 <loc> entries in sitemap.xml').toHaveLength(4);
  });

  test('sitemap includes all required canonical paths', async ({ page }) => {
    const { text } = await fetchText(page, '/sitemap.xml');
    const required = ['/', '/jadwal', '/konser', '/rumor'];
    for (const path of required) {
      expect(text, `sitemap.xml missing path: ${path}`).toContain(path);
    }
    for (const path of ['/about', '/contact']) {
      expect(text, `sitemap.xml must not list noindex stub: ${path}`).not.toContain(
        `<loc>https://www.list-concert-tour.web.id${path}</loc>`,
      );
    }
  });
});

// ─────────────────────────────────────────────────────────────────
// Robots.txt
// ─────────────────────────────────────────────────────────────────
test.describe('Robots.txt', () => {
  test('robots.txt is reachable', async ({ page }) => {
    const { status } = await fetchText(page, '/robots.txt');
    expect(status).toBe(200);
  });

  test('Disallow rules are present for sw.js and minified assets', async ({ page }) => {
    const { text } = await fetchText(page, '/robots.txt');
    expect(text, 'Missing Disallow: /sw.js').toContain('Disallow: /sw.js');
    expect(text, 'Missing Disallow: /*.min.js').toContain('Disallow: /*.min.js');
    expect(text, 'Missing Disallow: /*.min.css').toContain('Disallow: /*.min.css');
  });

  test('manifest.json is NOT blocked (PWA validation requires access)', async ({ page }) => {
    const { text } = await fetchText(page, '/robots.txt');
    expect(
      text,
      'manifest.json must not be in robots.txt Disallow — blocks Google PWA validation',
    ).not.toContain('Disallow: /manifest.json');
  });

  test('Sitemap URL is declared in robots.txt', async ({ page }) => {
    const { text } = await fetchText(page, '/robots.txt');
    expect(text).toContain('Sitemap:');
    expect(text).toContain('sitemap.xml');
  });

  test('manifest.json is directly accessible (not blocked)', async ({ page }) => {
    const { status, text } = await fetchText(page, '/manifest.json');
    expect(status).toBe(200);
    expect(text).toContain('"name"');
    expect(text).toContain('"icons"');
  });
});

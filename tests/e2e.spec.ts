import { test, expect } from '@playwright/test';

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

    // Exactly one H1 on the page
    await expect(page.locator('h1')).toHaveCount(1);

    // H1 must carry the hero-title class
    const h1 = page.locator('h1.hero-title');
    await expect(h1).toBeVisible();

    // H1 must contain the primary heading keyword
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
  test('sitemap.xml reachable and is valid XML', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
  });

  test('sitemap contains exactly 6 URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    const body = await res.text();
    const locs = body.match(/<loc>/g);
    expect(locs, 'Expected 6 <loc> entries in sitemap.xml').toHaveLength(6);
  });

  test('sitemap includes all required canonical paths', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    const body = await res.text();
    const required = ['/', '/jadwal', '/konser', '/rumor', '/about', '/contact'];
    for (const path of required) {
      expect(body, `sitemap.xml missing path: ${path}`).toContain(path);
    }
  });
});

// ─────────────────────────────────────────────────────────────────
// Robots.txt
// ─────────────────────────────────────────────────────────────────
test.describe('Robots.txt', () => {
  test('robots.txt is reachable', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
  });

  test('Disallow rules are present for sw.js and minified assets', async ({ request }) => {
    const res = await request.get('/robots.txt');
    const body = await res.text();
    expect(body, 'Missing Disallow: /sw.js').toContain('Disallow: /sw.js');
    expect(body, 'Missing Disallow: /*.min.js').toContain('Disallow: /*.min.js');
    expect(body, 'Missing Disallow: /*.min.css').toContain('Disallow: /*.min.css');
  });

  test('manifest.json is NOT blocked (PWA validation requires access)', async ({ request }) => {
    const res = await request.get('/robots.txt');
    const body = await res.text();
    expect(
      body,
      'manifest.json must not be in robots.txt Disallow — blocks Google PWA validation'
    ).not.toContain('Disallow: /manifest.json');
  });

  test('Sitemap URL is declared in robots.txt', async ({ request }) => {
    const res = await request.get('/robots.txt');
    const body = await res.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('sitemap.xml');
  });

  test('manifest.json is directly accessible (not blocked)', async ({ request }) => {
    const res = await request.get('/manifest.json');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('name');
    expect(json).toHaveProperty('icons');
  });
});

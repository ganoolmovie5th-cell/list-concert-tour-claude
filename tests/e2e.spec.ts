import { test, expect } from '@playwright/test';

test.describe('ConcertID (prod smoke)', () => {
  test('homepage loads + title ok + single H1', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ConcertID/i);

    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);

    await expect(page.locator('h1.hero-title')).toBeVisible();
  });

  test('navbar internal links exist', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav.navbar');
    await expect(nav).toBeVisible();

    // internal SEO links
    await expect(nav.getByRole('link', { name: 'Jadwal Lengkap' })).toHaveAttribute('href', '/jadwal');
    await expect(nav.getByRole('link', { name: 'Daftar Artis' })).toHaveAttribute('href', '/artis');
    await expect(nav.getByRole('link', { name: 'Venue Populer' })).toHaveAttribute('href', '/venue');
    await expect(nav.getByRole('link', { name: 'Kategori Konser' })).toHaveAttribute('href', '/kategori');
  });

  test('robots.txt + sitemap.xml reachable', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
  });
});

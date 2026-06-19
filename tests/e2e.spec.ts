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

    // navbar links
    await expect(nav.getByRole('link', { name: 'Konser' })).toHaveAttribute('href', '#concerts');
    await expect(nav.getByRole('link', { name: 'Mendatang' })).toHaveAttribute('href', '#upcoming');
    await expect(nav.getByRole('link', { name: 'Venue' })).toHaveAttribute('href', '#venues');
    await expect(nav.getByRole('link', { name: 'Tentang' })).toHaveAttribute('href', '#about');
  });

  test('robots.txt + sitemap.xml reachable', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
  });
});

import { test, expect } from '@playwright/test';

test('Smoke: Index lädt, Titel ok, keine Asset-404s', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', r => {
    const url = r.url();
    if (r.status() >= 400 && !/favicon|supabase|cdn\.jsdelivr|googleapis|gstatic|fonts|\.(?:jpg|jpeg|png|webp|gif|svg|mp4|mp3|woff2?)(?:\?|$)/i.test(url)) {
      failed.push(`${r.status()} ${url}`);
    }
  });
  await page.goto('/');
  await expect(page).toHaveTitle(/Norbert Kotzan/i);
  await page.waitForLoadState('networkidle').catch(() => {});
  expect(failed, failed.join('\n')).toEqual([]);
});

test('Smoke: /highlights.html erreichbar', async ({ page }) => {
  const resp = await page.goto('/highlights.html');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
});

test('Smoke: /impressum.html erreichbar', async ({ page }) => {
  const resp = await page.goto('/impressum.html');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
});

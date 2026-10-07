import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const standalone = new URL('../downloads/index.html', import.meta.url);
let browser;

before(async () => {
  assert.ok(existsSync(standalone), 'Create downloads/index.html before running standalone tests.');
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    headless: true,
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
});

after(async () => { await browser?.close(); });

async function openOffline(options = {}, initScript) {
  const context = await browser.newContext({
    offline: true, reducedMotion: 'reduce', viewport: { width: 1440, height: 960 }, ...options,
  });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage();
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(`${request.url().slice(0, 160)}: ${request.failure()?.errorText}`));
  page.on('request', request => {
    if (/^https?:/i.test(request.url())) externalRequests.push(request.url());
    if (request.url().startsWith('file:') && request.url().split('#')[0] !== standalone.href) {
      errors.push(`Unexpected local dependency: ${request.url()}`);
    }
  });
  page.setDefaultTimeout(12_000);
  try {
    // The managed cloud browser blocks file:// navigation. Load exactly the
    // exported document in memory while offline, without changing that policy.
    await page.setContent(await readFile(standalone, 'utf8'), { waitUntil: 'load' });
    await expect(page.locator('.hero-art')).toHaveAttribute('data-renderer', /^(webgl|fallback)$/, { timeout: 12_000 });
  } catch (error) {
    await context.close();
    throw error;
  }
  return { context, page, assertOffline() {
    assert.deepEqual(externalRequests, [], 'The standalone page must make no HTTP(S) requests.');
    assert.deepEqual(errors, [], 'The standalone page must have no JavaScript or resource errors.');
  } };
}

async function imageIsEmbeddedAndDecoded(image) {
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('src', /^(data:|blob:)/);
  await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  await image.evaluate(element => element.decode());
}

test('standalone desktop works offline with embedded projects, form and downloaded brief', { timeout: 50_000 }, async () => {
  const { context, page, assertOffline } = await openOffline();
  try {
    await expect(page).toHaveTitle('Demir Digital® — Sıradanın ötesinde.');
    await expect(page.locator('#hero-title')).toBeVisible();
    await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1');
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator('.project-card img').all()) await imageIsEmbeddedAndDecoded(image);
    for (const [key, title] of [['luma', 'Luma®'], ['forma', 'Forma®'], ['volt', 'Volt®']]) {
      const card = page.locator(`[data-project="${key}"]`);
      await card.click();
      const dialog = page.locator('#project-dialog');
      await expect(dialog, `${key} should open offline`).toBeVisible();
      await expect(dialog.locator('h2')).toContainText(title);
      await expect(dialog.locator('.eyebrow')).toContainText('KONSEPT ÇALIŞMA');
      await imageIsEmbeddedAndDecoded(dialog.locator('img'));
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(card).toBeFocused();
    }
    await page.locator('#open-contact-secondary').click();
    const dialog = page.locator('#contact-dialog');
    await expect(dialog).toBeVisible();
    await dialog.locator('button[type="submit"]').click();
    await expect(page.locator('#brief-result')).not.toBeVisible();
    assert.equal(await page.locator('#contact-form').evaluate(form => form.checkValidity()), false);
    await dialog.getByLabel('Adınız').fill('Deniz Demir');
    await dialog.getByLabel('E-posta adresiniz').fill('deniz@example.com');
    await dialog.getByLabel('İhtiyacınız').selectOption({ label: 'Dijital Deneyim' });
    const message = 'Çevrimdışı açılan tasarım üzerinden yeni marka projemizi planlıyoruz.';
    await dialog.getByLabel('Biraz projenizden bahsedin').fill(message);
    await dialog.locator('button[type="submit"]').click();
    await expect(page.locator('#brief-result')).toBeVisible();
    const preview = page.locator('#brief-preview');
    for (const value of ['Deniz Demir', 'deniz@example.com', 'Dijital Deneyim', message]) await expect(preview).toContainText(value);
    const pending = page.waitForEvent('download');
    await page.locator('#download-brief').click();
    const download = await pending;
    assert.equal(download.suggestedFilename(), 'demir-digital-proje-ozeti.txt');
    assert.equal(await download.failure(), null);
    const text = (await readFile(await download.path(), 'utf8')).replace(/^\uFEFF/, '');
    assert.equal(text, await preview.textContent());
    await page.locator('#edit-brief').click();
    await expect(dialog.getByLabel('Adınız')).toHaveValue('Deniz Demir');
    await expect(dialog.getByLabel('Biraz projenizden bahsedin')).toHaveValue(message);
    assertOffline();
  } finally { await context.close(); }
});

test('standalone mobile menu navigates offline and every section fits 390px', { timeout: 30_000 }, async () => {
  const { context, page, assertOffline } = await openOffline({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const toggle = page.locator('.menu-toggle');
    const menu = page.locator('#mobile-menu');
    await toggle.click();
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await menu.locator('a[href="#work"]').click();
    await expect(page).toHaveURL('about:blank#work');
    await expect(menu).not.toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await page.locator('.brand').scrollIntoViewIfNeeded();
    await toggle.click();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    for (const section of ['#home', '#work', '#studio', '#services', '#contact']) {
      await page.locator(section).scrollIntoViewIfNeeded();
      const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(dimensions.document <= dimensions.viewport + 1, `${section} overflows: ${JSON.stringify(dimensions)}`);
    }
    assertOffline();
  } finally { await context.close(); }
});

test('standalone falls back without WebGL while reduced-motion content remains usable', { timeout: 30_000 }, async () => {
  const { context, page, assertOffline } = await openOffline({}, () => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (String(type).includes('webgl')) return null;
      return original.call(this, type, ...args);
    };
  });
  try {
    await expect(page.locator('.hero-art')).toHaveAttribute('data-renderer', 'fallback');
    await expect(page.locator('.art-fallback')).toBeVisible();
    await expect(page.locator('.ticker-track')).toHaveCSS('animation-name', 'none');
    for (const heading of ['#hero-title', '#work-title', '#studio-title', '#services-title']) {
      await page.locator(heading).scrollIntoViewIfNeeded();
      await expect(page.locator(heading)).toBeVisible();
      await expect(page.locator(heading)).toHaveCSS('opacity', '1');
    }
    await page.locator('[data-project="luma"]').click();
    await expect(page.locator('#project-dialog')).toBeVisible();
    await imageIsEmbeddedAndDecoded(page.locator('#project-dialog img'));
    await page.keyboard.press('Escape');
    await page.locator('#open-contact-secondary').click();
    await expect(page.locator('#contact-form')).toBeVisible();
    assertOffline();
  } finally { await context.close(); }
});

import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const baseURL = 'http://127.0.0.1:4175';
let server;
let browser;
let downloads;
let serverOutput = '';

before(async () => {
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], {
    cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', chunk => { serverOutput += chunk; });
  server.stderr.on('data', chunk => { serverOutput += chunk; });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Vite stopped: ${serverOutput}`);
    try {
      if ((await fetch(baseURL)).ok) { ready = true; break; }
    } catch { /* Wait for the development server to bind its port. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, `Vite did not become ready: ${serverOutput}`);
  const executablePath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  browser = await chromium.launch({
    executablePath, headless: true,
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  downloads = await mkdtemp(join(tmpdir(), 'demir-digital-test-'));
});

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    const exited = new Promise(resolve => server.once('exit', resolve));
    server.kill('SIGTERM');
    await exited;
  }
  if (downloads) await rm(downloads, { recursive: true, force: true });
});

async function visit(options = {}, initScript) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce', ...options });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage();
  page.setDefaultTimeout(12_000);
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await expect(page.locator('.hero-art')).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
  return { context, page };
}

test('desktop content, renderer, local links and image assets load without errors', { timeout: 40_000 }, async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle('Demir Digital® — Sıradanın ötesinde.');
    await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-art')).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
    await expect(page.locator('.project-card')).toHaveCount(3);
    for (const image of await page.locator('.project-card img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links
      .map(link => link.getAttribute('href'))
      .filter(href => !document.getElementById(href.slice(1))));
    assert.deepEqual(brokenAnchors, []);
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});

test('each project opens its matching concept and Escape returns focus', { timeout: 40_000 }, async () => {
  const { context, page } = await visit();
  try {
    for (const [key, title] of [['luma', 'Luma®'], ['forma', 'Forma®'], ['volt', 'Volt®']]) {
      const card = page.locator(`[data-project="${key}"]`);
      await card.click();
      const dialog = page.locator('#project-dialog');
      await expect(dialog, `${key} project dialog should open`).toBeVisible();
      await expect(dialog.locator('h2')).toContainText(title);
      await expect(dialog.locator('.eyebrow')).toContainText('KONSEPT ÇALIŞMA');
      await expect(dialog.locator('img')).toHaveAttribute('src', `/projects/${key}.svg`);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(card).toBeFocused();
    }
  } finally { await context.close(); }
});

test('service accordions expose and hide the selected service descriptions', { timeout: 30_000 }, async () => {
  const { context, page } = await visit();
  try {
    const services = page.locator('.service');
    await expect(services).toHaveCount(4);
    for (const service of await services.all()) {
      if (await service.evaluate(element => element.open)) await service.locator('summary').click();
      await expect(service.locator('.service-body')).not.toBeVisible();
      await service.locator('summary').click();
      await expect(service).toHaveAttribute('open', '');
      await expect(service.locator('.service-body p')).toBeVisible();
      assert.ok((await service.locator('.service-body p').textContent()).length > 50);
      await service.locator('summary').click();
      await expect(service.locator('.service-body')).not.toBeVisible();
    }
  } finally { await context.close(); }
});

test('contact validates input, downloads the brief and preserves values when editing', { timeout: 35_000 }, async () => {
  const { context, page } = await visit();
  const outgoingSubmissions = [];
  page.on('request', request => { if (request.method() !== 'GET') outgoingSubmissions.push(request.url()); });
  try {
    await page.locator('#open-contact-secondary').click();
    const dialog = page.locator('#contact-dialog');
    await expect(dialog).toBeVisible();
    await dialog.locator('button[type="submit"]').click();
    await expect(page.locator('#brief-result')).not.toBeVisible();
    assert.equal(await page.locator('#contact-form').evaluate(form => form.checkValidity()), false);
    assert.equal(await page.locator('[name="name"]').evaluate(input => input.validity.valueMissing), true);
    await dialog.getByLabel('Adınız').fill('Deniz Demir');
    await dialog.getByLabel('E-posta adresiniz').fill('deniz@example.com');
    await dialog.getByLabel('İhtiyacınız').selectOption({ label: 'Dijital Deneyim' });
    const message = 'Yeni markamız için erişilebilir bir web deneyimi tasarlamak istiyoruz.';
    await dialog.getByLabel('Biraz projenizden bahsedin').fill(message);
    await dialog.locator('button[type="submit"]').click();
    await expect(page.locator('#brief-result')).toBeVisible();
    const preview = page.locator('#brief-preview');
    for (const value of ['Deniz Demir', 'deniz@example.com', 'Dijital Deneyim', message, 'Bilgiler bir sunucuya gönderilmedi.']) {
      await expect(preview).toContainText(value);
    }
    const pendingDownload = page.waitForEvent('download');
    await page.locator('#download-brief').click();
    const download = await pendingDownload;
    assert.equal(download.suggestedFilename(), 'demir-digital-proje-ozeti.txt');
    const saved = join(downloads, download.suggestedFilename());
    await download.saveAs(saved);
    const downloadedBrief = (await readFile(saved, 'utf8')).replace(/^\uFEFF/, '');
    assert.equal(downloadedBrief, await preview.textContent());
    await page.locator('#edit-brief').click();
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(dialog.getByLabel('Adınız')).toHaveValue('Deniz Demir');
    await expect(dialog.getByLabel('E-posta adresiniz')).toHaveValue('deniz@example.com');
    await expect(dialog.getByLabel('İhtiyacınız')).toHaveValue('Dijital Deneyim');
    await expect(dialog.getByLabel('Biraz projenizden bahsedin')).toHaveValue(message);
    assert.deepEqual(outgoingSubmissions, []);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  } finally { await context.close(); }
});

test('mobile menu navigates, closes with Escape and fits a 390px viewport', { timeout: 30_000 }, async () => {
  const { context, page } = await visit({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const toggle = page.locator('.menu-toggle');
    const menu = page.locator('#mobile-menu');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await menu.locator('a[href="#work"]').click();
    await expect(page).toHaveURL(`${baseURL}/#work`);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).not.toBeVisible();
    await page.locator('.brand').scrollIntoViewIfNeeded();
    await toggle.click();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    await expect(menu).not.toBeVisible();
    for (const section of ['#home', '#work', '#studio', '#services', '#contact']) {
      await page.locator(section).scrollIntoViewIfNeeded();
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(dimensions.width <= dimensions.viewport + 1, `${section} overflows: ${JSON.stringify(dimensions)}`);
    }
  } finally { await context.close(); }
});

test('reduced-motion and unavailable WebGL keep content and interactions usable', { timeout: 30_000 }, async () => {
  const { context, page } = await visit({ reducedMotion: 'reduce' }, () => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (String(type).includes('webgl')) return null;
      return original.call(this, type, ...args);
    };
  });
  try {
    await expect(page.locator('.hero-art')).toHaveAttribute('data-renderer', 'fallback');
    await expect(page.locator('.art-fallback')).toBeVisible();
    await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1');
    await expect(page.locator('.ticker-track')).toHaveCSS('animation-name', 'none');
    for (const heading of ['#work-title', '#studio-title', '#services-title']) {
      await page.locator(heading).scrollIntoViewIfNeeded();
      await expect(page.locator(heading)).toBeVisible();
      await expect(page.locator(heading)).toHaveCSS('opacity', '1');
    }
    await page.locator('[data-project="luma"]').click();
    await expect(page.locator('#project-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('#open-contact-secondary').click();
    await expect(page.locator('#contact-form')).toBeVisible();
  } finally { await context.close(); }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_PATH + '/index.mjs'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
  await page.addInitScript(() => {
    window.__roots = new Set();
    const renderers = new Map();
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true, renderers,
      inject: renderer => { const id = renderers.size + 1; renderers.set(id, renderer); return id; },
      onCommitFiberRoot: (_, root) => window.__roots.add(root),
      onCommitFiberUnmount() {}, onPostCommitFiberRoot() {},
    };
  });
  await page.goto(process.env.TEST_URL || 'http://localhost:3000');
  await page.waitForSelector('[data-scene-state="ready"]');
  await page.evaluate(() => {
    const visit = fiber => {
      if (!fiber) return;
      const value = fiber.memoizedProps?.value;
      if (value?.getState && value.getState().scene?.getObjectByName('cake-centerpiece')) window.__sceneStore = value;
      visit(fiber.child); visit(fiber.sibling);
    };
    window.__roots.forEach(root => visit(root.current));
  });
  const scene = () => page.evaluate(() => {
    const state = window.__sceneStore.getState();
    const cake = state.scene.getObjectByName('cake-centerpiece');
    const fragments = state.scene.getObjectByName('chocolate-fragments');
    return { cake: [...cake.position.toArray(), ...cake.rotation.toArray().slice(0, 3)], camera: state.camera.position.toArray(), fragments: fragments.children.map(piece => [...piece.position.toArray(), ...piece.rotation.toArray().slice(0, 3)]) };
  });
  await page.waitForTimeout(1800);
  const idleA = await scene();
  await page.screenshot({ path: 'docs/previews/animation-idle-a.png' });
  await page.waitForTimeout(1800);
  const idleB = await scene();
  await page.screenshot({ path: 'docs/previews/animation-idle-b.png' });
  assert.notDeepEqual(idleA.cake, idleB.cake, 'Cake idle motion');
  assert.notDeepEqual(idleA.fragments, idleB.fragments, 'Floating fragments');
  await page.mouse.move(780, 200);
  await page.waitForTimeout(900);
  const mouseA = await scene();
  await page.mouse.move(1350, 700);
  await page.waitForTimeout(900);
  const mouseB = await scene();
  assert(Math.abs(mouseA.camera[0] - mouseB.camera[0]) > 0.1, 'Mouse parallax');
  await page.mouse.move(100, 100);
  await page.mouse.wheel(0, 400);
  const scrollSamples = [];
  for (let i = 0; i < 12; i++) { await page.waitForTimeout(50); scrollSamples.push(await page.evaluate(() => scrollY)); }
  await page.waitForTimeout(1000);
  const scrolled = await scene();
  assert(new Set(scrollSamples.map(Math.round)).size > 3, 'Lenis smooth scroll');
  assert(Math.abs(scrolled.camera[2] - idleB.camera[2]) > 0.1, 'Scroll camera');
  assert(Math.abs(scrolled.cake[4] - idleB.cake[4]) > 0.1, 'Scroll cake rotation');
  const reveals = [];
  for (const selector of ['.product-card', '.ingredient-chapter', '.story-copy', '.final-cta']) {
    const elements = page.locator(selector);
    for (let i = 0; i < await elements.count(); i++) {
      const element = elements.nth(i);
      await element.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * 0.72));
      await page.waitForTimeout(150);
      const before = await element.getAttribute('style');
      await page.screenshot({ path: `docs/previews/animation-${selector.slice(1)}-${i}-start.png` });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `docs/previews/animation-${selector.slice(1)}-${i}-end.png` });
      reveals.push({ selector, index: i, before, styles: await element.evaluate(el => [...el.querySelectorAll('[style]')].map(child => ({ class: child.className, style: child.getAttribute('style') }))) });
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('html').evaluate(el => el.classList.contains('lenis')), false);
  assert.equal(await page.locator('.cake-scene').getAttribute('data-motion'), 'still');
  const reducedA = await scene();
  await page.waitForTimeout(500);
  assert.deepEqual(await scene(), reducedA, 'Reduced motion static scene');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(2000);
  assert.equal(await page.locator('.cake-scene').getAttribute('data-motion'), 'active');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await page.waitForTimeout(500);
  const paused = await scene();
  await page.waitForTimeout(500);
  assert.deepEqual(await scene(), paused, 'Pause control');
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'docs/previews/animation-mobile.png', fullPage: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Mobile overflow');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  fs.writeFileSync('docs/previews/animation-results.json', JSON.stringify({ idleA, idleB, mouseA, mouseB, scrolled, scrollSamples, reveals, errors }, null, 2));
  console.log('PASS: idle cake, fragments, mouse, scroll rotation/camera, Lenis, reduced motion, pause/resume, mobile overflow; section screenshots captured.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

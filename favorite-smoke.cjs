const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      localStorage.setItem('yueqian-onboarded', 'true');
      localStorage.removeItem('yueqian-favorites');
    });
    await page.goto('http://127.0.0.1:4174/', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: `${process.env.TEMP}\\codex-part-time-playwright\\home-current.png`, fullPage: true });
    await page.getByRole('button', { name: /收藏咖啡体验短视频拍摄/ }).click();
    assert.equal(await page.locator('#favorites-count').textContent(), '1');
    assert.equal(await page.locator('#hero-points').textContent(), '750');
    await page.locator('.nav button[data-go="growth"]').click();
    await page.getByRole('heading', { name: '我在关注的机会' }).waitFor();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${process.env.TEMP}\\codex-part-time-playwright\\growth-current.png`, fullPage: true });
    assert.equal(await page.locator('#favorites-list').getByText('咖啡体验短视频拍摄', { exact: true }).count(), 1);
    await page.getByRole('button', { name: '查看' }).click();
    await page.getByRole('dialog').waitFor();
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await mobile.addInitScript(() => localStorage.setItem('yueqian-onboarded', 'true'));
    await mobile.goto('http://127.0.0.1:4174/', { waitUntil: 'domcontentloaded' });
    const dimensions = await mobile.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    assert.ok(dimensions.width <= dimensions.viewport, `horizontal overflow: ${JSON.stringify(dimensions)}`);
    await mobile.screenshot({ path: `${process.env.TEMP}\\codex-part-time-playwright\\mobile-current.png`, fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: favorites persist in the growth collection and complete the growth task.');
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

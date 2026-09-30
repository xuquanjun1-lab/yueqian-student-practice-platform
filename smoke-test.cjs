const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);

const url = 'http://127.0.0.1:4174/';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => localStorage.clear());
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: '运营' }).click();
    await page.getByRole('button', { name: '拍摄' }).click();
    await page.getByRole('button', { name: /下一步/ }).click();
    await page.getByLabel('姓名').fill('许明');
    await page.getByLabel('联系方式').fill('13800138000');
    await page.getByRole('button', { name: /下一步/ }).click();
    await page.locator('#intro-file').setInputFiles({ name: 'intro.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-demo') });
    await page.getByRole('button', { name: /创建成长档案/ }).click();
    await page.getByRole('heading', { name: /欢迎来到 跃迁/ }).waitFor();
    await page.getByRole('button', { name: /开始探索/ }).click();

    await page.getByRole('button', { name: /收藏咖啡体验短视频拍摄/ }).click();
    assert.equal(await page.locator('#hero-points').textContent(), '750');
    await page.getByRole('button', { name: /查看详情/ }).last().click();
    await page.getByRole('dialog').waitFor();
    assert.match(await page.locator('#modal-description').textContent(), /协助签到/);
    assert.match(await page.locator('#modal-risk').textContent(), /公开路线/);
    await page.getByRole('button', { name: '提交接单申请' }).click();
    await page.locator('#toast.show').waitFor();

    await page.locator('.nav button[data-go="orders"]').click();
    await page.locator('#orders-page.active').waitFor();
    assert.equal(await page.getByRole('button', { name: /待确认 2/ }).count(), 1);
    await page.getByRole('button', { name: /待确认 2/ }).click();
    assert.equal(await page.locator('#order-list .order-row').count(), 2);
    await page.getByRole('button', { name: /已完成 1/ }).click();
    assert.equal(await page.locator('#order-list .order-row').count(), 1);

    await page.locator('.nav button[data-go="growth"]').click();
    await page.getByRole('heading', { name: '我在关注的机会' }).waitFor();
    assert.equal(await page.locator('#favorites-count').textContent(), '1');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${process.env.TEMP}\\codex-part-time-playwright\\prd-updated-growth.png`, fullPage: true });
    assert.deepEqual(errors, []);

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await mobile.addInitScript(() => localStorage.setItem('yueqian-onboarded', 'true'));
    await mobile.goto(url, { waitUntil: 'networkidle' });
    const dimensions = await mobile.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    assert.ok(dimensions.width <= dimensions.viewport, `horizontal overflow: ${JSON.stringify(dimensions)}`);
    console.log(`PASS: onboarding, detailed job applications, order filters, favorites, persistence and mobile layout verified. ${JSON.stringify(dimensions)}`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

import { test, expect } from '@playwright/test';
test('test1', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if(m.type() === 'error') errors.push(m.text()); });
    await page.goto('./tests/test1.html');
    // wait for 1 second
    await page.waitForTimeout(12000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
    expect(errors).toEqual([]);
});

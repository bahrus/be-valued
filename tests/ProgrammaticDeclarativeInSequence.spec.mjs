import { test, expect } from '@playwright/test';
test('ProgrammaticDeclarativeInSequence', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if(m.type() === 'error') errors.push(m.text()); });
    const requests = [];
    page.on('request', r => requests.push(r.url()));
    await page.goto('./tests/ProgrammaticDeclarativeInSequence.html');
    await page.waitForFunction(() => form.enh?.beValued?.resolved === true);
    const text = page.locator('#text');
    await text.fill('hello');
    await expect(text).toHaveAttribute('value', 'hello');
    // reset restores the initial value, and the initial (absent) attribute
    await page.click('#reset');
    await expect(text).not.toHaveAttribute('value');
    await expect(text).toHaveValue('');
    expect(errors).toEqual([]);
    // def.js registers the config directly -- no DOM monitoring is loaded.
    expect(requests.filter(u => u.includes('mount-observer'))).toEqual([]);
});

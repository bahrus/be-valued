import { test, expect } from '@playwright/test';
test('ProgrammaticImperative', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if(m.type() === 'error') errors.push(m.text()); });
    const requests = [];
    page.on('request', r => requests.push(r.url()));
    await page.goto('./tests/ProgrammaticImperative.html');
    await page.waitForFunction(() => form.enh?.beValued?.resolved === true);
    const text = page.locator('#text');
    const check = page.locator('#check');
    // Listening on 'change' only: typing (input events) doesn't reflect yet...
    await text.fill('hello');
    await page.waitForTimeout(100);
    await expect(text).not.toHaveAttribute('value');
    // ...committing the value (blur fires change) does.
    await text.blur();
    await expect(text).toHaveAttribute('value', 'hello');
    // Boolean prop: checked is reflected as a boolean attribute.
    await check.check();
    await expect(check).toHaveAttribute('checked', '');
    await check.uncheck();
    await expect(check).not.toHaveAttribute('checked');
    expect(errors).toEqual([]);
    // def.js registers the config directly -- no DOM monitoring is loaded.
    expect(requests.filter(u => u.includes('mount-observer'))).toEqual([]);
});

/* Screenshots each screen at iPhone size so layout can be eyeballed. */
import { chromium, devices } from 'playwright';
import fs from 'fs';

const OUT = process.argv[2] || '/private/tmp/claude-501/-Users-shantanusengupta-workingdir/382c149e-c0df-4a06-99a3-8766a81b7cbf/scratchpad/shots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'light' });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).split('\n')[0]));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });

await page.goto('http://localhost:5173/total/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); };

await shot('1-players-empty');

// add three players
for (const name of ['Ann', 'Bob', 'Cal']) {
  await page.getByRole('button', { name: 'Add player' }).click();
  const inputs = page.locator('input[data-id]');
  await inputs.last().fill(name);
}
await shot('2-players');

// template picker + search
await page.getByText('Template (optional)').click();
await page.waitForTimeout(700);
await shot('3-template-picker');
await page.locator('ion-searchbar input').fill('three');
await page.waitForTimeout(400);
await shot('4-template-search');
await page.getByText('Three Sisters').click();
await page.waitForTimeout(700);

// score screen
await page.locator('ion-tab-button', { hasText: 'Score' }).click();
await page.waitForTimeout(400);
const fields = page.locator('input[inputmode="numeric"]');
await fields.nth(0).fill('12');
await fields.nth(1).fill('9');
await fields.nth(2).fill('7');
await shot('5-score');

// keyboard-ish: focus a field (no real keyboard in chromium, but checks layout)
await fields.nth(2).focus();
await shot('6-score-focus');

await page.locator('ion-tab-button', { hasText: 'Sheet' }).click();
await page.waitForTimeout(400);
await shot('7-sheet');

await page.locator('ion-tab-button', { hasText: 'Ranks' }).click();
await page.waitForTimeout(400);
await shot('8-ranks');

// dark mode pass
const dark = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
const p2 = await dark.newPage();
await p2.goto('http://localhost:5173/total/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(600);
await p2.locator('ion-tab-button', { hasText: 'Score' }).click();
await p2.waitForTimeout(400);
await p2.screenshot({ path: `${OUT}/9-dark-score.png` });

console.log('page errors:', errs.length ? errs.slice(0, 5) : 'none');
console.log('written to', OUT);
await browser.close();

#!/usr/bin/env node
// StoryMotion check — opens a site (or a folder of templates) in a real browser and reports what breaks:
// sideways overflow at 375 / 1440 px, console and network errors, a loader that never leaves or whose name does not fit,
// [data-brand] texts that disagree after a rebrand, pinned scenes that never reach the end, untranslated or overflowing
// languages, loaders shown with reduced motion, content hidden without JS. Saves screenshots of every scene.
//
//   node check.cjs <folder | url> [page.html ...] [--out dir]
//
// Needs Playwright in the project (npm i -D playwright). Uses the installed Chrome if there is one,
// otherwise Playwright's Chromium (npx playwright install chromium). Exit code 1 if anything FAILs.
const http = require('http'), fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('Playwright not found. Run: npm i -D playwright   (without Chrome also: npx playwright install chromium)');
  process.exit(2);
}

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const outDir = path.resolve(outAt >= 0 ? args.splice(outAt, 2)[1] : 'storymotion-check');
const [target, ...only] = args;
if (!target) { console.error('Usage: node check.cjs <folder | url> [page.html ...] [--out dir]'); process.exit(2); }

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4' };

function serve(dir) {
  const root = path.resolve(dir);
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = path.join(root, rel.endsWith('/') ? rel + 'index.html' : rel);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve({ srv, base: `http://127.0.0.1:${srv.address().port}/` }));
  });
}

const problems = [];
const add = (page, level, msg) => { if (!problems.some(p => p.page === page && p.msg === msg)) problems.push({ page, level, msg }); };
const withParam = (url, q) => url + (url.includes('?') ? '&' : '?') + q;

function watchErrors(page) {
  const errors = [];
  const skip = u => /favicon/.test(u);
  page.on('console', m => m.type() === 'error' && !skip(m.text()) && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => r.status() >= 400 && !skip(r.url()) && errors.push(`HTTP ${r.status()} ${r.url()}`));
  return errors;
}

async function waitLoader(page, name, tag) {
  if (!(await page.evaluate(() => !!document.querySelector('.loader')))) return;
  try {
    await page.waitForFunction(() => !document.querySelector('.loader') && !document.documentElement.classList.contains('loading'), null, { timeout: 7000 });
  } catch { add(name, 'FAIL', `${tag}: loader still on screen after 7 s`); }
}

// Scroll the whole page; collect overflow, scene progress and step captions.
const audit = page => page.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const de = document.documentElement, max = () => de.scrollHeight - innerHeight;
  const scenes = [...document.querySelectorAll('.scene')];
  const seen = scenes.map(() => 0), stepOn = scenes.map(() => false);
  let overflow = 0, culprits = [];
  const describe = e => e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : '');
  for (let k = 0; k <= 40; k++) {
    scrollTo(0, max() * k / 40);
    await sleep(60);
    scenes.forEach((s, i) => {
      seen[i] = Math.max(seen[i], parseFloat(s.style.getPropertyValue('--p')) || 0);
      if (s.querySelector('[data-step].on')) stepOn[i] = true;
    });
    if (de.scrollWidth > innerWidth + 1 && de.scrollWidth > overflow) {
      overflow = de.scrollWidth;
      // outermost elements that stick out: the ones to fix (their children only follow them)
      const out = new Set([...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.stage, .loader, dialog, .gauge')));
      culprits = [...out].filter(e => !out.has(e.parentElement)).slice(0, 3).map(describe);
    }
  }
  scrollTo(0, 0);
  return { seen, stepOn, steps: scenes.map(s => s.querySelectorAll('[data-step]').length), overflow, culprits };
});

async function checkPage(browser, url, name) {
  // 1. Both widths, motion on, loader forced
  for (const [w, h] of [[375, 812], [1440, 900]]) {
    const tag = `${w}px`;
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = watchErrors(page);
    await page.goto(withParam(url, 'loader'), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);

    const brand = await page.evaluate(() => ({
      names: [...new Set([...document.querySelectorAll('[data-brand]')].map(el => el.textContent.trim().replace(/\s+/g, ' ').toLowerCase()))],
      tooWide: [...document.querySelectorAll('.loader [data-brand]')].filter(el => el.scrollWidth > innerWidth * .96).map(el => el.textContent.trim()),
    }));
    if (brand.names.length > 1) add(name, 'FAIL', `[data-brand] texts disagree: ${brand.names.join(' / ')} (rename all of them)`);
    if (brand.tooWide.length) add(name, 'WARN', `${tag}: loader name wider than the screen: ${brand.tooWide.join(', ')}`);

    await waitLoader(page, name, tag);
    await page.waitForLoadState('load');
    const a = await audit(page);
    if (a.overflow) add(name, 'FAIL', `${tag}: page is ${a.overflow}px wide (sideways scroll); widest: ${a.culprits.join(', ')}`);
    a.seen.forEach((p, i) => { if (p < 0.99) add(name, 'FAIL', `${tag}: scene ${i + 1} never reaches its end (max --p ${p.toFixed(2)})`); });
    a.steps.forEach((n, i) => { if (n && !a.stepOn[i]) add(name, 'FAIL', `${tag}: scene ${i + 1} never shows a step caption`); });

    // screenshots: top, then the middle of every scene
    fs.mkdirSync(outDir, { recursive: true });
    const base = path.join(outDir, `${name.replace(/\.html$/, '')}-${w}`);
    await page.screenshot({ path: `${base}-0-top.png` });
    const sceneTops = await page.evaluate(() => [...document.querySelectorAll('.scene')].map(s => s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) / 2));
    for (const [i, y] of sceneTops.entries()) {
      await page.evaluate(y => scrollTo(0, y), y);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${base}-${i + 1}-scene.png` });
    }
    errors.forEach(e => add(name, 'FAIL', `${tag}: ${e}`));

    // 2. Every translation at this width
    const langs = await page.evaluate(() => {
      try { return Object.keys(JSON.parse(document.getElementById('sm-i18n')?.textContent || '{}')); } catch { return ['(invalid sm-i18n JSON)']; }
    });
    for (const lang of langs) {
      if (lang.startsWith('(')) { add(name, 'FAIL', lang); continue; }
      await page.goto(withParam(url, `lang=${lang}`), { waitUntil: 'load' });
      await waitLoader(page, name, `${tag} ${lang}`);
      const missing = await page.evaluate(lang => {
        const d = JSON.parse(document.getElementById('sm-i18n').textContent)[lang] || {};
        return [...document.querySelectorAll('[data-i18n], [data-i18n-chapter]')]
          .map(el => el.dataset.i18n || el.dataset.i18nChapter).filter(k => !(k in d));
      }, lang);
      if (missing.length) add(name, 'WARN', `${lang}: ${missing.length} text(s) not translated: ${[...new Set(missing)].slice(0, 6).join(', ')}`);
      const la = await audit(page);
      if (la.overflow) add(name, 'FAIL', `${tag} ${lang}: page is ${la.overflow}px wide; widest: ${la.culprits.join(', ')}`);
      await page.screenshot({ path: `${base}-${lang}.png` });
    }
    await ctx.close();
  }

  // 3. Reduced motion: no loader, nothing broken
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = watchErrors(page);
    await page.goto(withParam(url, 'loader'), { waitUntil: 'load' });
    const shown = await page.evaluate(() => { const l = document.querySelector('.loader'); return !!l && getComputedStyle(l).display !== 'none'; });
    if (shown) add(name, 'FAIL', 'reduced motion: the loader is still shown');
    errors.forEach(e => add(name, 'FAIL', `reduced motion: ${e}`));
    await ctx.close();
  }

  // 4. No JavaScript: content visible, no loader
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load' });
    try {
      const r = await page.evaluate(() => ({
        loader: !!document.querySelector('.loader') && getComputedStyle(document.querySelector('.loader')).display !== 'none',
        hidden: [...document.querySelectorAll('h1, h2, [data-reveal], [data-step]')].filter(el => getComputedStyle(el).opacity === '0').length,
      }));
      if (r.loader) add(name, 'FAIL', 'no JS: the loader covers the page');
      if (r.hidden) add(name, 'FAIL', `no JS: ${r.hidden} heading/reveal element(s) stay invisible`);
    } catch { add(name, 'WARN', 'no-JS check skipped (browser refused to evaluate)'); }
    await ctx.close();
  }
}

(async () => {
  let pages, srv;
  if (/^https?:/.test(target)) pages = [[target, new URL(target).pathname.split('/').pop() || 'index.html']];
  else {
    const served = await serve(target);
    srv = served.srv;
    const files = only.length ? only : fs.readdirSync(target).filter(f => f.endsWith('.html')).sort();
    pages = files.map(f => [served.base + f, f]);
  }
  let browser;
  try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch(); }
  for (const [url, name] of pages) {
    process.stdout.write(`checking ${name} … `);
    try { await checkPage(browser, url, name); } catch (e) { add(name, 'FAIL', `check crashed: ${e.message.split('\n')[0]}`); }
    const mine = problems.filter(p => p.page === name);
    console.log(mine.length ? `${mine.filter(p => p.level === 'FAIL').length} fail, ${mine.filter(p => p.level === 'WARN').length} warn` : 'ok');
  }
  await browser.close();
  srv?.close();

  console.log('');
  for (const p of problems) console.log(`${p.level.padEnd(4)}  ${p.page}  ${p.msg}`);
  const fails = problems.filter(p => p.level === 'FAIL').length;
  console.log(`\n${pages.length} page(s), ${fails} fail, ${problems.length - fails} warn. Screenshots: ${outDir}`);
  process.exit(fails ? 1 : 0);
})();

# Motion recipes

Copy, then tune. All recipes respect `prefers-reduced-motion` and keep content visible without JS.

## Tokens

```css
:root {
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-in: cubic-bezier(.7, 0, .84, 0);
  --ease-move: cubic-bezier(.65, 0, .35, 1);
  --dur-micro: 160ms;
  --dur-ui: 280ms;
  --dur-enter: 620ms;
  --dur-story: 1100ms;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Reveal on scroll (IntersectionObserver, works everywhere)

```html
<script>document.documentElement.classList.add('js')</script>
```
```css
.js [data-reveal] { opacity: 0; translate: 0 24px; transition: opacity var(--dur-enter) var(--ease-out), translate var(--dur-enter) var(--ease-out); transition-delay: calc(var(--i, 0) * 60ms); }
.js [data-reveal].in { opacity: 1; translate: 0 0; }
```
```js
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
```
Stagger: `style="--i:2"` on siblings.

## Reveal with CSS scroll-driven animation (no JS, progressive)

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .rise { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% cover 35%; }
    @keyframes rise { from { opacity: 0; translate: 0 40px; } }
  }
}
```

## Pinned scene with a progress variable `--p` (0 → 1)

The most useful storytelling primitive: a tall section with a sticky stage; everything inside reads `--p`.

```html
<section class="scene" style="height:300vh">
  <div class="stage"> … </div>
</section>
```
```css
.stage { position: sticky; top: 0; height: 100svh; overflow: clip; }
.sun { translate: calc(var(--p, 0) * 70vw) calc(sin(var(--p, 0) * 180deg) * -40vh); }
/* several colour stops: slide a tall gradient instead of color-mix (mixing two hues gives muddy midpoints) */
.sky { background: linear-gradient(#f0a65a, #9cc9e6 35%, #e98a5c 68%, #0b1026) 0 calc(var(--p, 0) * 100%) / 100% 400%; }
```
```js
const scenes = [...document.querySelectorAll('.scene')];
let queued = false;
function tick() {
  queued = false;
  for (const s of scenes) {
    const r = s.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    s.style.setProperty('--p', p.toFixed(4));
    const steps = s.querySelectorAll('[data-step]');
    const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
    steps.forEach((el, i) => el.classList.toggle('on', i === active));
  }
}
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true });
addEventListener('resize', tick); tick();
```
Reduced motion: keep the captions switching, drop the travel (`.sun { translate: none }`).

## Split text stagger (headline entrance)

```js
// Letters wrapped per word, so the headline still breaks between words on small screens.
for (const el of document.querySelectorAll('[data-split]')) {
  el.setAttribute('aria-label', el.textContent);
  let i = 0;
  el.innerHTML = el.textContent.trim().split(/\s+/).map(word =>
    `<span class="w" aria-hidden="true">${[...word].map(c => `<span style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ');
}
```
```css
[data-split] .w { display: inline-block; white-space: nowrap; }
[data-split] .w > span { display: inline-block; animation: letter var(--dur-enter) var(--ease-out) both; animation-delay: calc(var(--i) * 28ms); }
@keyframes letter { from { opacity: 0; translate: 0 .5em; filter: blur(6px); } }
```
Split by words instead of letters for anything longer than ~20 characters.

## Count-up number

```js
function countUp(el, to, ms = 1400) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = to.toLocaleString(); return; }
  const t0 = performance.now();
  const step = t => {
    const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 4);
    el.textContent = Math.round(to * e).toLocaleString();
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
```
Put the final value in the HTML; JS only animates toward it.

## View Transitions (state or page change)

```js
function go(update) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return update();
  document.startViewTransition(update);
}
```
```css
.card-photo { view-transition-name: var(--vt); } /* unique per element, e.g. style="--vt:photo-3" */
::view-transition-group(*) { animation-duration: var(--dur-ui); animation-timing-function: var(--ease-move); }
```
Multi-page sites: `@view-transition { navigation: auto; }` in CSS of both pages.

## GSAP ScrollTrigger pinned timeline (when CSS is not enough)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
```
```js
gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.timeline({ scrollTrigger: { trigger: '.chapter', start: 'top top', end: '+=200%', scrub: 0.6, pin: true } })
    .from('.chapter h2', { yPercent: 60, opacity: 0 })
    .to('.chapter .photo', { scale: 1.15, ease: 'none' }, '<')
    .from('.chapter .fact', { opacity: 0, y: 20, stagger: 0.15 });
});
```
`gsap.matchMedia()` reverts everything automatically when reduced motion turns on.

## Custom scroll gauge (when the native scrollbar is hidden)

The gauge is part of the story, not chrome. Style it with the site's device and look:
time axis → a sky-coloured track with the sun as thumb and a clock readout; path → a dotted trail, walked part filled, stops as rings, km readout;
zoom → a ruler with ticks and the scale as readout; before/after → two-tone track with a year handle; chapters → numbered segments;
product or shop → a quiet, slim rail. Mark chapters on it and show their names on hover. The templates in `site-start/templates` have one of each.


```css
html { scrollbar-width: none; } html::-webkit-scrollbar { display: none; }
.gauge { position: fixed; right: 10px; top: 10vh; bottom: 10vh; width: 14px; cursor: pointer; touch-action: none; z-index: 50; }
.gauge::before { content: ""; position: absolute; inset: 0 6px; background: color-mix(in srgb, currentColor 18%, transparent); }
.gauge i { position: absolute; left: 4px; right: 4px; top: calc(var(--progress, 0) * (100% - 40px)); height: 40px; background: currentColor; }
@media (pointer: coarse) { .gauge { display: none; } }
```
```js
const g = document.querySelector('.gauge');
const seek = e => { const r = g.getBoundingClientRect();
  scrollTo(0, ((e.clientY - r.top) / r.height) * (document.documentElement.scrollHeight - innerHeight)); };
g.addEventListener('pointerdown', e => { g.setPointerCapture(e.pointerId); seek(e); g.onpointermove = seek; });
g.addEventListener('pointerup', () => { g.onpointermove = null; });
addEventListener('scroll', () => document.documentElement.style.setProperty('--progress',
  scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)), { passive: true });
```

## Loading screen from the site name

The loader is the story's first frame, built from the name. Mark the page in `<head>` so there is no flash on repeat visits:

```html
<script>(r => { r.classList.add('js'); try { r.classList.add(sessionStorage.getItem('sm-loader:' + location.pathname)
  && !/[?&]loader/.test(location.search) ? 'loader-seen' : 'loading'); } catch (e) { r.classList.add('loader-seen'); } })(document.documentElement)</script>
```
```html
<div class="loader" aria-hidden="true" data-min="1600">
  <div class="l-name" data-name>Forno</div>   <!-- core splits it into .w > span letters with --i -->
  <div class="l-readout">03:40</div>
</div>
```
`storymotion.js` drives it: `--lp` goes 0 → 1 on `.loader` (eased), a `loaderprogress` event carries the same value for readouts,
it ends on window load + fonts (at least `data-min`, at most 4 s), clicking skips, and `html.loading` is removed at the end so the
hero's own entrance plays after it. Style everything from `--lp`, for example:

```css
.l-name { clip-path: inset(-10% calc((1 - var(--lp, 0)) * 100%) -10% 0); }     /* written left to right */
.l-name { scale: calc(1 + (1 - var(--lp, 0)) * (1 - var(--lp, 0)) * 7); }       /* zooms out into place */
.loader { background: linear-gradient(#0b1026, #f0a65a) 0 calc(var(--lp, 0) * 100%) / 100% 300%; }  /* night → dawn */
```
```js
document.querySelector('.loader')?.addEventListener('loaderprogress', ({ detail }) => readout.textContent = Math.round(detail * 412) + ' km');
```
Base CSS (in `storymotion.css`) hides it without JS, on repeat visits and with reduced motion, and has a 6 s failsafe.

## Page transitions in the site's story (multi-page)

```css
@view-transition { navigation: auto; }                    /* on every page of the site */
::view-transition-old(root) { animation: 900ms var(--ease-out) both vt-dim; }
::view-transition-new(root) { animation: 900ms var(--ease-out) both vt-dawn; }
@keyframes vt-dim  { to { filter: brightness(.35); } }
@keyframes vt-dawn { from { clip-path: circle(0% at 50% 100%); } to { clip-path: circle(150% at 50% 100%); } }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
```
The new page's CSS styles the transition. Other moods: `clip-path: inset(0 100% 0 0)` → drawn left to right; old `scale: 1.6; opacity: 0` + new from `scale: .86` → zoom; old `translate: -30% 0` + new from `translate: 100% 0` → chapter turn.

## Languages

```html
<h1 data-split data-i18n="h1">Bread before sunrise.</h1>            <!-- default language lives in the HTML -->
<section data-chapter="02 — The dough" data-i18n-chapter="ch2">…</section>
<nav class="langs"><button data-lang="en">EN</button><button data-lang="it">IT</button></nav>
<script type="application/json" id="sm-i18n">{ "it": { "h1": "Pane prima dell'alba.", "ch2": "02 — L'impasto" } }</script>
```
`storymotion.js` picks `?lang=` → saved choice → browser language → `<html lang>`, swaps texts, re-splits headlines, reformats `data-count` numbers and the gauge's chapter marks. Missing keys fall back to the default text (`check.cjs` lists them).

## Magnetic button (one per page, on the main CTA)

```js
const b = document.querySelector('[data-magnetic]');
if (matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect();
    b.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .25}px`; });
  b.addEventListener('pointerleave', () => b.style.translate = '0 0');
}
```
```css
[data-magnetic] { transition: translate var(--dur-ui) var(--ease-out); }
```

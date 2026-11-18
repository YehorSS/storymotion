# Template catalog

Seven templates. Each one is a different **story device** (or none), a different **look** and a different **motion technique**, so offering two of them gives the user a real choice, not two skins of the same page.

All of them share `storymotion.css` + `storymotion.js` (reveals, pinned scenes with `--p`, step captions, chapter label, draggable scroll gauge with chapter marks, reduced motion). Each template restyles the scroll gauge to match its story and look, because the scroll is part of the narrative too. Copy the chosen `.html` **and both shared files**.

Every template also has a **loading screen built from the site name** in the same story and style (see each section). Add `?loader` to the URL to see it again; normally it shows once per session.

Every template is also ready to **rebrand** (a `BRAND` block of tokens at the top of `:root`, the name in every `[data-brand]` element), has a **themed page transition** for multi-page sites, and supports **languages** (`data-i18n` + `#sm-i18n`; `day-cycle.html` ships EN / IT / UK). Verify any of them with `../scripts/check.cjs`.

Preview: serve this folder (`python -m http.server` here) and open `index.html`; the gallery shows every template.

| Template | Narrative | Device | Look | Best for |
|----------|-----------|--------|------|----------|
| `day-cycle.html` | Full | Time axis | Dark, warm, editorial serif | Restaurants, bakeries, hotels, events, daily routines |
| `route.html` | Full | Path on a map | Paper, ink, red pencil, italic serif | Travel, tours, expeditions, logistics, real estate locations |
| `zoom.html` | Full | Scale dive | Charcoal and brass, wide caps grotesk | Architecture, interiors, craft products, manufacturing |
| `before-after.html` | Full | Transformation | Light, clean grotesk, electric blue | Renovation, services, beauty, cleaning, redesigns, fitness |
| `chapters.html` | Full | Horizontal chapters | Black, acid green, heavy grotesk | Portfolio case studies, agency work, product launches, history |
| `saas.html` | Partial | One pinned "how it works" scene | White, violet accent, Inter | SaaS, apps, B2B tools, startups |
| `catalog.html` | None | — | Warm off-white, product grid | Shops, catalogues, menus, listings, galleries |

---

## day-cycle — "A day at Forno"

**Story:** one day passes in a single scroll. The sky goes from dawn to noon blue to sunset to night while a sun travels an arc; captions mark the hours ("6:00 — first loaves out").

**Beats:** hook with key number and order action → setup at 3:40 a.m. → pinned day (4 time captions, 320 vh) → proof as "that day, repeated" with count-ups → CTA repeats the hook's action.

**Look:** near-black `#12100e`, cream text, amber accent; large serif headlines, monospace eyebrows. Feels warm, slow, crafted.

**Motion:** letter-split headline; sky = tall gradient slid by `--p`; sun moves on `sin()` arc; captions swap by step; caption colour flips to light when the sky gets dark (`data-dark-after`); count-ups; magnetic CTA.

**Loader:** "Forno" — night sky warms to dawn, the sun climbs out of the horizon, the letters rise like dough; clock 03:40 → 06:00.

**Page transition:** the next page opens like dawn, a circle of light rising from the horizon. **Languages:** EN / IT / UK worked example.

**Scroll gauge:** sky-gradient track (dawn → night), the sun is the thumb, a clock readout (03:40 → 22:00) next to it; chapter ticks show names on hover.

**Replace:** brand, the 4 hours and their sentences, stats. Add a real high-res photo per hour if available (as a layer behind the sun).

**Not for:** businesses where time of day means nothing; anything with many products to compare.

---

## route — "The Salt Road"

**Story:** the visitor walks a route. A red line is drawn across a map as they scroll, a walker dot moves along it, stops light up when reached, and each stop has its kilometre, title and a short story.

**Beats:** hook with distance / stages / season → why this road exists (history) → pinned map with 5 stops (420 vh) → stage list (table of legs) → next departure + CTA.

**Look:** paper `#f1ebdf` with faint ruled lines, ink-brown text, red-pencil accent `#c2462d`; italic old-style serif, monospace labels. Feels like a travel journal.

**Motion:** SVG `stroke-dashoffset` drawing by `--p`; walker positioned with `getPointAtLength`; stops fill as passed; legs swap per step.

**Loader:** "The Salt Road" — a red-pencil trail draws itself over a dotted route and the name is written along with it; km count up.

**Page transition:** the next page is drawn in from left to right, like the trail.

**Scroll gauge:** a dotted trail; the walked part fills in red pencil, chapters are stop rings, the thumb is the walker with a "km 188" readout.

**Replace:** the SVG path `d` (draw it over a real map, or trace one in Figma), stop names, legs. For a real map, put an image behind the SVG with the same aspect ratio.

**Not for:** content without a physical or logical sequence of places.

---

## zoom — "Casa Lume, from the hill to the handle"

**Story:** one continuous dive through scales: landscape → building → room → a single detail. Each level is a frame nested inside the previous one at 1/5 size; scrolling zooms through them.

**Beats:** hook "from the hill to the handle" → pinned zoom (4 levels, 480 vh) with a scale ratio readout → how we work (3 columns) → small CTA.

**Look:** charcoal `#0e0e0d`, warm off-white, brass accent; uppercase grotesk, technical monospace labels ("1 : 200 — room"). Feels precise, architectural, expensive.

**Motion:** JS sets `scale = 5^(t − k)` for each frame and fades it once it overfills the screen; captions swap per level; scale label updates.

**Loader:** "Casa Lume" — the name starts at detail scale, huge and widely spaced, and settles into a brass frame; scale 1 : 1 → 1 : 5000.

**Page transition:** a dive into the old page (scale up, fade) while the new one settles from a step back.

**Scroll gauge:** a ruler with tick marks and a brass cursor; the readout is the drawing scale, 1 : 5000 → 1 : 1.

**Replace:** each `.frame` background with a real photo or render (align the next level's subject to the centre of the previous one, that is where the zoom lands).

**Not for:** sites where the visitor needs to scan many items fast; low-end-device audiences (big images scaled hard).

---

## before-after — "Same walls, new kitchen"

**Story:** transformation. A pinned canvas shows the old state; scrolling wipes the new state across it with a draggable-looking divider, while a card narrates the steps (day 1–3 strip, day 4–9 surfaces…).

**Beats:** hook with promise + rating → pinned wipe (4 step cards, 340 vh) → results in numbers (cards) → CTA "send three photos".

**Look:** light `#f6f5f2`, white cards, electric-blue accent; tight bold grotesk. Feels trustworthy, modern, clear.

**Motion:** `clip-path: inset()` driven by `--p`; divider follows; step cards swap; count-ups.

**Loader:** "Nuovo" — the name in a dated italic serif is wiped by a divider into the new bold blue logotype; year 1974 → 2026.

**Page transition:** the old page fades to sepia while the new one is wiped over it.

**Scroll gauge:** a two-tone slider (new blue above, old tone below) with a round handle and a year pill, 1974 → 2026.

**Replace:** `--before` / `--after` with two photos **shot from the same spot**, same lens, same crop. This template lives or dies on that pair.

**Not for:** products with no visible change; when you have no matching photo pair.

---

## chapters — "Ferrylink case study"

**Story:** a case study told in chapters (problem → research → idea → product → launch). Vertical scroll moves a pinned track of big cards sideways; a counter and bar show "02 / 05".

**Beats:** hook with client / scope / time / result → horizontal chapters (5 cards, 500 vh) → one huge outcome number → CTA to the studio.

**Look:** black `#0a0a0a`, white, acid green `#d4ff3a`; heavy tight grotesk; outlined giant chapter numbers. Feels bold, confident, agency.

**Motion:** track `translate: calc(var(--p) * (100vw − 100%))`; progress bar `scale` by `--p`; counter per step.

**Loader:** "Ferrylink" — a giant outlined name slides in sideways and fills with acid green; chapter counter 01 → 05 with a bar.

**Page transition:** a sideways chapter turn, like the track.

**Scroll gauge:** an index of numbered segments (01–05) with an acid fill and block thumb.

**Replace:** card texts; `.visual` blocks with project images (`--img`). Keep 4–6 chapters; more gets tiring sideways.

**Not for:** long reading content; audiences on very old browsers.

---

## saas — "Tidy" (partial narrative)

**Story:** only one scene tells a story — "how it works" as before → sorted → done: messy rotated cards fly into neat columns and get green ticks. Everything else is a normal, scannable product page.

**Sections:** header → hero with product mock and two actions → features grid → pinned story (3 steps, 300 vh, dark) → pricing with monthly/yearly toggle → FAQ.

**Look:** white, soft grey panels, violet accent `#5b4cff`, Inter-style sans. Feels like a modern product site.

**Motion:** reveals and hover lifts; in the story scene cards interpolate from `--x0/--y0/--r0` to `--x1/--y1` by `--p`; ticks fill late; price count when toggling; FAQ `+` rotates.

**Loader:** "Tidy" — the letters of the name start scattered and get sorted into place, then the status turns from "Sorting…" to "Sorted." with a green tick.

**Page transition:** quick fade and a small lift, app-like.

**Scroll gauge:** a slim rounded rail with a violet pill, like a polished app scrollbar; no chapter marks.

**Replace:** product mock with a real screenshot (2×), feature texts, the story's three steps, plans.

**Not for:** brand-led sites that need emotion over information.

---

## catalog — "Argilla shop" (no narrative)

**Story:** none, on purpose. People come to compare and pick; a story would slow them down. Motion only orients and confirms.

**Sections:** sticky header with bag counter → short intro → filter chips → product grid → quick-view dialog.

**Look:** warm off-white, thin lines, terracotta accent; neutral sans. Products are the colour.

**Motion:** filtering uses View Transitions so cards glide to new places; image zoom on hover; quick view pops in; the bag counter bumps on add. All of it under 0.7 s, none of it blocks the user.

**Loader:** "Argilla" — just the name and a hairline filling in under 0.7 s; a shop should not make people wait for a story.

**Page transition:** a plain 0.2 s crossfade.

**Scroll gauge:** a hairline with a small dark thumb, out of the way; shopping is the point.

**Replace:** `--img` placeholders with real product photos (≥ 1600 px, `srcset`), prices, categories. Connect "Add to bag" to the real cart.

**Not for:** a brand story page; use `day-cycle` or `zoom` for the "about" page of the same shop.

---

## Mixing

A real site can mix: `catalog` for the shop + `zoom` for "about the studio"; `saas` for the landing + `chapters` for a customer story. Use one look (palette, type) across the mix: take the structure from the template and the tokens from the main page.

---
name: site-start
description: Use at the start of any new website, landing page, shop, portfolio, product or marketing page, or a full redesign — before writing code. Classifies the kind of site, decides whether it needs a narrative (full, partial or none), always asks the user whether they want a template and offers the fitting ones, designs the loading screen from the site name in the same story and style, then hands off to scroll-narrative and web-motion.
---

# Site Start

The entry point. Three decisions, in order, **before any code**: what kind of site → how much story → which template.

## Step 1. What kind of site is it?

Infer from the request; ask only if it is genuinely unclear. Use this table:

| Site kind | Narrative | Why | Fitting templates |
|-----------|-----------|-----|-------------------|
| Brand / small business (restaurant, bakery, hotel, studio) | **Full** | People choose by feeling; story sells the experience | day-cycle, zoom, route |
| Travel, tours, real estate, places | **Full** | A path or a place is a story by nature | route, day-cycle |
| Architecture, interiors, craft, premium product | **Full** | Scale and detail are the argument | zoom, before-after |
| Services with visible results (renovation, beauty, cleaning) | **Full** | The transformation is the proof | before-after |
| Portfolio case study, agency work, launch | **Full** | Problem → solution is the story | chapters |
| Event / festival / campaign | **Full** or partial | Countdown or day-of story | day-cycle, chapters |
| SaaS, app, B2B tool, startup landing | **Partial** | People scan for features and price; one "how it works" story helps | saas |
| Personal portfolio (overview of many works) | **Partial** | Grid to scan + story inside each case | catalog (grid) + chapters (case) |
| Online shop, catalogue, menu, listings | **None** | People compare and pick; story slows them down | catalog |
| Dashboard, admin, web app screens | **None** | Work tools: motion only for feedback | no template — use `web-motion` only |
| Docs, blog, news, knowledge base | **None** | Reading and search come first | no template — use `web-motion` only |
| Forms, booking flow, checkout | **None** | Every extra second loses people | no template — `web-motion` micro-interactions only |

Narrative levels:
- **Full** — the whole page is one story. Follow the `scroll-narrative` skill completely.
- **Partial** — a normal, scannable page with **one** story scene (usually "how it works" or "about"). Use `scroll-narrative` for that one scene only.
- **None** — no story. Motion only orients and confirms (filters, hover, add-to-cart, page transitions). Use `web-motion` only.

If the user explicitly wants a story on a "None" kind of site (or no story on a "Full" one), do what they ask — but say the trade-off in one line.

## Step 2. Always ask about a template — and wait

Before building, **always** ask the user, in one message, and wait for the answer:

1. State the site kind and narrative level you chose, in one line, so they can correct it.
2. Offer the 2–3 fitting templates from `templates/CATALOG.md`, each with: name, story device, look, and one line of why it fits. Mention any other template if it is a plausible stretch.
3. Always include the option **"from scratch"** (no template, built to the brief).
4. Tell them how to preview: serve `templates/` locally and open `index.html` (the gallery) — or offer to open it for them.

Example message:

> This is a **bakery site → full narrative**.
> Templates that fit:
> 1. **Day Cycle** — a whole baking day passes as you scroll (dawn → night); warm dark serif. Fits because your story *is* the early morning.
> 2. **Zoom** — from the street to the crust of one loaf; charcoal and brass. Fits if you want to show craft.
> 3. **From scratch** — built to your brief, same motion rules.
> Want me to open the template gallery so you can see them?

Do not start building until the user picks. If they pick a template, read its section in `CATALOG.md` before editing.

## Step 3. Loading screen from the site name

Every template has a loader. Build it from three things only: **the site name** (the letters are the material),
**the narrative device**, and **the site's palette and type**. It is the first sentence of the story, not a spinner.

| Device | Loader idea | Readout |
|--------|-------------|---------|
| Time axis | night sky turns to dawn, the sun climbs, the name rises | clock (03:40 → 06:00) |
| Path | a trail draws itself, the name is "written" along with it | km |
| Zoom | the name starts huge and settles into its frame | scale 1 : 1 → 1 : 5000 |
| Transformation | the name in the old style is wiped into the new brand | year |
| Chapters | the outlined name slides in and fills, chapter counter | 01 → 05 |
| Partial (product) | the product's promise acted on the name (e.g. scattered letters get sorted) | status text |
| None (shop, docs, app) | name + hairline, ≤ 0.7 s — or no loader at all | — |

Rules: shown once per session; click skips it; at least `data-min` ms (1.2–2 s for full narrative) and ends on real load, 4 s cap,
6 s CSS failsafe; no loader with reduced motion or without JS; its last frame hands off to the hero (same name, colour, place),
and the hero's own entrance plays only after it. When you rename the site, rename it in the loader too and re-check the fit
(long names: smaller size or two lines). Preview it any time with `?loader` in the URL.

## Step 4. Rebrand the template

Ask for (or infer) the brand: **name, 3–4 colours, display font, languages**. Then, in the copied template:

1. **Name** — replace the text of every `[data-brand]` element (`grep data-brand`): logo, eyebrow, loader, header. Never just the visible ones; `check.cjs` fails if they disagree.
2. **Colours and fonts** — edit the `BRAND` block at the top of `:root` (`--font-display`, `--font-ui`, `--font-mono`, `--ink`, `--muted`, `--bg`, `--accent`…). Rules below it use only these tokens; if you add a webfont, load it in `<head>` and put it first in `--font-display`.
3. **Story readouts** — the gauge and loader readouts (hours, km, scale, year) come from the story; update their arrays when the beats change, so the gauge and the captions show the same value.
4. **Languages** — see Step 5.

## Step 5. Languages

The HTML holds the default language (`<html lang>`). Mark every visible text with `data-i18n="key"` (chapter names with `data-i18n-chapter="key"`), put the other languages in `<script type="application/json" id="sm-i18n">{"it": {"key": "…"}}</script>`, and add `[data-lang="it"]` buttons. The core picks `?lang=` → saved choice → browser language → default, re-splits headlines, reformats numbers and chapter marks on switch. `day-cycle.html` is the worked example (EN / IT / UK).

- Write each language natively; don't translate word by word (Italian runs ~20 % longer, check headlines at 375 px).
- Names, times and numbers are not translated; numbers are formatted per language automatically (`data-count`).
- For SEO-critical multi-language sites, prefer one URL per language (`/it/`, `/uk/`) built from the same template; the in-page switch is for demos and small sites.

## Step 6. Page transitions

Multi-page sites get transitions between their own pages, in the same story as the loader and gauge (`@view-transition` is on in `storymotion.css`; each template themes `::view-transition-old/new(root)`): dawn from the horizon, a page drawn like a trail, a dive into scale, a before/after wipe, a sideways chapter turn, an app-like lift, a plain crossfade for shops. Keep them under ~0.9 s; they are off with reduced motion and simply absent in browsers without support.

## Step 7. Hand off, build, verify

- Copy the chosen template **plus `storymotion.css` and `storymotion.js`** into the project.
- Full / partial narrative → `scroll-narrative`: story questions, beat sheet (`beats.md`), pacing. Show the beat sheet before writing content.
- Every site → `web-motion` for timing, easing, performance and accessibility. React / Astro / Next → `web-motion/references/frameworks.md`.
- Replace placeholders (gradients) with real high-resolution photos; never ship the placeholder art.
- Mixed sites (shop + about page, SaaS + case study): one template per page type, one shared look (take tokens from the main page).
- **Before saying it is done, run the check** and fix every FAIL:

  ```
  npm i -D playwright                     # once per project; uses installed Chrome, else: npx playwright install chromium
  node <this skill>/scripts/check.cjs <site folder | http://localhost:port/page.html> --out check-shots
  ```

  It checks 375 / 1440 px overflow (and names the outermost element that sticks out), console and network errors, the loader (name fits, it leaves), `[data-brand]` consistency, every pinned scene reaching its end, every language, reduced motion and no-JS, and saves screenshots of the top and every scene. Look at the screenshots too: the script cannot judge whether the story reads well.

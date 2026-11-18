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

## Step 4. Hand off

- Copy the chosen template **plus `storymotion.css` and `storymotion.js`** into the project.
- Full / partial narrative → `scroll-narrative`: story questions, beat sheet (`beats.md`), pacing. Show the beat sheet before writing content.
- Every site → `web-motion` for timing, easing, performance and accessibility.
- Replace placeholders (gradients) with real high-resolution photos; never ship the placeholder art.
- Mixed sites (shop + about page, SaaS + case study): one template per page type, one shared look (take tokens from the main page).

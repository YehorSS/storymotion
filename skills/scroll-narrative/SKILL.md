---
name: scroll-narrative
description: Use when a website, landing page, product page, portfolio or case study should tell a story instead of listing blocks — scrollytelling, storytelling pages, "narrative" or "cinematic" sites, chapter-based pages, timelines, journeys, before/after, or when a page feels like a boring catalog of sections.
---

# Scroll Narrative

**Not every site needs a story.** Decide first: a **full** narrative (brands, small businesses, travel, places, craft, services with visible results), a **single story scene** (SaaS, apps: usually "how it works"), or **none** (shops, docs, dashboards, forms: motion only for feedback, use `web-motion` only). For **partial**, apply this skill to that one scene only.

A narrative site is a story the visitor walks through with the scroll wheel.
Facts are woven into the plot, not stacked as feature blocks. Motion (see the `web-motion` skill) is how time passes in that story.

## 1. Find the story before any code

Answer in one line each:

- **Hero** — who or what we follow (the visitor, the product, a place, a dish, a day).
- **Want** — what they want or where they go.
- **Obstacle** — what stands in the way (the problem the product solves).
- **Turn** — the moment things change (the product, the summit, the first bite).
- **After** — the world after the turn, and the one action the visitor takes now.

Then pick one **narrative device** that structures the whole scroll:

| Device | Scroll means | Good for |
|--------|--------------|----------|
| Time axis | dawn → night, 1920 → today, day 1 → day 30 | restaurants, events, history, routines |
| Path | moving along a route or map | travel, logistics, expeditions, real estate |
| Zoom | city → street → room → detail | architecture, products, craft |
| Transformation | raw → finished, before → after | services, renovation, SaaS, fitness |
| Countdown | toward a launch or a peak moment | festivals, drops, launches |
| Character | following one person's day | apps, B2C services |

## 2. Write the beat sheet

Save as `beats.md` before building. One row per beat:

| # | Beat | Headline (≤ 8 words) | Body (≤ 40 words) | Fact woven in | Visual | Motion | Scroll length |
|---|------|----------------------|-------------------|---------------|--------|--------|---------------|

Standard arc (6–9 beats):

1. **Hook** — the first screen. In 3 seconds: what this is, the key number, the main action. No "scroll down to discover" with nothing else.
2. **Setup** — the world before; the hero and the want.
3. **Journey** (2–4 beats) — progress through the device; each beat carries one fact as a plot point ("by 6 a.m. the bread is already out — 140 loaves").
4. **Turn** — the biggest scene: usually a pinned stage (200–300 vh) scrubbed by scroll.
5. **Proof** — numbers, faces, reviews, told as the outcome of the story.
6. **Resolution + CTA** — where the story lands, and one clear action. Repeat the hook's action.

## 3. Pacing rules

- One idea, one visual, one motion per beat.
- Alternate dense and sparse: after a pinned scene, a calm full-bleed photo or a single sentence.
- At most ~3 pinned scenes per page; each pin must earn its scroll length.
- Total page: 6–12 viewport heights on desktop. Longer only if each screen still has news.
- Text appears with the moment it describes, never ahead of it.
- The visitor always knows where they are: chapter label + progress gauge.
- The scroll itself speaks the story: the gauge uses the narrative device as its metaphor (hour, km, scale, year, chapter number) and the site's palette and type; chapters are marked on it and named on hover.

## 4. Content and craft

- Photos are the protagonist: only high resolution, sharp at 100 % crop; responsive `srcset`.
- Write like a person, plain words; no "unleash", "elevate", "seamless".
- Numbers are plot points, not a stats grid — unless the grid is the climax.
- Every beat must survive reduced motion and no JS: it still reads as a good long page.
- Mobile is not a shrunken desktop: shorter pins (150–200 vh), stacked stage, larger type.

## 5. Build

1. Build on `storymotion.css` + `storymotion.js` (in `web-motion/assets/`; pinned scenes with `--p`, step captions, reveals, count-ups, chapter label, draggable scroll gauge, loader, languages, reduced motion) and the recipes in `web-motion/references/recipes.md`.
2. Map each beat to a section; pinned beats become `.scene > .stage` with `[data-step]` captions; custom per-frame logic listens to the scene's `progress` event.
3. Add motion per `web-motion`; verify at 375 px and 1440 px with reduced motion on and off.

Checklist before done:
- [ ] Hook passes the 3-second test.
- [ ] Each beat has exactly one job and one fact.
- [ ] Story reads in order with JS disabled.
- [ ] Chapter label and gauge match the beat sheet.
- [ ] CTA at the end repeats the hook's action.

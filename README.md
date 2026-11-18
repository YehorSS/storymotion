# StoryMotion

A plugin for coding agents that build websites with **motion** and, when it fits, **narrative**: Claude Code, Gemini CLI and Codex.

Not every site needs a story. StoryMotion first decides what kind of site it is and how much story it should have (full, a single scene, or none), then asks which template to start from.

## Skills

- **`site-start`** is the entry point. It classifies the site (brand, travel, SaaS, shop, docs, dashboard…), picks the narrative level and always offers the fitting templates (or "from scratch") before any code. It also designs the loading screen from the site name, in the same story and style.
- **`scroll-narrative`** covers story questions, the narrative device, the beat sheet and pacing rules.
- **`web-motion`** covers the choice of tool (CSS, scroll-driven animations, View Transitions, WAAPI, GSAP), timing and easing, choreography, performance and accessibility, plus copy-ready recipes.
- **`/story-page <topic>`** runs the whole flow (Claude Code, Gemini CLI).

## Templates

Seven templates, each with a different device, look and motion. Full descriptions are in [`CATALOG.md`](skills/site-start/templates/CATALOG.md).

| Template | Narrative | Device | Best for |
|----------|-----------|--------|----------|
| Day Cycle | Full | Time axis | Restaurants, hotels, events |
| Route | Full | Path on a map | Travel, tours, logistics |
| Zoom | Full | Scale dive | Architecture, craft, products |
| Before / After | Full | Transformation | Renovation, services |
| Chapters | Full | Horizontal chapters | Case studies, agencies |
| SaaS | Partial | One "how it works" scene | Apps, B2B tools |
| Catalog | None | Functional motion only | Shops, menus, listings |

Preview: `cd skills/site-start/templates && python -m http.server`, then open http://localhost:8000.

Every template has a loading screen built from the site name, a scroll gauge and page transitions in the same story and style, a `BRAND` token block for quick rebranding, and language support (Day Cycle ships EN / IT / UK). Every template uses no dependencies, works without JS (content stays visible), respects `prefers-reduced-motion`, and replaces the native scrollbar with a draggable progress gauge.

## Check a site

```
npm i -D playwright        # once; uses installed Chrome, otherwise: npx playwright install chromium
node skills/site-start/scripts/check.cjs <site folder | url> --out check-shots
```
Checks 375 / 1440 px overflow, console and network errors, the loader, brand consistency, pinned scenes, every language, reduced motion and no-JS, and saves screenshots of every scene. Exit code 1 on any failure.

React, Next.js and Astro: see [`frameworks.md`](skills/web-motion/references/frameworks.md).

## Install

**Claude Code**
```
/plugin marketplace add YehorSS/storymotion
/plugin install storymotion@storymotion
```

**Gemini CLI**
```
gemini extensions install https://github.com/YehorSS/storymotion
```

**Codex** (plugin, via this repo's `.agents/plugins/marketplace.json`)
```
codex plugin marketplace add YehorSS/storymotion
```
then open `/plugins` in Codex, install **StoryMotion** and start a new session. Skills only, without the plugin: copy `skills/*` to `~/.agents/skills/` (user) or `.agents/skills/` in a repo. Invoke with `$site-start`, or just ask for a website. Codex has no plugin slash commands, so `/story-page` is Claude Code / Gemini only.

MIT license.

# StoryMotion

A plugin for coding agents that build websites with **motion** and, when it fits, **narrative**: Claude Code, Gemini CLI and Codex.

Not every site needs a story. StoryMotion first decides what kind of site it is and how much story it should have (full, a single scene, or none), then asks which template to start from.

## Skills

- **`site-start`** is the entry point. It classifies the site (brand, travel, SaaS, shop, docs, dashboard…), picks the narrative level and always offers the fitting templates (or "from scratch") before any code. It also designs the loading screen from the site name, in the same story and style.
- **`scroll-narrative`** covers story questions, the narrative device, the beat sheet and pacing rules.
- **`web-motion`** covers the choice of tool (CSS, scroll-driven animations, View Transitions, WAAPI, GSAP), timing and easing, choreography, performance and accessibility, plus copy-ready recipes.
- **`/story-page <topic>`** runs the whole flow.

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

Every template has a loading screen built from the site name and a scroll gauge in the same story and style. Every template uses no dependencies, works without JS (content stays visible), respects `prefers-reduced-motion`, and replaces the native scrollbar with a draggable progress gauge.

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

**Codex** loads skills from its skills folder. Copy the three skill folders there:
```
git clone https://github.com/YehorSS/storymotion
cp -r storymotion/skills/* ~/.codex/skills/
```
Another option is to drop `AGENTS.md` plus the `skills/` folder into your project.

MIT license.

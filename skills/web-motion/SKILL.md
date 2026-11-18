---
name: web-motion
description: Use when adding, designing, fixing or reviewing animation on a website or web app — scroll reveals, page and state transitions, hover and micro-interactions, text effects, parallax, pinned scroll scenes, loaders, GSAP/ScrollTrigger, View Transitions, CSS scroll-driven animations, or when motion feels janky, cheap, slow or "too much".
---

# Web Motion

Motion is a sentence in the page's story, not decoration. Every animation must do one job:
**orient** (where did this come from / go), **focus** (look here), **confirm** (your action worked),
or **narrate** (time passes, a path is travelled, something transforms). No job → cut it.

## 1. Pick the lightest tool that does the job

| Need | Tool |
|------|------|
| Hover, focus, toggle | CSS `transition` |
| Looping or one-shot entrance | CSS `@keyframes` |
| Tied to scroll position (reveal, parallax, progress) | CSS `animation-timeline: view()` / `scroll()`, JS `--p` variable as fallback |
| Element morphs between two states or pages | View Transitions API (`document.startViewTransition`, `view-transition-name`) |
| Sequenced timeline you control from JS | Web Animations API (`el.animate`) |
| Many synced tracks, pinning, scrubbed timelines, SVG morph | GSAP + ScrollTrigger (free, now including plugins) |
| Real 3D | Three.js — and still drive it from the same scroll progress |

Do not add a library for what CSS already does. Do not add smooth-scroll hijacking (wheel interception) — native scroll stays native.

## 2. Timing and easing

| Kind | Duration |
|------|----------|
| Micro (press, toggle, hover) | 120–200 ms |
| UI (menu, modal, tab) | 200–350 ms |
| Entrance of a block | 450–700 ms |
| Hero / story moment | 800–1400 ms |

- Exit ≈ 70 % of entrance. Things leave faster than they arrive.
- Enter: `cubic-bezier(.16, 1, .3, 1)` (expo-out). Exit: `cubic-bezier(.7, 0, .84, 0)`. Move on screen: `cubic-bezier(.65, 0, .35, 1)`.
- `linear` only for scrubbed-by-scroll, progress bars and endless loops.
- Distance: 16–32 px for reveals. Big travel reads as "PowerPoint".

## 3. Choreography

- One **lead** per moment. It moves first and most; supporting elements follow quieter.
- Stagger 40–80 ms; past ~6 items stagger groups, not items.
- Direction carries meaning: keep one axis for "forward in the story" across the whole site.
- Layer depth with speed: background slowest, text fastest (parallax 0.1–0.3 ratio, not more).
- Rest is part of the rhythm: after a big scene, give a calm section with almost no motion.

## 4. Performance (non-negotiable)

- Animate only `transform`, `opacity`; `filter` and `clip-path` sparingly. Never `top/left/width/height/margin`.
- Read layout once per frame in `requestAnimationFrame`; scroll listeners `{ passive: true }`.
- Use `IntersectionObserver` to start/stop work; pause off-screen loops, canvases and videos.
- `will-change` only on the element while it animates, never on dozens.
- No layout shift: reserve space; animated elements start in their final box, offset by transform.
- Check: DevTools Performance with CPU 4× slowdown — no long frames during scroll.

## 5. Accessibility (non-negotiable)

- Content is visible without JS. Hide-for-reveal styles apply only under a `.js` class set by the script.
- `@media (prefers-reduced-motion: reduce)`: remove movement, parallax and scrubbing; keep instant or short opacity changes; show final numbers.
- Nothing flashes more than 3 times per second.
- Auto-playing motion longer than 5 s gets a pause control (WCAG 2.2.2).
- Focus states are animated at most subtly and never hidden.
- If the native scrollbar is hidden for style, provide a custom draggable, clickable progress gauge; wheel, keyboard and touch scrolling keep working.
- A loading screen is allowed only as the story's first frame: built from the site name with the site's device, palette and type; once per session, click to skip, ≤ 2 s on top of real load (≤ 0.7 s or none for shops, docs and apps), never with reduced motion or without JS, and it hands off to the hero.
- That gauge belongs to the site's story and style: same palette, type and metaphor as the narrative (clock for a day, km for a route, scale for a zoom, year for a before/after, numbered chapters for a case study; a quiet slim rail for shops and products). Never a generic grey bar on a styled site.

## 6. Workflow

1. Write the motion intent next to each section: job, lead element, trigger, duration.
2. Build without motion first; the page must read fine static.
3. Add motion from the recipes in `references/recipes.md`; reuse tokens (`--ease-out`, `--dur-*`).
4. Verify: 375 px and 1440 px, reduced-motion on, CPU throttled, keyboard-only pass.

See `references/recipes.md` for copy-ready code.

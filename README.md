# StoryMotion

A plugin for coding agents that build websites with **motion** and, when it fits, **narrative**: Claude Code, Gemini CLI and Codex.

Not every site needs a story. StoryMotion decides how much story a site should have (full, a single scene, or none), writes the beat sheet, and builds the motion in the same story: loader, scroll gauge, pinned scenes and page transitions.

## Skills

- **`scroll-narrative`** covers the narrative level, story questions, the narrative device, the beat sheet and pacing rules.
- **`web-motion`** covers the choice of tool (CSS, scroll-driven animations, View Transitions, WAAPI, GSAP), timing and easing, choreography, performance and accessibility, plus copy-ready recipes and a small dependency-free runtime (`assets/storymotion.css`, `assets/storymotion.js`): pinned scenes, step captions, themed scroll gauge, loader from the site name, page transitions, languages, reduced motion.
- **`/story-page <topic>`** runs the whole flow (Claude Code, Gemini CLI).

React, Next.js and Astro: see [`frameworks.md`](skills/web-motion/references/frameworks.md).

## StoryMotion Pro

StoryMotion Pro (on Agensi) adds the site router, three concepts with live previews, seven ready templates and a browser check script. It designs three different concepts from your own description, shows them as live previews side by side, and grows the one you pick into the site, then checks it in a real browser (overflow at 375 / 1440 px, loader, brand, scenes, languages, reduced motion, no-JS).

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
then open `/plugins` in Codex, install **StoryMotion** and start a new session. Skills only, without the plugin: copy `skills/*` to `~/.agents/skills/` (user) or `.agents/skills/` in a repo. Codex has no plugin slash commands, so `/story-page` is Claude Code / Gemini only.

MIT license.

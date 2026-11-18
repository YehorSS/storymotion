# StoryMotion

A plugin for coding agents that build websites with **motion** and **narrative**: Claude Code, Gemini CLI and Codex.

- **`web-motion`** skill: picking the right tool (CSS, scroll-driven animations, View Transitions, WAAPI, GSAP), timing and easing, choreography, performance and accessibility rules, plus copy-ready recipes.
- **`scroll-narrative`** skill: finding the story, choosing a narrative device, writing the beat sheet, pacing rules, and a dependency-free scrollytelling template.
- **`/story-page <topic>`** command: writes the beat sheet first, then builds the page.

Open `skills/scroll-narrative/templates/index.html` in a browser to see the template.

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

**Codex**: Codex loads skills from its skills folder. Copy or symlink both skill folders there:
```
git clone https://github.com/YehorSS/storymotion
cp -r storymotion/skills/* ~/.codex/skills/
```
Or drop `AGENTS.md` plus the `skills/` folder into your project.

## Layout

```
.claude-plugin/        Claude Code manifest + marketplace
gemini-extension.json  Gemini CLI manifest (context: GEMINI.md)
AGENTS.md              Codex / generic agents
commands/              story-page.md (Claude), story-page.toml (Gemini)
skills/web-motion/     SKILL.md, references/recipes.md
skills/scroll-narrative/ SKILL.md, templates/index.html
```

MIT license.

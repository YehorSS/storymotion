# StoryMotion

For any new website or page, start with `skills/site-start/SKILL.md` (in Codex: `$site-start`): it decides the site kind, whether it needs a story (full / partial / none), and always asks the user which template to use (catalog: `skills/site-start/templates/CATALOG.md`).

- Narrative pages or a single story scene → `skills/scroll-narrative/SKILL.md`.
- Any animation → `skills/web-motion/SKILL.md` (code in `skills/web-motion/references/recipes.md`, React / Next / Astro in `references/frameworks.md`).
- Before calling a site done, run `node skills/site-start/scripts/check.cjs <site folder | url>` and fix every FAIL.

Codex plugins have no slash commands; the `/story-page` command exists only in Claude Code and Gemini CLI. Ask for it in words instead ("build a site about …") and `site-start` takes over.

# StoryMotion in React, Next.js and Astro

The core (`storymotion.js`) is plain JS. As a classic `<script src>` it starts itself; when a bundler imports it as a module
it only registers `window.StoryMotion` and waits for `StoryMotion.init()`, which returns `destroy()` (removes every listener
and observer). Everything else — markup hooks, CSS, loader, gauge, i18n — is the same as in the templates.

Two things always go in the HTML shell, outside the framework's root, so they work before the app mounts:

```html
<head>
  <script>(r => { r.classList.add('js'); try { r.classList.add(sessionStorage.getItem('sm-loader')
    && !/[?&]loader/.test(location.search) ? 'loader-seen' : 'loading'); } catch (e) { r.classList.add('loader-seen'); } })(document.documentElement)</script>
</head>
<body>
  <div class="loader" aria-hidden="true">…</div>   <!-- the loader, built from the site name -->
  <div id="root"></div>
</body>
```

## React (Vite)

```jsx
import { useEffect } from 'react';
import './storymotion.css';
import './storymotion.js';            // as a module: registers window.StoryMotion, does not start

export default function StoryPage() {
  useEffect(() => {
    const scene = document.querySelector('.route');
    const onProgress = e => { /* per-frame story logic, e.g. move the walker */ };
    scene?.addEventListener('progress', onProgress);   // attach before init: the first "progress" fires on the next frame
    const destroy = window.StoryMotion.init();
    return () => { scene?.removeEventListener('progress', onProgress); destroy(); };
  }, []);
  return (/* template markup, class → className, style strings → objects, e.g. style={{ '--i': 1 }} */);
}
```

- Put `.gauge`, `.chapter` and the scenes inside the page component; `init()` on mount, `destroy()` on unmount covers route changes.
- **Hydration / re-render limit:** the core rewrites the children of `[data-split]` and `.loader [data-name]` (letters).
  Keep those elements static (plain text, no state inside) or React will fight the DOM. If a headline must change with state,
  give it a `key` that changes too, so React remounts it, then call `destroy(); init()` again.
- StrictMode runs effects twice in development (`init → destroy → init`); that is safe.

## Next.js (App Router)

```jsx
// app/layout.jsx
import './storymotion.css';
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>  {/* the head script adds classes before hydration */}
      <head><script dangerouslySetInnerHTML={{ __html: `/* the head script above */` }} /></head>
      <body><div className="loader" aria-hidden="true">…</div>{children}</body>
    </html>
  );
}
```
```jsx
// app/story.jsx
'use client';
import { useEffect } from 'react';
export default function Story({ children }) {
  useEffect(() => {
    let destroy;
    import('./storymotion.js').then(() => { destroy = window.StoryMotion.init(); });  // browser only
    return () => destroy?.();
  }, []);
  return children;
}
```

Server components render the markup; only this wrapper is a client component.

## Astro

```astro
---
// src/layouts/Story.astro
import '../storymotion.css';
---
<html lang="en">
  <head><script is:inline>/* the head script above */</script></head>
  <body>
    <div class="loader" aria-hidden="true">…</div>
    <slot />
    <script>
      import '../storymotion.js';     // Astro bundles <script> as a module, so start it here
      window.StoryMotion.init();
    </script>
  </body>
</html>
```

- Prefer the native cross-document transitions already in `storymotion.css` (`@view-transition`) over Astro's `<ClientRouter />`:
  every page is a real page load, so the core starts cleanly each time.
- If you do use `<ClientRouter />`, restart the core on every swap:
  `let d; document.addEventListener('astro:page-load', () => { d?.(); d = window.StoryMotion.init(); });`

## Verify

Run the site (`npm run dev` / `npm run preview`) and point the check at the URL:
`node <site-start skill>/scripts/check.cjs http://localhost:5173/ --out check-shots`

// StoryMotion core. Markup hooks:
//   [data-reveal] (+ style="--i:n")   fade-up once in view
//   [data-split]                      headline split into letters
//   [data-count]                      count up to this number (final value already in the HTML)
//   [data-chapter="…"]                section name shown in .chapter (translate with data-i18n-chapter="key")
//   .scene > .stage                   pinned scene; sets --p (0 → 1) on .scene, fires a "progress" event (detail = {p, step})
//     [data-step] inside a scene      one is .on at a time; or data-steps="n" on .scene to set the count
//     data-dark-after="0.7"           sets [data-dark] on the scene past that progress
//   .gauge > i                        draggable scroll gauge; gets a <b> mark per [data-chapter] (data-label, data-n)
//   window "pageprogress" event       detail = page progress 0 → 1
//   .loader                           intro built from the site name: --lp 0 → 1, "loaderprogress" event (see storymotion.css)
//   [data-i18n="key"]                 text from <script type="application/json" id="sm-i18n">{"it": {"key": "…"}}</script>;
//                                     the HTML holds the default language (html lang); [data-lang="it"] buttons switch
//   [data-magnetic]                   magnetic CTA
// Reduced motion: scenes jump between step states instead of scrubbing; no loader, count-up or magnet.
//
// Plain sites: <script src="storymotion.js"></script> at the end of <body> runs init() by itself.
// React / Astro / SPA: import the file, then call StoryMotion.init() after render; it returns destroy().
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = v => Math.min(1, Math.max(0, v));
  const splitLetters = (el, hidden) => {
    let i = 0;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(word =>
      `<span class="w"${hidden ? ' aria-hidden="true"' : ''}>${[...word].map(c => `<span style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ');
  };

  // ---- i18n ----------------------------------------------------------------------------------
  let dict = {};
  try { dict = JSON.parse(document.getElementById('sm-i18n')?.textContent || '{}'); } catch {}
  const baseLang = root.lang || 'en';
  const langs = [baseLang, ...Object.keys(dict).filter(l => l !== baseLang)];
  function pickLang() {
    const want = [new URLSearchParams(location.search).get('lang')];
    try { want.push(localStorage.getItem('sm-lang')); } catch {}
    want.push(...(navigator.languages || []).map(l => l.slice(0, 2)));
    return want.find(l => l && langs.includes(l)) || baseLang;
  }
  function applyLang(lang) {
    root.lang = lang;
    const t = (el, key) => {
      if (!(key in el.dataset)) return;
      const k = el.dataset[key];
      const store = key + 'Default';
      if (!(store in el.dataset)) el.dataset[store] = key === 'i18nChapter' ? el.dataset.chapter : el.textContent;
      const text = (dict[lang] && dict[lang][k]) ?? el.dataset[store];
      if (key === 'i18nChapter') el.dataset.chapter = text; else el.textContent = text;
    };
    document.querySelectorAll('[data-i18n]').forEach(el => t(el, 'i18n'));
    document.querySelectorAll('[data-i18n-chapter]').forEach(el => t(el, 'i18nChapter'));
    document.querySelectorAll('[data-count]').forEach(el => el.textContent = (+el.dataset.count).toLocaleString(lang));
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  }

  function init() {
    root.classList.add('js');
    const ac = new AbortController(), on = { signal: ac.signal }, observers = [];
    let alive = true;

    applyLang(pickLang());

    // ---- loader (once per session for the whole site) ------------------------------------------
    const loader = document.querySelector('.loader');
    document.querySelectorAll('.loader [data-name]').forEach(el => splitLetters(el, false));
    if (!loader || reduce.matches || !root.classList.contains('loading')) {
      root.classList.remove('loading');
      loader?.remove();
    } else {
      const min = +loader.dataset.min || 1600, t0 = performance.now();
      let finished = false;
      const setLp = lp => { loader.style.setProperty('--lp', lp.toFixed(4)); loader.dispatchEvent(new CustomEvent('loaderprogress', { detail: lp })); };
      const frame = t => { if (finished || !alive) return; setLp(1 - Math.pow(1 - clamp((t - t0) / min), 3)); requestAnimationFrame(frame); };
      requestAnimationFrame(frame);
      const done = () => {
        if (finished) return;
        finished = true;
        setLp(1);
        try { sessionStorage.setItem('sm-loader', '1'); } catch {}
        loader.classList.add('out');
        root.classList.remove('loading'); // hero animations start now, as the loader fades
        setTimeout(() => loader.remove(), 900);
      };
      const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
      Promise.race([Promise.all([loaded, document.fonts?.ready]), new Promise(r => setTimeout(r, 4000))])
        .then(() => setTimeout(done, Math.max(0, min - (performance.now() - t0))));
      loader.addEventListener('click', done, on);
    }

    // ---- split headlines (after i18n, so the translated text is split) --------------------------
    const split = () => document.querySelectorAll('[data-split]').forEach(el => {
      el.setAttribute('aria-label', el.textContent);
      splitLetters(el, true);
    });
    split();

    // ---- reveals and count-ups ------------------------------------------------------------------
    const countUp = el => {
      if (reduce.matches) return;
      const to = +el.dataset.count, t0 = performance.now();
      const step = t => {
        if (!alive) return;
        const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(to * e).toLocaleString(root.lang);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.matches('[data-count]')) countUp(e.target);
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    }), { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    observers.push(io);

    // ---- chapter label ----------------------------------------------------------------------------
    const label = document.querySelector('.chapter');
    let current = null;
    if (label) {
      const chapters = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { current = e.target; label.textContent = e.target.dataset.chapter; }
      }), { rootMargin: '-50% 0px -50% 0px' });
      document.querySelectorAll('[data-chapter]').forEach(el => chapters.observe(el));
      observers.push(chapters);
    }

    // ---- pinned scenes ------------------------------------------------------------------------------
    const scenes = [...document.querySelectorAll('.scene')].map(el => ({ el, last: -1 }));
    let queued = false;
    function tick() {
      queued = false;
      if (!alive) return;
      for (const s of scenes) {
        const r = s.el.getBoundingClientRect();
        let p = clamp(-r.top / Math.max(1, r.height - innerHeight));
        const steps = s.el.querySelectorAll('[data-step]');
        const n = +s.el.dataset.steps || steps.length;
        const active = n ? Math.min(n - 1, Math.floor(p * n)) : 0;
        if (reduce.matches && n > 1) p = active / (n - 1);
        steps.forEach((el, i) => el.classList.toggle('on', i === active));
        if (s.el.dataset.darkAfter) s.el.toggleAttribute('data-dark', p > +s.el.dataset.darkAfter);
        if (p !== s.last) {
          s.last = p;
          s.el.style.setProperty('--p', p.toFixed(4));
          s.el.style.setProperty('--step', active);
          s.el.dispatchEvent(new CustomEvent('progress', { detail: { p, step: active } }));
        }
      }
      const pp = clamp(scrollY / Math.max(1, root.scrollHeight - innerHeight));
      root.style.setProperty('--progress', pp);
      dispatchEvent(new CustomEvent('pageprogress', { detail: pp }));
    }
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true, signal: ac.signal });
    addEventListener('resize', tick, on);
    reduce.addEventListener('change', tick, on);
    requestAnimationFrame(tick); // after template scripts have attached their "progress" listeners

    // ---- scroll gauge with chapter marks ------------------------------------------------------
    const gauge = document.querySelector('.gauge');
    const marks = () => {
      if (!gauge) return;
      gauge.querySelectorAll('b').forEach(b => b.remove());
      const max = Math.max(1, root.scrollHeight - innerHeight);
      document.querySelectorAll('[data-chapter]').forEach((sec, n) => {
        const b = document.createElement('b');
        b.style.top = `${clamp((sec.getBoundingClientRect().top + scrollY) / max) * 100}%`;
        b.dataset.label = sec.dataset.chapter;
        b.dataset.n = String(n + 1).padStart(2, '0');
        gauge.append(b);
      });
    };
    if (gauge) {
      const seek = e => {
        const r = gauge.getBoundingClientRect();
        scrollTo(0, clamp((e.clientY - r.top) / r.height) * (root.scrollHeight - innerHeight));
      };
      gauge.addEventListener('pointerdown', e => { gauge.setPointerCapture(e.pointerId); seek(e); gauge.onpointermove = seek; }, on);
      gauge.addEventListener('pointerup', () => { gauge.onpointermove = null; }, on);
      marks();
      addEventListener('resize', marks, on);
      addEventListener('load', marks, on);
    }

    // ---- language switch ----------------------------------------------------------------------
    document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
      applyLang(b.dataset.lang);
      try { localStorage.setItem('sm-lang', b.dataset.lang); } catch {}
      split();
      if (label && current) label.textContent = current.dataset.chapter;
      marks();
      tick();
    }, on));

    // ---- magnetic CTA ---------------------------------------------------------------------------
    const mag = document.querySelector('[data-magnetic]');
    if (mag && matchMedia('(hover: hover)').matches && !reduce.matches) {
      mag.addEventListener('pointermove', e => {
        const r = mag.getBoundingClientRect();
        mag.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .25}px`;
      }, on);
      mag.addEventListener('pointerleave', () => mag.style.translate = '0 0', on);
    }

    return function destroy() {
      alive = false;
      ac.abort();
      observers.forEach(o => o.disconnect());
    };
  }

  window.StoryMotion = { init, setLang: lang => document.querySelector(`[data-lang="${lang}"]`)?.click() ?? applyLang(lang) };
  // A classic <script src> tag runs it at once; an ES-module import (bundlers) leaves init() to the app.
  if (document.currentScript) init();
})();

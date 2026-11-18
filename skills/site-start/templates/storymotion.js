// StoryMotion core. Markup hooks:
//   [data-reveal] (+ style="--i:n")   fade-up once in view
//   [data-split]                      headline split into letters
//   [data-count]                      count up to this number (final value already in the HTML)
//   [data-chapter="…"]                section name shown in .chapter
//   .scene > .stage                   pinned scene; sets --p (0 → 1) on .scene, fires a "progress" event (detail = p)
//     [data-step] inside a scene      one is .on at a time; or data-steps="n" on .scene to set the count
//     data-dark-after="0.7"           sets [data-dark] on the scene past that progress
//   .gauge > i                        draggable scroll gauge; gets a <b> mark per [data-chapter] (data-label, data-n),
//                                     click a mark area to jump; style it per template so it fits the story
//   window "pageprogress" event       detail = page progress 0 → 1 (for gauge readouts: hour, km, year…)
//   [data-magnetic]                   magnetic CTA
// Reduced motion: scenes jump between step states instead of scrubbing; no count-up, no magnet.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = v => Math.min(1, Math.max(0, v));

  // Letters wrapped per word, so lines still break between words.
  for (const el of document.querySelectorAll('[data-split]')) {
    el.setAttribute('aria-label', el.textContent);
    let i = 0;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(word =>
      `<span class="w" aria-hidden="true">${[...word].map(c => `<span style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ');
  }

  const countUp = el => {
    if (reduce.matches) return;
    const to = +el.dataset.count, t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(to * e).toLocaleString(root.lang || undefined);
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

  const label = document.querySelector('.chapter');
  if (label) {
    const chapters = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) label.textContent = e.target.dataset.chapter;
    }), { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('[data-chapter]').forEach(el => chapters.observe(el));
  }

  const scenes = [...document.querySelectorAll('.scene')].map(el => ({ el, last: -1 }));
  let queued = false;
  function tick() {
    queued = false;
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
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true });
  addEventListener('resize', tick);
  reduce.addEventListener('change', tick);
  requestAnimationFrame(tick); // after template scripts have attached their "progress" listeners

  const gauge = document.querySelector('.gauge');
  if (gauge) {
    const seek = e => {
      const r = gauge.getBoundingClientRect();
      scrollTo(0, clamp((e.clientY - r.top) / r.height) * (root.scrollHeight - innerHeight));
    };
    gauge.addEventListener('pointerdown', e => { gauge.setPointerCapture(e.pointerId); seek(e); gauge.onpointermove = seek; });
    gauge.addEventListener('pointerup', () => { gauge.onpointermove = null; });
    // Chapter marks: where each chapter starts on the page, as a share of the scroll.
    const marks = () => {
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
    marks();
    addEventListener('resize', marks);
    addEventListener('load', marks);
  }

  const mag = document.querySelector('[data-magnetic]');
  if (mag && matchMedia('(hover: hover)').matches && !reduce.matches) {
    mag.addEventListener('pointermove', e => {
      const r = mag.getBoundingClientRect();
      mag.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .25}px`;
    });
    mag.addEventListener('pointerleave', () => mag.style.translate = '0 0');
  }
})();

/* DONE RITE Creator OS — shared glass-button touch light and offline SFX */
(function () {
  'use strict';
  const selector = 'button,.button,.btn,.navbtn,.back-link,.download,.open,.creator-os-float-return,.control-grid a,.desktop-hotspots a,[role="button"]';
  const manifestUrl = 'assets/sfx/manifest.json';
  const knownSounds = new Set(['click', 'pop', 'snap', 'whoosh']);
  const recent = new WeakMap();
  let audioContext = null;

  fetch(manifestUrl, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(data => {
    (data && data.builtIn || []).forEach(item => { if (item && item.id) knownSounds.add(item.id); });
  }).catch(() => {});

  function controlFrom(target) {
    const control = target && target.closest ? target.closest(selector) : null;
    if (!control || control.disabled || control.getAttribute('aria-disabled') === 'true') return null;
    return control;
  }
  function role(control) {
    const explicit = control.dataset.touchSound;
    if (explicit && knownSounds.has(explicit)) return explicit;
    const text = String(control.textContent || control.getAttribute('aria-label') || '').toLowerCase();
    if (control.matches('.dr-danger,.remove-clip,.danger,[data-touch-role="danger"]') || /remove|delete|reset|clear/.test(text)) return 'snap';
    if (control.matches('.button.good,.btn.green,.dr-button,[data-touch-role="primary"]') || /create|record|render|finish|save|export|use this/.test(text)) return 'pop';
    if (control.matches('a,.back-link,.navbtn') || /back|open|next|previous/.test(text)) return 'whoosh';
    return 'click';
  }
  function context() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }
  function tone(ctx, start, frequency, duration, gainValue, type) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .02);
  }
  function play(name) {
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime + .002;
    if (name === 'pop') {
      tone(ctx, now, 540, .09, .026, 'sine');
      tone(ctx, now + .035, 820, .10, .018, 'sine');
    } else if (name === 'snap') {
      tone(ctx, now, 1180, .045, .018, 'square');
      tone(ctx, now + .018, 690, .055, .012, 'triangle');
    } else if (name === 'whoosh') {
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(250, now);
      oscillator.frequency.exponentialRampToValueAtTime(760, now + .11);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.018, now + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .13);
      oscillator.connect(gain).connect(ctx.destination); oscillator.start(now); oscillator.stop(now + .15);
    } else {
      tone(ctx, now, 760, .065, .018, 'triangle');
      tone(ctx, now + .018, 980, .055, .012, 'sine');
    }
  }
  function react(control, sound) {
    const now = performance.now();
    if (now - (recent.get(control) || 0) < 160) return;
    recent.set(control, now);
    control.classList.remove('dr-touch-live');
    void control.offsetWidth;
    control.classList.add('dr-touch-live');
    window.setTimeout(() => control.classList.remove('dr-touch-live'), 360);
    play(sound || role(control));
  }
  document.addEventListener('pointerdown', event => {
    const control = controlFrom(event.target);
    if (control) react(control);
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const control = controlFrom(event.target);
    if (control) react(control);
  }, true);
  document.documentElement.classList.add('dr-smoked-glass-ready');
  window.DoneRiteTouchFeedback = { play, react, manifestUrl };
})();

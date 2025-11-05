// light-dark.js
(function () {
  const BUTTON_ID = 'light-dark-toggle';
  const LABEL_ID = 'light-dark-text';
  const STORAGE_KEY = 'theme';
  const LIGHT = 'light';
  const DARK = 'dark';
  const THEME_ANIM_MS = 280;
  let __themeTimer;

  function withThemeTransition(performChange, duration = THEME_ANIM_MS) {
    const root = document.documentElement;
    root.classList.add('theme-transition');       // enable CSS transitions
    // Force reflow so the class takes effect before we change the theme
    void root.offsetWidth;
    performChange();                               // change data-theme + UI
    clearTimeout(__themeTimer);
    __themeTimer = setTimeout(() => {
      root.classList.remove('theme-transition');   // clean up
    }, duration + 50);
}


  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    updateUi(theme);
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function systemPrefersLight() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function initTheme() {
    const saved = getStoredTheme();
    const initial = (saved === LIGHT || saved === DARK) ? saved : (systemPrefersLight() ? LIGHT : DARK);
    applyTheme(initial);

    // If user hasn't chosen, follow OS changes live
    if (!saved && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', e =>
    withThemeTransition(() => applyTheme(e.matches ? LIGHT : DARK))
  );
  }
  }

  function updateUi(theme) {
    const btn = document.getElementById(BUTTON_ID);
    const label = document.getElementById(LABEL_ID);
    const tdnn = document.querySelectorAll('.tdnn').forEach(el => {
    el.addEventListener('click', toggleTheme);
    });
    const moon = document.querySelector('.moon');

    // Match CSS: aria-pressed="true" means LIGHT is active
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === LIGHT));
      btn.setAttribute('aria-label', theme === LIGHT ? 'Light mode active' : 'Dark mode active');
    }
    if (label) {
      label.classList.toggle('is-light', theme === LIGHT);
      label.classList.toggle('is-dark', theme === DARK);
      label.textContent = theme === LIGHT ? 'Light' : 'Dark';
    }
    document.querySelectorAll('.tdnn').forEach(el => {
      el.classList.toggle('day', theme === LIGHT);
  });
  document.querySelectorAll('.tdnn .moon').forEach(el => {
    el.classList.toggle('sun', theme === LIGHT);
  });

  }

  function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') ||
                  (systemPrefersLight() ? LIGHT : DARK);
  const next = current === LIGHT ? DARK : LIGHT;
  withThemeTransition(() => applyTheme(next));
}

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const btn = document.getElementById(BUTTON_ID);
    if (btn) btn.addEventListener('click', toggleTheme);
    const tdnn = document.querySelector('.tdnn');
    if (tdnn) tdnn.addEventListener('click', toggleTheme);
  });
})();

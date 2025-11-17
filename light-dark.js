// light-dark.js
(function () {
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
    mq.addEventListener('change', e => withThemeTransition(() => applyTheme(e.matches ? LIGHT : DARK)));
  }
  }

  function updateArrowIcons(theme) {
    const nextIcon = document.getElementById('next-button-icon');
    const previousIcon = document.getElementById('previous-button-icon');
    const restartIcon = document.getElementById('quiz-restart-icon');
    if (theme === LIGHT) {
      if (nextIcon) nextIcon.src = 'icons/right_arrow_icon_light.png';
      if (previousIcon) previousIcon.src = 'icons/left_arrow_icon_light.png';
      if (restartIcon) restartIcon.src = 'icons/restart_icon_light.png';
    } else {
      if (nextIcon) nextIcon.src = 'icons/right_arrow_icon_dark.png';
      if (previousIcon) previousIcon.src = 'icons/left_arrow_icon_dark.png';
      if (restartIcon) restartIcon.src = 'icons/restart_icon_dark.png';
    }
  }

  function updateUi(theme) {
    // Match CSS: aria-pressed="true" means LIGHT is active
    document.querySelectorAll('.tdnn').forEach(el => {
      el.classList.toggle('day', theme === LIGHT);
  });
  document.querySelectorAll('.tdnn .moon').forEach(el => {
    el.classList.toggle('sun', theme === LIGHT);
  });
    updateArrowIcons(theme);
  }

  function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') ||
                  (systemPrefersLight() ? LIGHT : DARK);
  const next = current === LIGHT ? DARK : LIGHT;
  withThemeTransition(() => applyTheme(next));
}

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const tdnn = document.querySelectorAll('.tdnn');
    if (tdnn) tdnn.forEach(el => el.addEventListener('click', toggleTheme));
  });
})();

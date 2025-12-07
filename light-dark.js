/* 
==========================================================================
Project: Nginx overview site
Name: Caleb Jarrell
File: light-dark.js
Purpose: Logic for the theme toggle switch
========================================================================== 
*/

// light-dark.js
(function () {
  /* -----------------------------------------------------------------------------
     CONSTANTS & VARIABLES
     Theme identifiers and animation settings
  ----------------------------------------------------------------------------- */
  const STORAGE_KEY = 'theme';
  const LIGHT = 'light';
  const DARK = 'dark';
  const THEME_ANIM_MS = 280;
  let __themeTimer;

  /* -----------------------------------------------------------------------------
     THEME TRANSITION
     Handles CSS transitions during theme switch
  ----------------------------------------------------------------------------- */
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


  /* -----------------------------------------------------------------------------
     APPLY THEME
     Sets attributes and local storage
  ----------------------------------------------------------------------------- */
  function applyTheme(theme) {
    // Set the data-theme attribute on the html element
    document.documentElement.setAttribute('data-theme', theme);
    // Save preference to local storage
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    // Update icons and other UI elements
    updateUi(theme);
  }

  /* -----------------------------------------------------------------------------
     THEME PREFERENCES
     Retrieves stored or system preference
  ----------------------------------------------------------------------------- */
  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function systemPrefersLight() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function initTheme() {
    const saved = getStoredTheme();
    // Determine initial theme: saved > system preference > default (dark)
    const initial = (saved === LIGHT || saved === DARK) ? saved : (systemPrefersLight() ? LIGHT : DARK);
    applyTheme(initial);

    // If user hasn't chosen, follow OS changes live
    if (!saved && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    // Listen for system theme changes
    mq.addEventListener('change', e => withThemeTransition(() => applyTheme(e.matches ? LIGHT : DARK)));
  }
  }

  /* -----------------------------------------------------------------------------
     UI UPDATES
     Updates icons and toggle switch visuals
  ----------------------------------------------------------------------------- */
  function updateArrowIcons(theme) {
    const nextIcon = document.getElementById('next-button-icon');
    const previousIcon = document.getElementById('previous-button-icon');
    const restartIcon = document.getElementById('quiz-restart-icon');
    
    // Update image sources based on active theme
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
    // Toggle sun/moon icon classes
    document.querySelectorAll('.tdnn').forEach(el => {
      el.classList.toggle('day', theme === LIGHT);
  });
  document.querySelectorAll('.tdnn .moon').forEach(el => {
    el.classList.toggle('sun', theme === LIGHT);
  });
    updateArrowIcons(theme);
  }

  /* -----------------------------------------------------------------------------
     TOGGLE ACTION
     Switches between light and dark modes
  ----------------------------------------------------------------------------- */
  function toggleTheme() {
  // Get current theme or calculate default
  const current = document.documentElement.getAttribute('data-theme') ||
                  (systemPrefersLight() ? LIGHT : DARK);
  // Switch to opposite theme
  const next = current === LIGHT ? DARK : LIGHT;
  withThemeTransition(() => applyTheme(next));
}

  /* -----------------------------------------------------------------------------
     INITIALIZATION
     Sets up event listeners on load
  ----------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const tdnn = document.querySelectorAll('.tdnn');
    if (tdnn) tdnn.forEach(el => el.addEventListener('click', toggleTheme));
  });
})();

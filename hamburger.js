// hamburger.js

//Caches references to the media query and key elements
const mq = window.matchMedia('(max-width: 880px)');
const body = document.body;
const hamMenu = document.querySelector('.ham-menu');
const drawer = document.getElementById('mobile-drawer') || document.querySelector('.off-screen-menu');

//Only true when width is smaller than 880px, determines whether or not to run JS functions
function isMobile() { return mq.matches; }
function setExpanded(v) { hamMenu?.setAttribute('aria-expanded', String(v)); }

//Sets class values to menu-open/active to activate the hamburger menu slide in and updates ARIA value
function openMenu() {
  body.classList.add('menu-open');
  hamMenu?.classList.add('active');
  drawer?.classList.add('active');
  setExpanded(true);
}

//Sets class values to menu-open/active to activate the hamburger menu slide out and updates ARIA value
function closeMenu() {
  body.classList.remove('menu-open');
  hamMenu?.classList.remove('active');
  drawer?.classList.remove('active');
  setExpanded(false);
}

//Watches for clicks/touches on the hamburger menu to run the functions that activate hamburger menu, only occurs if isMobile is true
hamMenu?.addEventListener('click', () => {
  if (!isMobile()) return;                  
  body.classList.contains('menu-open') ? closeMenu() : openMenu();
});

// Close when a menu button is clicked (mobile)
drawer?.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeMenu();
});

// Escape to close (mobile)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMobile()) closeMenu();
});

// Auto-close hamburger menu if resized to desktop
mq.addEventListener('change', (e) => {
  if (!e.matches) closeMenu();
});

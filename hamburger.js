// hamburger.js

const mq = window.matchMedia('(max-width: 870px)');
const body = document.body;
const hamMenu = document.querySelector('.ham-menu');
const drawer = document.getElementById('mobile-drawer') || document.querySelector('.off-screen-menu');

function isMobile() { return mq.matches; }
function setExpanded(v) { hamMenu?.setAttribute('aria-expanded', String(v)); }

function openMenu() {
  body.classList.add('menu-open');
  hamMenu?.classList.add('active');
  drawer?.classList.add('active');
  setExpanded(true);
}

function closeMenu() {
  body.classList.remove('menu-open');
  hamMenu?.classList.remove('active');
  drawer?.classList.remove('active');
  setExpanded(false);
}

hamMenu?.addEventListener('click', () => {
  if (!isMobile()) return;                  // only on mobile/tablet
  body.classList.contains('menu-open') ? closeMenu() : openMenu();
});

// Close when a drawer link is clicked (mobile UX)
drawer?.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeMenu();
});

// Escape to close (mobile)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMobile()) closeMenu();
});

// Auto-close if resized to desktop
mq.addEventListener('change', (e) => {
  if (!e.matches) closeMenu();
});

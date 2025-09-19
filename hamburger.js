/* This code was discovered and adapted from a youtube video. (Channel: Treehouse) */
const hamMenu = document.querySelector('.ham-menu');

const offScreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
})

// Grab the hamburger and the off-screen menu
const ham = document.querySelector('.ham-menu');
const menu = document.querySelector('.off-screen-menu');


// OPTIONAL: close when a menu link is clicked
menu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => document.body.classList.remove('menu-open'))
);

// OPTIONAL: close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.body.classList.remove('menu-open');
  }
});

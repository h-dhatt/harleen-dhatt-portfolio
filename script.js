// theme toggle
const toggle = document.getElementById('themeToggle');
if (toggle){
  toggle.addEventListener('click', () => {
    const r = document.documentElement;
    const next = r.dataset.theme === 'dark' ? 'light' : 'dark';
    r.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
}

// year
document.getElementById('year').textContent = new Date().getFullYear();

// reveal on scroll (progressive enhancement)
// cards are visible by default; this just animates .reveal ones
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

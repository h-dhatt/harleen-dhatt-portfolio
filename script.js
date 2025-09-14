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
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- PLAYGROUND: all 2022 repos ---------- */
/* Pulled from your GitHub repos list. Feel free to reorder or edit labels. */
const playgroundRepos = [
  { name: "Workshops",                url: "https://github.com/h-dhatt/Workshops",               label: "Notebooks" },
  { name: "h-dhatt.github.io",        url: "https://github.com/h-dhatt/h-dhatt.github.io",       label: "Site" },
  { name: "Checkerboard-Game",        url: "https://github.com/h-dhatt/Checkerboard-Game",       label: "Game" },
  { name: "Roll-a-Die",               url: "https://github.com/h-dhatt/Roll-a-Die",              label: "Utility" },
  { name: "Birthday-Log",             url: "https://github.com/h-dhatt/Birthday-Log",            label: "Utility" },
  { name: "Tic-Tac-Toe",              url: "https://github.com/h-dhatt/Tic-Tac-Toe",             label: "Game" },
  { name: "Decision-Maker",           url: "https://github.com/h-dhatt/Decision-Maker",          label: "Utility" },
  { name: "Rock_Paper_Scissors",      url: "https://github.com/h-dhatt/Rock_Paper_Scissors",     label: "Game" },
  { name: "Hangman",                  url: "https://github.com/h-dhatt/Hangman",                 label: "Game" },
  { name: "Slice-Email-ID",           url: "https://github.com/h-dhatt/Slice-Email-ID",          label: "Utility" },
  { name: "Russian-Roulette",         url: "https://github.com/h-dhatt/Russian-Roulette",        label: "Game" },
  { name: "Sudoku-Solver",            url: "https://github.com/h-dhatt/Sudoku-Solver",           label: "Puzzle" },
  { name: "Calculate-your-Age",       url: "https://github.com/h-dhatt/Calculate-your-Age",      label: "Utility" },
  { name: "Math-Game",                url: "https://github.com/h-dhatt/Math-Game",               label: "Game" },
  { name: "Guess-the-Number",         url: "https://github.com/h-dhatt/Guess-the-Number",        label: "Game" },
  { name: "Magic-8-Ball",             url: "https://github.com/h-dhatt/Magic-8-Ball",            label: "Toy" },
  { name: "Game-of-Knowledge",        url: "https://github.com/h-dhatt/Game-of-Knowledge",       label: "Quiz" },
  { name: "Choose-an-Adventure",      url: "https://github.com/h-dhatt/Choose-an-Adventure",     label: "Story" },
  { name: "Login-System",             url: "https://github.com/h-dhatt/Login-System",            label: "Auth" },
  { name: "Chessboard-Visual",        url: "https://github.com/h-dhatt/Chessboard-Visual",       label: "Visual" },
  { name: "Caesar-Cipher",            url: "https://github.com/h-dhatt/Caesar-Cipher",           label: "Cipher" },
  { name: "Countdown-Timer",          url: "https://github.com/h-dhatt/Countdown-Timer",         label: "Utility" }
];

(function renderPlayground(){
  const wrap = document.getElementById('playground-cards');
  if (!wrap) return;

  playgroundRepos.forEach(({name, url, label}) => {
    const card = document.createElement('article');
    card.className = 'project';

    card.innerHTML = `
      <div class="badge badge-soft">${label}</div>
      <h3>${name.replace(/-/g,' ')}</h3>
      <p class="muted">${label === 'Game' ? 'A small interactive build.' :
                        label === 'Utility' ? 'A handy little script.' :
                        label === 'Puzzle' ? 'Logic-focused practice.' :
                        label === 'Auth' ? 'Basic authentication pattern.' :
                        label === 'Visual' ? 'Visual / graphics practice.' :
                        label === 'Cipher' ? 'Classic text cipher.' :
                        label === 'Site' ? 'Website scaffold.' :
                        label === 'Notebooks' ? 'Assorted notebooks.' :
                        label === 'Toy' ? 'Just for fun.' :
                        label === 'Quiz' ? 'Question-and-answer practice.' :
                        label === 'Story' ? 'Text adventure practice.' : 'Small experiment.'}
      </p>
      <div class="actions">
        <a class="btn small" href="${url}" target="_blank" rel="noopener">Open</a>
      </div>
    `;
    wrap.appendChild(card);
  });
})();

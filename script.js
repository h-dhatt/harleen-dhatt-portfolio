(function(){
  const GITHUB_USER = 'h-dhatt';
  const GAME_HINTS = [
    'Checkerboard-Game','Roll-a-Die','Birthday-Log','Tic-Tac-Toe','Decision-Maker',
    'Rock_Paper_Scissors','Hangman','Slice-Email-ID','Russian-Roulette','Sudoku-Solver',
    'Calculate-your-Age','Math-Game','Guess-the-Number','Magic-8-Ball',
    'Game-of-Knowledge','Choose-an-Adventure','Login-System','Chessboard-Visual',
    'Caesar-Cipher','Countdown-Timer'
  ];

  const grid = document.getElementById('games-grid');
  const teaser = document.getElementById('games-teaser');
  if(!grid && !teaser) return;

  fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
    .then(r=>r.json())
    .then(repos=>{
      const games = repos.filter(r=>{
        const is2022 = r.created_at && r.created_at.startsWith('2022-');
        const nameHit = GAME_HINTS.includes(r.name);
        const looksGamey = /game|tic|hangman|die|guess|chess|cipher|timer|roulette/i.test(r.name);
        return is2022 && (nameHit || looksGamey);
      }).sort((a,b)=>a.name.localeCompare(b.name));

      const cards = games.map(repo=>{
        const desc = repo.description || 'Mini console game written in Python.';
        return `
          <article class="project">
            <h3>${repo.name.replaceAll('-', ' ')}</h3>
            <p>${desc}</p>
            <span class="tags">Python · 2022</span>
            <a class="btn btn--sm" href="${repo.html_url}" target="_blank" rel="noopener">Repo</a>
          </article>`;
      });

      if(grid){ grid.innerHTML = cards.join(''); }
      if(teaser){
        teaser.innerHTML = games.map(r=>
          `<a class="project" href="${r.html_url}" target="_blank" rel="noopener">
            <div class="project" style="min-height:120px">
              <h3>${r.name.replaceAll('-', ' ')}</h3>
              <span class="tags">Python · 2022</span>
            </div>
          </a>`).join('');
      }
    })
    .catch(()=>{
      if(grid){
        grid.innerHTML = `<p class="muted">Couldn’t load from GitHub right now. See all repos 
          <a class="link" href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">here</a>.
        </p>`;
      }
    });
})();

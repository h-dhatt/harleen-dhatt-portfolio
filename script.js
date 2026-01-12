/* =========================================================
   script.js — FULL FILE (copy/paste this whole thing)
   - Starts on homepage (modal is CLOSED on load)
   - Click project -> modal opens
   - Click outside / press Esc / click X -> modal closes
   - Light/Dark toggle works + saves
   - Subtle animated canvas background

   UPDATED BY CHATGPT:
   - Replaced projects with ONLY your 3 projects
   - Added cover + images[] fields
   - Renders cover on project cards
   - Renders all images (2–3) stacked in modal
========================================================= */

/* ==========================
   Tiny helpers
========================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ==========================
   Theme toggle (works + persists)
========================== */
const THEME_KEY = "hd_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;

  // ✅ Default theme when there's no saved choice
  return "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  const btn = $("#themeToggle");
  if (btn) btn.setAttribute("aria-pressed", String(theme === "dark"));

  const icon = $("#themeToggle .toggle__icon");
  if (icon) icon.textContent = theme === "dark" ? "☾" : "◐";
}

setTheme(getPreferredTheme());

window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", (e) => {
  // Only auto-follow OS if the user hasn't explicitly chosen a theme
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return;
  setTheme(e.matches ? "dark" : "light");
});

$("#themeToggle")?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
});

/* ==========================
   Reveal on scroll
========================== */
const revealEls = $$(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

/* ==========================
   Year
========================== */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ==========================
   Projects data (ONLY these 3)
   + cover (card)
   + images[] (modal)
========================== */
const PROJECTS = [
  {
    id: "toronto-ksi",
    title: "Toronto KSI Traffic Collisions Analysis",
    badge: "Data Analysis",
    blurb:
      "Analyzed Killed or Seriously Injured (KSI) collisions to find hotspots, trends, and impacted road user groups.",
    repo: "https://github.com/h-dhatt/toronto-ksi-collisions-analysis",

    // NEW: card cover image
    cover: "assets/ksi/hotspots.jpg",

    // NEW: stacked images in modal
    images: ["assets/ksi/hotspots.jpg", "assets/ksi/trends_road_users.jpg"],

    why:
      "KSI collisions are a key road-safety metric. I wanted a clear, descriptive view of where severe collisions cluster and how patterns change over time.",
    shows:
      "Hotspots, time trends, and road-user patterns in KSI collision records.",
    bullets: [
      "Cleaned and standardized Toronto KSI open data in Python",
      "Built hotspot summaries and trend breakdowns",
      "Created a Power BI report for quick exploration",
    ],
    tags: ["Python", "pandas", "Power BI", "EDA"],
    stack: ["Python", "pandas", "Power BI"],
    methods: ["Cleaning", "EDA", "Aggregation", "Trend analysis"],
    deliverables: ["Power BI dashboard", "Cleaned analysis outputs", "Write-up in repo"],
  },

  {
    id: "ttc-delays",
    title: "TTC Delay Hotspots & Drivers",
    badge: "Data Analysis",
    blurb:
      "Explored subway delay data to identify recurring hotspots, major causes, and time-based patterns.",
    repo: "https://github.com/h-dhatt/ttc-subway-delays-2024",

    cover: "assets/ttc/overview.jpg",
    images: ["assets/ttc/overview.jpg", "assets/ttc/hotspots.jpg", "assets/ttc/drivers.jpg"],

    why:
      "TTC delays affect real commuters. I wanted to turn raw incident logs into a clear view of what’s happening most often and where.",
    shows:
      "Where delays cluster, what causes dominate, and how patterns shift across time.",
    bullets: [
      "Queried and summarized delay data with SQL",
      "Validated + cleaned datasets in Python",
      "Built a Power BI dashboard for delays by station/cause/time",
    ],
    tags: ["SQL", "Python", "Power BI", "Dashboards"],
    stack: ["SQL", "Python", "Power BI"],
    methods: ["Joins", "Grouping", "KPI summaries", "Dashboarding"],
    deliverables: ["SQL queries", "Power BI dashboard", "Project notes"],
  },

  {
    id: "bike-share",
    title: "Bike Share Toronto Demand Forecasting",
    badge: "Forecasting",
    blurb:
      "Built time-series forecasts to understand seasonality and predict demand for Bike Share usage.",
    repo: "https://github.com/h-dhatt/bike-share-toronto-demand-forecasting",

    cover: "assets/bikeshare/overview_dashboard.jpg",
    images: ["assets/bikeshare/overview_dashboard.jpg", "assets/bikeshare/forecast_dashboard.jpg"],

    why:
      "Bike share demand is seasonal and weather-sensitive. I wanted to practice forecasting with real Toronto mobility data.",
    shows:
      "Seasonality, trend components, and model performance for demand forecasts.",
    bullets: [
      "Cleaned and aggregated trip data in Python",
      "Explored seasonality and trend components",
      "Trained baseline time-series models and evaluated results",
    ],
    tags: ["Python", "pandas", "Time Series", "Forecasting"],
    stack: ["Python", "pandas", "time series"],
    methods: ["EDA", "Feature engineering", "Model evaluation"],
    deliverables: ["Notebook workflow", "Forecast outputs", "Repo write-up"],
  },
];

/* ==========================
   Render project cards
   - NEW: cover image on each card
========================== */
const projectsGrid = $("#projectsGrid");
if (projectsGrid) {
  PROJECTS.forEach((p, idx) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "project";
    el.dataset.projectId = p.id;
    el.setAttribute("aria-label", `Open project: ${p.title}`);

    el.innerHTML = `
      <img class="project-cover" src="${escapeHtml(p.cover)}" alt="${escapeHtml(p.title)} cover" loading="lazy">

      <div class="project__top">
        <div>
          <div class="badge">${escapeHtml(p.badge)}</div>
          <h3>${escapeHtml(p.title)}</h3>
        </div>
        <div class="project__hint" aria-hidden="true">
          <span>Open</span> <span>↗</span>
        </div>
      </div>

      <p>${escapeHtml(p.blurb)}</p>

      <div class="project__chips">
        ${p.tags.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("")}
      </div>

      <div class="project__footer">
        <span>Project ${idx + 1} of ${PROJECTS.length}</span>
        <span class="project__hint"><span>Click for details</span> <span>→</span></span>
      </div>
    `;

    el.addEventListener("click", () => openModal(p.id));
    projectsGrid.appendChild(el);
  });
}

/* ==========================
   Modal logic (STARTS CLOSED)
   - NEW: render p.images[] stacked in modal
========================== */
const overlay = $("#modalOverlay");
const closeBtn = $("#modalClose");
const nextBtn = $("#modalNext");
const repoBtn = $("#modalRepo");

let activeProjectIndex = 0;
let lastFocused = null;

// ✅ guarantee the modal is closed when the page loads
document.addEventListener("DOMContentLoaded", () => {
  if (overlay) overlay.hidden = true;
  document.body.style.overflow = "";
});

function ensureModalImagesContainer() {
  // We’ll inject images right after #modalDesc.
  const desc = $("#modalDesc");
  if (!desc) return null;

  let container = $("#modalImages");
  if (!container) {
    container = document.createElement("div");
    container.id = "modalImages";
    container.className = "project-modal-images";
    desc.insertAdjacentElement("afterend", container);
  }
  return container;
}

function openModal(projectId) {
  if (!overlay) return;

  const idx = PROJECTS.findIndex((p) => p.id === projectId);
  if (idx === -1) return;

  activeProjectIndex = idx;
  const p = PROJECTS[idx];

  lastFocused = document.activeElement;

  $("#modalEyebrow").textContent = p.badge;
  $("#modalTitle").textContent = p.title;
  $("#modalDesc").textContent = p.blurb;

  // NEW: images stacked in modal
  const imagesWrap = ensureModalImagesContainer();
  if (imagesWrap) {
    imagesWrap.innerHTML = (p.images || [])
      .map(
        (src, i) =>
          `<img class="project-modal-img" src="${escapeHtml(src)}" alt="${escapeHtml(
            p.title
          )} dashboard ${i + 1}" loading="lazy">`
      )
      .join("");
  }

  $("#modalWhy").textContent = p.why;
  $("#modalShows").textContent = p.shows;

  // Join arrays nicely (your HTML expects textContent)
  $("#modalStack").textContent = Array.isArray(p.stack) ? p.stack.join(" · ") : String(p.stack ?? "");
  $("#modalMethods").textContent = Array.isArray(p.methods) ? p.methods.join(" · ") : String(p.methods ?? "");
  $("#modalDeliverables").textContent = Array.isArray(p.deliverables) ? p.deliverables.join(" · ") : String(p.deliverables ?? "");

  const ul = $("#modalBullets");
  ul.innerHTML = "";
  (p.bullets || []).forEach((b) => {
    const li = document.createElement("li");
    li.textContent = b;
    ul.appendChild(li);
  });

  if (repoBtn) repoBtn.href = p.repo;

  // ✅ OPEN
  overlay.hidden = false;
  document.body.style.overflow = "hidden";

  // focus close button
  closeBtn?.focus();
}

function closeModal() {
  if (!overlay) return;

  // ✅ CLOSE
  overlay.hidden = true;
  document.body.style.overflow = "";

  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

function nextProject() {
  const nextIdx = (activeProjectIndex + 1) % PROJECTS.length;
  openModal(PROJECTS[nextIdx].id);
}

// Buttons
closeBtn?.addEventListener("click", closeModal);
nextBtn?.addEventListener("click", nextProject);

// Click outside the modal closes it
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Escape closes it + ArrowRight for next
document.addEventListener("keydown", (e) => {
  if (!overlay || overlay.hidden) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    nextProject();
  }
});

// Simple focus trap (prevents tabbing behind modal)
document.addEventListener("keydown", (e) => {
  if (!overlay || overlay.hidden) return;
  if (e.key !== "Tab") return;

  const focusables = $$(
    'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    overlay
  ).filter((el) => !el.hasAttribute("disabled"));

  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ==========================
   Ambient canvas animation
========================== */
const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const canvas = $("#bg-canvas");
const ctx = canvas?.getContext?.("2d", { alpha: true });

let w = 0;
let h = 0;
let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

function resize() {
  if (!canvas || !ctx) return;

  w = Math.floor(window.innerWidth);
  h = Math.floor(window.innerHeight);
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize, { passive: true });
resize();

const pointer = { x: w * 0.4, y: h * 0.3 };

window.addEventListener(
  "pointermove",
  (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  },
  { passive: true }
);

function themeColors() {
  const theme = document.documentElement.dataset.theme;
  if (theme === "dark") {
    return {
      a: "rgba(255, 111, 174, 0.22)",
      b: "rgba(178, 76, 255, 0.22)",
      c: "rgba(90, 215, 255, 0.18)",
      line: "rgba(244, 238, 246, 0.10)",
      vignette: "rgba(0,0,0,0.16)",
    };
  }
  return {
    a: "rgba(255, 111, 174, 0.20)",
    b: "rgba(178, 76, 255, 0.18)",
    c: "rgba(90, 215, 255, 0.16)",
    line: "rgba(32, 26, 34, 0.08)",
    vignette: "rgba(0,0,0,0.04)",
  };
}

const N = 38;
const blobs = Array.from({ length: N }, () => ({
  x: Math.random() * (w || 800),
  y: Math.random() * (h || 600),
  r: 18 + Math.random() * 42,
  dx: (Math.random() - 0.5) * 0.35,
  dy: (Math.random() - 0.5) * 0.35,
  seed: Math.random() * 1000,
}));

function draw(t) {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, w, h);
  const col = themeColors();

  // Gentle vignette
  const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 80, w * 0.5, h * 0.45, Math.max(w, h));
  g.addColorStop(0, "rgba(255,255,255,0.00)");
  g.addColorStop(1, col.vignette);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Blobs
  for (const b of blobs) {
    const pullX = (pointer.x - b.x) * 0.00012;
    const pullY = (pointer.y - b.y) * 0.00012;

    b.dx = clamp(b.dx + pullX, -0.55, 0.55);
    b.dy = clamp(b.dy + pullY, -0.55, 0.55);

    b.x += b.dx;
    b.y += b.dy;

    if (b.x < -80) b.x = w + 80;
    if (b.x > w + 80) b.x = -80;
    if (b.y < -80) b.y = h + 80;
    if (b.y > h + 80) b.y = -80;

    const wobble = Math.sin((t * 0.001 + b.seed) * 0.9) * 2.6;
    const rr = b.r + wobble;

    const fill = ctx.createRadialGradient(b.x - rr * 0.2, b.y - rr * 0.2, 2, b.x, b.y, rr);
    fill.addColorStop(0, col.a);
    fill.addColorStop(0.55, col.b);
    fill.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(b.x, b.y, rr, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // Soft lines between nearby blobs
  ctx.lineWidth = 1;
  for (let i = 0; i < blobs.length; i++) {
    for (let j = i + 1; j < blobs.length; j++) {
      const a = blobs[i];
      const b = blobs[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.45;
        const base = col.line.includes("0.10") ? 0.10 : 0.08;
        ctx.strokeStyle = col.line.replace(String(base), String(base * alpha));

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  if (!prefersReduced) requestAnimationFrame(draw);
}

if (!prefersReduced) requestAnimationFrame(draw);


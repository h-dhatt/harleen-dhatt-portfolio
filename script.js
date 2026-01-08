/* ==========================
   Helpers
========================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/* ==========================
   Theme toggle (works + persists)
========================== */
const THEME_KEY = "hd_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  const btn = $("#themeToggle");
  if (btn) btn.setAttribute("aria-pressed", String(theme === "dark"));

  // Update icon
  const icon = $("#themeToggle .toggle__icon");
  if (icon) icon.textContent = theme === "dark" ? "☾" : "◐";
}

setTheme(getPreferredTheme());

window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", (e) => {
  // Only auto-follow OS if the user hasn't explicitly set a theme
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
$("#year").textContent = String(new Date().getFullYear());

/* ==========================
   Projects data (edit text here anytime)
========================== */
const PROJECTS = [
  {
    id: "rev-retention",
    badge: "Capstone",
    title: "Revenue & Retention Analytics",
    blurb:
      "Built fact tables + KPIs in SQL, analyzed conversion and cohort retention, and wrote executive recommendations.",
    why:
      "Businesses don’t just need charts—they need a dependable set of definitions for revenue, conversion, and retention so teams can make decisions without arguing over numbers.",
    bullets: [
      "Designed clean fact tables and KPI views in SQL",
      "Built a dashboard view of revenue + conversion + retention",
      "Ran cohort retention analysis and explored churn drivers in Python",
      "Translated findings into clear, decision-ready recommendations",
    ],
    shows:
      "How I move from raw events → trustworthy KPIs → a narrative that helps someone choose what to do next.",
    stack: "SQL, Python (pandas), BI (Power BI / Tableau)",
    methods: "KPI design, cohort analysis, funnel thinking, retention drivers",
    deliverables: "SQL tables/views, analysis notebook, executive summary",
    tags: ["SQL", "Python", "KPIs", "Cohorts"],
    repo: "https://github.com/h-dhatt/capstone-revenue-retention",
  },
  {
    id: "ab-test",
    badge: "Experiment",
    title: "A/B Test Experiment",
    blurb:
      "Designed control vs treatment, measured conversion lift + significance, and interpreted results by segment.",
    why:
      "A/B tests are only useful if the setup is clean, the metric is well-defined, and the result is interpreted with real-world context (not just p-values).",
    bullets: [
      "Defined hypothesis, success metric, and guardrails",
      "Compared control vs treatment and checked statistical significance",
      "Segmented results to see who was most impacted",
      "Wrote an interpretation you could hand to a PM or stakeholder",
    ],
    shows:
      "How I think about experiments: measurable outcomes, clean comparisons, and a recommendation that respects uncertainty.",
    stack: "Python",
    methods: "Hypothesis testing, confidence intervals, segmentation",
    deliverables: "Analysis notebook + clear write-up",
    tags: ["Python", "Statistics", "A/B Testing", "Segmentation"],
    repo: "https://github.com/h-dhatt/experiment-ab-test",
  },
  {
    id: "qa-pipeline",
    badge: "Pipeline",
    title: "Data Cleaning & QA Pipeline",
    blurb:
      "Production-style cleaning: applied explicit rules and validated outputs with quality checks.",
    why:
      "If data quality is shaky, everything downstream becomes expensive: dashboards drift, experiments mislead, and teams lose trust. A repeatable QA approach is the fix.",
    bullets: [
      "Implemented rule-based cleaning steps with clear, testable logic",
      "Validated outputs with QA checks (ranges, missingness, duplicates, schema)",
      "Structured the work like something you could schedule and run regularly",
      "Kept the pipeline readable so it’s easy to extend later",
    ],
    shows:
      "How I build reliability: transparent rules, measurable checks, and outputs you can trust before analysis begins.",
    stack: "Python",
    methods: "Data validation, QA checks, production-minded structure",
    deliverables: "Cleaning pipeline + QA checks + documentation",
    tags: ["Python", "Data Cleaning", "QA", "Ops"],
    repo: "https://github.com/h-dhatt/ops-cleaning-qa-pipeline",
  },
  {
    id: "memo",
    badge: "Writing",
    title: "One-Page Insights Memo",
    blurb:
      "Executive-style one-pager: communicates insights + recommendations with a decision-focused structure.",
    why:
      "Great analysis can still fail if it’s hard to read. A one-page memo forces clarity: what matters, why it matters, and what we should do next.",
    bullets: [
      "Synthesized insights into a decision-first narrative",
      "Used a simple structure: context → findings → recommendation → risks",
      "Kept language crisp and non-technical where possible",
      "Made it skimmable for busy stakeholders",
    ],
    shows:
      "How I write: not more words—just the right words, with a clear decision at the end.",
    stack: "Communication + analytics",
    methods: "Storytelling, prioritization, executive framing",
    deliverables: "One-page memo",
    tags: ["Communication", "Storytelling", "Analytics"],
    repo: "https://github.com/h-dhatt/insights-onepager-memo",
  },
];

/* ==========================
   Render projects
========================== */
const projectsGrid = $("#projectsGrid");

function projectCard(p, index) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "project";
  el.dataset.projectId = p.id;
  el.setAttribute("aria-label", `Open project: ${p.title}`);

  el.innerHTML = `
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
      <span>Project ${index + 1} of ${PROJECTS.length}</span>
      <span class="project__hint"><span>Click for details</span> <span>→</span></span>
    </div>
  `;

  el.addEventListener("click", () => openModal(p.id));
  return el;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

PROJECTS.forEach((p, idx) => projectsGrid.appendChild(projectCard(p, idx)));

/* ==========================
   Modal logic (accessible-ish)
========================== */
const overlay = $("#modalOverlay");
const closeBtn = $("#modalClose");
const nextBtn = $("#modalNext");
const repoBtn = $("#modalRepo");

let activeProjectIndex = 0;
let lastFocused = null;

function openModal(projectId) {
  const idx = PROJECTS.findIndex((p) => p.id === projectId);
  if (idx === -1) return;

  activeProjectIndex = idx;
  const p = PROJECTS[idx];

  lastFocused = document.activeElement;

  $("#modalEyebrow").textContent = p.badge;
  $("#modalTitle").textContent = p.title;
  $("#modalDesc").textContent = p.blurb;

  $("#modalWhy").textContent = p.why;
  $("#modalShows").textContent = p.shows;

  $("#modalStack").textContent = p.stack;
  $("#modalMethods").textContent = p.methods;
  $("#modalDeliverables").textContent = p.deliverables;

  const ul = $("#modalBullets");
  ul.innerHTML = "";
  p.bullets.forEach((b) => {
    const li = document.createElement("li");
    li.textContent = b;
    ul.appendChild(li);
  });

  repoBtn.href = p.repo;

  overlay.hidden = false;
  document.body.style.overflow = "hidden";

  // Focus close button for keyboard users
  closeBtn.focus();
}

function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

function nextProject() {
  const nextIdx = (activeProjectIndex + 1) % PROJECTS.length;
  openModal(PROJECTS[nextIdx].id);
}

closeBtn.addEventListener("click", closeModal);
nextBtn.addEventListener("click", nextProject);

// Close on overlay click (but not when clicking the modal itself)
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Close on Escape + basic focus trap
document.addEventListener("keydown", (e) => {
  if (overlay.hidden) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
    return;
  }

  if (e.key === "Tab") {
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
  }
});

/* ==========================
   Ambient canvas animation (soft, Yan-ish vibe)
   - Respects prefers-reduced-motion
========================== */
const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const canvas = $("#bg-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0;
let h = 0;
let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

function resize() {
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

const pointer = { x: w * 0.4, y: h * 0.3, vx: 0, vy: 0 };
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
    };
  }
  return {
    a: "rgba(255, 111, 174, 0.20)",
    b: "rgba(178, 76, 255, 0.18)",
    c: "rgba(90, 215, 255, 0.16)",
    line: "rgba(32, 26, 34, 0.08)",
  };
}

const N = 38;
const blobs = Array.from({ length: N }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: 18 + Math.random() * 42,
  dx: (Math.random() - 0.5) * 0.35,
  dy: (Math.random() - 0.5) * 0.35,
  seed: Math.random() * 1000,
}));

function draw(t) {
  ctx.clearRect(0, 0, w, h);

  const col = themeColors();

  // Gentle vignette
  const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 80, w * 0.5, h * 0.45, Math.max(w, h));
  g.addColorStop(0, "rgba(255,255,255,0.00)");
  g.addColorStop(1, document.documentElement.dataset.theme === "dark" ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.04)");
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

  // Lines between nearby blobs (subtle)
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
        ctx.strokeStyle = col.line.replace("0.10", String(0.10 * alpha)).replace("0.08", String(0.08 * alpha));
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

/* ==========================
   Small polish: click "Next project" with arrow keys in modal
========================== */
document.addEventListener("keydown", (e) => {
  if (overlay.hidden) return;
  if (e.key === "ArrowRight") nextProject();
});

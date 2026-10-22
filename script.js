/* ═══════════════════════════════════════════════════════
   DATA DEFINITIONS
═══════════════════════════════════════════════════════ */
const SKILLS = [
  { icon: '🌐', name: 'HTML / CSS', pct: '90%' },
  { icon: '⚡', name: 'JavaScript', pct: '85%' },
  { icon: '⚛️', name: 'React', pct: '82%' },
  { icon: '🐍', name: 'Python', pct: '88%' },
  { icon: '🦄', name: 'Django', pct: '80%' },
  { icon: '🗄️', name: 'MySQL', pct: '78%' },
  { icon: '🤖', name: 'AI Integration', pct: '75%' },
  { icon: '🔁', name: 'UiPath RPA', pct: '72%' },
  { icon: '🎨', name: 'UI/UX Design', pct: '80%' },
];

const PROJECTS = [
  {
    icon: '🛡️',
    name: 'Fake Product Detection',
    desc: 'AI-powered authenticity verification using image classification and ML models.',
    tags: ['Python', 'AI/ML', 'Django'],
  },
  {
    icon: '🍳',
    name: 'Cooking Recipe Site',
    desc: 'Interactive recipe platform with smart search, filters, and step-by-step cooking guides.',
    tags: ['React', 'CSS', 'REST API'],
  },
  {
    icon: '📧',
    name: 'Email Automation',
    desc: 'RPA workflow automating bulk email campaigns, scheduling and analytics reporting.',
    tags: ['UiPath', 'Python', 'SMTP'],
  },
  {
    icon: '🗳️',
    name: 'E-Voting Website',
    desc: 'Secure containerized online voting with auth, real-time results, and audit trail.',
    tags: ['Django', 'MySQL', 'Docker'],
  },
];

/* ═══════════════════════════════════════════════════════
   DOM INITIALIZATION: SKILLS & PROJECTS
═══════════════════════════════════════════════════════ */
const sg = document.getElementById('skills-grid');
if (sg) {
  SKILLS.forEach((s) => {
    sg.innerHTML += `
    <div class="sk glass-border-anim">
      <div class="sk-icon">${s.icon}</div>
      <div class="sk-name">${s.name}</div>
      <div class="sk-bar-track"><div class="sk-bar" style="--pct:${s.pct}"></div></div>
    </div>`;
  });
}

const pg = document.getElementById('proj-grid');
if (pg) {
  PROJECTS.forEach((p) => {
    pg.innerHTML += `
    <div class="pc glass glass-border-anim">
      <div class="pc-icon">${p.icon}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="pc-tags">${p.tags.map((t) => `<span class="pct">${t}</span>`).join('')}</div>
    </div>`;
  });
}

/* ═══════════════════════════════════════════════════════
   FRAME SEQUENCE CANVAS SETUP
═══════════════════════════════════════════════════════ */
const TOTAL = 147;
const FDIR = 'scroll image/';
const pad = (n) => String(n).padStart(3, '0');
const fsrc = (n) => `${FDIR}ezgif-frame-${pad(n)}.png`;

const fc = document.getElementById('frame-canvas');
const fctx = fc.getContext('2d');
const imgs = new Array(TOTAL).fill(null);
let loaded = 0;

function resizeFC() {
  fc.width = window.innerWidth;
  fc.height = window.innerHeight;
}
resizeFC();
window.addEventListener('resize', resizeFC);

function drawFrame(idx) {
  const img = imgs[idx];
  if (!img) return;
  fctx.clearRect(0, 0, fc.width, fc.height);
  // cover-fit the image on the canvas
  const sr = img.naturalWidth / img.naturalHeight;
  const dr = fc.width / fc.height;
  let sw, sh, sx, sy;
  if (sr > dr) {
    sh = fc.height;
    sw = sh * sr;
    sx = (fc.width - sw) / 2;
    sy = 0;
  } else {
    sw = fc.width;
    sh = sw / sr;
    sx = 0;
    sy = (fc.height - sh) / 2;
  }
  fctx.drawImage(img, sx, sy, sw, sh);
}

function loadImg(i) {
  return new Promise((res) => {
    const img = new Image();
    img.src = fsrc(i + 1);
    img.onload = () => {
      imgs[i] = img;
      loaded++;
      onLoad();
      res();
    };
    img.onerror = () => {
      loaded++;
      onLoad();
      res();
    };
  });
}

const ldFill = document.getElementById('ld-fill');
const ldPct = document.getElementById('ld-pct');
const loader = document.getElementById('loader');

function onLoad() {
  const p = Math.round((loaded / TOTAL) * 100);
  if (ldFill) ldFill.style.width = p + '%';
  if (ldPct) ldPct.textContent = `Loading ${p}%`;
  if (loaded >= TOTAL) {
    if (ldPct) ldPct.textContent = 'Ready ✓';
    setTimeout(() => {
      if (loader) loader.classList.add('out');
    }, 400);
  }
}

/* ═══════════════════════════════════════════════════════
   PARTICLE NETWORK CANVAS
═══════════════════════════════════════════════════════ */
const pc2 = document.getElementById('particle-canvas');
const pctx = pc2.getContext('2d');
let pts = [];
const N = 55;

function resizePC() {
  pc2.width = window.innerWidth;
  pc2.height = window.innerHeight;
}
resizePC();
window.addEventListener('resize', resizePC);

class Pt {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * pc2.width;
    this.y = Math.random() * pc2.height;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r = Math.random() * 1.6 + 0.4;
    this.a = Math.random() * 0.55 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > pc2.width) this.vx *= -1;
    if (this.y < 0 || this.y > pc2.height) this.vy *= -1;
  }
}
for (let i = 0; i < N; i++) pts.push(new Pt());

function drawParticles() {
  pctx.clearRect(0, 0, pc2.width, pc2.height);
  pts.forEach((p) => p.update());

  // draw network connections
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        pctx.beginPath();
        pctx.strokeStyle = `rgba(230,57,70,${(1 - d / 120) * 0.12})`;
        pctx.lineWidth = 0.8;
        pctx.moveTo(pts[i].x, pts[i].y);
        pctx.lineTo(pts[j].x, pts[j].y);
        pctx.stroke();
      }
    }
  }

  // draw particle points
  pts.forEach((p) => {
    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(255,255,255,${p.a})`;
    pctx.fill();
  });
}

/* ═══════════════════════════════════════════════════════
   COLLABORATIVE CURSORS
═══════════════════════════════════════════════════════ */
const collabPaths = [
  { ax: 0.25, ay: 0.4, bx: 0.75, by: 0.55, spd: 0.0007, off: 0 },
  { ax: 0.6, ay: 0.3, bx: 0.35, by: 0.7, spd: 0.0009, off: 2.1 },
  { ax: 0.8, ay: 0.6, bx: 0.2, by: 0.35, spd: 0.0006, off: 4.2 },
];
const cuEls = [
  document.getElementById('cu0'),
  document.getElementById('cu1'),
  document.getElementById('cu2'),
];

function updateCollabCursors(t) {
  collabPaths.forEach((cp, i) => {
    if (!cuEls[i]) return;
    const angle = t * cp.spd + cp.off;
    const x = (cp.ax + Math.cos(angle) * 0.2) * window.innerWidth;
    const y = (cp.ay + Math.sin(angle * 0.7) * 0.15) * window.innerHeight;
    cuEls[i].style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ═══════════════════════════════════════════════════════
   SCROLL ENGINE (Virtual Smooth Scroll)
═══════════════════════════════════════════════════════ */
const SECTIONS = [
  { id: 'panel-hero', start: 0, end: 0.25 },
  { id: 'panel-skills', start: 0.25, end: 0.5 },
  { id: 'panel-projects', start: 0.5, end: 0.75 },
  { id: 'panel-contact', start: 0.75, end: 1.0 },
];
const PANEL_ELS = SECTIONS.map((s) => document.getElementById(s.id));

let targetP = 0; // target scroll progress 0-1
let smoothP = 0; // lerped progress
let curFrame = 0;
let dispFrame = 0;
let activeSec = 0;
let firstActivated = [false, false, false, false];

// wheel event handler
window.addEventListener(
  'wheel',
  (e) => {
    targetP += e.deltaY / (window.innerHeight * 7);
    targetP = Math.min(Math.max(targetP, 0), 1);
  },
  { passive: true }
);

// mobile touch gesture support
let touchY = 0;
window.addEventListener(
  'touchstart',
  (e) => {
    touchY = e.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  'touchmove',
  (e) => {
    const dy = touchY - e.touches[0].clientY;
    touchY = e.touches[0].clientY;
    targetP += dy / (window.innerHeight * 5);
    targetP = Math.min(Math.max(targetP, 0), 1);
  },
  { passive: true }
);

/* ═══════════════════════════════════════════════════════
   NAVIGATION / CLICK HANDLERS
═══════════════════════════════════════════════════════ */
function goToSection(idx) {
  const sec = SECTIONS[idx];
  targetP = (sec.start + sec.end) / 2;
}

document.querySelectorAll('[data-sec]').forEach((el) => {
  el.addEventListener('click', () => goToSection(+el.dataset.sec));
});

/* ═══════════════════════════════════════════════════════
   PANEL TRANSITIONS & ENTRANCE ANIMATIONS
═══════════════════════════════════════════════════════ */
function updatePanels(sp) {
  let newActive = 0;
  SECTIONS.forEach((sec, i) => {
    const el = PANEL_ELS[i];
    if (!el) return;
    const size = sec.end - sec.start;
    const lp = (sp - sec.start) / size; // local progress

    let opacity, ty;
    if (lp <= 0) {
      opacity = 0;
      ty = 80;
    } else if (lp < 0.18) {
      const t = lp / 0.18;
      opacity = t;
      ty = (1 - t) * 80;
    } else if (lp <= 0.82) {
      opacity = 1;
      ty = 0;
      newActive = i;
    } else if (lp < 1) {
      const t = (lp - 0.82) / 0.18;
      opacity = 1 - t;
      ty = -t * 70;
    } else {
      opacity = 0;
      ty = -80;
    }

    el.style.opacity = opacity;
    el.style.transform = `translateY(${ty}px)`;
    const live = opacity > 0.05;
    el.classList.toggle('live', live);

    // Trigger child entrance animations once when section activates
    if (live && !firstActivated[i]) {
      firstActivated[i] = true;
      activateSection(i);
    }
  });

  // update active status on dots & nav links
  if (newActive !== activeSec) {
    activeSec = newActive;
    document.querySelectorAll('.sdot').forEach((d, i) => d.classList.toggle('active', i === activeSec));
    document.querySelectorAll('.nav-links a').forEach((a, i) => a.classList.toggle('active', i === activeSec));
  }

  // top progress bar
  const progBar = document.getElementById('prog-bar');
  if (progBar) progBar.style.width = sp * 100 + '%';
}

function activateSection(i) {
  if (i === 0) {
    // hero word reveals
    document.querySelectorAll('#panel-hero .reveal-word').forEach((el, j) => {
      setTimeout(() => el.classList.add('shown'), j * 120);
    });
  }
  if (i === 1) {
    // skill chips stagger
    document.querySelectorAll('.sk').forEach((el, j) => {
      setTimeout(() => el.classList.add('shown'), j * 70);
    });
  }
  if (i === 2) {
    // project cards stagger
    document.querySelectorAll('.pc').forEach((el, j) => {
      setTimeout(() => el.classList.add('shown'), j * 100);
    });
  }
}

/* ═══════════════════════════════════════════════════════
   MAIN RAF ANIMATION LOOP
═══════════════════════════════════════════════════════ */
let startTime = null;

function loop(ts) {
  if (!startTime) startTime = ts;
  const t = ts - startTime;

  // smooth scroll lerp
  smoothP += (targetP - smoothP) * 0.072;

  // frame animation scrubbing
  const tf = smoothP * (TOTAL - 1);
  dispFrame += (tf - dispFrame) * 0.1;
  const fi = Math.min(Math.max(Math.round(dispFrame), 0), TOTAL - 1);
  if (fi !== curFrame) {
    curFrame = fi;
    drawFrame(curFrame);
  }

  // update sections & progress
  updatePanels(smoothP);

  // update particles network
  drawParticles();

  // update collaborative cursors
  updateCollabCursors(t);

  requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════════════════════
   PRELOAD & START
═══════════════════════════════════════════════════════ */
async function init() {
  activateSection(0);
  firstActivated[0] = true;

  // load first frame immediately so canvas isn't blank
  await loadImg(0);
  drawFrame(0);
  requestAnimationFrame(loop);

  // batch preload remaining frames
  const BATCH = 15;
  for (let i = 1; i < TOTAL; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, TOTAL); j++) {
      batch.push(loadImg(j));
    }
    await Promise.all(batch);
  }
}

init();

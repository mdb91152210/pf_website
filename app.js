/* ══════════════════════════════════════════════════════════
   DATA DEFINITIONS
══════════════════════════════════════════════════════════ */
const TOTAL_FRAMES = 147;
const FRAME_DIRECTORY = 'scroll image/';
const padZero = (n) => String(n).padStart(3, '0');
const getFrameSrc = (n) => `${FRAME_DIRECTORY}ezgif-frame-${padZero(n)}.png`;

const SKILLS_DATA = [
  { icon: '🌐', name: 'HTML & CSS', pct: '92%' },
  { icon: '⚡', name: 'JavaScript', pct: '88%' },
  { icon: '⚛️', name: 'React.js', pct: '85%' },
  { icon: '🐍', name: 'Python', pct: '90%' },
  { icon: '🦄', name: 'Django', pct: '82%' },
  { icon: '🗄️', name: 'MySQL', pct: '80%' },
  { icon: '🤖', name: 'AI Integration', pct: '78%' },
  { icon: '🔁', name: 'UiPath RPA', pct: '76%' },
  { icon: '🎨', name: 'UI / UX Design', pct: '84%' },
];

const PROJECTS_DATA = [
  {
    id: 1,
    category: 'ai',
    icon: '🛡️',
    title: 'Fake Product Detection System',
    description: 'AI-driven computer vision and machine learning model verifying product authenticity, barcode signatures, and package discrepancies.',
    tags: ['Python', 'AI / ML', 'Django', 'OpenCV'],
  },
  {
    id: 2,
    category: 'fullstack',
    icon: '🍳',
    title: 'Cooking Recipe Website',
    description: 'Modern fullstack recipe discovery portal with advanced allergen filters, interactive step timers, and real-time community ratings.',
    tags: ['React.js', 'REST API', 'CSS Grid', 'Node'],
  },
  {
    id: 3,
    category: 'automation',
    icon: '📧',
    title: 'Enterprise Email Automation',
    description: 'Intelligent UiPath RPA bot handling mass transactional email campaigns, bounce analytics, queue management, and automatic follow-ups.',
    tags: ['UiPath', 'Python', 'SMTP', 'RPA'],
  },
  {
    id: 4,
    category: 'fullstack',
    icon: '🗳️',
    title: 'Containerized E-Voting Platform',
    description: 'Cryptographically verified online ballot and election management system with Docker containerization, tamper-proof logs, and live auditing.',
    tags: ['Django', 'MySQL', 'Docker', 'Security'],
  },
];

/* ══════════════════════════════════════════════════════════
   CANVAS FRAME ANIMATION ENGINE (Optimized)
══════════════════════════════════════════════════════════ */
const frameImages = new Array(TOTAL_FRAMES).fill(null);
let loadedFramesCount = 0;
let lastDrawnFrameIndex = -1;

function setupCanvasEngine(onProgressUpdate, onReady) {
  const canvas = document.getElementById('scroll-canvas');
  if (!canvas) return { draw: () => {}, cleanup: () => {} };

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    if (lastDrawnFrameIndex >= 0) {
      render(lastDrawnFrameIndex);
    }
  }

  window.addEventListener('resize', fitCanvas);
  fitCanvas();

  function render(frameIndex) {
    const img = frameImages[frameIndex];
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || cw;
    const ih = img.naturalHeight || ch;

    // Cover-fit math
    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let drawW, drawH, drawX, drawY;
    if (imgRatio > canvasRatio) {
      drawH = ch;
      drawW = drawH * imgRatio;
      drawX = (cw - drawW) / 2;
      drawY = 0;
    } else {
      drawW = cw;
      drawH = drawW / imgRatio;
      drawX = 0;
      drawY = (ch - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    lastDrawnFrameIndex = frameIndex;
  }

  // Preload frames in background
  async function preloadFrame(index) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFrameSrc(index + 1);
      img.onload = async () => {
        if ('decode' in img) {
          try {
            await img.decode();
          } catch (e) {
            // fallback
          }
        }
        frameImages[index] = img;
        loadedFramesCount++;
        onProgressUpdate(Math.round((loadedFramesCount / TOTAL_FRAMES) * 100));
        resolve();
      };
      img.onerror = () => {
        loadedFramesCount++;
        resolve();
      };
    });
  }

  async function startPreloader() {
    // Load first frame immediately for instant first paint
    await preloadFrame(0);
    render(0);
    onReady();

    // Batch load the remaining frames without blocking main thread
    const BATCH_SIZE = 12;
    for (let i = 1; i < TOTAL_FRAMES; i += BATCH_SIZE) {
      const batch = [];
      for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
        batch.push(preloadFrame(j));
      }
      await Promise.all(batch);
    }
  }

  startPreloader();

  return {
    draw: (progress) => {
      const targetIndex = Math.min(
        Math.max(Math.round(progress * (TOTAL_FRAMES - 1)), 0),
        TOTAL_FRAMES - 1
      );
      if (targetIndex !== lastDrawnFrameIndex && frameImages[targetIndex]) {
        render(targetIndex);
      }
    },
    cleanup: () => {
      window.removeEventListener('resize', fitCanvas);
    },
  };
}

/* ══════════════════════════════════════════════════════════
   REACT COMPONENTS
══════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// 1. Navigation Bar Component
function Navbar({ activeSection, onNavClick }) {
  const sections = ['home', 'skills', 'projects', 'contact'];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => onNavClick('home')}>
        MB<span>.</span>
      </div>
      <ul className="nav-menu">
        {sections.map((sec) => (
          <li
            key={sec}
            className={`nav-item ${activeSection === sec ? 'active' : ''}`}
            onClick={() => onNavClick(sec)}
          >
            {sec.charAt(0).toUpperCase() + sec.slice(1)}
          </li>
        ))}
      </ul>
      <button className="nav-btn" onClick={() => onNavClick('contact')}>
        Hire Me →
      </button>
    </nav>
  );
}

// 2. Hero Section Component
function HeroSection({ onActionClick }) {
  return (
    <section className="section-block" id="home">
      <div className="hero-container">
        <div className="hero-left">
          <div className="avail-tag">
            <span className="avail-dot"></span>
            Available for Freelance &amp; Fulltime
          </div>
          <div className="badge-pill">
            <span className="badge-dot"></span>
            Fullstack Developer
          </div>
          <h1 className="hero-title">
            Mohamed<br />
            <span>Bilal</span>
          </h1>
          <p className="hero-sub">
            Crafting high-performance digital products from intuitive React interfaces to resilient Django architectures, AI integrations, and RPA workflows.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onActionClick('projects')}>
              View Projects →
            </button>
            <button className="btn-secondary" onClick={() => onActionClick('contact')}>
              Get In Touch
            </button>
          </div>
        </div>

        <div className="hero-stats-column">
          <div className="stat-box glass-panel">
            <div className="stat-number">4<span>+</span></div>
            <div className="stat-desc">Featured Projects</div>
          </div>
          <div className="stat-box glass-panel">
            <div className="stat-number">9<span>+</span></div>
            <div className="stat-desc">Core Technologies</div>
          </div>
          <div className="stat-box glass-panel">
            <div className="stat-number">100<span>%</span></div>
            <div className="stat-desc">Client Dedication</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Skills Section Component
function SkillsSection() {
  return (
    <section className="section-block" id="skills">
      <div className="skills-container">
        <div className="section-head">
          <div className="badge-pill">
            <span className="badge-dot"></span>
            Expertise
          </div>
          <h2>
            Skills &amp; <span>Technologies</span>
          </h2>
          <p>
            An industry-tested technical toolkit focused on modern web architectures, backend scale, automation, and intelligent AI system integration.
          </p>
        </div>

        <div className="skills-grid">
          {SKILLS_DATA.map((skill, index) => (
            <div className="skill-card glass-panel" key={index}>
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-name">{skill.name}</div>
              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  style={{ width: skill.pct }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Projects Section Component
function ProjectsSection() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return PROJECTS_DATA;
    return PROJECTS_DATA.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section className="section-block" id="projects">
      <div className="projects-container">
        <div className="projects-top">
          <div className="section-head">
            <div className="badge-pill">
              <span className="badge-dot"></span>
              Work
            </div>
            <h2>
              Featured <span>Projects</span>
            </h2>
            <p>Production-ready engineering across web, artificial intelligence, and RPA.</p>
          </div>

          <div className="filter-pills">
            {['all', 'fullstack', 'ai', 'automation'].map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all'
                  ? 'All Work'
                  : cat === 'fullstack'
                  ? 'Fullstack'
                  : cat === 'ai'
                  ? 'AI & ML'
                  : 'Automation'}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div className="project-card glass-panel" key={project.id}>
              <div className="project-icon">{project.icon}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span className="project-tag" key={i}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 5. Contact Section Component
function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = 'mohamedbilal@email.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="section-block" id="contact">
      <div className="contact-container glass-panel">
        <div className="badge-pill">
          <span className="badge-dot"></span>
          Collaboration
        </div>
        <h2>
          Get In <span>Touch</span>
        </h2>
        <p>
          Currently open for freelance challenges, fullstack contracts, and impactful engineering roles. Let's build your next milestone together.
        </p>

        {copied && (
          <div className="toast-feedback">
            ✓ Email copied to clipboard!
          </div>
        )}

        <div className="contact-links">
          <button className="contact-chip" onClick={copyEmail} title="Click to copy email">
            📩 {email}
          </button>
          <a
            className="contact-chip"
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            🐙 GitHub
          </a>
          <a
            className="contact-chip"
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            💼 LinkedIn
          </a>
        </div>

        <div className="contact-footer-note">
          © {new Date().getFullYear()} Mohamed Bilal · Built with React &amp; Smooth Scroll
        </div>
      </div>
    </section>
  );
}

// 6. Main Root App Component
function App() {
  const [loadPct, setLoadPct] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef(null);
  const canvasEngineRef = useRef(null);

  // Initialize Lenis Smooth Scroll & Canvas Engine
  useEffect(() => {
    // 1. Initialize Canvas Frame Engine
    canvasEngineRef.current = setupCanvasEngine(
      (pct) => setLoadPct(pct),
      () => setIsReady(true)
    );

    // 2. Initialize Lenis (Ultra-smooth 60/120fps physics)
    let lenis = null;
    if (window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      lenis.on('scroll', (e) => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalScroll > 0 ? Math.min(Math.max(e.scroll / totalScroll, 0), 1) : 0;
        setScrollProgress(progress);

        if (canvasEngineRef.current) {
          canvasEngineRef.current.draw(progress);
        }

        // Determine active section based on scroll offset
        const scrollY = e.scroll + window.innerHeight * 0.4;
        const sections = ['home', 'skills', 'projects', 'contact'];
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && scrollY >= el.offsetTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      });
    }

    return () => {
      if (lenis) lenis.destroy();
      if (canvasEngineRef.current) canvasEngineRef.current.cleanup();
    };
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: 0, duration: 1.4 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${isReady ? 'fade-out' : ''}`}>
        <div className="loader-logo">MB<span>.</span></div>
        <div className="loader-bar-wrap">
          <div className="loader-bar-inner" style={{ width: `${loadPct}%` }}></div>
        </div>
        <div className="loader-label">
          {isReady ? 'Ready' : `Optimizing assets ${loadPct}%`}
        </div>
      </div>

      {/* Top Scroll Indicator */}
      <div className="top-progress" style={{ width: `${scrollProgress * 100}%` }}></div>

      {/* Navbar */}
      <Navbar activeSection={activeSection} onNavClick={scrollTo} />

      {/* Floating Side Progress Dots */}
      <div className="side-nav">
        {['home', 'skills', 'projects', 'contact'].map((sec) => (
          <div
            key={sec}
            className={`side-dot ${activeSection === sec ? 'active' : ''}`}
            title={sec.toUpperCase()}
            onClick={() => scrollTo(sec)}
          ></div>
        ))}
      </div>

      {/* Main Sections */}
      <main className="main-wrapper">
        <HeroSection onActionClick={scrollTo} />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

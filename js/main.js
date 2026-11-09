/**
 * PORTFOLIO CLIENT ENGINE & INTERACTIONS
 * Developer: Ankit Kumar
 * Aspiring AI Engineer | Full-Stack Developer | Machine Learning Enthusiast
 * Sikkim Manipal Institute of Technology (SMIT) — Batch 2024–2028
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initAudioSystem();
  initCustomCursor();
  initBackgroundCanvas();
  initNavbarAndScroll();
  initTypingEffect();
  initThemeSwitcher();
  initStatsCounter();
  initSkillsSection();
  initProjectsSection();
  initTerminalEmulator();
  initContactForm();
  initQuickCopy();
  initResumeButton();
});

/* ==========================================================================
   1. Audio Synthesizer (Zero-asset Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = localStorage.getItem('smit_sound_enabled') === 'true';

function initAudioSystem() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  function updateSoundUI() {
    soundBtn.classList.toggle('active', soundEnabled);
    soundBtn.setAttribute('title', soundEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound');
  }

  updateSoundUI();

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('smit_sound_enabled', soundEnabled);
    updateSoundUI();
    if (soundEnabled) {
      playTone(587.33, 'triangle', 0.1, 0.08); // D5 chime
      showToast('Sound feedback enabled');
    } else {
      showToast('Sound muted');
    }
  });
}

function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.05) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context silently handled
  }
}

function playClickSound() {
  playTone(880, 'sine', 0.08, 0.04);
}

function playSuccessSound() {
  playTone(523.25, 'triangle', 0.1, 0.05);
  setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.05), 80);
}

/* ==========================================================================
   2. Custom Interactive Cursor
   ========================================================================== */
function initCustomCursor() {
  // Check if reduced motion or touch device
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
    return;
  }

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover target scale
  const interactiveSelectors = 'a, button, input, textarea, .project-card, .skill-item-card, .bento-card, .hint-chip, .theme-dot, .hero-social-pill';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovering');
    });
  });
}

/* ==========================================================================
   3. Interactive Background Canvas (Ambient Mesh)
   ========================================================================== */
function initBackgroundCanvas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 55 : 25, 70);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.6 + 0.8
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 130) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - mdist / 130)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ==========================================================================
   4. Navbar, Scrollspy & Mobile Drawer
   ========================================================================== */
function initNavbarAndScroll() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      playClickSound();
    });

    // Close mobile drawer upon click
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   5. Hero Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('hero-typing-target');
  if (!typingElement) return;

  const roles = [
    'AI & Full-Stack Systems',
    'Machine Learning Pipelines',
    'Intelligent Web Applications',
    'Autonomous AI Agents',
    'Scalable Cloud Backends'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const eraseSpeed = 40;
  const delayBetweenWords = 1800;

  function typeTick() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typingElement.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      typingElement.textContent = currentRole.substring(0, charIndex);
    }

    let nextTimeout = isDeleting ? eraseSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      nextTimeout = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      nextTimeout = 400;
    }

    setTimeout(typeTick, nextTimeout);
  }

  typeTick();
}

/* ==========================================================================
   6. Theme Switcher (Accent Palettes)
   ========================================================================== */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('smit_theme_accent') || 'emerald';

  applyTheme(savedTheme);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      applyTheme(theme);
      playTone(660, 'triangle', 0.1, 0.06);
    });
  });

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-accent', themeName);
    localStorage.setItem('smit_theme_accent', themeName);

    dots.forEach((dot) => {
      if (dot.getAttribute('data-theme') === themeName) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   7. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-count');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.max(1, Math.floor(target / 40));

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = count + suffix;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('hero');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   8. Skills Section (Organized into Professional Categories)
   ========================================================================== */
const skillsData = [
  // Programming Languages
  { name: 'Python', category: 'languages', level: 'Proficient', icon: 'python' },
  { name: 'Java', category: 'languages', level: 'Core Foundations', icon: 'java' },
  { name: 'C++', category: 'languages', level: 'DSA & Systems', icon: 'cpp' },

  // Frontend
  { name: 'React', category: 'frontend', level: 'Advanced', icon: 'react' },
  { name: 'JavaScript (ES6+)', category: 'frontend', level: 'Proficient', icon: 'javascript' },
  { name: 'HTML5', category: 'frontend', level: 'Semantic Web', icon: 'html' },
  { name: 'CSS3 / Modern Styling', category: 'frontend', level: 'Responsive UI', icon: 'css' },

  // Backend
  { name: 'Node.js', category: 'backend', level: 'Advanced', icon: 'node' },
  { name: 'Express.js', category: 'backend', level: 'Advanced', icon: 'express' },
  { name: 'Flask', category: 'backend', level: 'Proficient', icon: 'flask' },
  { name: 'REST APIs', category: 'backend', level: 'Architecture', icon: 'api' },

  // Databases
  { name: 'MongoDB', category: 'database', level: 'NoSQL Schemas', icon: 'mongo' },
  { name: 'MongoDB Atlas', category: 'database', level: 'Cloud Clusters', icon: 'atlas' },
  { name: 'SQL', category: 'database', level: 'Relational Queries', icon: 'sql' },

  // AI and Data Science
  { name: 'Gemini API', category: 'ai', level: 'Generative AI', icon: 'gemini' },
  { name: 'Generative AI', category: 'ai', level: 'LLMs & Prompting', icon: 'genai' },
  { name: 'Machine Learning', category: 'ai', level: 'Algorithms', icon: 'ml' },
  { name: 'Scikit-learn', category: 'ai', level: 'Predictive Models', icon: 'sklearn' },
  { name: 'TensorFlow', category: 'ai', level: 'Deep Learning', icon: 'tensorflow' },
  { name: 'NumPy', category: 'ai', level: 'Vector Math', icon: 'numpy' },
  { name: 'Pandas', category: 'ai', level: 'Data Wrangling', icon: 'pandas' },
  { name: 'Matplotlib', category: 'ai', level: 'Data Visualization', icon: 'matplotlib' },
  { name: 'Seaborn', category: 'ai', level: 'Statistical Plots', icon: 'seaborn' },

  // Tools and Platforms
  { name: 'Git', category: 'tools', level: 'Version Control', icon: 'git' },
  { name: 'GitHub', category: 'tools', level: 'CI & Collaboration', icon: 'github' },
  { name: 'VS Code', category: 'tools', level: 'Primary IDE', icon: 'vscode' },
  { name: 'Vercel', category: 'tools', level: 'Serverless Cloud', icon: 'vercel' },
  { name: 'Render', category: 'tools', level: 'Web Services', icon: 'render' },
  { name: 'Docker', category: 'tools', level: 'Containers', icon: 'docker' },
  { name: 'Linux', category: 'tools', level: 'Shell & POSIX', icon: 'linux' },
  { name: 'WSL', category: 'tools', level: 'Dev Environment', icon: 'wsl' }
];

function getSkillIconSvg(iconType) {
  const icons = {
    python: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9H7a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v-2a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2V9a3 3 0 0 0-3-3h-2"/><circle cx="9" cy="6" r="1"/><path d="M12 15h5a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3h-1v2a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v2a3 3 0 0 0 3 3h2"/><circle cx="15" cy="18" r="1"/></svg>`,
    java: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    cpp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
    react: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"/><path d="M4.2 16.8C2.8 14.4 2.8 11.6 4.2 9.2s3.8-3.9 6.2-4.7c2.4-.8 5.2-.4 7.4 1s3.7 3.8 3.7 6.5"/></svg>`,
    javascript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M16 8v8a2 2 0 0 1-2 2h-1M10 16a2 2 0 0 1-2-2"/></svg>`,
    html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    css: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 7.5 2.5L18 19l-6 2.5L6 19 4.5 5.5z"/></svg>`,
    node: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.5 3.5 7.4v9.8L12 22.1l8.5-4.9V7.4z"/><path d="M12 12.5v9.6M12 12.5 3.5 7.4M12 12.5l8.5-5.1"/></svg>`,
    express: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.1 19.46A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.54L14 9.31V2"/></svg>`,
    api: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
    mongo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.5 7.5 8 12 8 14.5c0 3 1.8 5.5 4 5.5s4-2.5 4-5.5C16 12 15.5 7.5 12 2z"/></svg>`,
    atlas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    sql: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    gemini: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>`,
    genai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    ml: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8.5" y1="7.5" x2="10.5" y2="16"/><line x1="15.5" y1="7.5" x2="13.5" y2="16"/></svg>`,
    sklearn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    tensorflow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/></svg>`,
    numpy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    pandas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
    matplotlib: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    seaborn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    git: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="8.5" y1="7.5" x2="15.5" y2="15.5"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    vscode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 3-9 9 9 9V3z"/><path d="M9 12 3 7.5v9L9 12z"/></svg>`,
    vercel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 20 2 20"/></svg>`,
    render: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M12 2v20M2 12h20"/></svg>`,
    docker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="10" width="20" height="10" rx="3"/><path d="M6 10V6h3v4M10 10V4h3v6M14 10V6h3v4"/></svg>`,
    linux: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    wsl: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`
  };

  return icons[iconType] || icons.python;
}

function initSkillsSection() {
  const container = document.getElementById('skills-container');
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  if (!container) return;

  function renderSkills(category = 'all') {
    container.innerHTML = '';
    const filtered = category === 'all' 
      ? skillsData 
      : skillsData.filter((s) => s.category === category);

    filtered.forEach((skill) => {
      const card = document.createElement('div');
      card.className = 'skill-item-card';
      card.innerHTML = `
        <div class="skill-icon-wrap">
          ${getSkillIconSvg(skill.icon)}
        </div>
        <div class="skill-name">${skill.name}</div>
        <span class="skill-level-badge">${skill.level}</span>
      `;
      container.appendChild(card);
    });
  }

  renderSkills('all');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-skill-category');
      renderSkills(cat);
      playClickSound();
    });
  });
}

/* ==========================================================================
   9. Projects Showcase & Architectural Modal
   ========================================================================== */
function initProjectsSection() {
  const container = document.getElementById('projects-container');
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');

  if (!container || typeof portfolioProjects === 'undefined') return;

  function renderProjects(filterCategory = 'all') {
    container.innerHTML = '';

    let list = portfolioProjects;
    if (filterCategory === 'deployed') {
      list = portfolioProjects.filter((p) => p.status === 'deployed');
    } else if (filterCategory === 'ai') {
      list = portfolioProjects.filter((p) => p.category === 'ai');
    } else if (filterCategory === 'fullstack') {
      list = portfolioProjects.filter((p) => p.category === 'fullstack' || p.tags.includes('Node.js'));
    }

    list.forEach((proj) => {
      const isDeployed = proj.status === 'deployed' && proj.liveUrl;
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-image-box">
          <img src="${proj.image}" alt="${proj.title}" loading="lazy">
          <span class="project-category-badge">${proj.categoryDisplay || proj.category}</span>
        </div>
        <div class="project-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
            <span class="status-pill ${proj.status}">
              <span class="dot"></span>
              <span>${proj.statusText}</span>
            </span>
          </div>

          <h3 class="project-title">
            <span>${proj.title}</span>
          </h3>

          <p class="project-tagline">${proj.description}</p>

          <div class="project-features-list">
            ${proj.highlights.slice(0, 3).map((h) => `
              <div class="project-feature-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>

          <div class="project-tags">
            ${proj.tags.map((t) => `<span class="project-tag">${t}</span>`).join('')}
          </div>

          <div class="project-footer-actions">
            <button class="btn btn-secondary btn-sm inspect-proj-btn" data-project-id="${proj.id}">
              <span>View Architecture</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <div class="project-links-row">
              <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Inspect GitHub Repository" aria-label="GitHub Repository">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>

              ${isDeployed 
                ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Launch Live Demo" aria-label="Live Demo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                   </a>`
                : `<button class="project-link-icon btn-in-dev" title="In Development — Not Deployed Yet" aria-label="In Development" onclick="showToast('Autonomous AI Agent is currently in active development. Inspect the GitHub repository for source code.')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                   </button>`
              }
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach inspect modal listeners
    container.querySelectorAll('.inspect-proj-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-project-id');
        openProjectModal(id);
        playClickSound();
      });
    });
  }

  renderProjects('all');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderProjects(cat);
      playClickSound();
    });
  });

  function openProjectModal(id) {
    const proj = portfolioProjects.find((p) => p.id === id);
    if (!proj || !modalBackdrop) return;

    document.getElementById('modal-img').src = proj.image;
    document.getElementById('modal-category').textContent = proj.categoryDisplay || proj.category;
    
    const statusPill = document.getElementById('modal-status-pill');
    statusPill.className = `status-pill ${proj.status}`;
    statusPill.innerHTML = `<span class="dot"></span><span>${proj.statusText}</span>`;

    document.getElementById('modal-title').textContent = proj.title;
    document.getElementById('modal-tagline').textContent = proj.tagline;

    // Render the 10 detailed sections
    const detailsContainer = document.getElementById('modal-details-container');
    const d = proj.details;

    let techStackHtml = '';
    if (d.techStack && Array.isArray(d.techStack)) {
      techStackHtml = `
        <div class="modal-tech-stack-table">
          ${d.techStack.map((ts) => `
            <div class="modal-tech-stack-item">
              <div class="modal-tech-label">${ts.label}</div>
              <div class="modal-tech-val">${ts.val}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    let keyFeaturesHtml = '';
    if (d.keyFeatures && Array.isArray(d.keyFeatures)) {
      keyFeaturesHtml = `
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.6rem; margin-top:0.5rem;">
          ${d.keyFeatures.map((kf) => `
            <li style="display:flex; align-items:flex-start; gap:0.6rem; font-size:0.9rem; color:var(--text-muted); line-height:1.5;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" style="flex-shrink:0; margin-top:3px;"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${kf}</span>
            </li>
          `).join('')}
        </ul>
      `;
    }

    let futureImprovementsHtml = '';
    if (d.futureImprovements && Array.isArray(d.futureImprovements)) {
      futureImprovementsHtml = `
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.6rem; margin-top:0.5rem;">
          ${d.futureImprovements.map((fi) => `
            <li style="display:flex; align-items:flex-start; gap:0.6rem; font-size:0.9rem; color:var(--text-muted); line-height:1.5;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" style="flex-shrink:0; margin-top:3px;"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 12 8"/></svg>
              <span>${fi}</span>
            </li>
          `).join('')}
        </ul>
      `;
    }

    // Optional Database Health Alert (Specifically for Dumka Sports Tracker)
    let dbHealthReportHtml = '';
    if (d.databaseHealthReport) {
      dbHealthReportHtml = `
        <div class="modal-diagnostic-alert">
          <div class="modal-diagnostic-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Database Connection & Deployment Health Diagnostic</span>
          </div>
          <div class="modal-diagnostic-text">
            ${d.databaseHealthReport}
          </div>
        </div>
      `;
    }

    detailsContainer.innerHTML = `
      <!-- 1. Problem Statement -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>1. Problem Statement</span>
        </div>
        <p class="modal-card-text">${d.problemStatement}</p>
      </div>

      <!-- 2. Proposed Solution -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
          <span>2. Proposed Solution</span>
        </div>
        <p class="modal-card-text">${d.proposedSolution}</p>
      </div>

      <!-- 3. System Architecture -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span>3. Architecture</span>
        </div>
        <p class="modal-card-text">${d.architecture}</p>
      </div>

      <!-- 4. Technology Stack -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/></svg>
          <span>4. Technology Stack</span>
        </div>
        ${techStackHtml}
      </div>

      <!-- 5. Key Implemented Features -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          <span>5. Key Features</span>
        </div>
        ${keyFeaturesHtml}
      </div>

      <!-- 6. Backend Implementation -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>
          <span>6. Backend Implementation</span>
        </div>
        <p class="modal-card-text">${d.backendImplementation}</p>
      </div>

      <!-- 7. Database Design -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          <span>7. Database Design</span>
        </div>
        <p class="modal-card-text">${d.databaseDesign}</p>
      </div>

      ${dbHealthReportHtml}

      <!-- 8. AI/ML Implementation -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/><path d="M16 8v1a4 4 0 0 1-8 0V8"/><line x1="12" y1="13" x2="12" y2="22"/></svg>
          <span>8. AI/ML Implementation</span>
        </div>
        <p class="modal-card-text">${d.aiMlImplementation}</p>
      </div>

      <!-- 9. Technical Challenges & Engineering Solutions -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>9. Technical Challenges</span>
        </div>
        <p class="modal-card-text">${d.technicalChallenges}</p>
      </div>

      <!-- 10. Future Improvements -->
      <div class="modal-section-card">
        <div class="modal-card-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>10. Future Improvements</span>
        </div>
        ${futureImprovementsHtml}
      </div>
    `;

    // Modal Links
    document.getElementById('modal-github-link').href = proj.githubUrl;

    const liveBtn = document.getElementById('modal-live-link');
    if (proj.status === 'deployed' && proj.liveUrl) {
      liveBtn.style.display = 'inline-flex';
      liveBtn.href = proj.liveUrl;
      liveBtn.className = 'btn btn-primary';
      liveBtn.innerHTML = `<span>Launch Live Demo</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>`;
      liveBtn.removeAttribute('disabled');
      liveBtn.onclick = null;
    } else {
      liveBtn.style.display = 'inline-flex';
      liveBtn.removeAttribute('href');
      liveBtn.className = 'btn btn-secondary btn-in-dev';
      liveBtn.innerHTML = `<span>In Development (No Live Demo)</span>`;
      liveBtn.onclick = (e) => {
        e.preventDefault();
        showToast('Autonomous AI Agent is under active development. Live deployment planned for next release milestone.');
      };
    }

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      playClickSound();
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. Interactive Dev Terminal (Ankit Dev CLI)
   ========================================================================== */
function initTerminalEmulator() {
  const terminalScreen = document.getElementById('terminal-screen');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInput = document.getElementById('terminal-input');
  const hintChips = document.querySelectorAll('.hint-chip');

  if (!terminalInput || !terminalHistory) return;

  const commands = {
    help: () => `
Available Commands:
  <span class="term-highlight">whoami</span>      - Professional identity, background & focus
  <span class="term-highlight">skills</span>      - Verified programming languages, frameworks & AI libraries
  <span class="term-highlight">projects</span>    - The 4 major engineering projects & links
  <span class="term-highlight">highlights</span>  - Core engineering differentiators & what sets me apart
  <span class="term-highlight">education</span>   - B.Tech CSE @ Sikkim Manipal Institute of Technology (2024–2028)
  <span class="term-highlight">contact</span>     - Direct email & campus coordinates
  <span class="term-highlight">github</span>      - Launch GitHub Profile in new tab
  <span class="term-highlight">linkedin</span>    - Launch LinkedIn Profile in new tab
  <span class="term-highlight">theme &lt;color&gt;</span>- Switch theme accent (<span class="term-accent-sec">emerald</span>, <span class="term-accent-sec">cyan</span>, <span class="term-accent-sec">violet</span>, <span class="term-accent-sec">amber</span>)
  <span class="term-highlight">clear</span>       - Clear console screen
    `,
    whoami: () => `
<span class="term-highlight">👨‍💻 Ankit Kumar</span>
  • Identity: Aspiring AI Engineer | Full-Stack Developer | Machine Learning Enthusiast
  • Goal: Secure an internship in a top technology company
  • Education: B.Tech Computer Science & Engineering, SMIT (Batch 2024–2028)
  • Areas of Interest: Artificial Intelligence, Machine Learning, Generative AI, AI Agents, Full-Stack Development, Backend Engineering, Data Science, Cloud Computing, Software Architecture.
    `,
    skills: () => `
<span class="term-highlight">⚡ Technical Competencies:</span>
  • Languages:      Python, Java, C++
  • Frontend:       HTML, CSS, JavaScript, React
  • Backend:        Node.js, Express.js, Flask, REST APIs
  • Databases:      MongoDB, MongoDB Atlas, SQL
  • AI & Data Sci:  NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, TensorFlow, Machine Learning, Generative AI, Gemini API
  • Tools & Cloud:  Git, GitHub, VS Code, Vercel, Render, Docker, Linux, WSL
    `,
    projects: () => `
<span class="term-highlight">🚀 Four Major Projects:</span>
  1. <span class="term-accent-sec">Tracker – Dumka Sports Academy</span> [Full-Stack | Sports Management]
     Live: https://dumka-sports-tracker.vercel.app/
     Repo: https://github.com/ankitkumar2006official-design/Tracker
  2. <span class="term-accent-sec">MediGuard AI – Operation Ward Zero</span> [AI Healthcare | Full-Stack]
     Live: https://frontend-fawn-eight-96.vercel.app/
     Repo: https://github.com/ankitkumar2006official-design/Medicare-AI-Healthcare
  3. <span class="term-accent-sec">GeoCommerce AI</span> [AI | Data Science | E-Commerce Analytics]
     Live: https://geoecommerce-ai.vercel.app/
     Repo: https://github.com/ankitkumar2006official-design/GeoecommerceAI
  4. <span class="term-accent-sec">Autonomous AI Software Engineer Agent</span> [AI | Autonomous AI Agents]
     Status: In Development
     Repo: https://github.com/ankitkumar2006official-design/AI-SOFTWARE-ENGINEER-AGENT
    `,
    highlights: () => `
<span class="term-highlight">⚡ What Sets Me Apart (Core Engineering DNA):</span>
  1. Production-Driven: Shipped 3 live cloud systems to Vercel & MongoDB Atlas.
  2. AI-First Architecture: Designing autonomous agent loops, AST parsers, and Gemini pipelines.
  3. Ground-Reality Problem Solving: Sports tracking (Dumka), emergency triage (MediGuard AI), regional commerce.
  4. Engineering Craft: Modern developer ergonomics, rapid prototyping, and clean architecture.
    `,
    leadership: () => `
<span class="term-highlight">⚡ Core Engineering Highlights:</span>
  • Production-Driven: Shipped 3 live cloud systems to Vercel & MongoDB Atlas.
  • AI-First Architecture: Designing autonomous agent loops, AST parsers, and Gemini pipelines.
  • Ground-Reality Problem Solving: Sports tracking (Dumka), emergency triage (MediGuard AI), regional commerce.
  • Engineering Craft: Modern developer ergonomics, rapid prototyping, and clean architecture.
    `,
    education: () => `
<span class="term-highlight">🎓 Bachelor of Technology (B.Tech) in Computer Science and Engineering</span>
  • Institution: Sikkim Manipal Institute of Technology (SMIT), Majitar, East Sikkim
  • Batch: 2024–2028
  • Coursework: Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, Software Engineering, AI & Machine Learning.
    `,
    contact: () => `
<span class="term-highlight">📬 Contact Information:</span>
  • Email:    ankitkumar2006official@gmail.com
  • GitHub:   https://github.com/ankitkumar2006official-design
  • LinkedIn: https://www.linkedin.com/in/ankit-kumar-3388732ba/
  • Campus:   SMIT Campus, Majitar, Rangpo, East Sikkim - 737136
    `,
    github: () => {
      window.open('https://github.com/ankitkumar2006official-design', '_blank', 'noopener,noreferrer');
      return `<span class="term-highlight">Opening GitHub Profile (https://github.com/ankitkumar2006official-design)...</span>`;
    },
    linkedin: () => {
      window.open('https://www.linkedin.com/in/ankit-kumar-3388732ba/', '_blank', 'noopener,noreferrer');
      return `<span class="term-highlight">Opening LinkedIn Profile (https://www.linkedin.com/in/ankit-kumar-3388732ba/)...</span>`;
    },
    clear: () => {
      terminalHistory.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Log user input line
    const userLine = document.createElement('div');
    userLine.className = 'term-line-output';
    userLine.innerHTML = `<span class="term-prompt">ankit@smit:~$</span> ${trimmed}`;
    terminalHistory.appendChild(userLine);

    // Handle theme command
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : null;

    let outputHtml = '';

    if (cmd === 'theme') {
      if (['emerald', 'violet', 'cyan', 'amber'].includes(arg)) {
        document.documentElement.setAttribute('data-accent', arg);
        localStorage.setItem('smit_theme_accent', arg);
        outputHtml = `Switched theme accent to <span class="term-highlight">${arg}</span>!`;
        playSuccessSound();
      } else {
        outputHtml = `Unknown theme '${arg}'. Choose from: emerald, violet, cyan, amber.`;
      }
    } else if (commands[cmd]) {
      outputHtml = commands[cmd]();
    } else {
      outputHtml = `command not found: <span style="color:#ef4444">${trimmed}</span>. Type <span class="term-highlight">help</span> for a list of available commands.`;
    }

    if (cmd !== 'clear' && outputHtml) {
      const outputLine = document.createElement('div');
      outputLine.className = 'term-line-output';
      outputLine.innerHTML = outputHtml;
      terminalHistory.appendChild(outputLine);
    }

    terminalScreen.scrollTop = terminalScreen.scrollHeight;
    playTone(720, 'sine', 0.05, 0.03);
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  hintChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      terminalInput.value = cmd;
      terminalInput.focus();
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   11. Contact Form Handling (Live Formspree Integration)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdeerayj';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <span>Transmitting Message...</span>
    `;
    submitBtn.disabled = true;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject || 'Portfolio Contact Dispatch',
          message: message
        })
      });

      if (response.ok) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
        playSuccessSound();
        showToast(`Thank you, ${name}! Your message was successfully delivered to Ankit Kumar.`);
      } else {
        const data = await response.json().catch(() => ({}));
        let errorMsg = 'Failed to deliver message. Please email directly at ankitkumar2006official@gmail.com.';
        if (data && data.errors && data.errors.length) {
          errorMsg = data.errors.map(err => err.message).join(', ');
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast(errorMsg, true);
      }
    } catch (error) {
      console.error('Contact form transmission error:', error);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showToast('Network error while transmitting. Please email ankitkumar2006official@gmail.com directly.', true);
    }
  });
}

function showToast(message, isError = false) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) {
    toast.style.borderLeftColor = '#ef4444';
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isError ? '#ef4444' : 'var(--accent-primary)'}" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   12. Quick Email Copy Feature
   ========================================================================== */
function initQuickCopy() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const emailVal = 'ankitkumar2006official@gmail.com';

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(emailVal).then(() => {
          btn.textContent = 'Copied!';
          showToast('Email address copied to clipboard!');
          playSuccessSound();
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2200);
        });
      } else {
        showToast(`Email: ${emailVal}`);
      }
    });
  });
}

/* ==========================================================================
   13. Resume Action Handler
   ========================================================================== */
function initResumeButton() {
  const resumeBtn = document.getElementById('resume-download-btn');
  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', () => {
    playClickSound();
    // Transparently inform that resume can be provided or viewed via LinkedIn
    showToast('Resume is available on request. Connecting to LinkedIn profile or contact dispatch.');
    setTimeout(() => {
      window.open('https://www.linkedin.com/in/ankit-kumar-3388732ba/', '_blank', 'noopener,noreferrer');
    }, 800);
  });
}

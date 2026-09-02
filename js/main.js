const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Cursor customizado: bolinha "puxada" pelo mouse como um ímã =====
// O ponteiro nativo continua visível — a bolinha só acompanha por perto,
// com bastante atraso (lerp bem lento), nunca gruda exatamente nele.
// Posição/velocidade ficam expostas em window.__cursorBall pro campo de
// partículas do hero reagir à bolinha, não ao mouse cru.
window.__cursorBall = { x: -999, y: -999, vx: 0, vy: 0, active: false };

(() => {
  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;

  const ring = document.getElementById('cursorRing');
  if (!ring) return;

  const ball = window.__cursorBall;
  let mx = 0, my = 0, started = false;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!started) { ball.x = mx; ball.y = my; started = true; ring.classList.add('show'); }
    ball.active = true;
  });

  function loop() {
    const prevX = ball.x, prevY = ball.y;
    ball.x += (mx - ball.x) * 0.06;
    ball.y += (my - ball.y) * 0.06;
    ball.vx = ball.x - prevX;
    ball.vy = ball.y - prevY;
    ring.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
})();

// ===== Botões magnéticos: seguem o cursor sutilmente por perto =====
(() => {
  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.28}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });
})();

// ===== Preloader: abertura com partículas + logo em blur-in =====
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const canvas = document.getElementById('preloader-particles');
  const logo = preloader?.querySelector('.preloader-logo');
  if (!preloader) return Promise.resolve();

  if (reduceMotion) {
    preloader.remove();
    return Promise.resolve();
  }

  document.body.classList.add('no-scroll');

  let raf;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
    }
    function makeParticles() {
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.6 + 0.4) * dpr,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: (Math.random() - 0.5) * 0.25 * dpr,
        a: Math.random() * 0.5 + 0.15,
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,164,79,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    resize();
    makeParticles();
    tick();
    window.addEventListener('resize', () => { resize(); makeParticles(); }, { passive: true });
  }

  return new Promise((resolve) => {
    setTimeout(() => logo?.classList.add('show'), 600);

    setTimeout(() => {
      preloader.classList.add('hide');
      document.body.classList.remove('no-scroll');
      resolve();
    }, 600 + 1100 + 700);

    setTimeout(() => {
      cancelAnimationFrame(raf);
      preloader.remove();
    }, 600 + 1100 + 700 + 700);
  });
}

// ===== Header: fundo com blur ao rolar =====
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Menu mobile =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('nav-open');
  navToggle.classList.toggle('active', open);
});
nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('nav-open');
    navToggle?.classList.remove('active');
  });
});

// ===== Scroll reveal =====
// Os .reveal do hero esperam a abertura (preloader) terminar antes de entrar,
// pra não ficarem visíveis "escondidos" atrás da tela de abertura.
const allReveals = document.querySelectorAll('.reveal');
// .line-mask entra junto (mesmo grupo do hero), mas usa transform próprio
// (a linha desliza de dentro da máscara) em vez do fade+translateY do .reveal
const heroReveals = document.querySelectorAll('.hero .reveal, .hero .line-mask');
const otherReveals = Array.from(allReveals).filter(el => !el.closest('.hero'));

if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 40);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  otherReveals.forEach(el => io.observe(el));

  initPreloader().then(() => {
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), i * 90);
    });
    setTimeout(initHeroCinematic, 1200);
  });
} else {
  allReveals.forEach(el => el.classList.add('in-view'));
  document.querySelectorAll('.line-mask').forEach(el => el.classList.add('in-view'));
  initPreloader();
}

// ===== Hero: sai de cena suavemente ao rolar =====
// O texto desbota com um leve blur e sobe, o brilho de fundo diminui e a
// rede de partículas encolhe — tudo isso conforme a hero sai da viewport,
// pra não simplesmente "cortar" pra próxima seção.
function initHeroCinematic() {
  if (reduceMotion || window.innerWidth < 768) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const textEls = ['.eyebrow', '.hero-title', '.hero-sub', '.hero-actions']
    .map(sel => hero.querySelector(sel))
    .filter(Boolean);
  const glow = hero.querySelector('.hero-glow');
  const netCanvas = hero.querySelector('.hero-canvas');
  const hint = hero.querySelector('.scroll-hint');

  // a partir daqui o scroll controla opacity/transform direto —
  // sem transition CSS competindo com o valor a cada frame
  [...textEls, glow, netCanvas, hint].forEach(el => { if (el) el.style.transition = 'none'; });

  let ticking = false;
  function update() {
    ticking = false;
    const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);

    textEls.forEach(el => {
      el.style.opacity = 1 - progress;
      el.style.transform = `translateY(${-40 * progress}px)`;
      el.style.filter = `blur(${4 * progress}px)`;
    });
    if (glow) glow.style.opacity = 1 - progress * 0.85;
    if (netCanvas) {
      netCanvas.style.transform = `scale(${1 - progress * 0.15}) translateY(${-70 * progress}px)`;
      netCanvas.style.opacity = 0.55 - progress * 0.3;
    }
    if (hint) hint.style.opacity = Math.max(1 - progress * 4, 0);
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}

// ===== Processo: seção presa na tela com scroll horizontal =====
// Em vez da página descer normalmente, a seção fica "grudada" (sticky) e o
// scroll vertical do usuário empurra os cards pro lado — até passar o
// último, quando aí sim solta e a página volta a descer.
function initTimelinePin() {
  const pinWrap = document.getElementById('timelinePinWrap');
  const track = document.getElementById('timelineTrack');
  const fill = document.getElementById('timelineProgressFill');
  if (!pinWrap || !track) return;

  const steps = track.querySelectorAll('.timeline-step');

  if (reduceMotion || window.innerWidth < 860) {
    pinWrap.classList.add('native-scroll');
    steps.forEach(s => s.classList.add('active'));
    return;
  }

  function edgePadding() {
    const cardWidth = steps[0].getBoundingClientRect().width;
    const pad = Math.max((window.innerWidth - cardWidth) / 2, 24);
    track.style.paddingLeft = `${pad}px`;
    track.style.paddingRight = `${pad}px`;
  }

  function trackDistance() {
    return Math.max(track.scrollWidth - window.innerWidth, 100);
  }

  function setup() {
    edgePadding();
    pinWrap.style.height = `${window.innerHeight + trackDistance()}px`;
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect = pinWrap.getBoundingClientRect();
    const distance = trackDistance();
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / distance, 0), 1);

    track.style.transform = `translateX(${-progress * distance}px)`;
    if (fill) fill.style.width = `${progress * 100}%`;

    const centerX = window.innerWidth / 2;
    let closest = null, closestDist = Infinity;
    steps.forEach(step => {
      const r = step.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - centerX);
      if (dist < closestDist) { closestDist = dist; closest = step; }
    });
    steps.forEach(s => s.classList.toggle('active', s === closest));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { setup(); update(); }, 200);
  }, { passive: true });

  setup();
  update();

  // largura das fontes/cards pode assentar um instante depois do load
  document.fonts?.ready.then(() => { setup(); update(); });
}
initTimelinePin();

// ===== Cards: borda com brilho que segue o cursor =====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// ===== Header: onda de partículas fluida e sutil, sempre ativa =====
(() => {
  const canvas = document.getElementById('headerWave');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr, rows, segments, t = 0, animId;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    rows = 8;
    segments = Math.max(Math.round(w / 22), 24);
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    t += 0.005;

    for (let r = 0; r < rows; r++) {
      const rowT = r / (rows - 1); // 0 topo .. 1 base
      const baseY = h * (0.3 + rowT * 0.85);
      const amp = 4 + rowT * 11;
      const rowPhase = r * 0.7;

      ctx.beginPath();
      for (let c = 0; c <= segments; c++) {
        const x = (c / segments) * w;
        const y = baseY + Math.sin(x * 0.01 + t * 1.3 + rowPhase) * amp;
        if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const alpha = (0.035 + rowT * 0.16) * (0.7 + 0.3 * Math.sin(t * 1.6 + rowPhase));
      ctx.strokeStyle = `rgba(212,164,79,${Math.max(alpha, 0)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // pontos sutis por cima, reforçando a textura sem pesar
    for (let r = 2; r < rows; r += 2) {
      const rowT = r / (rows - 1);
      const baseY = h * (0.3 + rowT * 0.85);
      const amp = 4 + rowT * 11;
      const rowPhase = r * 0.7;
      const step = Math.max(Math.round(segments / 14), 1);
      for (let c = 0; c <= segments; c += step) {
        const x = (c / segments) * w;
        const y = baseY + Math.sin(x * 0.01 + t * 1.3 + rowPhase) * amp;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,194,116,${0.12 + rowT * 0.22})`;
        ctx.fill();
      }
    }

    animId = requestAnimationFrame(tick);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      tick();
    }, 200);
  }, { passive: true });

  resize();
  tick();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animId = requestAnimationFrame(tick);
  });
})();

// ===== Hero: estilhaços com física tipo "gravidade" reagindo à bolinha =====
// A bolinha do cursor (window.__cursorBall, não o mouse cru) é o corpo que
// interage: se ela está se movendo, os estilhaços perto são repelidos; se
// ela fica parada, os estilhaços próximos passam a orbitar ao redor dela.
(() => {
  const canvas = document.getElementById('net');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr, shards, animId;
  const isMobile = window.innerWidth < 720;
  const DENSITY = isMobile ? 20000 : 13000;
  const RADIUS = isMobile ? 120 : 170;
  const MOVE_THRESHOLD = 0.15;
  const COLORS = ['rgba(232,194,116,0.75)', 'rgba(244,223,168,0.8)', 'rgba(212,164,79,0.7)'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / DENSITY);
    shards = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      baseVx: (Math.random() - 0.5) * 0.16,
      baseVy: (Math.random() - 0.5) * 0.16,
      vx: 0, vy: 0,
      size: Math.random() * 2.6 + 2.2,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function getBall() {
    const b = window.__cursorBall;
    if (!b || !b.active) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: b.x - rect.left, y: b.y - rect.top, vx: b.vx, vy: b.vy };
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);

    const ball = getBall();
    const ballMoving = ball ? Math.hypot(ball.vx, ball.vy) > MOVE_THRESHOLD : false;

    for (const p of shards) {
      if (ball) {
        const dx = p.x - ball.x, dy = p.y - ball.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          const nx = dx / dist, ny = dy / dist;

          if (ballMoving) {
            // repele: espalha os estilhaços pra longe da bolinha
            p.vx += nx * t * t * 0.65;
            p.vy += ny * t * t * 0.65;
          } else {
            // atrai de leve + empurra na tangente = passam a orbitar
            p.vx += -nx * t * 0.045;
            p.vy += -ny * t * 0.045;
            p.vx += -ny * t * 0.24;
            p.vy += nx * t * 0.24;
          }
        }
      }

      p.vx *= 0.94;
      p.vy *= 0.94;
      const speed = Math.hypot(p.vx, p.vy);
      const maxSpeed = 3.4;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      p.x += p.baseVx + p.vx;
      p.y += p.baseVy + p.vy;
      p.angle += p.rotSpeed + speed * 0.015;

      if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
      if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size * 0.28, p.size, p.size * 0.56);
      ctx.restore();
    }

    animId = requestAnimationFrame(tick);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      tick();
    }, 200);
  });

  resize();
  tick();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(tick);
    }
  });
})();

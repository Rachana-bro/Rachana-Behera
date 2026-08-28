/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT - RACHANA BEHERA
 * Features:
 *   1. Dynamic Background Physics & Multi-Mode Particle Canvas
 *   2. Web Audio Synthesizer (UI Clicks, Taala Metronome, Beeps)
 *   3. 3D Tilt Card Physics & Cursor Spotlight
 *   4. Holographic Interactive Code Terminal & Virtual Sandbox Runner
 *   5. Live Interactive Algorithm Visualizer (Bubble, Quick, Insertion)
 *   6. Bharatnatyam Taala Player (Mathematical Rhythmic Cycles)
 *   7. Project Filter & Lightbox Modals
 *   8. Live Time (Kolkata IST) & Typewriter Effects
 *   9. Form Validation & Toast Notification System
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. SOUND SYNTHESIZER (Web Audio API)
     ========================================================================= */
  class SoundSynth {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.08) {
      if (this.muted) return;
      try {
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio API may be restricted until user interaction
      }
    }

    click() { this.playTone(800, 'sine', 0.06, 0.05); }
    hover() { this.playTone(400, 'triangle', 0.04, 0.02); }
    success() { 
      this.playTone(523.25, 'sine', 0.1, 0.07);
      setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.07), 100);
      setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.07), 200);
    }
    beat(accent = false) {
      if (accent) {
        this.playTone(600, 'triangle', 0.12, 0.12);
      } else {
        this.playTone(320, 'sine', 0.08, 0.06);
      }
    }
  }

  const sound = new SoundSynth();

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      sound.muted = !sound.muted;
      audioToggleBtn.classList.toggle('sound-muted', sound.muted);
      showToast(sound.muted ? 'Sound Effects Muted' : 'Sound Effects Enabled');
    });
  }

  /* =========================================================================
     2. DYNAMIC BACKGROUND CANVAS (6 High-Performance Dynamic Particle Modes)
     ========================================================================= */
  const canvas = document.getElementById('neuralCanvas');
  let ctx = null;
  let particles = [];
  let canvasMode = 0; // 0: Constellation, 1: Cyber Matrix, 2: Starfield Orbit, 3: Quantum Wave Grid, 4: Warp Speed, 5: Singularity Vortex
  const modes = [
    'Constellation Mesh',
    'Matrix Cyber Grid',
    'Starfield Orbit',
    'Quantum Waveform Grid',
    '⚡ Hyper-Speed Warp Stream',
    '🌀 Gravitational Singularity Vortex'
  ];

  if (canvas) {
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
        this.color = Math.random() > 0.4 ? '#00f0ff' : '#6366f1';
        this.alpha = Math.random() * 0.5 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.angle = Math.random() * Math.PI * 2;
        this.dist = Math.random() * Math.min(canvas.width, canvas.height) * 0.5;
        this.speed = Math.random() * 2 + 1;
        this.z = Math.random() * 1000 + 1;
      }

      update(mouse) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Interactive mouse repulsion / glow
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (140 - dist) / 140;
            this.x -= (dx / dist) * force * 3.5;
            this.y -= (dy / dist) * force * 3.5;
            this.radius = this.baseRadius * 2.2;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.globalAlpha = this.alpha;
        context.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 140);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    const mouseState = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouseState.x = null;
      mouseState.y = null;
    });

    let animId = null;
    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (canvasMode === 0) {
        // Constellation Mesh Mode
        for (let i = 0; i < particles.length; i++) {
          particles[i].update(mouseState);
          particles[i].draw(ctx);

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 135) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = '#00f0ff';
              ctx.globalAlpha = (1 - dist / 135) * 0.25;
              ctx.lineWidth = 0.85;
              ctx.stroke();
            }
          }
        }
      } else if (canvasMode === 1) {
        // Matrix Cyber Grid Mode
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.09)';
        ctx.lineWidth = 1;
        const step = 60;
        const offset = (Date.now() / 45) % step;
        
        for (let x = 0; x < canvas.width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = offset; y < canvas.height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        particles.forEach(p => {
          p.update(mouseState);
          p.draw(ctx);
        });
      } else if (canvasMode === 2) {
        // Starfield Orbit Mode
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        particles.forEach((p, idx) => {
          const angle = (Date.now() / 2200) * (idx % 2 === 0 ? 1 : -1) + idx;
          const radius = (idx * 14 + 60) % (canvas.width / 2);
          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * (radius * 0.6);

          ctx.beginPath();
          ctx.arc(px, py, p.radius * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.55;
          ctx.fill();
        });
      } else if (canvasMode === 3) {
        // Quantum Waveform Grid Mode
        const time = Date.now() / 800;
        const cols = 28;
        const rows = 14;
        const xGap = canvas.width / (cols + 1);
        const yGap = canvas.height / (rows + 1);

        for (let r = 1; r <= rows; r++) {
          for (let c = 1; c <= cols; c++) {
            const baseX = c * xGap;
            const baseY = r * yGap;
            const wave = Math.sin(time + c * 0.4 + r * 0.3) * 12;
            const rad = Math.max(1, 2 + Math.cos(time + c * 0.3) * 1.5);
            
            ctx.beginPath();
            ctx.arc(baseX, baseY + wave, rad, 0, Math.PI * 2);
            ctx.fillStyle = (c + r) % 2 === 0 ? '#00f0ff' : '#ec4899';
            ctx.globalAlpha = 0.28;
            ctx.fill();
          }
        }
      } else if (canvasMode === 4) {
        // Mode 4: Hyper-Speed Warp Stream
        const cx = mouseState.x || (canvas.width / 2);
        const cy = mouseState.y || (canvas.height / 2);

        particles.forEach(p => {
          p.z -= 18;
          if (p.z <= 0) {
            p.z = 1000;
            p.x = (Math.random() - 0.5) * canvas.width * 2;
            p.y = (Math.random() - 0.5) * canvas.height * 2;
          }

          const k = 250 / p.z;
          const px = p.x * k + cx;
          const py = p.y * k + cy;

          if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            const prevK = 250 / (p.z + 32);
            const prevPx = p.x * prevK + cx;
            const prevPy = p.y * prevK + cy;

            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.min(3, (1 - p.z / 1000) * 3);
            ctx.globalAlpha = (1 - p.z / 1000) * 0.85;
            ctx.stroke();
          }
        });
      } else {
        // Mode 5: Gravitational Singularity Vortex
        const cx = mouseState.x || (canvas.width / 2);
        const cy = mouseState.y || (canvas.height / 2);
        const time = Date.now() / 900;

        // Draw glowing singularity core
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
        glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
        glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p, idx) => {
          p.angle += (0.015 + (idx % 5) * 0.004);
          p.dist -= (0.5 + (idx % 3) * 0.4);
          if (p.dist < 15) {
            p.dist = Math.random() * Math.min(canvas.width, canvas.height) * 0.48 + 50;
          }

          const spiralX = cx + Math.cos(p.angle) * p.dist;
          const spiralY = cy + Math.sin(p.angle) * (p.dist * 0.7);

          ctx.beginPath();
          ctx.arc(spiralX, spiralY, p.radius * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#ec4899';
          ctx.globalAlpha = Math.min(0.9, p.dist / 200 + 0.2);
          ctx.fill();
        });
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateCanvas();

    // Canvas Mode Switcher Button
    const canvasModeBtn = document.getElementById('canvasModeBtn');
    if (canvasModeBtn) {
      canvasModeBtn.addEventListener('click', () => {
        sound.click();
        canvasMode = (canvasMode + 1) % modes.length;
        showToast(`Canvas Particle Engine: ${modes[canvasMode]}`);
      });
    }
  }

  /* =========================================================================
     2.5. INTERACTIVE PARTICLES & SPARK BURST ENGINE (Sparks Canvas)
     ========================================================================= */
  const sparksCanvas = document.getElementById('sparksCanvas');
  let sparksCtx = null;
  let sparks = [];

  if (sparksCanvas) {
    sparksCtx = sparksCanvas.getContext('2d');

    function resizeSparksCanvas() {
      sparksCanvas.width = window.innerWidth;
      sparksCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeSparksCanvas);
    resizeSparksCanvas();

    class Spark {
      constructor(x, y, vx, vy, color, size, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // subtle gravity
        this.vx *= 0.96; // drag
        this.life--;
      }

      draw(c) {
        const progress = this.life / this.maxLife;
        c.beginPath();
        c.arc(this.x, this.y, this.size * progress, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = progress * 0.85;
        c.shadowColor = this.color;
        c.shadowBlur = 8;
        c.fill();
        c.shadowBlur = 0;
      }
    }

    function createSparkBurst(x, y, count = 18) {
      const palette = ['#00f0ff', '#6366f1', '#ec4899', '#38bdf8', '#ffffff'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 1.5;
        const color = palette[Math.floor(Math.random() * palette.length)];
        const size = Math.random() * 3 + 1.5;
        const life = Math.floor(Math.random() * 30) + 25;
        sparks.push(new Spark(x, y, vx, vy, color, size, life));
      }
    }

    function animateSparks() {
      sparksCtx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw(sparksCtx);
        if (sparks[i].life <= 0) {
          sparks.splice(i, 1);
        }
      }
      requestAnimationFrame(animateSparks);
    }
    animateSparks();

    // Shockwave ring creation on click
    function createClickShockwave(x, y) {
      const ring = document.createElement('div');
      ring.className = 'click-shockwave';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      const size = Math.random() * 30 + 45;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 750);
    }

    // Trigger spark burst and shockwave on any click
    window.addEventListener('click', (e) => {
      createSparkBurst(e.clientX, e.clientY, 18);
      createClickShockwave(e.clientX, e.clientY);
    });

    // Micro stardust on fast cursor movement
    let lastMoveTime = Date.now();
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMoveTime > 45 && Math.random() > 0.4) {
        lastMoveTime = now;
        const color = Math.random() > 0.5 ? '#00f0ff' : '#6366f1';
        sparks.push(new Spark(e.clientX, e.clientY, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, color, 2, 20));
      }
    });
  }

  /* =========================================================================
     3. CURSOR SPOTLIGHT, MAGNETIC BUTTONS & RIPPLE ENGINE
     ========================================================================= */
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');
  const cursorTrail = document.getElementById('cursorTrail');

  let trailX = 0, trailY = 0;

  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    
    if (cursorGlow) {
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
    }
    if (cursorDot) {
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
    }
  });

  function updateCursorTrail() {
    if (cursorDot && cursorTrail) {
      const targetX = parseFloat(cursorDot.style.left) || 0;
      const targetY = parseFloat(cursorDot.style.top) || 0;
      
      trailX += (targetX - trailX) * 0.22;
      trailY += (targetY - trailY) * 0.22;

      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
    }
    requestAnimationFrame(updateCursorTrail);
  }
  updateCursorTrail();

  // Magnetic Button Physics with Expanding Cursor
  const magneticButtons = document.querySelectorAll('.btn-magnetic, .icon-tool-btn, .social-link, .btn, .hero-view-pill');
  magneticButtons.forEach((btn) => {
    btn.classList.add('btn-liquid-sheen');
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.26}px, ${y * 0.26}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });

    btn.addEventListener('mouseenter', () => {
      sound.hover();
      if (cursorTrail) {
        cursorTrail.style.width = '46px';
        cursorTrail.style.height = '46px';
        cursorTrail.style.borderColor = 'rgba(0, 240, 255, 0.95)';
        cursorTrail.style.backgroundColor = 'rgba(0, 240, 255, 0.06)';
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (cursorTrail) {
        cursorTrail.style.width = '24px';
        cursorTrail.style.height = '24px';
        cursorTrail.style.borderColor = 'rgba(0, 240, 255, 0.4)';
        cursorTrail.style.backgroundColor = 'transparent';
      }
    });

    // Ripple wave effect on click
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Advanced 3D Multi-Layer Tilt with Depth Planes & Specular Lighting
  const tiltCards = document.querySelectorAll('.tilt-card, .project-card, .cert-official-card, .skill-group-card, .timeline-item');
  tiltCards.forEach((card) => {
    card.classList.add('card-depth-3d');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.028, 1.028, 1.028)`;

      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.22) 0%, rgba(0, 240, 255, 0.08) 35%, transparent 70%)`;
      }

      // Parallax child layers
      const icon = card.querySelector('.skill-group-icon, .project-icon, .cert-badge-ribbon, .tab-lang-icon');
      if (icon) {
        icon.style.transform = `translateZ(35px) translate(${(x - centerX) * 0.05}px, ${(y - centerY) * 0.05}px)`;
      }
      const title = card.querySelector('.project-title, .skill-group-title, .cert-title');
      if (title) {
        title.style.transform = `translateZ(20px) translate(${(x - centerX) * 0.025}px, ${(y - centerY) * 0.025}px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.background = 'transparent';

      const icon = card.querySelector('.skill-group-icon, .project-icon, .cert-badge-ribbon, .tab-lang-icon');
      if (icon) icon.style.transform = 'translateZ(0px) translate(0px, 0px)';
      const title = card.querySelector('.project-title, .skill-group-title, .cert-title');
      if (title) title.style.transform = 'translateZ(0px) translate(0px, 0px)';
    });
  });

  /* =========================================================================
     3.5. CYBER TEXT SCRAMBLE DECRYPTION ANIMATION (With Sound & Chromatic Glitch)
     ========================================================================= */
  class CyberScrambler {
    constructor() {
      this.chars = '!<>-_\\/[]{}—=+*^?#01αβγλ∑∏∂∆∇0x9F⚡⚛❯';
    }

    scramble(element, customText = null, duration = 650) {
      if (!element || element.dataset.scrambling === 'true') return;
      element.dataset.scrambling = 'true';
      element.classList.add('glitch-active');

      const originalText = customText || element.innerText;
      const length = originalText.length;
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const resolvedChars = Math.floor(progress * length);

        let output = '';
        for (let i = 0; i < length; i++) {
          if (i < resolvedChars) {
            output += originalText[i];
          } else if (originalText[i] === ' ' || originalText[i] === '\n') {
            output += originalText[i];
          } else {
            output += this.chars[Math.floor(Math.random() * this.chars.length)];
          }
        }

        element.innerText = output;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.innerText = originalText;
          element.dataset.scrambling = 'false';
          element.classList.remove('glitch-active');
        }
      };

      update();
    }
  }

  const scrambler = new CyberScrambler();

  // Attach hover scramble to all section headers, badges, and code items
  document.querySelectorAll('.section-title, .logo-text, .badge, .project-title, .cyber-scramble').forEach(el => {
    el.addEventListener('mouseenter', () => {
      sound.hover();
      scrambler.scramble(el);
    });
  });

  /* =========================================================================
     3.8. NUMERICAL COUNT-UP ENGINE WITH SPRING EASING
     ========================================================================= */
  function animateCounter(el, start, end, duration = 1800, suffix = '', prefix = '', decimals = 0) {
    const startTime = performance.now();
    el.classList.add('count-up-animated');

    function easeOutExpo(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = easeOutExpo(progress);
      const current = start + (end - start) * easeVal;

      if (decimals > 0) {
        el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
      } else {
        el.textContent = `${prefix}${Math.round(current)}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (decimals > 0) {
          el.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
        } else {
          el.textContent = `${prefix}${Math.round(end)}${suffix}`;
        }
        el.classList.add('count-up-highlight');
        setTimeout(() => el.classList.remove('count-up-highlight'), 450);
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        // Check if already parsed or has data-counter
        if (el.dataset.counted === 'true') return;
        el.dataset.counted = 'true';

        // Parse patterns like "100+", "9.12", "100%", "450+", "12+"
        const matchDecimal = text.match(/^(\D*)(\d+\.\d+)(\D*)$/);
        const matchInt = text.match(/^(\D*)(\d+)(\D*)$/);

        if (matchDecimal) {
          const prefix = matchDecimal[1];
          const val = parseFloat(matchDecimal[2]);
          const suffix = matchDecimal[3];
          animateCounter(el, 0, val, 1600, suffix, prefix, 2);
        } else if (matchInt) {
          const prefix = matchInt[1];
          const val = parseInt(matchInt[2], 10);
          const suffix = matchInt[3];
          animateCounter(el, 0, val, 1500, suffix, prefix, 0);
        }

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.metric-val, .cgpa-val, .highlight-stat, [data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  /* =========================================================================
     4. TYPEWRITER & LIVE KOLKATA CLOCK
     ========================================================================= */
  const typewriterElement = document.getElementById('typewriterText');
  const roles = [
    'Software Developer',
    'Tech Innovator',
    'C++ & Python Coder',
    'DSA Problem Solver',
    'Bharatnatyam Classical Artist',
    'B-Tech CSE at FIEM'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function typeRole() {
    if (!typewriterElement) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeRole, typeSpeed);
  }
  typeRole();

  // Kolkata Live Clock
  const localTimeBadge = document.getElementById('localTimeBadge');
  function updateKolkataTime() {
    if (!localTimeBadge) return;
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeStr = new Intl.DateTimeFormat([], options).format(new Date());
    localTimeBadge.textContent = `${timeStr} IST`;
  }
  updateKolkataTime();
  setInterval(updateKolkataTime, 1000);

  /* =========================================================================
     5. HOLOGRAPHIC CODE RUNNER TERMINAL
     ========================================================================= */
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const runCodeBtn = document.getElementById('runCodeBtn');
  const consoleBody = document.getElementById('consoleBody');
  const consoleStatus = document.getElementById('consoleStatus');

  let activeTab = 'python';

  terminalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      sound.click();
      const targetTab = tab.getAttribute('data-tab');
      activeTab = targetTab;

      terminalTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      tabContents.forEach(content => content.classList.remove('active'));
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) activeContent.classList.add('active');

      if (consoleBody) {
        consoleBody.innerHTML = `<span class="console-text">&gt; Buffer switched to [${targetTab}]. Ready to execute.</span>`;
      }
    });
  });

  const simulatedOutputs = {
    python: [
      '&gt; Compiling rachana.py with Python 3.12 Virtual Runtime...',
      '&gt; [INFO] Instantiating SoftwareInnovator(name="Rachana Behera", college="FIEM")',
      '&gt; [SUCCESS] Rachana Behera: Building resilient systems & digital collaboration!',
      '&gt; Process exited with code 0. (Execution Time: 12ms)'
    ],
    cpp: [
      '&gt; g++ -O3 dsa_solver.cpp -o dsa_solver &amp;&amp; ./dsa_solver',
      '&gt; [BFS] Initializing Graph Queue & Adjacency List...',
      '&gt; [TRAVERSAL] Visited Nodes: Binary Tree -&gt; Graph BFS -&gt; Dynamic Programming',
      '&gt; [STATUS] Memory allocation: 0 leaks. Big-O Complexity: O(V + E)'
    ],
    fastapi: [
      '&gt; uvicorn service:app --host 0.0.0.0 --port 8000 --reload',
      '&gt; [INFO] Application startup complete. Docs available at /docs',
      '&gt; GET /api/v1/metrics -&gt; 200 OK {"status": "Operational", "velocity": "High", "latency": "8ms"}'
    ],
    rhythm: [
      '&gt; ts-node taala.ts --cycle=AdiTaala',
      '&gt; [TAALA] 8-beat metric initialized: [1-Laghu, 2-Finger, 3-Finger, 4-Finger, 5-Drutam, 6-Wave, 7-Drutam, 8-Wave]',
      '&gt; [SYNC] Taala sequence synced with 8 state transitions.',
      '&gt; Harmonics matched modulo 8.'
    ]
  };

  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
      sound.success();
      if (consoleStatus) consoleStatus.textContent = 'Running...';
      if (consoleBody) {
        consoleBody.innerHTML = '<span class="console-text">&gt; Executing virtual sandbox...</span>';
      }

      const lines = simulatedOutputs[activeTab] || simulatedOutputs.python;
      let lineIdx = 0;

      const interval = setInterval(() => {
        if (lineIdx < lines.length) {
          const p = document.createElement('div');
          p.className = 'console-text';
          p.innerHTML = lines[lineIdx];
          consoleBody.appendChild(p);
          lineIdx++;
        } else {
          clearInterval(interval);
          if (consoleStatus) consoleStatus.textContent = 'Done';
        }
      }, 200);
    });
  }

  /* =========================================================================
     6. LIVE ALGORITHM VISUALIZER LAB
     ========================================================================= */
  const visualizerStage = document.getElementById('visualizerStage');
  const startVisualizerBtn = document.getElementById('startVisualizerBtn');
  const resetVisualizerBtn = document.getElementById('resetVisualizerBtn');
  const algoSelect = document.getElementById('algoSelect');
  const visComparisons = document.getElementById('visComparisons');
  const visSwaps = document.getElementById('visSwaps');
  const visStatus = document.getElementById('visStatus');
  const algoDescription = document.getElementById('algoDescription');

  let arrayData = [];
  let isSorting = false;

  const descriptions = {
    bubble: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Time Complexity: O(N²).',
    quick: 'Quick Sort is a Divide-and-Conquer algorithm. It selects a pivot element and partitions the array so elements smaller than the pivot are on the left. Time Complexity: O(N log N).',
    insertion: 'Insertion Sort builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position. Time Complexity: O(N²).'
  };

  function generateRandomArray(size = 14) {
    arrayData = [];
    for (let i = 0; i < size; i++) {
      arrayData.push(Math.floor(Math.random() * 85) + 15);
    }
    renderVisualizerBars();
    if (visComparisons) visComparisons.textContent = '0';
    if (visSwaps) visSwaps.textContent = '0';
    if (visStatus) visStatus.textContent = 'Idle';
  }

  function renderVisualizerBars(highlightIndices = {}, sortedIndices = []) {
    if (!visualizerStage) return;
    visualizerStage.innerHTML = '';

    arrayData.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'vis-bar';
      bar.style.height = `${val * 2.2}px`;

      if (highlightIndices.comparing && highlightIndices.comparing.includes(idx)) {
        bar.classList.add('comparing');
      }
      if (highlightIndices.swapping && highlightIndices.swapping.includes(idx)) {
        bar.classList.add('swapping');
      }
      if (sortedIndices.includes(idx)) {
        bar.classList.add('sorted');
      }

      const num = document.createElement('span');
      num.className = 'vis-bar-num';
      num.textContent = val;
      bar.appendChild(num);

      visualizerStage.appendChild(bar);
    });
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function bubbleSort() {
    isSorting = true;
    let comparisons = 0, swaps = 0;
    const n = arrayData.length;
    const sorted = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isSorting) return;

        comparisons++;
        if (visComparisons) visComparisons.textContent = comparisons;
        renderVisualizerBars({ comparing: [j, j + 1] }, sorted);
        sound.click();
        await sleep(120);

        if (arrayData[j] > arrayData[j + 1]) {
          swaps++;
          if (visSwaps) visSwaps.textContent = swaps;
          const temp = arrayData[j];
          arrayData[j] = arrayData[j + 1];
          arrayData[j + 1] = temp;
          renderVisualizerBars({ swapping: [j, j + 1] }, sorted);
          await sleep(120);
        }
      }
      sorted.push(n - i - 1);
    }

    renderVisualizerBars({}, arrayData.map((_, i) => i));
    if (visStatus) visStatus.textContent = 'Sorted!';
    sound.success();
    isSorting = false;
  }

  async function insertionSort() {
    isSorting = true;
    let comparisons = 0, swaps = 0;
    const n = arrayData.length;

    for (let i = 1; i < n; i++) {
      let key = arrayData[i];
      let j = i - 1;

      while (j >= 0 && arrayData[j] > key) {
        if (!isSorting) return;
        comparisons++;
        swaps++;
        if (visComparisons) visComparisons.textContent = comparisons;
        if (visSwaps) visSwaps.textContent = swaps;

        arrayData[j + 1] = arrayData[j];
        renderVisualizerBars({ swapping: [j, j + 1] });
        sound.click();
        await sleep(130);
        j = j - 1;
      }
      arrayData[j + 1] = key;
    }

    renderVisualizerBars({}, arrayData.map((_, i) => i));
    if (visStatus) visStatus.textContent = 'Sorted!';
    sound.success();
    isSorting = false;
  }

  if (algoSelect) {
    algoSelect.addEventListener('change', () => {
      sound.click();
      const val = algoSelect.value;
      if (algoDescription) algoDescription.textContent = descriptions[val] || '';
    });
  }

  if (startVisualizerBtn) {
    startVisualizerBtn.addEventListener('click', async () => {
      if (isSorting) return;
      sound.click();
      if (visStatus) visStatus.textContent = 'Sorting...';

      const algo = algoSelect ? algoSelect.value : 'bubble';
      if (algo === 'bubble') await bubbleSort();
      else if (algo === 'insertion') await insertionSort();
      else await bubbleSort(); // fallback
    });
  }

  if (resetVisualizerBtn) {
    resetVisualizerBtn.addEventListener('click', () => {
      sound.click();
      isSorting = false;
      generateRandomArray();
    });
  }

  generateRandomArray();

  /* =========================================================================
     7. BHARATNATYAM TAALA PLAYER & REAL-TIME AUDIO OSCILLOSCOPE
     ========================================================================= */
  const playTaalaBtn = document.getElementById('playTaalaBtn');
  const stopTaalaBtn = document.getElementById('stopTaalaBtn');
  const taalaBeats = document.querySelectorAll('.taala-beat');
  const oscStatus = document.getElementById('oscStatus');
  const oscCanvas = document.getElementById('taalaOscilloscopeCanvas');
  const waveOptBtns = document.querySelectorAll('.wave-opt-btn');

  let taalaInterval = null;
  let currentBeat = 0;
  let currentWaveform = 'sine';
  let oscAnimId = null;
  let oscPhase = 0;
  let oscAmplitude = 0;
  let isTaalaPlaying = false;

  waveOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.click();
      waveOptBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWaveform = btn.getAttribute('data-wave') || 'sine';
      showToast(`Oscilloscope Synth Wave: ${currentWaveform.toUpperCase()}`);
    });
  });

  function drawOscilloscope() {
    if (!oscCanvas) return;
    const ctx = oscCanvas.getContext('2d');
    const width = oscCanvas.width = oscCanvas.offsetWidth || 460;
    const height = oscCanvas.height = oscCanvas.offsetHeight || 75;

    ctx.clearRect(0, 0, width, height);

    // Background Cyber Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x += 30) {
      ctx.moveTo(x, 0); ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 15) {
      ctx.moveTo(0, y); ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Center Baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dynamic Waveform
    const targetAmp = isTaalaPlaying ? 24 : 4;
    oscAmplitude += (targetAmp - oscAmplitude) * 0.1;
    oscPhase += isTaalaPlaying ? 0.08 : 0.02;

    ctx.lineWidth = 2.5;
    const isLaghuAccent = isTaalaPlaying && currentBeat === 1;
    ctx.strokeStyle = isLaghuAccent ? '#ff0055' : (isTaalaPlaying ? '#00f0ff' : '#6366f1');
    ctx.shadowBlur = isTaalaPlaying ? 12 : 4;
    ctx.shadowColor = isLaghuAccent ? '#ff0055' : '#00f0ff';

    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const normalizedX = (x / width) * Math.PI * 6;
      let yOffset = 0;

      if (currentWaveform === 'sine') {
        yOffset = Math.sin(normalizedX + oscPhase) * oscAmplitude + 
                  Math.sin(normalizedX * 2 - oscPhase * 1.5) * (oscAmplitude * 0.35);
      } else if (currentWaveform === 'triangle') {
        const val = ((normalizedX + oscPhase) % (Math.PI * 2)) / (Math.PI * 2);
        yOffset = (val < 0.5 ? (val * 4 - 1) : ((1 - val) * 4 - 1)) * oscAmplitude;
      } else if (currentWaveform === 'square') {
        yOffset = (Math.sin(normalizedX + oscPhase) >= 0 ? 1 : -1) * oscAmplitude * 0.8;
      }

      const y = height / 2 + yOffset;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    oscAnimId = requestAnimationFrame(drawOscilloscope);
  }

  // Start continuous render
  drawOscilloscope();

  function stepTaalaBeat() {
    taalaBeats.forEach(b => b.classList.remove('active'));
    
    currentBeat = (currentBeat % 8) + 1;
    const activeEl = document.querySelector(`.taala-beat[data-beat="${currentBeat}"]`);
    if (activeEl) activeEl.classList.add('active');

    // Accent beat 1 (Laghu)
    const isAccent = currentBeat === 1;
    sound.beat(isAccent);

    if (oscStatus) {
      oscStatus.textContent = `BEAT ${currentBeat}/8 • ${isAccent ? 'LAGHU (ACCENT)' : 'DRUTAM'}`;
      oscStatus.style.color = isAccent ? 'var(--accent-pink)' : 'var(--accent-cyan)';
    }
  }

  if (playTaalaBtn) {
    playTaalaBtn.addEventListener('click', () => {
      sound.click();
      if (taalaInterval) clearInterval(taalaInterval);
      isTaalaPlaying = true;
      currentBeat = 0;
      stepTaalaBeat();
      taalaInterval = setInterval(stepTaalaBeat, 500); // 120 BPM
      showToast('Playing Adi Taala (8-Beat Metric Loop)');
      if (oscStatus) oscStatus.textContent = 'TRANSMITTING HARMONICS';
    });
  }

  if (stopTaalaBtn) {
    stopTaalaBtn.addEventListener('click', () => {
      sound.click();
      isTaalaPlaying = false;
      if (taalaInterval) {
        clearInterval(taalaInterval);
        taalaInterval = null;
      }
      taalaBeats.forEach(b => b.classList.remove('active'));
      const first = document.querySelector('.taala-beat[data-beat="1"]');
      if (first) first.classList.add('active');
      if (oscStatus) {
        oscStatus.textContent = 'STANDBY';
        oscStatus.style.color = 'var(--accent-cyan)';
      }
    });
  }

  /* =========================================================================
     8. PROJECT FILTERING & LIGHTBOX MODAL
     ========================================================================= */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.click();
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Data
  const projectModalData = {
    neuroflow: {
      courseCode: 'PCC-CS301',
      courseTitle: 'Data Structures & Algorithms (DSA)',
      semester: '3rd Semester B-Tech CSE',
      category: 'Python • FastAPI • DSA Tree Visualizer',
      title: 'NeuroFlow – Intelligent DSA Assistant',
      desc: 'NeuroFlow is designed to bridge the cognitive gap when learning complex data structures and graph algorithms. It accepts algorithmic problem statements in Python/C++, builds a visual recursion tree, and benchmarks time and space complexity with deterministic execution trace logs.',
      imgSvg: `
        <svg viewBox="0 0 600 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#090e18;display:block;">
          <defs>
            <linearGradient id="aiGradModal1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00f0ff"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
          </defs>
          <g stroke="#16233b" stroke-width="1" opacity="0.6">
            <line x1="0" y1="50" x2="600" y2="50"/><line x1="0" y1="110" x2="600" y2="110"/><line x1="0" y1="170" x2="600" y2="170"/>
            <line x1="120" y1="0" x2="120" y2="240"/><line x1="240" y1="0" x2="240" y2="240"/><line x1="360" y1="0" x2="360" y2="240"/><line x1="480" y1="0" x2="480" y2="240"/>
          </g>
          <path d="M300 40 L160 110 L90 180" stroke="#00f0ff" stroke-width="2.5" stroke-dasharray="6,4"/>
          <path d="M300 40 L160 110 L230 180" stroke="#00f0ff" stroke-width="2.5" stroke-dasharray="6,4"/>
          <path d="M300 40 L440 110 L370 180" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="6,4"/>
          <path d="M300 40 L440 110 L510 180" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="6,4"/>
          <circle cx="300" cy="40" r="22" fill="url(#aiGradModal1)"/>
          <text x="300" y="46" fill="#07090e" font-size="12" font-weight="bold" text-anchor="middle">Root</text>
          <circle cx="160" cy="110" r="17" fill="#00f0ff"/>
          <text x="160" y="115" fill="#07090e" font-size="11" font-weight="bold" text-anchor="middle">Left</text>
          <circle cx="440" cy="110" r="17" fill="#6366f1"/>
          <text x="440" y="115" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Right</text>
          <circle cx="90" cy="180" r="13" fill="#10b981"/>
          <circle cx="230" cy="180" r="13" fill="#f59e0b"/>
          <circle cx="370" cy="180" r="13" fill="#38bdf8"/>
          <circle cx="510" cy="180" r="13" fill="#ec4899"/>
          <text x="300" y="222" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="10" text-anchor="middle">Recursion Stack: Depth=4 | Big-O: O(N log N) | Memory: 4.8MB</text>
        </svg>
      `,
      features: [
        'Automatic Big-O polynomial and exponential complexity decomposition',
        'Interactive dynamic programming memoization table visualizer',
        'FastAPI asynchronous endpoints with sub-15ms response latency',
        'Integrated with Web Audio feedback for each recursive branch resolution'
      ],
      github: 'https://github.com/rachana-behera/neuroflow-assistant'
    },
    edusync: {
      courseCode: 'PCC-CS401',
      courseTitle: 'Database Management Systems (DBMS)',
      semester: '4th Semester B-Tech CSE',
      category: 'SQL Analysis • Spring Boot • Cohort Data Pipeline',
      title: 'EduSync – Engineering Cohort Analytics',
      desc: 'EduSync is an enterprise-grade academic data platform designed for engineering departments to track student performance, attendance patterns, and predictive exam readiness through optimized SQL queries and indexing architectures.',
      imgSvg: `
        <svg viewBox="0 0 600 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#070c17;display:block;">
          <rect x="25" y="20" width="550" height="200" rx="8" fill="#10192b" stroke="#22324f" stroke-width="1.5"/>
          <rect x="25" y="20" width="550" height="34" rx="8" fill="#18253e"/>
          <circle cx="45" cy="37" r="5" fill="#ef4444"/><circle cx="62" cy="37" r="5" fill="#f59e0b"/><circle cx="79" cy="37" r="5" fill="#10b981"/>
          <text x="300" y="42" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">SELECT cohort_id, AVG(score) OVER(PARTITION BY dept) FROM analytics;</text>
          <g transform="translate(40, 20)">
            <rect x="30" y="100" width="35" height="70" rx="4" fill="#00f0ff"/>
            <rect x="90" y="70" width="35" height="100" rx="4" fill="#6366f1"/>
            <rect x="150" y="50" width="35" height="120" rx="4" fill="#10b981"/>
            <rect x="210" y="80" width="35" height="90" rx="4" fill="#f59e0b"/>
            <rect x="270" y="40" width="35" height="130" rx="4" fill="#ec4899"/>
            <rect x="330" y="65" width="35" height="105" rx="4" fill="#38bdf8"/>
            <rect x="390" y="55" width="35" height="115" rx="4" fill="#a855f7"/>
            <rect x="450" y="75" width="35" height="95" rx="4" fill="#00f0ff"/>
            <path d="M47 100 Q 107 65, 167 45 T 287 35 T 407 50 T 467 70" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="4,2"/>
          </g>
        </svg>
      `,
      features: [
        'Complex SQL queries utilizing Window Functions, CTEs, and Partitioning',
        'Spring Boot backend handling multi-table relational schema queries',
        'Visual cohort grade distribution with dynamic quantile categorization',
        'Automated database indexing reducing average query time by 68%'
      ],
      github: 'https://github.com/rachana-behera/edusync-analytics'
    },
    algovisual: {
      courseCode: 'PCC-CS402',
      courseTitle: 'Design & Analysis of Algorithms (DAA)',
      semester: '4th Semester B-Tech CSE',
      category: 'C++ • Web Canvas • DSA Sandbox',
      title: 'AlgoVisual – Interactive Algorithmic Playground',
      desc: 'AlgoVisual brings foundational Computer Science algorithms to life through interactive 60fps HTML5 Canvas animations. Users can step forward, step backward, adjust execution speed, and test custom input arrays to inspect comparisons and swaps in real time.',
      imgSvg: `
        <svg viewBox="0 0 600 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#080c16;display:block;">
          <rect x="25" y="15" width="550" height="210" rx="8" fill="#0f172a" stroke="#1e293b"/>
          <g transform="translate(30, 35)">
            <rect x="20" y="100" width="22" height="60" rx="3" fill="#475569"/>
            <rect x="55" y="75" width="22" height="85" rx="3" fill="#475569"/>
            <rect x="90" y="115" width="22" height="45" rx="3" fill="#ef4444"/>
            <rect x="125" y="45" width="22" height="115" rx="3" fill="#10b981"/>
            <rect x="160" y="90" width="22" height="70" rx="3" fill="#475569"/>
            <rect x="195" y="30" width="22" height="130" rx="3" fill="#00f0ff"/>
            <rect x="230" y="105" width="22" height="55" rx="3" fill="#475569"/>
            <rect x="265" y="60" width="22" height="100" rx="3" fill="#6366f1"/>
            <rect x="300" y="75" width="22" height="85" rx="3" fill="#475569"/>
            <rect x="335" y="20" width="22" height="140" rx="3" fill="#ec4899"/>
            <rect x="370" y="120" width="22" height="40" rx="3" fill="#f59e0b"/>
            <rect x="405" y="40" width="22" height="120" rx="3" fill="#475569"/>
            <rect x="440" y="65" width="22" height="95" rx="3" fill="#38bdf8"/>
            <rect x="475" y="85" width="22" height="75" rx="3" fill="#475569"/>
          </g>
          <polygon points="171,205 161,220 181,220" fill="#00f0ff"/>
          <polygon points="241,205 231,220 251,220" fill="#ec4899"/>
          <text x="300" y="220" fill="#94a3b8" font-size="11" font-family="'Fira Code', monospace" text-anchor="middle">QuickSort Step: Pivot [i=4, j=7] Swapped</text>
        </svg>
      `,
      features: [
        'Interactive Sorting: QuickSort, MergeSort, HeapSort, and BubbleSort',
        'Graph Traversal: Breadth-First Search (BFS), Depth-First Search (DFS)',
        'Dijkstra Shortest Path Finder with interactive grid barrier creation',
        'Clean C++ source code references embedded with STL explanations'
      ],
      github: 'https://github.com/rachana-behera/algovisual-playground'
    },
    cybervault: {
      courseCode: 'PCC-CS302',
      courseTitle: 'Object-Oriented Programming & Systems (OOP)',
      semester: '3rd Semester B-Tech CSE',
      category: 'C++ • Cryptography • OOP Systems',
      title: 'CyberVault – Secure File Encryptor',
      desc: 'A robust Object-Oriented cryptographic suite in C++ utilizing AES-256 block ciphers, PBKDF2 key derivation, and RAII memory safety patterns for zero-leak file security and polymorphic key vaults.',
      imgSvg: `
        <svg viewBox="0 0 600 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0a0f1d;display:block;">
          <rect x="25" y="20" width="550" height="200" rx="8" fill="#131e36" stroke="#253557" stroke-width="1.5"/>
          <g transform="translate(240, 45)">
            <polygon points="60,5 110,32 110,90 60,118 10,90 10,32" fill="#10192e" stroke="#00f0ff" stroke-width="2"/>
            <circle cx="60" cy="60" r="30" fill="#09101f" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4,2"/>
            <rect x="46" y="52" width="28" height="22" rx="3" fill="#00f0ff"/>
            <path d="M52 52 V44 A8 8 0 0 1 68 44 V52" fill="none" stroke="#00f0ff" stroke-width="3"/>
            <circle cx="60" cy="62" r="2.5" fill="#07090e"/>
          </g>
          <g font-family="'Fira Code', monospace" font-size="10" fill="#64748b">
            <text x="55" y="70">CIPHER: AES-256-CBC</text>
            <text x="55" y="100">KEY_DERIV: PBKDF2</text>
            <text x="55" y="130">HASH: SHA-256</text>
            <text x="55" y="160">BUFFERS: RAII_PTR</text>

            <text x="420" y="70">STATUS: VERIFIED</text>
            <text x="420" y="100">LEAKS: 0 BYTES</text>
            <text x="420" y="130">TIME: 2.4ms</text>
            <text x="420" y="160">POLYMORPHIC: YES</text>
          </g>
          <text x="300" y="205" fill="#10b981" font-family="'Fira Code', monospace" font-size="10" text-anchor="middle">&gt; Encrypted Payload Checksum Validated (SHA-256)</text>
        </svg>
      `,
      features: [
        'Pure C++17 implementation with RAII smart pointers and strict destructor management',
        'AES-256 CBC cipher mode with PKCS#7 padding and dynamic IV generation',
        'PBKDF2 key derivation from user master passphrase with 100,000 hashing rounds',
        'Polymorphic KeyVault interface allowing extensible backend token storage'
      ],
      github: 'https://github.com/rachana-behera/cybervault-cpp'
    },
    kernelsim: {
      courseCode: 'PCC-CS501',
      courseTitle: 'Operating Systems & Virtual Memory (OS)',
      semester: '5th Semester B-Tech CSE',
      category: 'Systems • CPU Scheduling • Memory Paging',
      title: 'KernelSim – OS Process & Memory Simulator',
      desc: 'A visual operating system kernel simulator rendering live Gantt execution charts for Round-Robin, SJF, and Multilevel Feedback Queues alongside LRU virtual memory page fault analyses.',
      imgSvg: `
        <svg viewBox="0 0 600 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0a0c16;display:block;">
          <rect x="25" y="20" width="550" height="200" rx="8" fill="#111728" stroke="#243352" stroke-width="1.5"/>
          <g transform="translate(45, 50)">
            <rect x="0" y="0" width="110" height="42" rx="4" fill="#00f0ff"/>
            <text x="55" y="26" fill="#07090e" font-family="'Fira Code', monospace" font-size="11" font-weight="bold" text-anchor="middle">P1 (RR 4ms)</text>

            <rect x="120" y="0" width="140" height="42" rx="4" fill="#6366f1"/>
            <text x="190" y="26" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" font-weight="bold" text-anchor="middle">P2 (SJF 6ms)</text>

            <rect x="270" y="0" width="90" height="42" rx="4" fill="#ec4899"/>
            <text x="315" y="26" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" font-weight="bold" text-anchor="middle">P3 (4ms)</text>

            <rect x="370" y="0" width="140" height="42" rx="4" fill="#10b981"/>
            <text x="440" y="26" fill="#07090e" font-family="'Fira Code', monospace" font-size="11" font-weight="bold" text-anchor="middle">P4 (Priority)</text>
          </g>
          <g transform="translate(45, 125)">
            <text x="0" y="18" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="10">LRU Frames:</text>
            <rect x="100" y="0" width="60" height="28" rx="3" fill="#1e293b" stroke="#00f0ff"/>
            <text x="130" y="19" fill="#00f0ff" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">Page 4</text>
            <rect x="175" y="0" width="60" height="28" rx="3" fill="#1e293b" stroke="#6366f1"/>
            <text x="205" y="19" fill="#6366f1" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">Page 1</text>
            <rect x="250" y="0" width="60" height="28" rx="3" fill="#1e293b" stroke="#ec4899"/>
            <text x="280" y="19" fill="#ec4899" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">Page 7</text>
            <rect x="330" y="0" width="110" height="28" rx="3" fill="#065f46"/>
            <text x="385" y="19" fill="#34d399" font-family="'Fira Code', monospace" font-size="10" text-anchor="middle">HIT RATIO: 94%</text>
          </g>
          <text x="300" y="195" fill="#f59e0b" font-family="'Fira Code', monospace" font-size="10" text-anchor="middle">&gt; Context Switch Latency: 1.2μs | Turnaround Avg: 11.4ms</text>
        </svg>
      `,
      features: [
        'Real-time interactive Gantt chart for Preemptive and Non-Preemptive algorithms',
        'Simulates Round Robin, Shortest Job First (SJF), Priority, and FCFS',
        'Virtual memory page replacement engine comparing LRU, FIFO, and Optimal algorithms',
        'Resource Allocation Graph (RAG) deadlock detection using Banker’s algorithm'
      ],
      github: 'https://github.com/rachana-behera/kernelsim-os'
    },
    rhythmcode: {
      courseCode: 'OEC-CS601',
      courseTitle: 'Computational Aesthetics & Audio Computing',
      semester: 'Open Elective & Interdisciplinary',
      category: 'Web Audio API • TypeScript • Creative Computing',
      title: 'RhythmCode – Taala Math Generator',
      desc: 'RhythmCode is an interdisciplinary experiment that translates Indian Classical Bharatnatyam Taala cycles (rhythmic metrics) into mathematical state machines, visual mandalas, and synthesizer tones using the Web Audio API.',
      imgSvg: `
        <svg viewBox="0 0 600 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#120919;display:block;">
          <g transform="translate(100, 10)">
            <circle cx="200" cy="110" r="85" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            <circle cx="200" cy="110" r="55" fill="none" stroke="#00f0ff" stroke-width="2" stroke-dasharray="4,2"/>
            <circle cx="200" cy="110" r="28" fill="none" stroke="#6366f1" stroke-width="2"/>
            
            <circle cx="200" cy="25" r="9" fill="#00f0ff"/>
            <circle cx="260" cy="50" r="9" fill="#ec4899"/>
            <circle cx="285" cy="110" r="9" fill="#00f0ff"/>
            <circle cx="260" cy="170" r="9" fill="#ec4899"/>
            <circle cx="200" cy="195" r="9" fill="#00f0ff"/>
            <circle cx="140" cy="170" r="9" fill="#ec4899"/>
            <circle cx="115" cy="110" r="9" fill="#00f0ff"/>
            <circle cx="140" cy="50" r="9" fill="#ec4899"/>

            <text x="200" y="115" fill="#f8fafc" font-size="12" font-family="'Space Grotesk', sans-serif" font-weight="bold" text-anchor="middle">Adi Taala</text>
          </g>
        </svg>
      `,
      features: [
        'Synthesizer rhythm engine for Adi Taala, Rupaka Taala, and Misra Chapu',
        'Interactive circular canvas mandala mapping beats to binary cycles',
        'Demonstrates state machine transitions and modulo arithmetic in computing',
        'Bridging artistic discipline with algorithmic rigor'
      ],
      github: 'https://github.com/rachana-behera/rhythm-code'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openProjectModal(projectId) {
    const data = projectModalData[projectId];
    if (!data || !modalBody || !projectModal) return;
    sound.click();

    modalBody.innerHTML = `
      <div class="modal-course-badge-box">
        <span class="modal-course-code">${data.courseCode}</span>
        <span class="modal-course-title">${data.courseTitle}</span>
        <span class="modal-course-dept">(${data.semester})</span>
      </div>

      <div class="modal-project-img-box">
        ${data.imgSvg}
      </div>

      <div class="modal-category">${data.category}</div>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-text">${data.desc}</p>
      
      <h3 class="modal-section-title">Key Architectural Features:</h3>
      <ul class="modal-features-list">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <div class="modal-actions">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-magnetic">
          <span>View Source on GitHub</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <button class="btn btn-secondary btn-magnetic" id="modalDismissBtn">
          <span>Close Window</span>
        </button>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const dismissBtn = document.getElementById('modalDismissBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeProjectModal);
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;
    sound.click();
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-modal-target');
      openProjectModal(target);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  /* =========================================================================
     8.5. CERTIFICATE INSPECTION MODAL
     ========================================================================= */
  const certModal = document.getElementById('certificateModal');
  const certModalCloseBtn = document.getElementById('certModalCloseBtn');
  const printCertBtn = document.getElementById('printCertBtn');

  function openCertificateModal() {
    if (!certModal) return;
    sound.hover();
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertificateModal() {
    if (!certModal) return;
    sound.click();
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-cert="true"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openCertificateModal();
    });
  });

  if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertificateModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertificateModal();
    });
  }

  if (printCertBtn) {
    printCertBtn.addEventListener('click', () => {
      sound.click();
      window.print();
    });
  }

  /* =========================================================================
     8.5 PROFILE PHOTO & DEVELOPER IDENTITY MODAL & AVATAR MANAGER
     ========================================================================= */
  const profilePhotoModal = document.getElementById('profilePhotoModal');
  const profileModalCloseBtn = document.getElementById('profileModalCloseBtn');
  const heroAvatarTrigger = document.getElementById('heroAvatarTrigger');
  const navAvatarBtn = document.getElementById('navAvatarBtn');
  const aboutProfileAvatar = document.getElementById('aboutProfileAvatar');
  const inspectPortraitModalBtn = document.getElementById('inspectPortraitModalBtn');
  const profileModalContactBtn = document.getElementById('profileModalContactBtn');
  const profilePhotoUploadInput = document.getElementById('profilePhotoUploadInput');
  const triggerUploadPhotoBtn = document.getElementById('triggerUploadPhotoBtn');
  const resetProfilePhotoBtn = document.getElementById('resetProfilePhotoBtn');
  const profileModalDropZone = document.getElementById('profileModalDropZone');
  const downloadProfilePhotoBtn = document.getElementById('downloadProfilePhotoBtn');

  const DEFAULT_PROFILE_PHOTO = '/assets/rachana-profile.jpg';

  function applyProfilePhoto(photoUrl, isCustom = false) {
    const avatarImages = document.querySelectorAll('.hero-avatar-thumb img, .portrait-photo-main, .profile-avatar-img, .profile-modal-img, .nav-avatar-thumb-img');
    avatarImages.forEach(img => {
      img.src = photoUrl;
    });

    if (downloadProfilePhotoBtn) {
      downloadProfilePhotoBtn.href = photoUrl;
    }

    if (resetProfilePhotoBtn) {
      resetProfilePhotoBtn.style.display = isCustom ? 'inline-flex' : 'none';
    }
  }

  // Load saved custom avatar from storage if present
  const savedCustomAvatar = localStorage.getItem('rb_custom_profile_avatar');
  if (savedCustomAvatar) {
    applyProfilePhoto(savedCustomAvatar, true);
  }

  function handleFileSelected(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      try {
        localStorage.setItem('rb_custom_profile_avatar', dataUrl);
        applyProfilePhoto(dataUrl, true);
        sound.success();
        showToast('Profile photo updated successfully!');
      } catch (err) {
        applyProfilePhoto(dataUrl, true);
        showToast('Profile photo applied for current session');
      }
    };
    reader.readAsDataURL(file);
  }

  if (triggerUploadPhotoBtn && profilePhotoUploadInput) {
    triggerUploadPhotoBtn.addEventListener('click', () => {
      sound.click();
      profilePhotoUploadInput.click();
    });

    profilePhotoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFileSelected(file);
    });
  }

  if (resetProfilePhotoBtn) {
    resetProfilePhotoBtn.addEventListener('click', () => {
      sound.click();
      localStorage.removeItem('rb_custom_profile_avatar');
      applyProfilePhoto(DEFAULT_PROFILE_PHOTO, false);
      showToast('Profile photo restored to default');
    });
  }

  // Drag and Drop on modal photo card
  if (profileModalDropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      profileModalDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        profileModalDropZone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      profileModalDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        profileModalDropZone.classList.remove('drag-over');
      }, false);
    });

    profileModalDropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handleFileSelected(file);
    });
  }

  function openProfilePhotoModal() {
    if (!profilePhotoModal) return;
    sound.hover();
    profilePhotoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProfilePhotoModal() {
    if (!profilePhotoModal) return;
    sound.click();
    profilePhotoModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (heroAvatarTrigger) heroAvatarTrigger.addEventListener('click', openProfilePhotoModal);
  if (navAvatarBtn) navAvatarBtn.addEventListener('click', openProfilePhotoModal);
  if (aboutProfileAvatar) aboutProfileAvatar.addEventListener('click', openProfilePhotoModal);
  if (inspectPortraitModalBtn) inspectPortraitModalBtn.addEventListener('click', openProfilePhotoModal);
  if (profileModalCloseBtn) profileModalCloseBtn.addEventListener('click', closeProfilePhotoModal);
  if (profileModalContactBtn) profileModalContactBtn.addEventListener('click', () => {
    closeProfilePhotoModal();
  });

  if (profilePhotoModal) {
    profilePhotoModal.addEventListener('click', (e) => {
      if (e.target === profilePhotoModal) closeProfilePhotoModal();
    });
  }

  /* =========================================================================
     8.6 SKILL PICTURE GALLERY, REAL CAPTURE UPLOADER & LIGHTBOX INSPECTOR
     ========================================================================= */
  const skillGalleryGrid = document.getElementById('skillGalleryGrid');
  const skillsVisualGallery = document.getElementById('skillsVisualGallery');
  const galleryDragOverlay = document.getElementById('galleryDragOverlay');
  const totalCapturesCount = document.getElementById('totalCapturesCount');
  const customCapturesCount = document.getElementById('customCapturesCount');
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');

  // Lightbox Modal elements
  const skillPhotoModal = document.getElementById('skillPhotoModal');
  const skillPhotoModalCloseBtn = document.getElementById('skillPhotoModalCloseBtn');
  const skillModalImg = document.getElementById('skillModalImg');
  const skillModalCatBadge = document.getElementById('skillModalCatBadge');
  const skillModalDiscipline = document.getElementById('skillModalDiscipline');
  const skillModalTitle = document.getElementById('skillModalTitle');
  const skillModalExif = document.getElementById('skillModalExif');
  const skillModalDesc = document.getElementById('skillModalDesc');
  const skillModalTags = document.getElementById('skillModalTags');
  const downloadSkillPhotoBtn = document.getElementById('downloadSkillPhotoBtn');
  const prevSkillPhotoBtn = document.getElementById('prevSkillPhotoBtn');
  const nextSkillPhotoBtn = document.getElementById('nextSkillPhotoBtn');
  const skillModalInquireBtn = document.getElementById('skillModalInquireBtn');
  const deleteCurrentCaptureBtn = document.getElementById('deleteCurrentCaptureBtn');

  // Upload Modal elements
  const uploadCaptureModal = document.getElementById('uploadCaptureModal');
  const uploadCaptureModalCloseBtn = document.getElementById('uploadCaptureModalCloseBtn');
  const openUploadCaptureModalBtn = document.getElementById('openUploadCaptureModalBtn');
  const cancelUploadCaptureBtn = document.getElementById('cancelUploadCaptureBtn');
  const uploadCaptureForm = document.getElementById('uploadCaptureForm');
  const uploadCaptureDropArea = document.getElementById('uploadCaptureDropArea');
  const captureFileInput = document.getElementById('captureFileInput');
  const uploadDropPlaceholder = document.getElementById('uploadDropPlaceholder');
  const uploadDropPreview = document.getElementById('uploadDropPreview');
  const capturePreviewImg = document.getElementById('capturePreviewImg');
  const removePreviewImgBtn = document.getElementById('removePreviewImgBtn');
  const captureTitleInput = document.getElementById('captureTitleInput');
  const captureCategorySelect = document.getElementById('captureCategorySelect');
  const captureExifInput = document.getElementById('captureExifInput');
  const captureTagsInput = document.getElementById('captureTagsInput');
  const captureDescInput = document.getElementById('captureDescInput');

  let currentSkillPhotoIndex = 0;
  let activeFilter = 'all';
  let stagedImageDataUrl = null;

  // Initial Seed Captures
  const defaultSkillCaptures = [
    {
      id: 'default-1',
      isCustom: false,
      category: 'photo',
      title: 'Golden Hour Architectural Photography',
      discipline: 'Photography & Visual Arts',
      img: '/assets/skill-photo-golden-hour.jpg',
      exif: 'f/1.8 • 1/500s • ISO 100 • 24mm Wide',
      desc: 'Mastering natural golden-hour illumination, leading perspective lines, and dynamic reflections across geometric modern structures.',
      tags: ['Rule of Thirds', 'Light Geometry', 'Dynamic Contrast', 'Visual Storytelling'],
      caption: 'Compositional framing with high dynamic range, shadow contrast, and perspective control.'
    },
    {
      id: 'default-2',
      isCustom: false,
      category: 'photo',
      title: 'Macro Nature & Dew Drop Optics',
      discipline: 'Photography & Visual Arts',
      img: '/assets/skill-photo-macro.jpg',
      exif: 'f/2.8 • 1/250s • ISO 200 • 90mm Macro',
      desc: 'Exploring minute organic details with shallow depth of field, creamy circular bokeh, and razor-sharp focal isolation.',
      tags: ['f/2.8', '1/250s', 'ISO 200', 'Shallow DOF'],
      caption: 'Shallow depth-of-field precision isolating water tension and surface textures.'
    },
    {
      id: 'default-3',
      isCustom: false,
      category: 'photo',
      title: 'Kolkata Heritage & Atmospheric Twilight',
      discipline: 'Photography & Visual Arts',
      img: '/assets/skill-photo-heritage.jpg',
      exif: 'f/2.0 • 1/60s • ISO 800 • 35mm Prime',
      desc: 'Atmospheric low-light street photography capturing colonial architecture, street lamps, and cobblestone reflections.',
      tags: ['f/2.0', '1/60s', 'ISO 800', 'Night Street'],
      caption: 'Low-light exposure balancing ambient street lighting with moody blue hour skies.'
    },
    {
      id: 'default-4',
      isCustom: false,
      category: 'dance',
      title: 'Classical Bharatnatyam Mudras & Stage Rhythm',
      discipline: 'Classical Performing Arts',
      img: '/assets/skill-dance-art.jpg',
      exif: 'Natyasastra • Adi Taala • Mudra Precision • 120 BPM',
      desc: 'Traditional hand Hastas/Mudras, rhythmic brass Ghungroos, and intricate discipline cultivating unwavering mental focus and spatial precision.',
      tags: ['Mudras', 'Adi Taala', 'Ghungroo', 'Stage Craft'],
      caption: 'Classical Indian dance geometry, Hastas, and microsecond rhythmic discipline.'
    },
    {
      id: 'default-5',
      isCustom: false,
      category: 'code',
      title: 'High-Efficiency Algorithms & Microservices',
      discipline: 'Software Engineering',
      img: '/assets/skill-software-code.jpg',
      exif: 'C++ STL • Python 3 • FastAPI • SQL Indexing',
      desc: 'Architecting clean modular code, optimizing memory models, algorithmic data structures, and deploying high-concurrency endpoints.',
      tags: ['C++ STL', 'Python', 'FastAPI', 'DSA Logic'],
      caption: 'Building high-performance algorithmic engines and clean RESTful microservices.'
    },
    {
      id: 'default-6',
      isCustom: false,
      category: 'bakery',
      title: 'Artisanal Patisserie & Sourdough Science',
      discipline: 'Artisanal Bakery & Culinary Arts',
      img: '/assets/skill-bakery-art.jpg',
      exif: '230°C Deck Oven • 78% Hydration • 24h Cold Proof • Levain',
      desc: 'Mastering temperature kinetics, wild sourdough levain microbiology, delicate flaky lamination, and precision chocolate tempering.',
      tags: ['Sourdough Kinetics', '78% Hydration', 'Viennoiserie', 'Pastry Chemistry'],
      caption: 'Artisanal sourdough crusts, golden brioche lamination, and culinary chemistry.'
    }
  ];

  // Storage helper for custom captures with automatic deduplication
  function deduplicateCaptures(capturesList) {
    if (!Array.isArray(capturesList)) return [];
    const seenImgs = new Set();
    const seenTitles = new Set();
    const unique = [];

    capturesList.forEach(item => {
      if (!item) return;
      // Clean and normalize keys
      const imgKey = (item.img || '').trim();
      const titleKey = (item.title || '').trim().toLowerCase();

      // Check if image data or exact title is duplicate
      if (imgKey && seenImgs.has(imgKey)) {
        return; // skip duplicate image
      }
      if (titleKey && seenTitles.has(titleKey)) {
        return; // skip duplicate title
      }

      if (imgKey) seenImgs.add(imgKey);
      if (titleKey) seenTitles.add(titleKey);
      unique.push(item);
    });

    return unique;
  }

  function loadCustomCaptures() {
    try {
      const stored = localStorage.getItem('rachana_custom_captures');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      const deduped = deduplicateCaptures(parsed);
      if (deduped.length !== parsed.length) {
        saveCustomCaptures(deduped);
      }
      return deduped;
    } catch (e) {
      console.warn('Failed to parse custom captures:', e);
      return [];
    }
  }

  function saveCustomCaptures(captures) {
    try {
      const deduped = deduplicateCaptures(captures);
      localStorage.setItem('rachana_custom_captures', JSON.stringify(deduped));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  function getAllCaptures() {
    const custom = loadCustomCaptures();
    // Merge custom with default captures, stripping any duplicates across both sets
    const combined = [...custom, ...defaultSkillCaptures];
    return deduplicateCaptures(combined);
  }

  function renderSkillGallery() {
    if (!skillGalleryGrid) return;
    const all = getAllCaptures();
    const custom = loadCustomCaptures();

    if (totalCapturesCount) totalCapturesCount.textContent = all.length;
    if (customCapturesCount) customCapturesCount.textContent = custom.length;

    skillGalleryGrid.innerHTML = '';

    // Quick Add Card
    const addCard = document.createElement('div');
    addCard.className = 'skill-photo-card-add tilt-card';
    addCard.id = 'quickAddCaptureCard';
    addCard.innerHTML = `
      <div class="add-capture-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <h4 class="add-capture-title">Upload Real Capture</h4>
      <p class="add-capture-sub">Click or drag & drop your real camera or stage photos</p>
    `;
    addCard.addEventListener('click', openUploadModal);
    skillGalleryGrid.appendChild(addCard);

    all.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `skill-photo-card tilt-card ${item.isCustom ? 'is-custom-capture' : ''}`;
      card.setAttribute('data-id', item.id);
      card.setAttribute('data-category', item.category);
      card.setAttribute('data-iscustom', item.isCustom ? 'true' : 'false');
      
      const badgeClass = item.category === 'photo' ? 'badge-amber' : item.category === 'bakery' ? 'badge-caramel' : item.category === 'code' ? 'badge-purple' : 'badge-pink';
      const badgeText = item.category === 'photo' ? 'Photography' : item.category === 'bakery' ? 'Bakery Arts' : item.category === 'code' ? 'Code & Systems' : 'Performing Arts';

      let tagsHtml = '';
      (item.tags || []).forEach(t => {
        tagsHtml += `<span class="tele-tag">${escapeHtml(t)}</span>`;
      });

      card.innerHTML = `
        <div class="skill-photo-img-wrap">
          ${item.isCustom ? '<div class="badge-custom-capture">Personal Capture</div>' : ''}
          ${item.isCustom ? `
            <button class="skill-card-quick-delete-btn" title="Delete this photo" aria-label="Delete photo">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          ` : ''}
          <img src="${item.img}" alt="${escapeHtml(item.title)}" loading="lazy" referrerPolicy="no-referrer" />
          <div class="skill-photo-overlay">
            <button class="skill-photo-zoom-btn" title="Inspect HD Skill Photo">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>View HD Capture</span>
            </button>
          </div>
          <div class="skill-photo-cat-badge ${badgeClass}">${badgeText}</div>
        </div>
        <div class="skill-photo-body">
          <h4 class="skill-photo-title">${escapeHtml(item.title)}</h4>
          <p class="skill-photo-caption">${escapeHtml(item.caption || item.desc)}</p>
          <div class="skill-photo-telemetry">
            ${tagsHtml}
          </div>
        </div>
      `;

      // Quick Delete Button for custom uploads
      const quickDelBtn = card.querySelector('.skill-card-quick-delete-btn');
      if (quickDelBtn) {
        quickDelBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sound.click();
          if (confirm(`Remove "${item.title}" from your photography captures?`)) {
            const custom = loadCustomCaptures().filter(c => c.id !== item.id && c.img !== item.img);
            saveCustomCaptures(custom);
            renderSkillGallery();
          }
        });
      }

      card.addEventListener('click', () => {
        openSkillPhotoModal(index);
      });

      // Filter visibility
      if (activeFilter === 'all') {
        card.style.display = 'flex';
      } else if (activeFilter === 'custom') {
        card.style.display = item.isCustom ? 'flex' : 'none';
      } else if (item.category === activeFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }

      skillGalleryGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Filter Buttons Handler
  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.click();
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-skill-filter') || 'all';
      renderSkillGallery();
    });
  });

  // Modal Population
  function populateSkillModal(index) {
    const all = getAllCaptures();
    const item = all[index];
    if (!item) return;
    currentSkillPhotoIndex = index;

    if (skillModalImg) skillModalImg.src = item.img;
    if (skillModalTitle) skillModalTitle.textContent = item.title;
    if (skillModalDiscipline) skillModalDiscipline.textContent = item.discipline || (item.category === 'photo' ? 'Photography & Visual Arts' : item.category === 'bakery' ? 'Artisanal Bakery & Culinary Arts' : item.category === 'code' ? 'Software Engineering' : 'Classical Performing Arts');
    if (skillModalExif) skillModalExif.innerHTML = item.exif || 'Real Camera Capture';
    if (skillModalDesc) skillModalDesc.textContent = item.desc || item.caption || 'Captured by Rachana Behera.';
    
    if (downloadSkillPhotoBtn) {
      downloadSkillPhotoBtn.href = item.img;
      downloadSkillPhotoBtn.download = `${item.title.replace(/\s+/g, '_')}_Rachana_Behera.jpg`;
    }

    if (skillModalCatBadge) {
      if (item.isCustom) {
        skillModalCatBadge.textContent = 'Personal Capture';
        skillModalCatBadge.style.borderColor = 'var(--accent-amber)';
        skillModalCatBadge.style.color = '#f59e0b';
      } else {
        const catMap = {
          photo: { text: 'Photography', color: 'var(--accent-amber)', hex: '#f59e0b' },
          bakery: { text: 'Bakery Arts', color: '#fb923c', hex: '#fb923c' },
          code: { text: 'Code & Logic', color: 'var(--accent-cyan)', hex: '#00f0ff' },
          dance: { text: 'Performing Arts', color: 'var(--accent-pink)', hex: '#ec4899' }
        };
        const catInfo = catMap[item.category] || { text: 'Skill Capture', color: 'var(--accent-amber)', hex: '#f59e0b' };
        skillModalCatBadge.textContent = catInfo.text;
        skillModalCatBadge.style.borderColor = catInfo.color;
        skillModalCatBadge.style.color = catInfo.hex;
      }
    }

    if (skillModalTags) {
      skillModalTags.innerHTML = '';
      (item.tags || []).forEach(t => {
        const span = document.createElement('span');
        span.className = 'skill-modal-tag';
        span.textContent = t;
        skillModalTags.appendChild(span);
      });
    }

    // Toggle delete button for custom captures
    if (deleteCurrentCaptureBtn) {
      if (item.isCustom) {
        deleteCurrentCaptureBtn.style.display = 'inline-flex';
        deleteCurrentCaptureBtn.onclick = () => {
          if (confirm(`Remove "${item.title}" from your portfolio captures?`)) {
            const custom = loadCustomCaptures().filter(c => c.id !== item.id);
            saveCustomCaptures(custom);
            closeSkillPhotoModal();
            renderSkillGallery();
            sound.click();
          }
        };
      } else {
        deleteCurrentCaptureBtn.style.display = 'none';
      }
    }
  }

  function openSkillPhotoModal(index) {
    if (!skillPhotoModal) return;
    populateSkillModal(index);
    sound.hover();
    skillPhotoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSkillPhotoModal() {
    if (!skillPhotoModal) return;
    sound.click();
    skillPhotoModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (skillPhotoModalCloseBtn) skillPhotoModalCloseBtn.addEventListener('click', closeSkillPhotoModal);
  if (skillModalInquireBtn) skillModalInquireBtn.addEventListener('click', closeSkillPhotoModal);

  if (prevSkillPhotoBtn) {
    prevSkillPhotoBtn.addEventListener('click', () => {
      sound.click();
      const all = getAllCaptures();
      let prevIdx = (currentSkillPhotoIndex - 1 + all.length) % all.length;
      populateSkillModal(prevIdx);
    });
  }

  if (nextSkillPhotoBtn) {
    nextSkillPhotoBtn.addEventListener('click', () => {
      sound.click();
      const all = getAllCaptures();
      let nextIdx = (currentSkillPhotoIndex + 1) % all.length;
      populateSkillModal(nextIdx);
    });
  }

  if (skillPhotoModal) {
    skillPhotoModal.addEventListener('click', (e) => {
      if (e.target === skillPhotoModal) closeSkillPhotoModal();
    });
  }

  // --- Upload Captured Photos Modal Handlers ---
  function openUploadModal() {
    if (!uploadCaptureModal) return;
    sound.hover();
    resetUploadForm();
    uploadCaptureModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (captureTitleInput) captureTitleInput.focus();
  }

  function closeUploadModal() {
    if (!uploadCaptureModal) return;
    sound.click();
    uploadCaptureModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function resetUploadForm() {
    if (uploadCaptureForm) uploadCaptureForm.reset();
    stagedImageDataUrl = null;
    if (uploadDropPlaceholder) uploadDropPlaceholder.style.display = 'block';
    if (uploadDropPreview) uploadDropPreview.style.display = 'none';
    if (capturePreviewImg) capturePreviewImg.src = '';
  }

  if (openUploadCaptureModalBtn) openUploadCaptureModalBtn.addEventListener('click', openUploadModal);
  if (uploadCaptureModalCloseBtn) uploadCaptureModalCloseBtn.addEventListener('click', closeUploadModal);
  if (cancelUploadCaptureBtn) cancelUploadCaptureBtn.addEventListener('click', closeUploadModal);
  if (uploadCaptureModal) {
    uploadCaptureModal.addEventListener('click', (e) => {
      if (e.target === uploadCaptureModal) closeUploadModal();
    });
  }

  // Drop zone inside upload modal
  if (uploadCaptureDropArea && captureFileInput) {
    uploadCaptureDropArea.addEventListener('click', (e) => {
      if (e.target !== removePreviewImgBtn && !removePreviewImgBtn.contains(e.target)) {
        captureFileInput.click();
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadCaptureDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadCaptureDropArea.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadCaptureDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadCaptureDropArea.classList.remove('dragover');
      });
    });

    uploadCaptureDropArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    });

    captureFileInput.addEventListener('change', () => {
      if (captureFileInput.files && captureFileInput.files.length > 0) {
        handleFileSelection(captureFileInput.files[0]);
      }
    });
  }

  if (removePreviewImgBtn) {
    removePreviewImgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stagedImageDataUrl = null;
      if (captureFileInput) captureFileInput.value = '';
      if (uploadDropPlaceholder) uploadDropPlaceholder.style.display = 'block';
      if (uploadDropPreview) uploadDropPreview.style.display = 'none';
      if (capturePreviewImg) capturePreviewImg.src = '';
    });
  }

  // File optimizer & reader (scales high-res photos to high-performance responsive resolution)
  function handleFileSelection(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality downscaling for responsive storage
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        stagedImageDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        if (capturePreviewImg) capturePreviewImg.src = stagedImageDataUrl;
        if (uploadDropPlaceholder) uploadDropPlaceholder.style.display = 'none';
        if (uploadDropPreview) uploadDropPreview.style.display = 'flex';

        // Auto-fill title if empty
        if (captureTitleInput && !captureTitleInput.value.trim()) {
          const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          captureTitleInput.value = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Submit capture form
  if (uploadCaptureForm) {
    uploadCaptureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!stagedImageDataUrl) {
        alert('Please select or drop an image for your capture.');
        return;
      }

      const title = (captureTitleInput ? captureTitleInput.value.trim() : '') || 'Personal Capture';
      const category = (captureCategorySelect ? captureCategorySelect.value : 'photo');
      const exif = (captureExifInput ? captureExifInput.value.trim() : '') || 'Shot by Rachana Behera • Real Capture';
      const desc = (captureDescInput ? captureDescInput.value.trim() : '') || 'Real photography & skill capture by Rachana Behera.';
      const rawTags = (captureTagsInput ? captureTagsInput.value.trim() : '');
      const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : ['Real Capture', 'Personal Shot'];

      // Check if duplicate exists
      const existing = loadCustomCaptures();
      const isDuplicate = existing.some(c => c.img === stagedImageDataUrl || (c.title && c.title.toLowerCase() === title.toLowerCase())) ||
                          defaultSkillCaptures.some(c => c.img === stagedImageDataUrl || (c.title && c.title.toLowerCase() === title.toLowerCase()));

      if (isDuplicate) {
        alert(`A photo titled "${title}" or with this identical image already exists in your photography captures. Duplicate was prevented!`);
        return;
      }

      const newCapture = {
        id: 'user-cap-' + Date.now(),
        isCustom: true,
        category: category,
        title: title,
        discipline: category === 'photo' ? 'Photography & Visual Arts' : category === 'code' ? 'Software Engineering' : 'Classical Performing Arts',
        img: stagedImageDataUrl,
        exif: exif,
        desc: desc,
        tags: tags,
        caption: desc.slice(0, 80) + (desc.length > 80 ? '...' : '')
      };

      existing.unshift(newCapture);
      saveCustomCaptures(existing);

      sound.success();
      closeUploadModal();
      activeFilter = 'all';
      skillFilterBtns.forEach(b => {
        if (b.getAttribute('data-skill-filter') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
      renderSkillGallery();

      // Smooth scroll to gallery
      if (skillsVisualGallery) {
        skillsVisualGallery.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Clean Duplicates Button Handler
  const cleanDuplicatesBtn = document.getElementById('cleanDuplicatesBtn');
  if (cleanDuplicatesBtn) {
    cleanDuplicatesBtn.addEventListener('click', () => {
      sound.click();
      const rawCustom = [];
      try {
        const stored = localStorage.getItem('rachana_custom_captures');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) rawCustom.push(...parsed);
        }
      } catch (e) {
        console.warn('Error reading stored captures:', e);
      }

      const deduped = deduplicateCaptures(rawCustom);
      const diff = rawCustom.length - deduped.length;
      saveCustomCaptures(deduped);
      renderSkillGallery();

      if (diff > 0) {
        alert(`Successfully removed ${diff} duplicate photo(s) from the photography captures gallery!`);
      } else {
        alert('Verified: No duplicate photos found in the photography section. All photos are unique and synchronized!');
      }
    });
  }

  // Live Drag & Drop across the whole Visual Skills Gallery Container
  if (skillsVisualGallery && galleryDragOverlay) {
    let dragCounter = 0;

    window.addEventListener('dragenter', (e) => {
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        dragCounter++;
        const rect = skillsVisualGallery.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          galleryDragOverlay.classList.add('active');
        }
      }
    });

    window.addEventListener('dragleave', () => {
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        galleryDragOverlay.classList.remove('active');
      }
    });

    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    galleryDragOverlay.addEventListener('drop', (e) => {
      e.preventDefault();
      dragCounter = 0;
      galleryDragOverlay.classList.remove('active');
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        openUploadModal();
        handleFileSelection(files[0]);
      }
    });
  }

  // Initialize Gallery
  renderSkillGallery();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('active')) closeProjectModal();
      if (certModal && certModal.classList.contains('active')) closeCertificateModal();
      if (profilePhotoModal && profilePhotoModal.classList.contains('active')) closeProfilePhotoModal();
      if (skillPhotoModal && skillPhotoModal.classList.contains('active')) closeSkillPhotoModal();
      if (uploadCaptureModal && uploadCaptureModal.classList.contains('active')) closeUploadModal();
    } else if (skillPhotoModal && skillPhotoModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft' && prevSkillPhotoBtn) prevSkillPhotoBtn.click();
      if (e.key === 'ArrowRight' && nextSkillPhotoBtn) nextSkillPhotoBtn.click();
    }
  });

  /* =========================================================================
     9. THEME TOGGLING & LOCAL STORAGE
     ========================================================================= */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('rb_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      sound.click();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rb_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme`);
    });
  }

  /* =========================================================================
     10. SCROLL SPY, PROGRESS BAR, HUD RADAR & NAVBAR SCROLL EFFECT
     ========================================================================= */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[data-section]');
  const hudSectionIndex = document.getElementById('hudSectionIndex');
  const hudSectionName = document.getElementById('hudSectionName');
  const hudProgressFill = document.getElementById('hudProgressFill');

  const sectionMeta = {
    hero: { idx: 'SEC 01 / 09', name: 'HOME • ACTIVE' },
    projects: { idx: 'SEC 02 / 09', name: 'PROJECTS • ACTIVE' },
    visualizer: { idx: 'SEC 03 / 09', name: 'ALGO LAB • ACTIVE' },
    skills: { idx: 'SEC 04 / 09', name: 'SKILLS • ACTIVE' },
    rhythm: { idx: 'SEC 05 / 09', name: 'ART & LOGIC • ACTIVE' },
    about: { idx: 'SEC 06 / 09', name: 'ABOUT • ACTIVE' },
    education: { idx: 'SEC 07 / 09', name: 'EDUCATION • ACTIVE' },
    certificates: { idx: 'SEC 08 / 09', name: 'CERTS • ACTIVE' },
    contact: { idx: 'SEC 09 / 09', name: 'CONNECT • ACTIVE' }
  };

  let lastActiveSec = 'hero';

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }
    if (hudProgressFill) {
      hudProgressFill.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollTop > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    // Scroll Spy
    let currentSectionId = 'hero';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSectionId = sec.getAttribute('data-section');
      }
    });

    if (currentSectionId !== lastActiveSec) {
      lastActiveSec = currentSectionId;
      if (hudSectionIndex && hudSectionName && sectionMeta[currentSectionId]) {
        hudSectionIndex.textContent = sectionMeta[currentSectionId].idx;
        hudSectionName.textContent = sectionMeta[currentSectionId].name;
      }
    }

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === currentSectionId) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navLinksMenu = document.getElementById('navLinks');

  if (mobileToggleBtn && navLinksMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      sound.click();
      const isOpen = navLinksMenu.classList.toggle('open');
      mobileToggleBtn.classList.toggle('open', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      sound.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================================
     11. CLIPBOARD COPY UTILITY & TOAST NOTIFICATIONS
     ========================================================================= */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          sound.success();
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`);
        });
      }
    });
  });

  /* =========================================================================
     12. CONTACT FORM VALIDATION & TRANSMISSION
     ========================================================================= */
  const contactForm = document.getElementById('contactForm');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userMessage = document.getElementById('userMessage');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateInput(input, isValid) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    if (isValid) {
      formGroup.classList.remove('has-error');
      input.classList.add('is-valid');
    } else {
      formGroup.classList.add('has-error');
      input.classList.remove('is-valid');
    }
  }

  if (userName) {
    userName.addEventListener('input', () => validateInput(userName, userName.value.trim().length >= 2));
  }
  if (userEmail) {
    userEmail.addEventListener('input', () => validateInput(userEmail, validateEmail(userEmail.value.trim())));
  }
  if (userMessage) {
    userMessage.addEventListener('input', () => validateInput(userMessage, userMessage.value.trim().length >= 10));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = userName && userName.value.trim().length >= 2;
      const isEmailValid = userEmail && validateEmail(userEmail.value.trim());
      const isMsgValid = userMessage && userMessage.value.trim().length >= 10;

      validateInput(userName, isNameValid);
      validateInput(userEmail, isEmailValid);
      validateInput(userMessage, isMsgValid);

      if (isNameValid && isEmailValid && isMsgValid) {
        sound.success();
        showToast('Message transmitted successfully to Rachana!');
        contactForm.reset();
        document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      } else {
        sound.click();
        showToast('Please correct the highlighted fields before transmitting.');
      }
    });
  }

  /* =========================================================================
     13. INTERSECTION OBSERVER (ADVANCED SCROLL & STAGGERED REVEALS)
     ========================================================================= */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate3d, .reveal-stagger-parent'
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // If it's a staggered parent, reveal its children with sequential timing
        if (entry.target.classList.contains('reveal-stagger-parent')) {
          const children = entry.target.querySelectorAll('.reveal-child');
          children.forEach((child, idx) => {
            child.style.transitionDelay = `${idx * 0.08 + 0.05}s`;
            child.classList.add('revealed');
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* =========================================================================
     14. DUAL-MODE HERO VISUAL & 3D QUANTUM GYROSCOPE CORE ENGINE
     ========================================================================= */
  const heroViewTerminalBtn = document.getElementById('heroViewTerminalBtn');
  const heroViewGyroBtn = document.getElementById('heroViewGyroBtn');
  const heroViewPortraitBtn = document.getElementById('heroViewPortraitBtn');
  const heroTerminal = document.getElementById('heroTerminal');
  const heroGyroCard = document.getElementById('heroGyroCard');
  const heroPortraitCard = document.getElementById('heroPortraitCard');
  const gyroSpatialRig = document.getElementById('gyroSpatialRig');
  const gyroStageWrap = document.getElementById('gyroStageWrap');
  const gyroBoostBtn = document.getElementById('gyroBoostBtn');
  const gyroPitchVal = document.getElementById('gyroPitchVal');
  const gyroYawVal = document.getElementById('gyroYawVal');
  const gyroVelocityVal = document.getElementById('gyroVelocityVal');

  let currentHeroView = 'terminal';
  let gyroRotX = 15;
  let gyroRotY = 25;
  let gyroRotZ = 0;
  let gyroSpeed = 1.0;
  let isDraggingGyro = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartRotX = 0;
  let dragStartRotY = 0;

  function switchHeroView(view) {
    currentHeroView = view;
    // Remove active from all buttons
    if (heroViewTerminalBtn) heroViewTerminalBtn.classList.remove('active');
    if (heroViewGyroBtn) heroViewGyroBtn.classList.remove('active');
    if (heroViewPortraitBtn) heroViewPortraitBtn.classList.remove('active');

    // Hide all view containers
    if (heroTerminal) heroTerminal.style.display = 'none';
    if (heroGyroCard) heroGyroCard.style.display = 'none';
    if (heroPortraitCard) heroPortraitCard.style.display = 'none';

    if (view === 'terminal') {
      if (heroViewTerminalBtn) heroViewTerminalBtn.classList.add('active');
      if (heroTerminal) heroTerminal.style.display = 'block';
      showToast('Switched to Interactive Code Sandbox');
    } else if (view === 'gyro') {
      if (heroViewGyroBtn) heroViewGyroBtn.classList.add('active');
      if (heroGyroCard) heroGyroCard.style.display = 'block';
      showToast('Engaged 3D Quantum Gyroscope Core');
    } else if (view === 'portrait') {
      if (heroViewPortraitBtn) heroViewPortraitBtn.classList.add('active');
      if (heroPortraitCard) heroPortraitCard.style.display = 'block';
      showToast('Displaying Rachana Behera Developer Portrait');
    }
  }

  if (heroViewTerminalBtn) {
    heroViewTerminalBtn.addEventListener('click', () => {
      sound.click();
      switchHeroView('terminal');
    });
  }

  if (heroViewGyroBtn) {
    heroViewGyroBtn.addEventListener('click', () => {
      sound.click();
      switchHeroView('gyro');
    });
  }

  if (heroViewPortraitBtn) {
    heroViewPortraitBtn.addEventListener('click', () => {
      sound.click();
      switchHeroView('portrait');
    });
  }

  if (gyroBoostBtn) {
    gyroBoostBtn.addEventListener('click', () => {
      sound.success();
      gyroSpeed = 4.5;
      showToast('⚡ Kinetic Boost Injected: 4.5x Orbital Spin!');
    });
  }

  // Pointer drag on 3D Gyro
  if (gyroStageWrap) {
    gyroStageWrap.addEventListener('mousedown', (e) => {
      isDraggingGyro = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartRotX = gyroRotX;
      dragStartRotY = gyroRotY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingGyro) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      gyroRotY = dragStartRotY + dx * 0.6;
      gyroRotX = dragStartRotX - dy * 0.6;
    });

    window.addEventListener('mouseup', () => {
      isDraggingGyro = false;
    });

    // Touch support
    gyroStageWrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDraggingGyro = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        dragStartRotX = gyroRotX;
        dragStartRotY = gyroRotY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDraggingGyro || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStartX;
      const dy = e.touches[0].clientY - dragStartY;
      gyroRotY = dragStartRotY + dx * 0.6;
      gyroRotX = dragStartRotX - dy * 0.6;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDraggingGyro = false;
    });
  }

  // Kinetic Gyroscope loop
  function updateGyroLoop() {
    if (currentHeroView === 'gyro' && gyroSpatialRig) {
      if (!isDraggingGyro) {
        gyroRotY += 0.8 * gyroSpeed;
        gyroRotX += 0.3 * gyroSpeed;
        gyroRotZ += 0.5 * gyroSpeed;
      }

      // Smooth decay of boost
      if (gyroSpeed > 1.0) {
        gyroSpeed -= 0.03;
        if (gyroSpeed < 1.0) gyroSpeed = 1.0;
      }

      gyroSpatialRig.style.transform = `rotateX(${gyroRotX.toFixed(1)}deg) rotateY(${gyroRotY.toFixed(1)}deg) rotateZ(${gyroRotZ.toFixed(1)}deg)`;

      if (gyroPitchVal) gyroPitchVal.textContent = `${(gyroRotX % 360).toFixed(1)}°`;
      if (gyroYawVal) gyroYawVal.textContent = `${(gyroRotY % 360).toFixed(1)}°`;
      if (gyroVelocityVal) gyroVelocityVal.textContent = `${gyroSpeed.toFixed(2)}x`;
    }

    requestAnimationFrame(updateGyroLoop);
  }
  updateGyroLoop();

  /* =========================================================================
     15. CYBER COMMAND PALETTE (⌘K SPOTLIGHT MODAL)
     ========================================================================= */
  const commandPaletteModal = document.getElementById('commandPaletteModal');
  const openCommandPaletteBtn = document.getElementById('openCommandPaletteBtn');
  const cmdSearchInput = document.getElementById('cmdSearchInput');
  const cmdCloseBadge = document.getElementById('cmdCloseBadge');
  const cmdPillBtns = document.querySelectorAll('.cmd-pill-btn');
  const cmdItems = document.querySelectorAll('.cmd-item');
  const cmdResultsList = document.getElementById('cmdResultsList');

  let activeCmdFilter = 'all';
  let selectedCmdIndex = -1;

  function openCommandPalette() {
    if (!commandPaletteModal) return;
    sound.click();
    commandPaletteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (cmdSearchInput) {
      cmdSearchInput.value = '';
      setTimeout(() => cmdSearchInput.focus(), 50);
    }
    filterCommandItems('');
  }

  function closeCommandPalette() {
    if (!commandPaletteModal) return;
    commandPaletteModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openCommandPaletteBtn) {
    openCommandPaletteBtn.addEventListener('click', openCommandPalette);
  }

  if (cmdCloseBadge) {
    cmdCloseBadge.addEventListener('click', closeCommandPalette);
  }

  if (commandPaletteModal) {
    commandPaletteModal.addEventListener('click', (e) => {
      if (e.target === commandPaletteModal) closeCommandPalette();
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K / Slash (when not in input)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandPaletteModal && commandPaletteModal.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openCommandPalette();
    } else if (e.key === 'Escape') {
      if (commandPaletteModal && commandPaletteModal.classList.contains('active')) {
        closeCommandPalette();
      }
    }
  });

  // Filter Items
  function filterCommandItems(query) {
    const q = query.toLowerCase().trim();
    const visibleItems = [];

    cmdItems.forEach(item => {
      const type = item.getAttribute('data-type');
      const title = item.querySelector('.cmd-item-title')?.textContent.toLowerCase() || '';
      const sub = item.querySelector('.cmd-item-sub')?.textContent.toLowerCase() || '';
      const matchesCategory = activeCmdFilter === 'all' || type === activeCmdFilter;
      const matchesQuery = !q || title.includes(q) || sub.includes(q);

      if (matchesCategory && matchesQuery) {
        item.style.display = 'flex';
        visibleItems.push(item);
      } else {
        item.style.display = 'none';
      }
    });

    // Toggle group headers
    document.querySelectorAll('.cmd-group-label').forEach(header => {
      const grp = header.getAttribute('data-group');
      const hasVisible = visibleItems.some(i => i.getAttribute('data-type') === grp);
      header.style.display = hasVisible ? 'block' : 'none';
    });

    // Update selected index
    selectedCmdIndex = visibleItems.length > 0 ? 0 : -1;
    updateCommandSelection(visibleItems);
  }

  function updateCommandSelection(visibleItems) {
    cmdItems.forEach(i => i.classList.remove('selected'));
    if (selectedCmdIndex >= 0 && selectedCmdIndex < visibleItems.length) {
      const sel = visibleItems[selectedCmdIndex];
      sel.classList.add('selected');
      sel.scrollIntoView({ block: 'nearest' });
    }
  }

  if (cmdSearchInput) {
    cmdSearchInput.addEventListener('input', (e) => {
      filterCommandItems(e.target.value);
    });

    cmdSearchInput.addEventListener('keydown', (e) => {
      const visible = Array.from(cmdItems).filter(i => i.style.display !== 'none');
      if (!visible.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex + 1) % visible.length;
        updateCommandSelection(visible);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex - 1 + visible.length) % visible.length;
        updateCommandSelection(visible);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedCmdIndex >= 0 && selectedCmdIndex < visible.length) {
          executeCommandItem(visible[selectedCmdIndex]);
        }
      }
    });
  }

  // Quick Filter Pills
  cmdPillBtns.forEach(pill => {
    pill.addEventListener('click', () => {
      sound.click();
      cmdPillBtns.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCmdFilter = pill.getAttribute('data-cmd-filter') || 'all';
      filterCommandItems(cmdSearchInput ? cmdSearchInput.value : '');
    });
  });

  function executeCommandItem(item) {
    const type = item.getAttribute('data-type');
    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');
    const modalKey = item.getAttribute('data-modal');

    closeCommandPalette();
    sound.success();

    if (action === 'view-profile-photo') {
      openProfilePhotoModal();
    } else if (action === 'upload-capture') {
      openUploadModal();
    } else if (action === 'view-skill-photos') {
      const skillsGal = document.getElementById('skillsVisualGallery');
      if (skillsGal) {
        skillsGal.scrollIntoView({ behavior: 'smooth' });
        const firstCard = skillsGal.querySelector('.skill-photo-card');
        if (firstCard) {
          firstCard.classList.add('pulse-highlight');
          setTimeout(() => firstCard.classList.remove('pulse-highlight'), 1800);
        }
      }
    } else if (action === 'run-code') {
      const runBtn = document.getElementById('runCodeBtn');
      if (runBtn) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        switchHeroView('terminal');
        setTimeout(() => runBtn.click(), 400);
      }
    } else if (action === 'toggle-gyro') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      switchHeroView('gyro');
    } else if (action === 'cycle-canvas') {
      const canvasBtn = document.getElementById('canvasModeBtn');
      if (canvasBtn) canvasBtn.click();
    } else if (action === 'play-taala') {
      const rhythmSec = document.getElementById('rhythm');
      if (rhythmSec) rhythmSec.scrollIntoView({ behavior: 'smooth' });
      const playBtn = document.getElementById('playTaalaBtn');
      if (playBtn) setTimeout(() => playBtn.click(), 500);
    } else if (action === 'toggle-theme') {
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) themeBtn.click();
    } else if (action === 'open-font-studio') {
      openFontStudioModal();
    } else if (action === 'font-sora') {
      applyFontStyle('sora', true);
    } else if (action === 'font-lexend') {
      applyFontStyle('lexend', true);
    } else if (action === 'font-unbounded') {
      applyFontStyle('unbounded', true);
    } else if (action === 'font-bricolage') {
      applyFontStyle('bricolage', true);
    } else if (action === 'font-neotech') {
      applyFontStyle('neotech', true);
    } else if (action === 'font-cyberpunk') {
      applyFontStyle('cyberpunk', true);
    } else if (action === 'font-editorial') {
      applyFontStyle('editorial', true);
    } else if (action === 'font-minimal') {
      applyFontStyle('minimal', true);
    } else if (action === 'font-montserrat') {
      applyFontStyle('montserrat', true);
    } else if (action === 'font-regal') {
      applyFontStyle('regal', true);
    } else if (action === 'logo-prism') {
      applyLogoStyle('prism', true);
    } else if (action === 'logo-hex') {
      applyLogoStyle('hex', true);
    } else if (action === 'logo-terminal') {
      applyLogoStyle('terminal', true);
    } else if (action === 'logo-minimal') {
      applyLogoStyle('minimal', true);
    } else if (action === 'logo-orbit') {
      applyLogoStyle('orbit', true);
    } else if (target) {
      const targetEl = document.querySelector(target);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    } else if (modalKey) {
      openProjectModal(modalKey);
    }
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      executeCommandItem(item);
    });
  });

  /* =========================================================================
     16. DYNAMIC CARD GLARE & CURSOR SPOTLIGHT SHADER
     ========================================================================= */
  const allTiltCards = document.querySelectorAll('.tilt-card');
  allTiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* =========================================================================
     17. CYBER TYPOGRAPHY & NAME LOGO STUDIO CONTROLLER
     ========================================================================= */
  const fontStudioModal = document.getElementById('fontLogoStudioModal');
  const fontStudioToggleBtn = document.getElementById('fontStudioToggleBtn') || document.getElementById('fontLogoStudioBtn');
  const fontStudioCloseBtn = document.getElementById('fontStudioCloseBtn');
  const resetTypographyBtn = document.getElementById('resetTypographyBtn');
  const saveTypographyBtn = document.getElementById('saveTypographyBtn');

  const fontArchetypeCards = document.querySelectorAll('.font-archetype-card');
  const logoSilhouetteCards = document.querySelectorAll('.logo-silhouette-card');
  const nameFormatPills = document.querySelectorAll('.name-format-pill');

  // Preview elements
  const previewSampleHeading = document.getElementById('previewSampleHeading');
  const previewLogoMainText = document.getElementById('previewLogoMainText');
  const previewLogoAccent = document.getElementById('previewLogoAccent');
  const previewLogoCipher = document.getElementById('previewLogoCipher');

  // State
  let currentFontStyle = localStorage.getItem('rb_font_style') || 'sora';
  let currentLogoStyle = localStorage.getItem('rb_logo_style') || 'prism';
  let currentNameFormat = localStorage.getItem('rb_name_format') || 'sigil';

  const nameFormatMap = {
    'sigil': { main: 'RACHANA', accent: '✦BEHERA', cipher: 'RB' },
    'dev': { main: 'Rachana', accent: '.dev', cipher: 'RB' },
    'caps': { main: 'RACHANA', accent: ' BEHERA', cipher: 'RB' },
    'brackets': { main: '⟨ RB', accent: ' // DEV ⟩', cipher: 'RB' },
    'core': { main: 'rachana', accent: '::core', cipher: '01' },
    'init': { main: 'rachana', accent: '.init()', cipher: 'λ' }
  };

  function applyFontStyle(fontKey, save = false) {
    currentFontStyle = fontKey;
    document.documentElement.setAttribute('data-font-style', fontKey);
    document.body.setAttribute('data-font-style', fontKey);

    fontArchetypeCards.forEach(card => {
      const cardFont = card.getAttribute('data-font-family');
      card.classList.toggle('active', cardFont === fontKey);
    });

    if (save) {
      localStorage.setItem('rb_font_style', fontKey);
      sound.success();
      showToast(`Font Archetype Applied: ${fontKey.toUpperCase()}`);
    }
  }

  function applyLogoStyle(logoKey, save = false) {
    currentLogoStyle = logoKey;
    document.documentElement.setAttribute('data-logo-style', logoKey);
    document.body.setAttribute('data-logo-style', logoKey);

    logoSilhouetteCards.forEach(card => {
      const cardLogo = card.getAttribute('data-logo-style');
      card.classList.toggle('active', cardLogo === logoKey);
    });

    if (save) {
      localStorage.setItem('rb_logo_style', logoKey);
      sound.success();
      showToast(`Logo Silhouette Applied: ${logoKey.toUpperCase()}`);
    }
  }

  function applyNameFormat(formatKey, save = false) {
    currentNameFormat = formatKey;
    const formatData = nameFormatMap[formatKey] || nameFormatMap['sigil'];

    // Update preview
    if (previewLogoMainText) previewLogoMainText.textContent = formatData.main;
    if (previewLogoAccent) previewLogoAccent.textContent = formatData.accent;
    if (previewLogoCipher) previewLogoCipher.textContent = formatData.cipher;

    // Update all live navbar and footer brand logos on page
    document.querySelectorAll('.logo-headline').forEach(headline => {
      const mainEl = headline.querySelector('.logo-text');
      const accentEl = headline.querySelector('.logo-accent');
      if (mainEl) mainEl.textContent = formatData.main;
      if (accentEl) accentEl.textContent = formatData.accent;
    });

    document.querySelectorAll('.logo-cipher, .logo-cipher-svg').forEach(c => {
      c.textContent = formatData.cipher;
    });

    nameFormatPills.forEach(pill => {
      const pillFormat = pill.getAttribute('data-name-format');
      pill.classList.toggle('active', pillFormat === formatKey);
    });

    if (save) {
      localStorage.setItem('rb_name_format', formatKey);
      sound.success();
      showToast(`Name Format Updated: ${formatKey.toUpperCase()}`);
    }
  }

  function openFontStudioModal() {
    if (!fontStudioModal) return;
    sound.click();
    fontStudioModal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Sync current active UI buttons
    applyFontStyle(currentFontStyle, false);
    applyLogoStyle(currentLogoStyle, false);
    applyNameFormat(currentNameFormat, false);
  }

  function closeFontStudioModal() {
    if (!fontStudioModal) return;
    fontStudioModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Event Listeners for Studio Open/Close
  if (fontStudioToggleBtn) {
    fontStudioToggleBtn.addEventListener('click', () => {
      openFontStudioModal();
    });
  }

  if (fontStudioCloseBtn) {
    fontStudioCloseBtn.addEventListener('click', () => {
      closeFontStudioModal();
      sound.click();
    });
  }

  if (fontStudioModal) {
    fontStudioModal.addEventListener('click', (e) => {
      if (e.target === fontStudioModal) {
        closeFontStudioModal();
      }
    });
  }

  // Archetype Card Clicks
  fontArchetypeCards.forEach(card => {
    card.addEventListener('click', () => {
      const fontKey = card.getAttribute('data-font-family');
      sound.click();
      applyFontStyle(fontKey, false);
    });
  });

  // Logo Silhouette Card Clicks
  logoSilhouetteCards.forEach(card => {
    card.addEventListener('click', () => {
      const logoKey = card.getAttribute('data-logo-style');
      sound.click();
      applyLogoStyle(logoKey, false);
    });
  });

  // Name Format Pill Clicks
  nameFormatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const formatKey = pill.getAttribute('data-name-format');
      sound.click();
      applyNameFormat(formatKey, false);
    });
  });

  // Reset to Default
  if (resetTypographyBtn) {
    resetTypographyBtn.addEventListener('click', () => {
      sound.click();
      applyFontStyle('sora', false);
      applyLogoStyle('prism', false);
      applyNameFormat('sigil', false);
      showToast('Reset to default typography & logo mark');
    });
  }

  // Save Settings
  if (saveTypographyBtn) {
    saveTypographyBtn.addEventListener('click', () => {
      localStorage.setItem('rb_font_style', currentFontStyle);
      localStorage.setItem('rb_logo_style', currentLogoStyle);
      localStorage.setItem('rb_name_format', currentNameFormat);
      sound.success();
      showToast('Aesthetic Preferences Saved Successfully');
      closeFontStudioModal();
    });
  }

  // Initialize from storage on first boot
  applyFontStyle(currentFontStyle, false);
  applyLogoStyle(currentLogoStyle, false);
  applyNameFormat(currentNameFormat, false);

  // Keyboard shortcut listener: ESC to close studio modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fontStudioModal && fontStudioModal.classList.contains('active')) {
      closeFontStudioModal();
    }
  });

});



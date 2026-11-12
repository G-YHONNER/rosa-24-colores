/**
 * ROSA MÁGICA • PANTALLA PRINCIPAL
 * - Cambio de color local con zonas táctiles y teclado
 * - Reloj Neón en tiempo real
 * - Sistema de partículas mágicas
 */

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const titleEl = document.getElementById("roseTitle");
  const subtitleEl = document.getElementById("roseSubtitle");
  const clockEl = document.getElementById("neonClock");
  const roseContainer = document.querySelector(".container2");
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");

  // Reloj Digital Neón en Tiempo Real (Solo números)
  function updateNeonClock() {
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    clockEl.textContent = h + ":" + m + ":" + s;
  }
  updateNeonClock();
  setInterval(updateNeonClock, 1000);

  const colorInfo = {
    blue:      { rgb: "128, 216, 255" },
    pink:      { rgb: "255, 120, 150" },
    purple:    { rgb: "206, 147, 216" },
    ruby:      { rgb: "255, 64, 129" },
    gold:      { rgb: "255, 224, 130" },
    cyan:      { rgb: "132, 255, 255" },
    red:       { rgb: "255, 60, 60" },
    emerald:   { rgb: "0, 230, 118" },
    orange:    { rgb: "255, 145, 0" },
    white:     { rgb: "240, 248, 255" },
    black:     { rgb: "186, 104, 200" },
    coral:     { rgb: "255, 110, 64" },
    lavender:  { rgb: "179, 136, 255" },
    mint:      { rgb: "29, 233, 182" },
    yellow:    { rgb: "255, 234, 0" },
    magenta:   { rgb: "255, 0, 127" },
    turquoise: { rgb: "0, 229, 255" },
    lime:      { rgb: "118, 255, 3" },
    peach:     { rgb: "255, 171, 145" },
    indigo:    { rgb: "83, 109, 254" },
    bronze:    { rgb: "215, 122, 56" },
    crimson:   { rgb: "194, 24, 91" },
    silver:    { rgb: "224, 224, 224" },
    champagne: { rgb: "247, 231, 206" }
  };

  const themeList = [
    "blue",
    "pink",
    "purple",
    "ruby",
    "gold",
    "cyan",
    "red",
    "emerald",
    "orange",
    "white",
    "black",
    "coral",
    "lavender",
    "mint",
    "yellow",
    "magenta",
    "turquoise",
    "lime",
    "peach",
    "indigo",
    "bronze",
    "crimson",
    "silver",
    "champagne"
  ];

  let currentThemeIndex = 0;
  let currentTheme = "blue";
  let cycleInterval = null;
  let currentCycleIntervalTime = 0;

  // Restaurar color guardado
  try {
    const savedColor = localStorage.getItem("rose_permanent_color");
    if (savedColor && themeList.indexOf(savedColor) !== -1) {
      setTheme(savedColor);
    }
  } catch (e) {}

  function setTheme(theme) {
    currentTheme = theme;

    // Efecto dissolve suave: breve blur + fade → aplica tema → restaura
    roseContainer.style.transition = "filter 0.25s ease, opacity 0.25s ease";
    roseContainer.style.filter = "blur(6px) brightness(1.4)";
    roseContainer.style.opacity = "0.55";

    setTimeout(function () {
      if (theme === "blue") {
        body.removeAttribute("data-theme");
      } else {
        body.setAttribute("data-theme", theme);
      }
      currentThemeIndex = themeList.indexOf(theme);
      try {
        localStorage.setItem("rose_permanent_color", theme);
      } catch (e) {}

      roseContainer.style.transition = "filter 0.5s ease, opacity 0.5s ease";
      roseContainer.style.filter = "";
      roseContainer.style.opacity = "";
      spawnSparklesAroundRose(30);
    }, 240);
  }

  function startCycle(intervalMs) {
    intervalMs = intervalMs || 4000;
    currentCycleIntervalTime = intervalMs;
    if (cycleInterval) clearInterval(cycleInterval);
    cycleInterval = setInterval(function () {
      currentThemeIndex = (currentThemeIndex + 1) % themeList.length;
      setTheme(themeList[currentThemeIndex]);
    }, intervalMs);
  }

  function stopCycle() {
    currentCycleIntervalTime = 0;
    if (cycleInterval) {
      clearInterval(cycleInterval);
      cycleInterval = null;
    }
  }

  // Navegación de Colores Lateral (Retroceder / Adelantar)
  function prevColor() {
    currentThemeIndex = (currentThemeIndex - 1 + themeList.length) % themeList.length;
    setTheme(themeList[currentThemeIndex]);
  }

  function nextColor() {
    currentThemeIndex = (currentThemeIndex + 1) % themeList.length;
    setTheme(themeList[currentThemeIndex]);
  }

  const prevZone = document.getElementById("prevTouchZone");
  const nextZone = document.getElementById("nextTouchZone");

  if (prevZone) {
    prevZone.addEventListener("click", function (e) { prevColor(); });
  }

  if (nextZone) {
    nextZone.addEventListener("click", function (e) { nextColor(); });
  }

  // Navegación con flechas del teclado
  document.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (e.key === "ArrowLeft") prevColor();
    if (e.key === "ArrowRight") nextColor();
  });

  let touchHandled = false;
  roseContainer.addEventListener("touchstart", function (e) {
    e.preventDefault();
    touchHandled = true;
    spawnSparklesAroundRose(35);
    setTimeout(function () { touchHandled = false; }, 350);
  }, { passive: false });

  roseContainer.addEventListener("click", function (e) {
    if (!touchHandled) {
      spawnSparklesAroundRose(35);
    }
  });

  // Bloquear zoom táctil en móviles (Safari iOS y Android)
  document.addEventListener("touchstart", function (e) {
    if (e.touches.length > 1) { e.preventDefault(); }
  }, { passive: false });
  document.addEventListener("touchmove", function (e) {
    if (e.touches.length > 1) { e.preventDefault(); }
  }, { passive: false });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturechange", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gestureend", function (e) { e.preventDefault(); }, { passive: false });
  let lastTouchEndTime = 0;
  document.addEventListener("touchend", function (e) {
    const now = Date.now();
    if (now - lastTouchEndTime <= 300) {
      e.preventDefault();
    }
    lastTouchEndTime = now;
  }, { passive: false });

  // =========================================================================
  // SISTEMA DE PARTÍCULAS
  // =========================================================================
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 40;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class StarDust {
    constructor(x, y, speedX, speedY, size, alpha) {
      this.reset(true, x, y, speedX, speedY, size, alpha);
    }

    reset(initial, x, y, speedX, speedY, size, alpha) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : (initial ? Math.random() * height : height + 10);
      this.size = size !== undefined ? size : Math.random() * 2.2 + 0.8;
      this.speedY = speedY !== undefined ? speedY : -(Math.random() * 0.4 + 0.15);
      this.speedX = speedX !== undefined ? speedX : (Math.random() - 0.5) * 0.3;
      this.alpha = alpha !== undefined ? alpha : Math.random() * 0.5 + 0.2;
      this.maxAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
      this.isSparkle = x !== undefined;
      this.life = 1.0;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.isSparkle) {
        this.life -= 0.018;
        this.alpha = Math.max(0, this.life);
        return this.life > 0;
      }

      this.pulseAngle += this.pulseSpeed;
      this.alpha = (Math.sin(this.pulseAngle) * 0.5 + 0.5) * this.maxAlpha;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
      return true;
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      const activeColor = body.getAttribute("data-theme") || "blue";
      const rgb = (colorInfo[activeColor] || colorInfo.blue).rgb;

      ctx.fillStyle = "rgba(" + rgb + ", " + this.alpha + ")";
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = "rgba(" + rgb + ", 0.8)";
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new StarDust());
  }

  function spawnSparklesAroundRose(count) {
    count = count || 25;
    const rect = roseContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + 90;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.8 + 0.6;
      const p = new StarDust(
        centerX + (Math.random() - 0.5) * 35,
        centerY + (Math.random() - 0.5) * 35,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.random() * 2.5 + 1.2,
        1.0
      );
      particles.push(p);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const alive = p.update();
      if (!alive) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
});

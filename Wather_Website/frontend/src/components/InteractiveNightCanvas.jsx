import { useEffect, useRef } from 'react';

/**
 * InteractiveNightCanvas renders an interactive celestial starry night atmosphere:
 * - 100+ twinkling stars with variable celestial magnitudes and colors.
 * - Interactive Constellation Web: Cursor connects nearby stars with glowing starlight lines.
 * - Shooting Stars / Meteors sparked across the night sky.
 * - Cursor trail leaves cosmic stardust particles.
 * - Clicking triggers an ethereal Supernova / Nebula shockwave.
 * - Pauses RAF when inactive to conserve CPU/GPU.
 */
export function InteractiveNightCanvas({ isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking
    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
      prevX: width * 0.5,
      prevY: height * 0.5,
    };

    // Stardust trail
    const stardust = [];

    // Supernova shockwaves on click
    const shockwaves = [];

    // Shooting stars
    const meteors = [];

    // Generate celestial stars
    const STAR_COUNT = Math.min(105, Math.floor(width / 13));
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: 0.8 + Math.random() * 2.2,
      baseAlpha: 0.25 + Math.random() * 0.65,
      twinkleSpeed: 0.015 + Math.random() * 0.035,
      twinkleOffset: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.6 ? 270 : Math.random() > 0.3 ? 210 : 0, // purple, blue, or crisp white
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const spawnMeteor = (startX, startY) => {
      const angle = 0.55 + Math.random() * 0.25; // diagonal fall
      const speed = 18 + Math.random() * 10;
      meteors.push({
        x: startX ?? Math.random() * width * 0.8,
        y: startY ?? -20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 60 + Math.random() * 50,
        alpha: 0.95,
        decay: 0.025,
      });
    };

    let meteorTimer = setInterval(() => {
      if (Math.random() > 0.35 && meteors.length < 3) {
        spawnMeteor();
      }
    }, 3500);

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      const dist = Math.hypot(dx, dy);

      // Fast cursor motion has a chance to spark a shooting star
      if (dist > 35 && meteors.length < 2 && Math.random() > 0.7) {
        spawnMeteor(e.clientX, e.clientY);
      }

      // Add cosmic stardust trail
      if (dist > 5 && stardust.length < 35) {
        stardust.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 1 + Math.random() * 2,
          alpha: 0.8,
          decay: 0.025 + Math.random() * 0.02,
        });
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    };

    const handlePointerDown = (e) => {
      // Create supernova shockwave
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.42,
        alpha: 0.75,
      });

      // Scatter burst of stardust
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        stardust.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 1.2 + Math.random() * 2.5,
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.02,
        });
      }

      // Always launch a shooting star on click
      spawnMeteor(e.clientX - 100, e.clientY - 120);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // --- 1. Interactive Supernova Shockwaves ---
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08 + 3;
        sw.alpha *= 0.94;

        if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 132, 252, ${sw.alpha * 0.6})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();
      }

      // --- 2. Cosmic Stardust Trail ---
      for (let i = stardust.length - 1; i >= 0; i--) {
        const sp = stardust[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          stardust.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 231, 255, ${sp.alpha})`;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // --- 3. Shooting Stars / Meteors ---
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.decay;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
        const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.6, `rgba(192, 132, 252, ${m.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#e0e7ff';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // --- 4. Interactive Constellation Lines ---
      const constellationRadius = 150;
      const connectedStars = [];

      stars.forEach((star) => {
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < constellationRadius) {
          connectedStars.push({ star, dist });

          // Draw line from cursor to star
          const alpha = (1 - dist / constellationRadius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(star.x, star.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // Connect nearby stars to each other in constellation web
      for (let i = 0; i < connectedStars.length; i++) {
        for (let j = i + 1; j < connectedStars.length; j++) {
          const s1 = connectedStars[i].star;
          const s2 = connectedStars[j].star;
          const d = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          if (d < 110) {
            const alpha = (1 - d / 110) * 0.35;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // --- 5. Render Twinkling Stars ---
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
        const currentAlpha = Math.max(0.12, star.baseAlpha + twinkle * 0.3);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.baseRadius, 0, Math.PI * 2);

        if (star.hue === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.shadowColor = '#ffffff';
        } else {
          ctx.fillStyle = `hsla(${star.hue}, 90%, 80%, ${currentAlpha})`;
          ctx.shadowColor = `hsla(${star.hue}, 100%, 75%, 0.8)`;
        }

        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(meteorTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-15"
      style={{ willChange: 'transform' }}
    />
  );
}

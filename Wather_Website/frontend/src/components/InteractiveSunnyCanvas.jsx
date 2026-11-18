import { useEffect, useRef } from 'react';

/**
 * InteractiveSunnyCanvas renders an interactive solar atmosphere:
 * - The golden sun core and lens flare smoothly track the cursor with fluid inertia.
 * - 50+ floating golden dust motes / solar flares that scatter when the cursor approaches.
 * - Cursor trail generates shimmering sunbeam sparks.
 * - Clicking or tapping creates an expanding solar corona shockwave.
 * - Automatically pauses RAF when inactive to conserve CPU/GPU.
 */
export function InteractiveSunnyCanvas({ isActive }) {
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

    // Track mouse with smooth lerp
    const mouse = {
      x: width * 0.5,
      y: height * 0.25,
      targetX: width * 0.5,
      targetY: height * 0.25,
      isMoving: false,
      speed: 0,
      prevX: width * 0.5,
      prevY: height * 0.25,
    };

    // Sun flares & rotating rays
    let rayAngle = 0;

    // Interactive Shockwaves on click
    const shockwaves = [];

    // Cursor sparks
    const sparks = [];

    // Floating Solar Dust Motes
    const PARTICLE_COUNT = Math.min(55, Math.floor(width / 25));
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.4 - Math.random() * 0.7, // gently floating upward
      radius: 1.2 + Math.random() * 3.5,
      baseAlpha: 0.2 + Math.random() * 0.5,
      alpha: 0.2 + Math.random() * 0.5,
      hue: 35 + Math.random() * 20, // warm amber-gold
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    let moveTimeout;
    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;

      // Add sparks when cursor moves actively
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 5 && sparks.length < 40) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 2 + dx * 0.1,
          vy: (Math.random() - 0.5) * 2 + dy * 0.1 - 0.5,
          radius: 1 + Math.random() * 2.5,
          alpha: 0.8,
          life: 1,
          decay: 0.03 + Math.random() * 0.03,
        });
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        mouse.isMoving = false;
      }, 150);
    };

    const handlePointerDown = (e) => {
      // Trigger a radiant solar corona shockwave
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.45,
        alpha: 0.75,
      });

      // Scatter nearby dust motes outwards with impulse
      particles.forEach((p) => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < 250 && d > 0) {
          const force = (250 - d) / 250 * 8;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate sun position toward cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      rayAngle += dt * 0.15;

      // --- 1. Draw Interactive Solar Flare & Rays ---
      ctx.save();
      ctx.translate(mouse.x, mouse.y);

      // Radial glowing solar core
      const coreGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 320);
      coreGrad.addColorStop(0, 'rgba(255, 230, 150, 0.35)');
      coreGrad.addColorStop(0.2, 'rgba(251, 191, 36, 0.22)');
      coreGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.10)');
      coreGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 320, 0, Math.PI * 2);
      ctx.fill();

      // Rotating solar rays
      const RAY_COUNT = 8;
      ctx.rotate(rayAngle);
      for (let i = 0; i < RAY_COUNT; i++) {
        ctx.rotate((Math.PI * 2) / RAY_COUNT);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-40, 480);
        ctx.lineTo(40, 480);
        ctx.closePath();
        const rayGrad = ctx.createLinearGradient(0, 0, 0, 480);
        rayGrad.addColorStop(0, 'rgba(253, 224, 71, 0.08)');
        rayGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.03)');
        rayGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.restore();

      // --- 2. Interactive Solar Corona Shockwaves ---
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08 + 4;
        sw.alpha *= 0.94;

        if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${sw.alpha * 0.6})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();
      }

      // --- 3. Shimmering Cursor Trail Sparks ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= sp.decay;

        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius * sp.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 160, ${sp.alpha * sp.life})`;
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // --- 4. Interactive Floating Solar Particles (Dust Motes) ---
      particles.forEach((p) => {
        // Natural upward & drifting motion
        p.x += p.vx;
        p.y += p.vy;

        // Mouse avoidance physics: motes scatter gently away from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 140;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.8;
          p.vy += Math.sin(angle) * force * 0.8;
        }

        // Apply friction
        p.vx *= 0.96;
        p.vy *= 0.98;
        if (p.vy > -0.2) p.vy -= 0.02; // maintain gentle upward float

        // Wrap around boundaries
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        // Subtle pulsing brightness
        const pulse = Math.sin(time * 0.002 * p.pulseSpeed * 100 + p.pulseOffset);
        const currentAlpha = Math.max(0.1, p.baseAlpha + pulse * 0.2);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${currentAlpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, ${currentAlpha * 0.8})`;
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(moveTimeout);
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

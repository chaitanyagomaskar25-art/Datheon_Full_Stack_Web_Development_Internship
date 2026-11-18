import { useEffect, useRef } from 'react';

/**
 * InteractiveSnowyCanvas renders an interactive arctic snowfall atmosphere:
 * - 80+ delicate crystalline snowflakes drifting with sinusoidal flutter.
 * - Cursor movements generate winter air vortices that whip and swirl snowflakes.
 * - Cursor trail creates shimmering frost sparkles.
 * - Clicking creates an icy crystallization shockwave with a 360° burst of frost motes.
 * - Pauses RAF when inactive to conserve CPU/GPU.
 */
export function InteractiveSnowyCanvas({ isActive }) {
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
      vx: 0,
      vy: 0,
      prevX: width * 0.5,
      prevY: height * 0.5,
    };

    // Frost sparkle trail from cursor
    const frostSparks = [];

    // Icy crystallization shockwaves on click
    const shockwaves = [];

    // Generate snowflakes
    const FLAKE_COUNT = Math.min(85, Math.floor(width / 16));
    const flakes = Array.from({ length: FLAKE_COUNT }, () => {
      const depth = 0.4 + Math.random() * 0.6;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseVy: (0.8 + Math.random() * 1.4) * depth,
        vx: 0,
        vy: 0,
        radius: (1.5 + Math.random() * 3.5) * depth,
        depth,
        alpha: (0.3 + Math.random() * 0.5) * depth,
        flutterSpeed: 0.02 + Math.random() * 0.03,
        flutterAmp: 1.2 + Math.random() * 1.8,
        flutterOffset: Math.random() * Math.PI * 2,
      };
    });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      const dist = Math.hypot(dx, dy);

      // Create frost sparkles along cursor trail
      if (dist > 6 && frostSparks.length < 35) {
        frostSparks.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 1.5 + dx * 0.05,
          vy: (Math.random() - 0.5) * 1.5 + dy * 0.05,
          radius: 1 + Math.random() * 2,
          alpha: 0.85,
          decay: 0.025 + Math.random() * 0.02,
        });
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    };

    const handlePointerDown = (e) => {
      // Create icy shockwave
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 12,
        maxRadius: Math.max(width, height) * 0.4,
        alpha: 0.7,
      });

      // Burst of frost sparkles outward
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        frostSparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 1.2 + Math.random() * 2.5,
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.02,
        });
      }

      // Impel snowflakes away from click point
      flakes.forEach((f) => {
        const dx = f.x - e.clientX;
        const dy = f.y - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < 260 && d > 0) {
          const force = ((260 - d) / 260) * 8 * f.depth;
          f.vx += (dx / d) * force;
          f.vy += (dy / d) * force;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      const oldX = mouse.x;
      const oldY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;
      mouse.vx = mouse.x - oldX;
      mouse.vy = mouse.y - oldY;

      // --- 1. Interactive Icy Crystallization Shockwaves ---
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
        ctx.strokeStyle = `rgba(224, 242, 254, ${sw.alpha * 0.6})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#bae6fd';
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();
      }

      // --- 2. Frost Sparkle Trail ---
      for (let i = frostSparks.length - 1; i >= 0; i--) {
        const sp = frostSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          frostSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 249, 255, ${sp.alpha})`;
        ctx.shadowColor = '#7dd3fc';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // --- 3. Render Snowflakes with Cursor Wind Vortex Physics ---
      const windInfluenceRadius = 160;

      flakes.forEach((f) => {
        // Natural downward drift + sinusoidal horizontal flutter
        const flutter = Math.sin(time * f.flutterSpeed * 60 + f.flutterOffset) * f.flutterAmp;
        f.x += flutter + f.vx;
        f.y += f.baseVy + f.vy;

        // Friction on impulses
        f.vx *= 0.95;
        f.vy *= 0.96;

        // Mouse wind effect: moving cursor whips snowflakes in direction of motion
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < windInfluenceRadius && dist > 0) {
          const force = (windInfluenceRadius - dist) / windInfluenceRadius;
          // Apply cursor velocity wind
          f.vx += mouse.vx * force * 0.12 * f.depth;
          f.vy += mouse.vy * force * 0.08 * f.depth;

          // Gentle outward push
          const angle = Math.atan2(dy, dx);
          f.vx += Math.cos(angle) * force * 0.6;
          f.vy += Math.sin(angle) * force * 0.6;
        }

        // Screen boundary wrap
        if (f.y > height + 15) {
          f.y = -15;
          f.x = Math.random() * width;
        }
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;

        // Draw snowflake with soft frost glow
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
        ctx.shadowColor = 'rgba(186, 230, 253, 0.7)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
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

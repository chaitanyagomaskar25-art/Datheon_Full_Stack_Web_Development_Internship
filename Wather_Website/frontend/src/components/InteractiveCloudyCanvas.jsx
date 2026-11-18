import { useEffect, useRef } from 'react';

/**
 * InteractiveCloudyCanvas renders an interactive volumetric cloudy/overcast atmosphere:
 * - 3 depth planes of drifting volumetric cloud puffs.
 * - Cursor movements create an interactive "wind wake" that parts and disperses clouds.
 * - Cursor leaves behind ethereal wisps of swirling mist.
 * - Optical 3D parallax shifts clouds based on cursor position.
 * - Clicking creates a mist shockwave with an ambient overcast illumination pulse.
 * - Pauses RAF when inactive to conserve resources.
 */
export function InteractiveCloudyCanvas({ isActive }) {
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

    // Mouse tracking with smooth lerp
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

    // Parallax offset
    const parallax = { x: 0, y: 0 };

    // Swirling interactive mist wisps created by mouse movement
    const mistWisps = [];

    // Ambient cloud shockwaves on click
    const shockwaves = [];

    // Generate volumetric cloud puffs in 3 depth layers
    const CLOUD_COUNT = Math.min(38, Math.floor(width / 35));
    const clouds = Array.from({ length: CLOUD_COUNT }, () => {
      const depth = 0.3 + Math.random() * 0.7; // 0.3 (deep background) to 1.0 (foreground)
      return {
        x: Math.random() * (width + 300) - 150,
        y: Math.random() * height * 0.75 + height * 0.05,
        baseVx: (0.15 + depth * 0.3) * (Math.random() > 0.1 ? 1 : 0.8), // gentle horizontal drift
        vx: 0,
        vy: 0,
        radius: (80 + Math.random() * 120) * depth,
        depth,
        alpha: (0.08 + Math.random() * 0.12) * depth,
        hue: 215 + Math.random() * 15, // misty slate-blue
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

      // Create mist trail behind cursor when moving actively
      if (dist > 4 && mistWisps.length < 30) {
        mistWisps.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5 + dx * 0.08,
          vy: (Math.random() - 0.5) * 1.5 + dy * 0.08 - 0.2,
          radius: 20 + Math.random() * 35,
          maxRadius: 60 + Math.random() * 40,
          alpha: 0.25,
          decay: 0.015 + Math.random() * 0.01,
        });
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    };

    const handlePointerDown = (e) => {
      // Create parting shockwave in cloud layer
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 15,
        maxRadius: Math.max(width, height) * 0.4,
        alpha: 0.45,
      });

      // Part clouds away from click point
      clouds.forEach((c) => {
        const dx = c.x - e.clientX;
        const dy = c.y - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < 300 && d > 0) {
          const force = ((300 - d) / 300) * 10 * c.depth;
          c.vx += (dx / d) * force;
          c.vy += (dy / d) * force;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor lerp
      const oldX = mouse.x;
      const oldY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouse.vx = mouse.x - oldX;
      mouse.vy = mouse.y - oldY;

      // Parallax shift based on normalized cursor position (-1 to 1)
      const normX = (mouse.x / width - 0.5) * 2;
      const normY = (mouse.y / height - 0.5) * 2;
      parallax.x += (normX * 25 - parallax.x) * 0.05;
      parallax.y += (normY * 15 - parallax.y) * 0.05;

      // --- 1. Render Shockwaves ---
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
        ctx.strokeStyle = `rgba(186, 230, 253, ${sw.alpha * 0.4})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      // --- 2. Render Interactive Mist Wisps (Cursor Trail) ---
      for (let i = mistWisps.length - 1; i >= 0; i--) {
        const wisp = mistWisps[i];
        wisp.x += wisp.vx;
        wisp.y += wisp.vy;
        wisp.radius += (wisp.maxRadius - wisp.radius) * 0.05;
        wisp.alpha -= wisp.decay;

        if (wisp.alpha <= 0) {
          mistWisps.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(
          wisp.x,
          wisp.y,
          0,
          wisp.x,
          wisp.y,
          wisp.radius
        );
        grad.addColorStop(0, `rgba(203, 213, 225, ${wisp.alpha * 0.3})`);
        grad.addColorStop(0.5, `rgba(148, 163, 184, ${wisp.alpha * 0.15})`);
        grad.addColorStop(1, 'rgba(148, 163, 184, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 3. Render Volumetric Cloud Puffs with Interaction & Parallax ---
      // Sort clouds by depth so deep clouds render behind foreground clouds
      clouds.sort((a, b) => a.depth - b.depth);

      clouds.forEach((cloud) => {
        // Natural drift
        cloud.x += cloud.baseVx + cloud.vx;
        cloud.y += cloud.vy;

        // Apply friction to cursor impulses
        cloud.vx *= 0.94;
        cloud.vy *= 0.94;

        // Interactive parting: as cursor moves close, clouds part smoothly
        const px = cloud.x + parallax.x * cloud.depth;
        const py = cloud.y + parallax.y * cloud.depth;
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = cloud.radius * 1.3;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          // Push cloud away from cursor
          cloud.vx += Math.cos(angle) * force * 1.2 * cloud.depth;
          cloud.vy += Math.sin(angle) * force * 1.2 * cloud.depth;
        }

        // Wrap around boundaries
        if (cloud.x - cloud.radius > width + 100) {
          cloud.x = -cloud.radius - 80;
          cloud.y = Math.random() * height * 0.75 + height * 0.05;
        }
        if (cloud.y - cloud.radius > height + 80) cloud.y = -cloud.radius;
        if (cloud.y + cloud.radius < -80) cloud.y = height + cloud.radius;

        // Render soft volumetric cloud puff with radial gradient
        const drawX = cloud.x + parallax.x * cloud.depth;
        const drawY = cloud.y + parallax.y * cloud.depth;

        const grad = ctx.createRadialGradient(
          drawX,
          drawY,
          cloud.radius * 0.1,
          drawX,
          drawY,
          cloud.radius
        );

        grad.addColorStop(0, `hsla(${cloud.hue}, 20%, 75%, ${cloud.alpha})`);
        grad.addColorStop(0.4, `hsla(${cloud.hue}, 22%, 65%, ${cloud.alpha * 0.65})`);
        grad.addColorStop(0.7, `hsla(${cloud.hue}, 25%, 50%, ${cloud.alpha * 0.25})`);
        grad.addColorStop(1, `hsla(${cloud.hue}, 30%, 40%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, cloud.radius, 0, Math.PI * 2);
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

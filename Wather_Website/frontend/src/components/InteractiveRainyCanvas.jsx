import { useEffect, useRef } from 'react';

/**
 * InteractiveRainyCanvas renders an interactive storm precipitation atmosphere:
 * - Falling angled raindrops with realistic terminal velocities.
 * - Cursor creates an interactive splash forcefield: raindrops colliding with the cursor
 *   splatter into micro water droplets.
 * - Cursor trail leaves expanding water ripples.
 * - Clicking triggers a water ripple shockwave and an ambient lightning illumination flash.
 * - Pauses RAF when inactive to conserve CPU/GPU.
 */
export function InteractiveRainyCanvas({ isActive }) {
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

    // Splash droplets created on cursor collision or bottom impact
    const splashes = [];

    // Water ripple shockwaves on click
    const shockwaves = [];

    // Ambient lightning flash effect
    let lightningAlpha = 0;

    // Generate falling raindrops
    const DROP_COUNT = Math.min(110, Math.floor(width / 12));
    const rainAngle = 0.18; // slight angled rain wind
    const cosAngle = Math.cos(rainAngle);
    const sinAngle = Math.sin(rainAngle);

    const raindrops = Array.from({ length: DROP_COUNT }, () => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      speed: 16 + Math.random() * 14,
      length: 18 + Math.random() * 22,
      thickness: 1 + Math.random() * 1.5,
      alpha: 0.25 + Math.random() * 0.45,
    }));

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

      // Create subtle water ripples behind cursor when moving
      if (dist > 8 && shockwaves.length < 15) {
        shockwaves.push({
          x: e.clientX,
          y: e.clientY,
          radius: 6,
          maxRadius: 40 + Math.random() * 30,
          alpha: 0.35,
        });
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    };

    const handlePointerDown = (e) => {
      // Trigger lightning flash
      lightningAlpha = 0.45;

      // Create big water ripple shockwave
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.38,
        alpha: 0.7,
      });

      // Scatter burst of water droplets
      for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 6;
        splashes.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 2,
          radius: 1.5 + Math.random() * 2,
          alpha: 0.75,
          decay: 0.03 + Math.random() * 0.02,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // --- 1. Ambient Lightning Illumination Flash ---
      if (lightningAlpha > 0.01) {
        ctx.fillStyle = `rgba(186, 230, 253, ${lightningAlpha * 0.22})`;
        ctx.fillRect(0, 0, width, height);
        lightningAlpha *= 0.88;
      }

      // --- 2. Interactive Water Ripple Shockwaves ---
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.09 + 2.5;
        sw.alpha *= 0.94;

        if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${sw.alpha * 0.55})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // --- 3. Interactive Splash Particles ---
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.25; // gravity
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${sp.alpha})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // --- 4. Render Falling Raindrops with Cursor Deflection/Splatter ---
      const cursorShieldRadius = 90;

      ctx.save();
      raindrops.forEach((drop) => {
        // Move drop along angled trajectory
        drop.x += sinAngle * drop.speed;
        drop.y += cosAngle * drop.speed;

        // Collision check with mouse cursor
        const dx = drop.x - mouse.x;
        const dy = drop.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < cursorShieldRadius) {
          // Splatter drop into micro droplets at point of collision
          if (splashes.length < 45 && Math.random() > 0.4) {
            splashes.push({
              x: drop.x,
              y: drop.y,
              vx: (dx / dist) * (2 + Math.random() * 4),
              vy: -1 - Math.random() * 3,
              radius: 1 + Math.random() * 1.5,
              alpha: 0.7,
              decay: 0.04,
            });
          }
          // Reset drop above
          drop.y = -20;
          drop.x = Math.random() * (width + 200) - 100;
        }

        // Reset if past screen bottom
        if (drop.y > height + 20) {
          // Chance of bottom splash
          if (splashes.length < 45 && Math.random() > 0.7) {
            splashes.push({
              x: drop.x,
              y: height - 5,
              vx: (Math.random() - 0.5) * 3,
              vy: -1 - Math.random() * 2,
              radius: 1 + Math.random() * 1.2,
              alpha: 0.5,
              decay: 0.05,
            });
          }
          drop.y = -20;
          drop.x = Math.random() * (width + 200) - 100;
        }

        // Draw raindrop streak
        const endX = drop.x + sinAngle * drop.length;
        const endY = drop.y + cosAngle * drop.length;

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(186, 230, 253, ${drop.alpha})`;
        ctx.lineWidth = drop.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
      ctx.restore();

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

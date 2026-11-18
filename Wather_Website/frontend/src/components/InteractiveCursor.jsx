import { useEffect, useRef, useState } from 'react';

/**
 * InteractiveCursor renders a high-visibility, high-contrast atmospheric telemetry cursor:
 * - Completely hides the default OS arrow cursor.
 * - Bold, high-contrast central core with a crisp white rim and vivid weather glow.
 * - Bold outer telemetry reticle with crosshair notches and smooth fluid trailing.
 * - Reactive states:
 *   - Hovering buttons, links, search bar, and cards: expands into a luminous target lock.
 *   - Clicking: punchy spring contraction with a bright flash ring.
 * - Smooth fluid particle trailing with weather stardust.
 * - Always clearly visible over both dark gradients and bright glass cards.
 */

const THEME_STYLES = {
  sunny: {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.75)',
    core: '#fffbeb',
    svgColor: '#fde047',
    trailHue: '45, 100%, 65%',
  },
  cloudy: {
    primary: '#38bdf8',
    secondary: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.75)',
    core: '#f0f9ff',
    svgColor: '#7dd3fc',
    trailHue: '198, 95%, 65%',
  },
  rainy: {
    primary: '#00e5ff',
    secondary: '#0284c7',
    glow: 'rgba(0, 229, 255, 0.75)',
    core: '#ecfeff',
    svgColor: '#38bdf8',
    trailHue: '190, 100%, 60%',
  },
  snowy: {
    primary: '#7dd3fc',
    secondary: '#38bdf8',
    glow: 'rgba(125, 211, 252, 0.8)',
    core: '#ffffff',
    svgColor: '#e0f2fe',
    trailHue: '195, 100%, 80%',
  },
  night: {
    primary: '#c084fc',
    secondary: '#a855f7',
    glow: 'rgba(192, 132, 252, 0.8)',
    core: '#faf5ff',
    svgColor: '#d8b4fe',
    trailHue: '275, 95%, 75%',
  },
};

export function InteractiveCursor({ theme = 'night' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInputHover, setIsInputHover] = useState(false);

  const dotRef = useRef(null);
  const reticleRef = useRef(null);
  const canvasRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100 });
  const reticle = useRef({ x: -100, y: -100, rotation: 0 });
  const trail = useRef([]);

  const currentTheme = THEME_STYLES[theme] || THEME_STYLES.night;

  useEffect(() => {
    // Only disable if device has coarse touch AND NO fine pointer (pure mobile phones without mouse)
    if (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handlePointerMove = (e) => {
      // Ignore simulated touch mouse events
      if (e.pointerType === 'touch') return;

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant inner core placement
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Add to particle trail
      if (trail.current.length < 16) {
        trail.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 3 + Math.random() * 2.5,
          alpha: 0.75,
          decay: 0.04,
        });
      }

      // Check hover targets
      const target = e.target;
      if (target) {
        const inputElem = target.closest('input, textarea, [contenteditable="true"]');
        setIsInputHover(Boolean(inputElem));

        const interactiveElem = target.closest(
          'button, a, select, [role="button"], [data-cursor-hover], .cursor-pointer'
        );
        setIsHovering(Boolean(interactiveElem));
      }
    };

    const handlePointerDown = () => setIsClicking(true);
    const handlePointerUp = () => setIsClicking(false);
    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    // Continuous smooth animation loop
    let animId;
    const render = () => {
      // Smoothly lerp outer reticle towards mouse
      const dx = mouse.current.x - reticle.current.x;
      const dy = mouse.current.y - reticle.current.y;
      reticle.current.x += dx * 0.22;
      reticle.current.y += dy * 0.22;

      // Reticle rotation
      reticle.current.rotation += isHovering ? 2.5 : 0.9;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticle.current.x}px, ${reticle.current.y}px, 0) rotate(${reticle.current.rotation}deg)`;
      }

      // Render particle trail on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = trail.current.length - 1; i >= 0; i--) {
          const p = trail.current[i];
          p.alpha -= p.decay;
          p.radius *= 0.95;

          if (p.alpha <= 0) {
            trail.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${currentTheme.trailHue}, ${p.alpha})`;
          ctx.shadowColor = currentTheme.primary;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
    };
  }, [isVisible, isHovering, currentTheme]);

  if (!isVisible) return null;

  return (
    <>
      {/* Canvas for Smooth Fluid Particle Trailing */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9990]"
      />

      {/* Instant High-Contrast Central Precision Core */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      >
        <div
          className={`relative -ml-2 -mt-2 w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-150 ${
            isClicking ? 'scale-75' : isHovering ? 'scale-135' : 'scale-100'
          }`}
        >
          {/* Outer high-contrast black shadow halo */}
          <div className="absolute inset-0 rounded-full bg-black/60 blur-[2px]" />

          {/* Crisp 2px white border with vivid themed interior */}
          <div
            className="relative w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_12px_rgba(0,0,0,0.9)] flex items-center justify-center"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.glow}, 0 2px 6px rgba(0,0,0,0.85)`,
            }}
          >
            {/* Center white focal sparkle */}
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: currentTheme.core }}
            />
          </div>
        </div>
      </div>

      {/* Trailing High-Contrast Atmospheric Telemetry Reticle */}
      <div
        ref={reticleRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-300 ease-out ${
            isClicking
              ? '-ml-4 -mt-4 w-8 h-8 scale-90'
              : isHovering
              ? '-ml-7 -mt-7 w-14 h-14 scale-110'
              : '-ml-5 -mt-5 w-10 h-10'
          }`}
        >
          {/* Bold SVG Atmospheric Radar Reticle */}
          <svg
            viewBox="0 0 48 48"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: `drop-shadow(0 0 8px ${currentTheme.primary}) drop-shadow(0 1px 4px rgba(0,0,0,0.9))`,
            }}
          >
            {/* Outer segmented radar ring */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={currentTheme.svgColor}
              strokeWidth="2.5"
              strokeDasharray={isHovering ? '12 8' : '18 10'}
              strokeLinecap="round"
              className="opacity-95"
            />

            {/* 4 Cardinal Crosshair Telemetry Notches */}
            <line x1="24" y1="1" x2="24" y2="7" stroke={currentTheme.svgColor} strokeWidth="2.8" strokeLinecap="round" />
            <line x1="24" y1="41" x2="24" y2="47" stroke={currentTheme.svgColor} strokeWidth="2.8" strokeLinecap="round" />
            <line x1="1" y1="24" x2="7" y2="24" stroke={currentTheme.svgColor} strokeWidth="2.8" strokeLinecap="round" />
            <line x1="41" y1="24" x2="47" y2="24" stroke={currentTheme.svgColor} strokeWidth="2.8" strokeLinecap="round" />

            {/* Inner target circle on hover */}
            {isHovering && (
              <circle
                cx="24"
                cy="24"
                r="12"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                className="animate-spin-slow opacity-90"
              />
            )}
          </svg>
        </div>
      </div>
    </>
  );
}

import { memo } from 'react';
import { InteractiveSunnyCanvas } from './InteractiveSunnyCanvas';
import { InteractiveCloudyCanvas } from './InteractiveCloudyCanvas';
import { InteractiveRainyCanvas } from './InteractiveRainyCanvas';
import { InteractiveSnowyCanvas } from './InteractiveSnowyCanvas';
import { InteractiveNightCanvas } from './InteractiveNightCanvas';

/**
 * DynamicBackground renders 5 distinct, vibrant, GPU-accelerated atmospheric weather themes:
 * - 'sunny': Warm yellow and golden-orange solar gradient + interactive tracking sunbeams & solar burst
 * - 'cloudy': Soft grey and atmospheric blue gradient + interactive cloud parting & mist wake
 * - 'rainy': Deep oceanic blue and charcoal grey storm gradient + interactive falling raindrops & lightning
 * - 'snowy': Icy crystalline blue and frosted white gradient + interactive blizzard snowflakes & frost shockwave
 * - 'night': Dark celestial navy and royal purple gradient + interactive constellations & shooting meteors
 * 
 * Uses multi-layer opacity cross-dissolve (1000ms ease-in-out) for seamless transitions.
 */

const THEME_DEFINITIONS = {
  sunny: {
    // Warm yellow, amber and golden-orange solar daylight gradient
    bgGradient: 'from-[#1e1505] via-[#352306] to-[#0f1a33]',
    orb1: 'bg-amber-400/35 shadow-[0_0_160px_rgba(251,191,36,0.55)]',
    orb2: 'bg-orange-500/30 shadow-[0_0_150px_rgba(249,115,22,0.45)]',
    orb3: 'bg-yellow-400/25 shadow-[0_0_120px_rgba(250,204,21,0.35)]',
  },
  cloudy: {
    // Soft overcast grey and atmospheric steel blue gradient
    bgGradient: 'from-[#111823] via-[#1f293d] to-[#0f1724]',
    orb1: 'bg-slate-300/30 shadow-[0_0_150px_rgba(203,213,225,0.45)]',
    orb2: 'bg-sky-600/30 shadow-[0_0_140px_rgba(2,132,199,0.4)]',
    orb3: 'bg-slate-400/25 shadow-[0_0_120px_rgba(148,163,184,0.35)]',
  },
  rainy: {
    // Deep oceanic storm blue, rainy indigo and charcoal grey gradient
    bgGradient: 'from-[#061224] via-[#0b2142] to-[#081326]',
    orb1: 'bg-sky-500/35 shadow-[0_0_160px_rgba(14,165,233,0.55)]',
    orb2: 'bg-indigo-600/30 shadow-[0_0_140px_rgba(79,70,229,0.45)]',
    orb3: 'bg-cyan-600/25 shadow-[0_0_120px_rgba(8,145,178,0.35)]',
  },
  snowy: {
    // Icy crystalline arctic blue, frosted white and glacial cyan gradient
    bgGradient: 'from-[#0b1f36] via-[#143354] to-[#091728]',
    orb1: 'bg-cyan-300/35 shadow-[0_0_160px_rgba(103,232,249,0.55)]',
    orb2: 'bg-sky-200/30 shadow-[0_0_140px_rgba(186,230,253,0.45)]',
    orb3: 'bg-white/20 shadow-[0_0_120px_rgba(255,255,255,0.3)]',
  },
  night: {
    // Dark celestial navy, deep space sapphire and royal purple gradient
    bgGradient: 'from-[#050816] via-[#0d1033] to-[#1c0f38]',
    orb1: 'bg-purple-600/35 shadow-[0_0_160px_rgba(147,51,234,0.5)]',
    orb2: 'bg-indigo-600/30 shadow-[0_0_140px_rgba(79,70,229,0.45)]',
    orb3: 'bg-sky-500/20 shadow-[0_0_120px_rgba(56,189,248,0.35)]',
  },
};

const THEME_KEYS = ['sunny', 'cloudy', 'rainy', 'snowy', 'night'];

export const DynamicBackground = memo(function DynamicBackground({ theme = 'night' }) {
  const activeTheme = THEME_DEFINITIONS[theme] ? theme : 'night';

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-[#050814]">
      {/* Permanent atmospheric mesh overlay */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50 z-20 pointer-events-none" />

      {/* Cross-fading themed layers */}
      {THEME_KEYS.map((key) => {
        const item = THEME_DEFINITIONS[key];
        const isActive = activeTheme === key;

        return (
          <div
            key={key}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Themed Base Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient}`} />

            {/* Floating Themed Ambient Orbs */}
            <div
              className={`absolute -top-24 -left-20 w-[500px] h-[500px] rounded-full blur-[115px] animate-pulse-glow ${item.orb1}`}
            />
            <div
              className={`absolute top-1/3 -right-24 w-[540px] h-[540px] rounded-full blur-[135px] animate-float-slow ${item.orb2}`}
            />
            <div
              className={`absolute -bottom-24 left-1/3 w-[580px] h-[580px] rounded-full blur-[145px] animate-float-delayed ${item.orb3}`}
            />

            {/* Weather-Specific Interactive Canvases */}
            {key === 'sunny' && <InteractiveSunnyCanvas isActive={isActive} />}
            {key === 'cloudy' && <InteractiveCloudyCanvas isActive={isActive} />}
            {key === 'rainy' && <InteractiveRainyCanvas isActive={isActive} />}
            {key === 'snowy' && <InteractiveSnowyCanvas isActive={isActive} />}
            {key === 'night' && <InteractiveNightCanvas isActive={isActive} />}
          </div>
        );
      })}
    </div>
  );
});

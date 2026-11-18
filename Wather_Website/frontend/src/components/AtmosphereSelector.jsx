import { useState, useRef, useEffect } from 'react';
import { Sparkles, Sun, Cloud, CloudRain, Snowflake, Moon, Check, RefreshCw } from 'lucide-react';
import { THEMES } from '@/utils/weatherHelpers';

const OPTIONS = [
  { id: 'auto', label: 'Auto (City Weather)', icon: RefreshCw, desc: 'Syncs with live city condition & sun' },
  { id: 'sunny', label: 'Sunny Day (Interactive)', icon: Sun, desc: 'Cursor sunbeams, sparks & solar shockwave' },
  { id: 'cloudy', label: 'Overcast Clouds (Interactive)', icon: Cloud, desc: 'Interactive cloud parting & mist wake' },
  { id: 'rainy', label: 'Active Rain (Interactive)', icon: CloudRain, desc: 'Raindrop splatter, ripples & lightning' },
  { id: 'snowy', label: 'Icy Snowfall (Interactive)', icon: Snowflake, desc: 'Blizzard air vortex & frost shockwave' },
  { id: 'night', label: 'Celestial Night (Interactive)', icon: Moon, desc: 'Constellations, shooting stars & supernova' },
];

export function AtmosphereSelector({
  currentTheme,
  overrideTheme,
  onSelectTheme,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeMeta = THEMES[currentTheme] || THEMES.night;
  const isAuto = !overrideTheme || overrideTheme === 'auto';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-card border border-white/10 hover:border-white/20 transition-all text-xs font-semibold shadow-md active:scale-95 group"
        title="Change or lock atmospheric background"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
        </span>
        <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Atmosphere:</span>
        <span className={`${activeMeta.accentText} font-medium`}>
          {activeMeta.label}
        </span>
        {isAuto ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-normal">
            Auto
          </span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-normal border border-sky-500/30">
            Locked
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-white/15 bg-slate-950/90 backdrop-blur-2xl shadow-2xl z-50 p-2 animate-fade-in divide-y divide-white/5">
          <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Atmospheric Ambience</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>

          <div className="py-1 space-y-1">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = isAuto ? opt.id === 'auto' : overrideTheme === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 text-white border border-sky-400/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-300' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{opt.desc}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 text-[10px] text-slate-400 leading-tight">
            Backgrounds smoothly cross-dissolve with 60fps GPU acceleration.
          </div>
        </div>
      )}
    </div>
  );
}

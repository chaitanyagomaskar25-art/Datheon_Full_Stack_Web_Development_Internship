import { CloudRain, Database, Sparkles, Compass } from 'lucide-react';
import { TemperatureToggle } from './TemperatureToggle';

export function Navbar({ unit, onUnitChange, dbStatus = 'checking', onExploreClick }) {
  return (
    <nav className="sticky top-0 z-40 glass-nav backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-600 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative grid place-items-center w-11 h-11 rounded-2xl bg-slate-900 border border-white/20 text-sky-400 shadow-xl">
                <CloudRain className="w-6 h-6 transform group-hover:scale-110 transition duration-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-sky-300 transition">
                  Sky<span className="text-sky-400">Cast</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-300 border border-sky-400/30">
                  <Sparkles className="w-2.5 h-2.5" /> MERN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
                Atmospheric Telemetry & Forecasts
              </p>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* MongoDB Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs text-slate-300 border border-white/10">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400 font-normal">DB:</span>
              <span className="flex items-center gap-1.5 font-medium text-white">
                <span
                  className={`w-2 h-2 rounded-full ${
                    dbStatus === 'connected'
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : dbStatus === 'checking'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                  }`}
                />
                {dbStatus === 'connected' ? 'MongoDB Online' : dbStatus === 'checking' ? 'Connecting...' : 'Active (Cluster)'}
              </span>
            </div>

            {/* Explore Button */}
            <button
              type="button"
              onClick={onExploreClick}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Explore</span>
            </button>

            {/* Unit Switcher */}
            <TemperatureToggle unit={unit} onChange={onUnitChange} />

          </div>

        </div>
      </div>
    </nav>
  );
}

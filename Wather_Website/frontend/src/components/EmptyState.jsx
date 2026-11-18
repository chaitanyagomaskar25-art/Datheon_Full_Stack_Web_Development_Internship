import { CloudSun, Sparkles, Compass } from 'lucide-react';

export function EmptyState({ onExploreClick }) {
  return (
    <div className="glass-card rounded-3xl p-10 sm:p-14 text-center animate-fade-in border border-white/10 relative overflow-hidden">
      <div className="relative inline-grid place-items-center mb-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-purple-500/20 to-transparent border border-white/10 grid place-items-center shadow-xl">
          <CloudSun
            className="w-10 h-10 text-sky-400 animate-float-slow"
            aria-hidden="true"
          />
        </div>
        <Sparkles
          className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight">
        Explore Weather Telemetry
      </h3>
      <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm leading-relaxed">
        Search for any global city or click on trending destinations above to view live atmospheric metrics, temperatures, and 5-day forecasts.
      </p>
    </div>
  );
}

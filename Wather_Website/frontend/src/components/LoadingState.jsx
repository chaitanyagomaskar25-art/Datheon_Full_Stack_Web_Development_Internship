import { Loader2, Radio } from 'lucide-react';

export function LoadingState() {
  return (
    <div
      className="glass-card rounded-3xl p-12 text-center animate-fade-in border border-sky-400/20 shadow-2xl relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="relative inline-block mb-4">
        <div className="absolute -inset-2 bg-sky-400/20 rounded-full blur-md animate-ping" />
        <div className="relative w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-sky-400 grid place-items-center">
          <Loader2 className="w-7 h-7 animate-spin-slow" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-white font-bold text-lg">Querying SkyCast Telemetry API</h3>
      <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
        Acquiring live weather radar, barometric sensors, and forecast models...
      </p>
    </div>
  );
}

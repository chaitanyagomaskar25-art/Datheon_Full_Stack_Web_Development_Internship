import { CalendarDays, CloudRain, ShieldCheck, Sparkles } from 'lucide-react';
import { ForecastCard } from './ForecastCard';

export function ForecastSection({ days, unit }) {
  return (
    <section aria-label="5-day weather forecast" className="animate-rise mt-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-purple-600/20 border border-sky-400/30 text-sky-400 grid place-items-center shadow-md">
            <CalendarDays className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              5-Day Atmospheric Forecast
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Daily calendar predictions grouped by local solar cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="px-3 py-1 rounded-full glass-card border border-white/10 hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Real-time Multi-day Telemetry</span>
          </span>
        </div>
      </div>

      {/* Dynamic Forecast Grid using Array.map() */}
      {!days || days.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center border border-white/10 shadow-xl">
          <CloudRain className="w-10 h-10 mx-auto mb-3 text-slate-400" aria-hidden="true" />
          <h3 className="text-white font-bold text-base">Forecast Data Pending</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
            Search for a city above to load the official 5-day predictive meteorological forecast.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {days.map((day) => (
            <ForecastCard
              key={day.date}
              day={day}
              unit={unit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

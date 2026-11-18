import { Droplets, Sun, CloudRain } from 'lucide-react';
import { iconUrlSmall } from '@/utils/weatherHelpers';
import { formatTemp } from '@/utils/temperature';

export function ForecastCard({ day, unit, isToday = false }) {
  const hasRain = day.precipitation > 0;

  return (
    <div className="group relative rounded-3xl glass-card p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-[0_20px_35px_-10px_rgba(56,189,248,0.25)] border border-white/10 flex flex-col justify-between overflow-hidden">
      
      {/* Background ambient subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header: Day Name & Date */}
      <div className="relative z-10">
        <div className="flex items-center justify-between sm:justify-center gap-1.5 mb-1">
          <p className="text-white font-extrabold text-base sm:text-lg tracking-tight">
            {day.dayName}
          </p>
        </div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {day.dateLabel}
        </p>
      </div>

      {/* Center: Dynamic Weather Icon with Hover Zoom */}
      <div className="relative z-10 my-4 grid place-items-center">
        <div className="relative w-20 h-20 rounded-2xl bg-slate-900/40 border border-white/10 grid place-items-center shadow-inner group-hover:border-sky-400/30 transition duration-300">
          <img
            src={iconUrlSmall(day.condition.icon)}
            alt={day.condition.description}
            className="w-16 h-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] group-hover:scale-115 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Condition Text */}
        <p className="text-sky-300 font-semibold capitalize text-xs mt-2.5 line-clamp-1 group-hover:text-sky-200 transition">
          {day.condition.description}
        </p>
      </div>

      {/* Bottom Section: Temperature Range & Precipitation */}
      <div className="relative z-10 pt-3 border-t border-white/10 space-y-3">
        {/* Min / Max Temperatures */}
        <div className="flex items-center justify-between text-sm px-1">
          <span className="text-slate-400 font-medium text-xs">
            Low: <strong className="text-slate-300 font-bold">{formatTemp(day.tempMin, unit)}</strong>
          </span>
          <span className="text-white font-extrabold text-base">
            {formatTemp(day.tempMax, unit)}
          </span>
        </div>

        {/* Mini Temperature Range Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 opacity-80 group-hover:opacity-100 transition duration-300"
            style={{ width: '100%' }}
          />
        </div>

        {/* Precipitation Chance */}
        <div className="flex items-center justify-center pt-1">
          {hasRain ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/25 text-sky-300 text-[11px] font-semibold">
              <Droplets className="w-3 h-3 text-sky-400 animate-pulse" aria-hidden="true" />
              <span>{day.precipitation}% Rain</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-[11px] font-medium">
              <Sun className="w-3 h-3 text-amber-300/80" aria-hidden="true" />
              <span>0% Rain</span>
            </span>
          )}
        </div>
      </div>

    </div>
  );
}

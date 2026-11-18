import { MapPin, Sunrise, Sunset, RefreshCw, Clock, Star, Compass, Wind } from 'lucide-react';
import {
  formatLocalTime,
  iconUrl,
  isDaytime,
} from '@/utils/weatherHelpers';
import { formatTemp, formatTempLong } from '@/utils/temperature';

export function CurrentWeather({
  data,
  unit,
  lastUpdated,
  isFavorite,
  onToggleFavorite,
  isSavingFavorite,
}) {
  const day = isDaytime(data.dt, data.sunrise, data.sunset);

  return (
    <section
      className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] animate-rise overflow-hidden relative border border-white/15"
      aria-label="Current weather telemetry"
    >
      {/* Decorative ambient background gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-sky-400/20 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" />

      {/* Header bar within card */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 relative z-10">
        
        {/* City and Coordinates */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-white">
              <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20">
                <MapPin className="w-5 h-5 shrink-0" aria-hidden="true" />
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                {data.city}{data.country ? `, ${data.country}` : ''}
              </h2>
            </div>

            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={onToggleFavorite}
                disabled={isSavingFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                className={`p-2.5 rounded-xl transition duration-300 border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-400/15 text-amber-300 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                    : 'glass-pill text-slate-300 hover:text-white border-white/10 hover:border-amber-400/40'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
                />
                <span className="hidden sm:inline">
                  {isFavorite ? 'Saved' : 'Save'}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm mt-2 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {formatLocalTime(data.dt, data.timezone)} (Local)
            </span>
            <span className="text-white/30">•</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs">
              {day ? '☀️ Daytime' : '🌙 Night'}
            </span>
            {data.coord && (
              <>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  {data.coord.lat.toFixed(2)}°N, {data.coord.lon.toFixed(2)}°E
                </span>
              </>
            )}
          </div>
        </div>

        {/* Big Temperature & Weather Icon */}
        <div className="flex items-center gap-4 sm:gap-6 self-start">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative grid place-items-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/80 border border-white/20 shadow-2xl overflow-hidden backdrop-blur-xl">
              <img
                src={iconUrl(data.condition.icon)}
                alt={data.condition.description}
                className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition duration-300"
                loading="eager"
              />
            </div>
          </div>

          <div className="leading-none">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white">
              {formatTemp(data.temp, unit)}
            </div>
            <p className="text-sky-300 font-semibold capitalize mt-2 text-base sm:text-lg">
              {data.condition.description}
            </p>
          </div>
        </div>

      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 relative z-10">
        <Stat
          label="Feels Like"
          value={formatTempLong(data.feelsLike, unit)}
          sub="Perceived temp"
        />
        <Stat
          label="High Today"
          value={formatTempLong(data.tempMax, unit)}
          sub="Peak temperature"
        />
        <Stat
          label="Low Today"
          value={formatTempLong(data.tempMin, unit)}
          sub="Minimum recorded"
        />
        <Stat
          label="Telemetry Sync"
          value={lastUpdated.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          sub="Real-time cache"
          icon={<RefreshCw className="w-3.5 h-3.5 text-sky-400" />}
        />
      </div>

      {/* Sunrise & Sunset atmospheric bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 relative z-10">
        <div className="flex items-center gap-3 rounded-2xl glass-pill px-4 py-3.5 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 grid place-items-center shrink-0">
            <Sunrise className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Solar Dawn (Sunrise)</p>
            <p className="text-white font-bold text-sm sm:text-base">
              {formatLocalTime(data.sunrise, data.timezone)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl glass-pill px-4 py-3.5 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-400/20 text-orange-300 grid place-items-center shrink-0">
            <Sunset className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Solar Dusk (Sunset)</p>
            <p className="text-white font-bold text-sm sm:text-base">
              {formatLocalTime(data.sunset, data.timezone)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub, icon }) {
  return (
    <div className="rounded-2xl glass-pill p-4 border border-white/10 hover:border-sky-400/30 transition duration-300">
      <div className="flex items-center justify-between text-slate-400 text-xs">
        <span>{label}</span>
        {icon}
      </div>
      <p className="text-white text-lg sm:text-xl font-bold mt-1 tracking-tight">{value}</p>
      {sub && <p className="text-slate-400 text-[11px] mt-0.5">{sub}</p>}
    </div>
  );
}

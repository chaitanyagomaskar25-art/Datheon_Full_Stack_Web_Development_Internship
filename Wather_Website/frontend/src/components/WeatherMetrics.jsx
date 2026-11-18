import { Droplets, Wind, Gauge, Eye, Navigation, Sunrise, Sunset, Compass, Activity, Thermometer } from 'lucide-react';
import { windDirectionLabel, formatLocalTime } from '@/utils/weatherHelpers';

export function WeatherMetrics({ data }) {
  const visibilityKm =
    data.visibility != null ? (data.visibility / 1000).toFixed(1) : null;

  // Compute daylight progress percentage
  const now = data.dt || Math.floor(Date.now() / 1000);
  const totalDaylight = (data.sunset || 0) - (data.sunrise || 0);
  const elapsedDaylight = now - (data.sunrise || 0);
  const daylightProgress = totalDaylight > 0
    ? Math.min(100, Math.max(0, Math.round((elapsedDaylight / totalDaylight) * 100)))
    : 0;

  // Approximate dew point using Magnus-Tetens formula: T - ((100 - RH) / 5)
  const dewPoint = (data.temp - (100 - data.humidity) / 5).toFixed(1);

  // Generate atmospheric condition description sentence
  const conditionSentence = `${data.condition?.description ? data.condition.description.charAt(0).toUpperCase() + data.condition.description.slice(1) : 'Standard conditions'} with ${
    data.windSpeed > 8 ? 'strong' : data.windSpeed > 4 ? 'moderate' : 'light'
  } ${windDirectionLabel(data.windDeg || 0)} wind. Air pressure is ${
    data.pressure >= 1013 ? 'stable and high' : 'low'
  } at ${data.pressure} hPa.`;

  return (
    <div className="space-y-4">
      {/* Narrative Atmospheric Condition Banner */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex items-start gap-3.5 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/25 text-sky-400 grid place-items-center shrink-0 mt-0.5">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-300">
            Atmospheric Intelligence Summary
          </span>
          <p className="text-sm text-slate-200 font-medium leading-relaxed mt-0.5">
            {conditionSentence}
          </p>
        </div>
      </div>

      {/* 4 Primary Atmospheric Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Relative Humidity */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 hover:border-sky-400/30 transition duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/20 text-sky-400 grid place-items-center group-hover:scale-110 transition">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Humidity
            </span>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {data.humidity}%
            </p>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-300">Dew point: {dewPoint}°C</span>
              <span className="text-sky-300 text-[11px] font-semibold">
                {data.humidity > 70 ? 'High Moisture' : data.humidity < 35 ? 'Dry Air' : 'Comfortable'}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(0, data.humidity))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wind Velocity with Compass Indicator */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 hover:border-teal-400/30 transition duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-400/20 text-teal-400 grid place-items-center group-hover:scale-110 transition">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Wind Vector
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {data.windSpeed} <span className="text-lg text-slate-400 font-normal">m/s</span>
              </p>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1 font-medium">
                <span>{(data.windSpeed * 3.6).toFixed(1)} km/h</span>
                <span className="text-white/30">•</span>
                <span className="text-teal-300 font-bold">{windDirectionLabel(data.windDeg || 0)}</span>
              </p>
            </div>

            {/* Rotating Compass Needle Icon */}
            <div className="relative w-12 h-12 rounded-full border border-teal-400/30 bg-teal-500/10 grid place-items-center shadow-inner" title={`Wind bearing: ${data.windDeg}°`}>
              <span className="absolute top-1 text-[8px] font-bold text-teal-400/70">N</span>
              <Navigation
                className="w-5 h-5 text-teal-300 transition-transform duration-700 ease-out drop-shadow-md"
                style={{ transform: `rotate(${data.windDeg || 0}deg)` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bearing: {Math.round(data.windDeg || 0)}°</span>
            <span className="text-teal-300 font-medium">
              {data.windSpeed > 10 ? 'High Wind' : data.windSpeed > 5 ? 'Moderate Breeze' : 'Gentle Air'}
            </span>
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 hover:border-indigo-400/30 transition duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 text-indigo-400 grid place-items-center group-hover:scale-110 transition">
              <Gauge className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pressure
            </span>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {data.pressure} <span className="text-lg text-slate-400 font-normal">hPa</span>
            </p>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-300">Standard: 1013 hPa</span>
              <span className="text-indigo-300 text-[11px] font-semibold">
                {data.pressure >= 1013 ? 'High Barometer' : 'Low Barometer'}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(0, ((data.pressure - 950) / 100) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Optical Visibility */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 hover:border-purple-400/30 transition duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/20 text-purple-400 grid place-items-center group-hover:scale-110 transition">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Visibility
            </span>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {visibilityKm != null ? `${visibilityKm}` : 'N/A'}{' '}
              {visibilityKm != null && <span className="text-lg text-slate-400 font-normal">km</span>}
            </p>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-300">Horizon range</span>
              <span className="text-purple-300 text-[11px] font-semibold">
                {visibilityKm >= 10 ? 'Maximum Clarity' : visibilityKm >= 5 ? 'Good Clarity' : 'Hazy / Low'}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(0, ((visibilityKm || 0) / 10) * 100))}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Solar Daylight Progression Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/25 text-amber-300 grid place-items-center">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Solar Daylight Cycle</h4>
              <p className="text-[11px] text-slate-400">Solar transit from dawn to dusk</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full glass-pill text-amber-300 border border-amber-400/20">
            {daylightProgress > 0 && daylightProgress < 100
              ? `${daylightProgress}% daylight elapsed`
              : daylightProgress >= 100
              ? 'Nighttime (Post-Sunset)'
              : 'Pre-Dawn'}
          </span>
        </div>

        {/* Solar Progress Bar */}
        <div className="relative pt-2 pb-1">
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-600 transition-all duration-1000 shadow-md"
              style={{ width: `${daylightProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-300" />
            <span className="text-slate-400">Dawn:</span>
            <span className="font-bold text-white">{formatLocalTime(data.sunrise, data.timezone)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span className="text-slate-400">Dusk:</span>
            <span className="font-bold text-white">{formatLocalTime(data.sunset, data.timezone)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

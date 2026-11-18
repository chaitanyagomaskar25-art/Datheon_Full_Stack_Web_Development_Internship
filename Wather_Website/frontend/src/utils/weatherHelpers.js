const ICON_BASE = 'https://openweathermap.org/img/wn';

export function iconUrl(code) {
  return `${ICON_BASE}/${code}@4x.png`;
}

export function iconUrlSmall(code) {
  return `${ICON_BASE}/${code}@2x.png`;
}

export function windDirectionLabel(deg) {
  const dirs = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Local time for a city given its UTC offset (seconds).
export function localTime(dt, timezone) {
  const utc = dt * 1000 + timezone * 1000;
  return new Date(utc);
}

export function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatLocalTime(dt, timezone) {
  return formatTime(localTime(dt, timezone));
}

// Checks if current local time dt is between local sunrise and sunset
export function isDaytime(dt, sunrise, sunset) {
  if (!sunrise || !sunset) return true;
  return dt >= sunrise && dt < sunset;
}

/**
 * Resolves the active atmospheric theme based on condition & solar dawn/dusk:
 * - 'sunny': warm yellow and orange gradient (Clear daytime)
 * - 'cloudy': soft grey and blue gradient (Cloudy/overcast/mist)
 * - 'rainy': deep blue and grey gradient (Rain/drizzle/thunderstorm)
 * - 'snowy': icy blue and white gradient (Snow)
 * - 'night': dark navy and purple gradient (Nighttime)
 */
export function resolveTheme(condition, isDay) {
  const main = condition?.main?.toLowerCase() || '';

  // 1. Active precipitation always takes precedence (day or night)
  if (main === 'rain' || main === 'drizzle' || main === 'thunderstorm') {
    return 'rainy';
  }

  // 2. Active snowfall always takes precedence (day or night)
  if (main === 'snow') {
    return 'snowy';
  }

  // 3. Cloudy, overcast, mist, fog, haze, smoke, or dust
  if (
    main === 'clouds' ||
    main === 'mist' ||
    main === 'fog' ||
    main === 'haze' ||
    main === 'smoke' ||
    main === 'dust'
  ) {
    return 'cloudy';
  }

  // 4. Clear skies:
  // If local night, celestial dark navy & purple starry night
  if (!isDay) {
    return 'night';
  }

  // If local day, radiant warm yellow & orange sunny day
  return 'sunny';
}

export const THEMES = {
  sunny: {
    label: 'Sunny Day (Interactive)',
    accentText: 'text-amber-300',
    description: 'Interactive golden solar aura, sparks & sunbeam flare',
  },
  cloudy: {
    label: 'Overcast Clouds (Interactive)',
    accentText: 'text-slate-300',
    description: 'Interactive volumetric cloud parting & mist wake',
  },
  rainy: {
    label: 'Active Rain (Interactive)',
    accentText: 'text-sky-300',
    description: 'Interactive raindrop deflection, splash ripples & lightning',
  },
  snowy: {
    label: 'Icy Snowfall (Interactive)',
    accentText: 'text-cyan-200',
    description: 'Interactive blizzard air vortex, flutter & frost bursts',
  },
  night: {
    label: 'Celestial Night (Interactive)',
    accentText: 'text-purple-300',
    description: 'Interactive constellation web, shooting stars & supernova',
  },
};

export const POPULAR_CITIES = ['London', 'Tokyo', 'Mumbai', 'New York', 'Delhi', 'Sydney', 'Paris'];

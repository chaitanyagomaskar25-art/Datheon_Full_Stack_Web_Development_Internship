import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Short in-memory cache (3 min TTL) to avoid hitting OpenWeatherMap rate limits repeatedly
const cache = new Map();
const CACHE_TTL_MS = 3 * 60 * 1000;

function getCached(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache(key, data) {
  if (cache.size > 200) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { timestamp: Date.now(), data });
}

function getApiKey() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweathermap_api_key_here') {
    throw new Error('OpenWeatherMap API key is missing. Please configure OPENWEATHER_API_KEY in backend/.env');
  }
  return key;
}

export function formatWeatherData(currentRaw, forecastRaw) {
  // Current weather extraction from real OpenWeatherMap API
  const current = {
    city: currentRaw.name,
    country: currentRaw.sys?.country || '',
    coord: currentRaw.coord,
    temp: currentRaw.main.temp,
    feelsLike: currentRaw.main.feels_like,
    tempMin: currentRaw.main.temp_min,
    tempMax: currentRaw.main.temp_max,
    humidity: currentRaw.main.humidity,
    windSpeed: currentRaw.wind.speed,
    windDeg: currentRaw.wind.deg,
    pressure: currentRaw.main.pressure,
    visibility: currentRaw.visibility ?? null,
    sunrise: currentRaw.sys?.sunrise,
    sunset: currentRaw.sys?.sunset,
    dt: currentRaw.dt,
    timezone: currentRaw.timezone,
    condition: currentRaw.weather?.[0] || { main: 'Clear', description: 'clear sky', icon: '01d' },
  };

  // Group 3-hour forecast records by local date
  const byDate = new Map();
  const timezone = current.timezone || 0;

  for (const item of forecastRaw.list || []) {
    const localUtc = item.dt * 1000 + timezone * 1000;
    const dateObj = new Date(localUtc);
    const key = dateObj.toISOString().slice(0, 10);

    const existing = byDate.get(key);
    if (!existing) {
      byDate.set(key, {
        date: item.dt,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        conditions: [{ cond: item.weather[0], pop: item.pop || 0, dt: item.dt }],
      });
    } else {
      existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
      existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
      existing.conditions.push({ cond: item.weather[0], pop: item.pop || 0, dt: item.dt });
    }
  }

  const todayKey = new Date(Date.now() + timezone * 1000).toISOString().slice(0, 10);

  const forecast = Array.from(byDate.entries())
    .filter(([key]) => key !== todayKey)
    .map(([, d]) => {
      const local = new Date(d.date * 1000 + timezone * 1000);
      const dayName = local.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const dateLabel = local.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

      // Condition closest to midday (12:00 UTC)
      const midday = d.conditions.reduce((best, cur) => {
        const curHour = new Date(cur.dt * 1000 + timezone * 1000).getUTCHours();
        const bestHour = new Date(best.dt * 1000 + timezone * 1000).getUTCHours();
        return Math.abs(curHour - 12) < Math.abs(bestHour - 12) ? cur : best;
      }, d.conditions[0]);

      const maxPop = Math.max(...d.conditions.map((c) => c.pop || 0));

      return {
        date: d.date,
        dayName,
        dateLabel,
        tempMin: d.tempMin,
        tempMax: d.tempMax,
        condition: midday.cond,
        precipitation: Math.round(maxPop * 100),
      };
    })
    .slice(0, 5);

  return { current, forecast };
}

export async function fetchWeatherFromApi(params) {
  const apiKey = getApiKey();
  const cacheKey = JSON.stringify(params);
  const cached = getCached(cacheKey);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const commonParams = {
    ...params,
    appid: apiKey,
    units: 'metric',
  };

  // Directly call the real OpenWeatherMap API for both current conditions and 5-day forecast
  const [currentRes, forecastRes] = await Promise.all([
    axios.get(`${BASE_URL}/weather`, { params: commonParams, timeout: 10000 }),
    axios.get(`${BASE_URL}/forecast`, { params: commonParams, timeout: 10000 }),
  ]);

  const formatted = formatWeatherData(currentRes.data, forecastRes.data);
  setCache(cacheKey, formatted);
  return formatted;
}

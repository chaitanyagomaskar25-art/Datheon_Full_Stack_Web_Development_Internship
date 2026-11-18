import { useCallback, useEffect, useRef, useState } from 'react';
import { CloudRain, Database, Globe, Sparkles } from 'lucide-react';
import {
  getWeatherByCity,
  getWeatherByCoords,
  getHealthStatus,
} from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CurrentWeather } from '@/components/CurrentWeather';
import { WeatherMetrics } from '@/components/WeatherMetrics';
import { ForecastSection } from '@/components/ForecastSection';
import { FavoritesList } from '@/components/FavoritesList';
import { RecentSearches } from '@/components/RecentSearches';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { DynamicBackground } from '@/components/DynamicBackground';
import { AtmosphereSelector } from '@/components/AtmosphereSelector';
import { InteractiveCursor } from '@/components/InteractiveCursor';
import { isDaytime, resolveTheme } from '@/utils/weatherHelpers';

const RECENT_KEY = 'skycast:recent_queries';
const UNIT_KEY = 'skycast:temp_unit';
const FAVORITES_KEY = 'skycast:favorite_cities';

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === 'string').slice(0, 6)
      : [];
  } catch {
    return [];
  }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadUnit() {
  try {
    const raw = localStorage.getItem(UNIT_KEY);
    return raw === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
}

export default function App() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [unit, setUnit] = useState(() => loadUnit());
  const [recent, setRecent] = useState(() => loadRecent());
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [dbStatus, setDbStatus] = useState('checking');
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [atmosphereOverride, setAtmosphereOverride] = useState(() => {
    try {
      return localStorage.getItem('skycast:atmosphere') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const abortRef = useRef(null);
  const dashboardRef = useRef(null);

  // Initialize DB health
  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const health = await getHealthStatus();
        if (isMounted) {
          setDbStatus(health.database === 'connected' ? 'connected' : 'memory');
        }
      } catch {
        if (isMounted) setDbStatus('memory');
      }
    }

    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save temperature unit preference
  useEffect(() => {
    try {
      localStorage.setItem(UNIT_KEY, unit);
    } catch {
      /* ignore */
    }
  }, [unit]);

  const addRecent = useCallback((city) => {
    setRecent((prev) => {
      const next = [
        city,
        ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase()),
      ].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResult = useCallback(
    (res) => {
      setCurrent(res.current);
      setForecast(res.forecast);
      setLastUpdated(new Date());
      setError(null);
      // Automatically sync background to the newly searched city's weather condition
      setAtmosphereOverride('auto');
      try {
        localStorage.setItem('skycast:atmosphere', 'auto');
      } catch {
        /* ignore */
      }
      addRecent(
        `${res.current.city}${res.current.country ? ', ' + res.current.country : ''}`,
      );

      // Smooth scroll down to dashboard
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    },
    [addRecent],
  );

  const runSearch = useCallback(
    async (city) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);
      setLastQuery(city);
      try {
        const res = await getWeatherByCity(city, controller.signal);
        handleResult(res);
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError(err.message || 'Unable to fetch weather data. Please try again.');
        setTimeout(() => {
          dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } finally {
        if (abortRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [handleResult],
  );

  const handleUseLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setIsLoading(true);
        setLastQuery('current-location');
        try {
          const res = await getWeatherByCoords(
            pos.coords.latitude,
            pos.coords.longitude,
            controller.signal,
          );
          handleResult(res);
        } catch (err) {
          if (err.name === 'CanceledError' || err.name === 'AbortError') return;
          setError(err.message || 'Unable to fetch weather for your location.');
          setTimeout(() => {
            dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } finally {
          setIsLocating(false);
          if (abortRef.current === controller) setIsLoading(false);
        }
      },
      () => {
        setIsLocating(false);
        setError(
          'Could not access your location. Please check browser permissions and try again.',
        );
      },
      { timeout: 10000 },
    );
  }, [handleResult]);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Check if active city is in favorites
  const isCurrentFavorite = current
    ? favorites.some((f) => f.city.toLowerCase() === current.city.toLowerCase())
    : false;

  const handleToggleFavorite = useCallback(() => {
    if (!current) return;

    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.city.toLowerCase() === current.city.toLowerCase(),
      );
      let updated;
      if (exists) {
        updated = prev.filter(
          (f) => f.city.toLowerCase() !== current.city.toLowerCase(),
        );
      } else {
        const item = {
          _id: `fav-${Date.now()}`,
          city: current.city,
          country: current.country,
        };
        updated = [item, ...prev];
      }
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, [current]);

  const handleRemoveFavorite = useCallback((idOrCity) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (f) => f._id !== idOrCity && f.city.toLowerCase() !== String(idOrCity).toLowerCase(),
      );
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, []);

  const handleAtmosphereChange = useCallback((themeId) => {
    setAtmosphereOverride(themeId);
    try {
      localStorage.setItem('skycast:atmosphere', themeId);
    } catch {
      /* ignore */
    }
  }, []);

  // Determine active dynamic weather theme
  const isDay = current
    ? isDaytime(current.dt, current.sunrise, current.sunset)
    : false;

  const detectedTheme = current
    ? resolveTheme(current.condition, isDay)
    : 'night';

  const activeTheme = atmosphereOverride && atmosphereOverride !== 'auto'
    ? atmosphereOverride
    : detectedTheme;

  const hasResults = current !== null;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Interactive Themed Custom Cursor */}
      <InteractiveCursor theme={activeTheme} />

      {/* Dynamic Atmospheric Background with Micro-effects */}
      <DynamicBackground theme={activeTheme} />

      {/* Top Navigation Bar */}
      <Navbar
        unit={unit}
        onUnitChange={setUnit}
        dbStatus={dbStatus}
        onExploreClick={scrollToDashboard}
      />

      {/* Hero Section */}
      <HeroSection
        onSearch={runSearch}
        onUseLocation={handleUseLocation}
        isLoading={isLoading}
        isLocating={isLocating}
        onExploreClick={scrollToDashboard}
      />

      {/* Main Interactive Weather Dashboard */}
      <main
        id="dashboard"
        ref={dashboardRef}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10"
      >
        {/* Dashboard Header with Atmosphere Ambience Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Telemetry Dashboard</span>
            </h2>
            <p className="text-xs text-slate-400">Live atmospheric metrics & 5-day predictive forecast</p>
          </div>

          {/* Active Atmosphere Theme Selector */}
          <div className="self-start sm:self-center">
            <AtmosphereSelector
              currentTheme={activeTheme}
              overrideTheme={atmosphereOverride}
              onSelectTheme={handleAtmosphereChange}
            />
          </div>
        </div>

        {/* Saved Favorites Strip */}
        {favorites.length > 0 && (
          <FavoritesList
            favorites={favorites}
            onSelect={runSearch}
            onRemove={handleRemoveFavorite}
          />
        )}

        {/* Recent Search Queries */}
        {recent.length > 0 && (
          <RecentSearches
            cities={recent}
            onSelect={runSearch}
            onClear={clearRecent}
          />
        )}

        {/* Conditional Views: Loading, Error, Weather Cards, or Empty State */}
        {isLoading ? (
          <LoadingState />
        ) : error && !hasResults ? (
          <ErrorMessage
            message={error}
            onRetry={lastQuery && lastQuery !== 'current-location' ? () => runSearch(lastQuery) : undefined}
          />
        ) : !hasResults ? (
          <EmptyState onExploreClick={scrollToDashboard} />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Current Weather Card */}
            <CurrentWeather
              data={current}
              unit={unit}
              lastUpdated={lastUpdated}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 4 Metric Cards */}
            <WeatherMetrics data={current} />

            {/* 5-Day Forecast Grid */}
            <ForecastSection days={forecast} unit={unit} />
          </div>
        )}

        {error && hasResults && (
          <ErrorMessage
            message={error}
            onRetry={lastQuery && lastQuery !== 'current-location' ? () => runSearch(lastQuery) : undefined}
          />
        )}
      </main>

      {/* Commercial Grade Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#070b1a]/85 backdrop-blur-2xl py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/20 text-sky-400 grid place-items-center shadow-lg">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Sky<span className="text-sky-400">Cast</span>
                </span>
                <p className="text-xs text-slate-300">
                  Full-Stack MERN Atmospheric Telemetry Platform
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Live Atmospheric Telemetry
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                MongoDB + Mongoose
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                OpenWeatherMap Live API
              </span>
            </div>

            <div className="text-xs text-slate-300 text-center md:text-right">
              <p>© {new Date().getFullYear()} SkyCast Inc. All rights reserved.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">MERN Architecture · MongoDB · Express · React · Node</p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

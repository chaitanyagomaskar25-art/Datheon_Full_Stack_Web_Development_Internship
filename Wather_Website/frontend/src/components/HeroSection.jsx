import { Search, MapPin, Loader2, Sparkles, Compass, ShieldCheck, Zap, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { POPULAR_CITIES } from '@/utils/weatherHelpers';
import { getMatchingSuggestions } from '@/utils/citySuggestions';

export function HeroSection({
  onSearch,
  onUseLocation,
  isLoading,
  isLocating,
  onExploreClick,
}) {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const heroSearchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target)) {
        setIsSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setValidationError('Please enter a city name to search (e.g., Tokyo, London, Paris).');
      return;
    }
    setValidationError('');
    setIsSuggestionsOpen(false);
    if (isLoading) return;
    onSearch(trimmed);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (validationError && val.trim()) {
      setValidationError('');
    }

    if (val.trim().length >= 1) {
      const matches = getMatchingSuggestions(val, 5);
      setSuggestions(matches);
      setIsSuggestionsOpen(matches.length > 0);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  };

  const handleSelectSuggestion = (city) => {
    setQuery(city);
    setIsSuggestionsOpen(false);
    setValidationError('');
    onSearch(city);
  };

  const handleKeyDown = (e) => {
    if (!isSuggestionsOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeSuggestionIndex].city);
      }
    } else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false);
    }
  };

  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-sky-600/25 via-indigo-600/20 to-purple-700/20 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-sky-500/15 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-sky-400/25 shadow-lg mb-6 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs font-semibold tracking-wide text-sky-200">
            Next-Gen Atmospheric Intelligence
          </span>
          <span className="text-white/30">•</span>
          <span className="text-xs text-slate-300">Live Global Feeds</span>
        </div>

        {/* Main Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-rise">
          <span className="text-white">Weather, </span>
          <span className="text-gradient">Wherever Life Takes You</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed mb-10 animate-fade-in">
          Hyper-local forecasting, real-time barometric telemetry, and 5-day predictive models engineered with modern MERN architecture for flawless accuracy.
        </p>

        {/* Prominent City Search Container with In-Flow Autocomplete (No Overlapping) */}
        <div
          ref={heroSearchRef}
          className={`max-w-2xl mx-auto mb-6 rounded-3xl glass-card border shadow-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden text-left relative z-20 ${
            validationError
              ? 'border-amber-400/70 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
              : isSuggestionsOpen && suggestions.length > 0
              ? 'border-sky-400/40 shadow-[0_0_35px_rgba(56,189,248,0.25)]'
              : 'border-white/20'
          }`}
        >
          {/* Main Search Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-sky-400/80 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search any global city (e.g., Tokyo, London, San Francisco)..."
                className="w-full h-14 pl-12 pr-4 bg-transparent text-white placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Geolocation Button */}
              <button
                type="button"
                onClick={onUseLocation}
                disabled={isLocating}
                title="Detect Current GPS Location"
                aria-label="Detect Current GPS Location"
                className="h-14 w-14 rounded-2xl glass-pill text-slate-200 hover:text-white flex items-center justify-center transition border border-white/10 hover:border-sky-400/50 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isLocating ? (
                  <Loader2 className="w-5 h-5 text-sky-400 animate-spin-slow" />
                ) : (
                  <MapPin className="w-5 h-5 text-sky-400" />
                )}
              </button>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="h-14 px-7 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition duration-300 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin-slow" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Integrated Suggestions List - Expands seamlessly in flow without overlapping anything! */}
          {isSuggestionsOpen && suggestions.length > 0 && (
            <div className="border-t border-white/10 bg-slate-950/75 backdrop-blur-2xl animate-fade-in">
              <div className="px-5 py-2.5 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium bg-white/[0.02]">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Matching Global Cities</span>
                </span>
                <span className="hidden sm:inline text-slate-400 text-[10px]">
                  Use ↑↓ to navigate · Enter to select · Esc to close
                </span>
              </div>

              <ul className="max-h-64 overflow-y-auto divide-y divide-white/5">
                {suggestions.map((item, idx) => (
                  <li
                    key={item.city + item.country}
                    onClick={() => handleSelectSuggestion(item.city)}
                    className={`px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm cursor-pointer transition ${
                      idx === activeSuggestionIndex
                        ? 'bg-sky-500/25 text-white pl-7'
                        : 'text-slate-200 hover:bg-white/10 hover:text-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin className={`w-4 h-4 shrink-0 ${idx === activeSuggestionIndex ? 'text-sky-300' : 'text-slate-400'}`} />
                      <span className="font-bold text-white truncate">{item.city}</span>
                      <span className="text-slate-400 font-normal truncate">, {item.country}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 shrink-0 ml-2">
                      {item.code}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Inline Validation Alert */}
        {validationError && (
          <p className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-semibold -mt-2 mb-6 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{validationError}</span>
          </p>
        )}

        {/* Popular Cities Quick Select & CTA */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-fade-in">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">
            Trending:
          </span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setValidationError('');
                onSearch(city);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 glass-pill transition hover:text-sky-300 cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Explore Weather CTA */}
        <div className="flex justify-center mb-12">
          <button
            type="button"
            onClick={onExploreClick}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-card border border-white/15 text-sm font-semibold text-white hover:border-sky-400/40 hover:bg-white/10 transition shadow-xl cursor-pointer"
          >
            <Compass className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition duration-500" />
            <span>Explore Weather Telemetry</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto animate-rise">
          <div className="glass-card rounded-2xl p-5 border border-white/10 hover:border-sky-500/30 transition duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 grid place-items-center mb-3 group-hover:scale-110 transition">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Hyper-Local Precision</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time atmospheric condition updates down to the minute powered by live OpenWeatherMap API data.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 grid place-items-center mb-3 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Secure MERN Engine</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zero frontend API key leaks. Robust Express backend proxy, rate-limiting & MongoDB persistence.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 hover:border-indigo-500/30 transition duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 grid place-items-center mb-3 group-hover:scale-110 transition">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Global 5-Day Forecasts</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Comprehensive multi-day predictive models, barometric pressure, wind vectors & precipitation.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

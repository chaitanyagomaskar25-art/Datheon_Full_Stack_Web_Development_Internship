import { History, X } from 'lucide-react';

export function RecentSearches({ cities, onSelect, onClear }) {
  if (cities.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in py-1">
      <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-semibold mr-1">
        <History className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
        <span>Recent:</span>
      </div>

      {cities.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => onSelect(city)}
          className="px-3 py-1 rounded-full text-xs font-medium text-slate-200 glass-pill transition hover:text-sky-300 border border-white/10 cursor-pointer"
        >
          {city}
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        aria-label="Clear recent searches"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-400 text-xs hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer ml-auto"
      >
        <X className="w-3 h-3" />
        <span>Clear</span>
      </button>
    </div>
  );
}

import { Star, Trash2, MapPin } from 'lucide-react';

export function FavoritesList({ favorites, onSelect, onRemove }) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 grid place-items-center">
            <Star className="w-3.5 h-3.5 fill-amber-300" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Favorite Locations
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {favorites.map((fav) => (
          <div
            key={fav._id || fav.city}
            className="group inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-xl glass-pill hover:bg-white/15 transition border border-white/10 hover:border-sky-400/40"
          >
            <button
              type="button"
              onClick={() => onSelect(fav.city)}
              className="text-white text-xs sm:text-sm font-semibold hover:text-sky-300 transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>{fav.city}{fav.country ? `, ${fav.country}` : ''}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(fav._id || fav.city);
              }}
              title={`Remove ${fav.city} from saved places`}
              aria-label={`Remove ${fav.city} from saved places`}
              className="p-1 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/20 transition cursor-pointer focus:outline-none"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

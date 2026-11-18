export function TemperatureToggle({ unit, onChange }) {
  return (
    <div
      className="inline-flex items-center rounded-2xl glass-card p-1 shadow-lg border border-white/10"
      role="group"
      aria-label="Temperature unit"
    >
      {['C', 'F'].map((u) => {
        const active = unit === u;
        return (
          <button
            key={u}
            type="button"
            onClick={() => onChange(u)}
            aria-pressed={active}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
              active
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °{u}
          </button>
        );
      })}
    </div>
  );
}

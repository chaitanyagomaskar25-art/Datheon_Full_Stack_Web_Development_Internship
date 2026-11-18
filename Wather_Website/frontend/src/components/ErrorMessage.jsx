import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="glass-card rounded-3xl p-8 sm:p-10 text-center animate-rise border border-rose-500/25 shadow-2xl relative overflow-hidden"
      role="alert"
      aria-live="assertive"
    >
      <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/20 mb-4 shadow-inner">
        <AlertTriangle className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-white font-bold text-lg mb-1">Weather Service Notice</h3>
      <p className="text-slate-300 font-normal text-sm max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wide transition border border-white/15 cursor-pointer shadow-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
}

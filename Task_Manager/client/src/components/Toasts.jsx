import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-500/30',
  error: 'border-rose-500/25 bg-rose-500/10 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-500/30',
  info: 'border-indigo-500/25 bg-white text-slate-800 dark:border-indigo-500/30 dark:bg-slate-900/90 dark:text-slate-100 shadow-premium',
};

const ICON_STYLES = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-rose-600 dark:text-rose-400',
  info: 'text-indigo-600 dark:text-indigo-400',
};

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-2.5"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.kind];
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-xl animate-toast-in ${STYLES[toast.kind]}`}
      role="status"
    >
      <div className={`mt-0.5 shrink-0 ${ICON_STYLES[toast.kind]}`}>
        <Icon size={18} aria-hidden />
      </div>
      <p className="flex-1 text-sm font-semibold leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-lg p-1 opacity-70 transition hover:opacity-100 hover:bg-slate-200/50 dark:hover:bg-slate-800"
        aria-label="Dismiss notification"
      >
        <X size={15} aria-hidden />
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
      return;
    }
    setIsProcessing(false);
    confirmRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape' && !isProcessing) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isProcessing, onCancel]);

  if (!open) return null;

  const handleConfirmClick = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={isProcessing ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl animate-modal-in dark:border-slate-800 dark:bg-surface-cardDark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              destructive
                ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                : 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
            }`}
          >
            {destructive ? (
              <Trash2 size={20} aria-hidden />
            ) : (
              <AlertTriangle size={20} aria-hidden />
            )}
          </div>
          <div className="flex-1">
            <h2 id="confirm-title" className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            disabled={isProcessing}
            className="btn-ghost"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={isProcessing}
            className={destructive ? 'btn-danger min-w-[100px]' : 'btn-primary min-w-[100px]'}
            onClick={handleConfirmClick}
          >
            {isProcessing ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden />
                <span>Processing…</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

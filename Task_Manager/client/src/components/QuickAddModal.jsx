import { useEffect, useRef, useState } from 'react';
import {
  X,
  Sparkles,
  Folder,
  Flag,
  CalendarDays,
  AlignLeft,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '@/types';
import { todayISO, getTomorrowISO } from '@/lib/datetime';

function getNextWeekISO() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export function QuickAddModal({ open, onClose, onAdd, defaultDueDate = '' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('Medium');
      setDueDate(defaultDueDate || '');
      setError('');
      setIsSubmitting(false);
      requestAnimationFrame(() => titleRef.current?.focus());
    }
  }, [open, defaultDueDate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Task title is required.');
      titleRef.current?.focus();
      return false;
    }
    if (trimmed.length > 120) {
      setError('Task title must be 120 characters or fewer.');
      titleRef.current?.focus();
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await onAdd({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate || null,
      });

      if (res && res.success === false) {
        setError(res.error || 'Failed to create task.');
        return;
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-modal-in dark:border-slate-800 dark:bg-surface-cardDark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25">
              <Sparkles size={17} aria-hidden />
            </div>
            <div>
              <h2 id="quick-add-title" className="text-base font-bold text-slate-900 dark:text-white">
                Quick Add Task
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture an action item and set your timeline
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5" noValidate>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="quick-title-input" className="label mb-0">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                {title.length}/120
              </span>
            </div>
            <input
              id="quick-title-input"
              ref={titleRef}
              type="text"
              maxLength={130}
              value={title}
              disabled={isSubmitting}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className={`input ${error ? 'border-rose-400 ring-2 ring-rose-400/20 animate-shake' : ''}`}
              placeholder="e.g., Deliver product review presentation"
              aria-invalid={!!error}
              aria-describedby={error ? 'quick-add-error' : undefined}
            />
            {error && (
              <div
                id="quick-add-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
              >
                <AlertCircle size={13} className="shrink-0" aria-hidden />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="quick-desc" className="label flex items-center gap-1.5">
              <AlignLeft size={12} className="text-indigo-500" aria-hidden /> Details & Notes
            </label>
            <textarea
              id="quick-desc"
              value={description}
              maxLength={500}
              disabled={isSubmitting}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="Add optional notes, checklist, or links…"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="quick-category" className="label flex items-center gap-1.5">
                <Folder size={12} className="text-indigo-500" aria-hidden /> Category
              </label>
              <select
                id="quick-category"
                value={category}
                disabled={isSubmitting}
                onChange={(e) => setCategory(e.target.value)}
                className="input cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quick-priority" className="label flex items-center gap-1.5">
                <Flag size={12} className="text-indigo-500" aria-hidden /> Priority
              </label>
              <select
                id="quick-priority"
                value={priority}
                disabled={isSubmitting}
                onChange={(e) => setPriority(e.target.value)}
                className="input cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quick-due" className="label flex items-center gap-1.5">
                <CalendarDays size={12} className="text-indigo-500" aria-hidden /> Due Date
              </label>
              <input
                id="quick-due"
                type="date"
                value={dueDate}
                disabled={isSubmitting}
                onChange={(e) => setDueDate(e.target.value)}
                className="input cursor-pointer"
              />
            </div>
          </div>

          {/* Date presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1">
              Presets:
            </span>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setDueDate(todayISO())}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                dueDate === todayISO()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setDueDate(getTomorrowISO())}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                dueDate === getTomorrowISO()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setDueDate(getNextWeekISO())}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                dueDate === getNextWeekISO()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              Next Week
            </button>
            {dueDate && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setDueDate('')}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear date
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              disabled={isSubmitting}
              className="btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  <span>Creating…</span>
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

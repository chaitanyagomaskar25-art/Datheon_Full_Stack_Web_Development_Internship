import { useState } from 'react';
import {
  Plus,
  CalendarDays,
  Flag,
  Folder,
  AlignLeft,
  CornerDownLeft,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '@/types';

export function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
    setCategory('Work');
    setPriority('Medium');
    setDueDate('');
    setError('');
    setIsSubmitting(false);
  };

  const validate = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Task title is required.');
      return false;
    }
    if (trimmed.length > 120) {
      setError('Task title must be 120 characters or fewer.');
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

      reset();
      setExpanded(false);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showExtras = expanded || description.length > 0;

  return (
    <div className="card p-4 sm:p-5 transition-all focus-within:border-indigo-400/60 focus-within:shadow-premium-hover dark:focus-within:border-indigo-500/40">
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              maxLength={130}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              onFocus={() => setExpanded(true)}
              placeholder="What needs to be done? (press Enter to add)"
              disabled={isSubmitting}
              className={`input pl-10 pr-24 ${
                error ? 'border-rose-400 ring-2 ring-rose-400/20 animate-shake' : ''
              }`}
              aria-label="Task title"
              aria-invalid={!!error}
              aria-describedby={error ? 'task-form-error' : undefined}
            />
            <Plus
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:flex dark:bg-slate-800 dark:text-slate-500">
              <CornerDownLeft size={10} aria-hidden /> ↵
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showExtras && (
              <button
                type="button"
                onClick={() => {
                  reset();
                  setExpanded(false);
                }}
                disabled={isSubmitting}
                className="btn-ghost px-3 py-2 text-xs"
                title="Cancel / Collapse"
              >
                <X size={14} aria-hidden /> Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary shrink-0 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  <span>Adding…</span>
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            id="task-form-error"
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-slide-in"
          >
            <AlertCircle size={14} className="shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        <div
          className={`grid transition-all duration-200 ease-in-out ${
            showExtras ? 'grid-rows-[1fr] opacity-100 pt-1' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden space-y-3.5">
            <div className="relative">
              <AlignLeft
                size={16}
                className="pointer-events-none absolute left-3.5 top-3 text-slate-400 dark:text-slate-500"
                aria-hidden
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={2}
                maxLength={500}
                placeholder="Add optional notes, links, or context… (up to 500 characters)"
                className="input resize-none pl-10"
                aria-label="Task description"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="f-category" className="label flex items-center gap-1.5">
                  <Folder size={12} className="text-indigo-500" aria-hidden /> Category
                </label>
                <select
                  id="f-category"
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
                <label htmlFor="f-priority" className="label flex items-center gap-1.5">
                  <Flag size={12} className="text-indigo-500" aria-hidden /> Priority
                </label>
                <select
                  id="f-priority"
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
                <label htmlFor="f-due" className="label flex items-center gap-1.5">
                  <CalendarDays size={12} className="text-indigo-500" aria-hidden /> Due Date
                </label>
                <input
                  id="f-due"
                  type="date"
                  value={dueDate}
                  disabled={isSubmitting}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

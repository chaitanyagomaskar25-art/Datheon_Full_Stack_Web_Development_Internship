import {
  CalendarClock,
  Check,
  Pencil,
  Trash2,
  GripVertical,
  Inbox,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { CATEGORY_STYLES, PRIORITY_STYLES, CATEGORY_DOT_COLORS } from '@/types';
import { formatDueDate, formatRelativeCreated, isOverdue, isDueToday } from '@/lib/datetime';

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging,
  isDragOver,
}) {
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);

  return (
    <article
      draggable
      onDragStart={(e) => {
        const id = task.id || task._id;
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', id);
          e.dataTransfer.effectAllowed = 'move';
        }
        if (onDragStart) onDragStart(id);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        const id = task.id || task._id;
        if (onDragEnter) onDragEnter(id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`card group relative flex items-start gap-3 p-3.5 sm:p-4.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-premium-hover dark:hover:border-indigo-500/40 ${
        task.completed ? 'opacity-70 dark:opacity-65' : ''
      } ${
        isDragging
          ? 'opacity-30 scale-[0.98] border-dashed border-indigo-400 dark:border-indigo-500 shadow-none'
          : ''
      } ${
        isDragOver
          ? 'ring-2 ring-indigo-500 ring-offset-2 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 scale-[1.01]'
          : ''
      }`}
    >
      {/* Drag handle */}
      <div className="flex flex-col items-center pt-0.5">
        <div
          className="cursor-grab active:cursor-grabbing touch-none text-slate-300 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 p-0.5"
          aria-label="Drag to reorder task"
          title="Drag to reorder"
        >
          <GripVertical size={16} aria-hidden />
        </div>
      </div>

      {/* Custom SaaS Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Mark task as active' : 'Mark task as completed'}
        onClick={() => onToggle(task.id || task._id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
          task.completed
            ? 'border-indigo-600 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
            : 'border-slate-300 text-transparent hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-600 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10'
        }`}
      >
        {task.completed && <Check size={13} className="animate-check-pop stroke-[2.5]" aria-hidden />}
      </button>

      {/* Task Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
            <span
              className={`strike-line ${
                task.completed ? 'is-complete text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </span>
          </h3>
          <span
            className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
            title={task.createdAt}
          >
            {formatRelativeCreated(task.createdAt)}
          </span>
        </div>

        {task.description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
            {task.description}
          </p>
        )}

        {/* Badges metadata row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {/* Category Pill */}
          <span className={`badge ${CATEGORY_STYLES[task.category] ?? 'bg-slate-100 text-slate-700'}`}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT_COLORS[task.category] ?? 'bg-slate-400'}`}
              aria-hidden
            />
            {task.category}
          </span>

          {/* Priority Pill */}
          <span className={`badge ${PRIORITY_STYLES[task.priority] ?? 'bg-slate-100 text-slate-700'}`}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                task.priority === 'High'
                  ? 'bg-rose-500'
                  : task.priority === 'Medium'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              aria-hidden
            />
            {task.priority}
          </span>

          {/* Due date badge */}
          {task.dueDate && (
            <span
              className={`badge ${
                overdue
                  ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30 font-semibold'
                  : dueToday
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 font-semibold'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/80'
              }`}
            >
              {overdue ? (
                <AlertCircle size={11} className="text-rose-500" aria-hidden />
              ) : dueToday ? (
                <Clock size={11} className="text-amber-500" aria-hidden />
              ) : (
                <CalendarClock size={11} aria-hidden />
              )}
              {formatDueDate(task.dueDate)}
              {overdue && <span className="text-[10px] uppercase font-bold">(Overdue)</span>}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
          aria-label={`Edit task: ${task.title}`}
          title="Edit task"
        >
          <Pencil size={15} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
          aria-label={`Delete task: ${task.title}`}
          title="Delete task"
        >
          <Trash2 size={15} aria-hidden />
        </button>
      </div>
    </article>
  );
}

export function EmptyState({ message, hint, onReset }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in border-dashed">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-indigo-500/5 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 shadow-sm">
        <Inbox size={28} aria-hidden />
      </div>
      <p className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">{message}</p>
      {hint && <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {onReset && (
        <button type="button" onClick={onReset} className="btn-secondary mt-5 text-xs">
          Reset all filters
        </button>
      )}
    </div>
  );
}

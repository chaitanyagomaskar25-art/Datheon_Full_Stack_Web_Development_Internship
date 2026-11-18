import {
  ListChecks,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  CalendarCheck,
  CalendarClock,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';
import { CATEGORY_STYLES, PRIORITY_STYLES, CATEGORY_DOT_COLORS } from '@/types';
import { isOverdue, isDueToday, isUpcoming, formatDueDate, getDaysUntil } from '@/lib/datetime';

export function SummaryCards({ stats, onSelectView }) {
  const cards = [
    {
      id: 'total',
      viewId: 'all',
      label: 'Total Tasks',
      value: stats.total,
      sublabel: 'All captured items',
      icon: ListChecks,
      badge: 'Backlog',
      gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent dark:from-indigo-500/15',
      iconBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25',
      borderAccent: 'hover:border-indigo-400/50 dark:hover:border-indigo-500/40',
      badgeStyle: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    },
    {
      id: 'active',
      viewId: 'all',
      label: 'Active Tasks',
      value: stats.active,
      sublabel: 'Pending completion',
      icon: CircleDot,
      badge: 'In Progress',
      gradient: 'from-sky-500/10 via-sky-500/5 to-transparent dark:from-sky-500/15',
      iconBg: 'bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/20',
      borderAccent: 'hover:border-sky-400/50 dark:hover:border-sky-500/40',
      badgeStyle: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    },
    {
      id: 'completed',
      viewId: 'completed',
      label: 'Completed Tasks',
      value: stats.completed,
      sublabel: `${stats.completionRate}% finished`,
      icon: CheckCircle2,
      badge: stats.total > 0 && stats.completionRate === 100 ? 'All Cleared!' : 'Accomplished',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/15',
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20',
      borderAccent: 'hover:border-emerald-400/50 dark:hover:border-emerald-500/40',
      badgeStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    {
      id: 'overdue',
      viewId: 'all',
      label: 'Overdue Tasks',
      value: stats.overdue,
      sublabel: stats.overdue > 0 ? 'Requires attention' : 'All on track',
      icon: AlertTriangle,
      badge: stats.overdue > 0 ? 'Action Needed' : 'On Schedule',
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15',
      iconBg:
        stats.overdue > 0
          ? 'bg-gradient-to-tr from-rose-500 to-red-500 text-white shadow-md shadow-rose-500/20'
          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      borderAccent:
        stats.overdue > 0
          ? 'hover:border-rose-400/50 dark:hover:border-rose-500/40'
          : 'hover:border-slate-300 dark:hover:border-slate-700',
      badgeStyle:
        stats.overdue > 0
          ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => onSelectView && onSelectView(c.viewId)}
            className={`card group relative cursor-pointer overflow-hidden p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-premium-hover ${c.borderAccent}`}
          >
            {/* Ambient subtle card glow */}
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              aria-hidden
            />

            <div className="relative flex items-center justify-between gap-3">
              <span className={`rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${c.badgeStyle}`}>
                {c.badge}
              </span>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${c.iconBg}`}
              >
                <Icon size={18} aria-hidden />
              </div>
            </div>

            <div className="relative mt-3">
              <p className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {c.value}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {c.label}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {c.sublabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProgressIndicator({ rate, completed, total }) {
  const remaining = Math.max(0, total - completed);

  let statusBadge = {
    label: 'Getting Started',
    color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  };
  if (rate >= 80) {
    statusBadge = {
      label: 'High Velocity',
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    };
  } else if (rate >= 50) {
    statusBadge = {
      label: 'On Track',
      color: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    };
  }

  return (
    <div className="card p-5 sm:p-6 transition-all hover:shadow-premium-hover">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Task Completion Progress
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${statusBadge.color}`}
            >
              {statusBadge.label}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            {total === 0
              ? 'No active tasks — create your first item to begin tracking.'
              : `${completed} of ${total} tasks completed (${remaining} remaining)`}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
            {rate}%
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">done</span>
        </div>
      </div>

      {/* Modern Gradient Progress Bar */}
      <div className="mt-4">
        <div
          className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Sprint progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 shadow-sm transition-all duration-700 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>0%</span>
          <span>50%</span>
          <span>100% Target</span>
        </div>
      </div>
    </div>
  );
}

export function TodaysTasksSection({ tasks, onToggle, onNavigateToToday, onQuickAdd }) {
  const todaysTasks = tasks.filter(isDueToday);

  return (
    <div className="card p-5 sm:p-6 transition-all hover:shadow-premium-hover">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <CalendarCheck size={17} aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Today&apos;s Tasks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate action items scheduled for today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-extrabold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            {todaysTasks.length} {todaysTasks.length === 1 ? 'task' : 'tasks'}
          </span>
          <button
            type="button"
            onClick={onNavigateToToday}
            className="btn-ghost hidden sm:inline-flex py-1.5 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View All</span>
            <ArrowRight size={13} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {todaysTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10">
              <Sparkles size={20} aria-hidden />
            </div>
            <p className="mt-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No tasks due today
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-0.5">
              You are all caught up for today! Plan ahead or add a quick task.
            </p>
            {onQuickAdd && (
              <button
                type="button"
                onClick={onQuickAdd}
                className="btn-secondary mt-3 py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Plus size={13} aria-hidden /> Add task for today
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {todaysTasks.slice(0, 4).map((t) => (
              <li key={t.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={t.completed}
                    onClick={() => onToggle(t.id || t._id)}
                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                      t.completed
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 text-transparent hover:border-indigo-500 dark:border-slate-600'
                    }`}
                  >
                    {t.completed && <Check size={11} className="stroke-[3]" aria-hidden />}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold ${CATEGORY_STYLES[t.category]}`}>
                        {t.category}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className={`text-[10px] font-semibold ${PRIORITY_STYLES[t.priority]}`}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                  Today
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function UpcomingDeadlinesSection({ tasks, onToggle, onNavigateToUpcoming, onQuickAdd }) {
  const upcomingTasks = tasks
    .filter(isUpcoming)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  return (
    <div className="card p-5 sm:p-6 transition-all hover:shadow-premium-hover">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <CalendarClock size={17} aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deliverables scheduled on the horizon
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-extrabold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            {upcomingTasks.length} {upcomingTasks.length === 1 ? 'task' : 'tasks'}
          </span>
          <button
            type="button"
            onClick={onNavigateToUpcoming}
            className="btn-ghost hidden sm:inline-flex py-1.5 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View All</span>
            <ArrowRight size={13} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {upcomingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
              <Calendar size={20} aria-hidden />
            </div>
            <p className="mt-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              No upcoming deadlines
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-0.5">
              No future deadlines are scheduled yet. Keep things on your radar.
            </p>
            {onQuickAdd && (
              <button
                type="button"
                onClick={onQuickAdd}
                className="btn-secondary mt-3 py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Plus size={13} aria-hidden /> Schedule upcoming task
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {upcomingTasks.slice(0, 4).map((t) => {
              const days = getDaysUntil(t.dueDate);
              const dayText = days === 1 ? 'Tomorrow' : `In ${days} days`;
              return (
                <li key={t.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={t.completed}
                      onClick={() => onToggle(t.id || t._id)}
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                        t.completed
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 text-transparent hover:border-indigo-500 dark:border-slate-600'
                      }`}
                    >
                      {t.completed && <Check size={11} className="stroke-[3]" aria-hidden />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-semibold ${CATEGORY_STYLES[t.category]}`}>
                          {t.category}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className={`text-[10px] font-semibold ${PRIORITY_STYLES[t.priority]}`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {dayText}
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatDueDate(t.dueDate)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function QuickInsights({ tasks }) {
  const overdue = tasks.filter(isOverdue).length;
  const todayCount = tasks.filter(isDueToday).length;
  const upcoming = tasks.filter(isUpcoming).length;

  const highPriority = tasks.filter((t) => !t.completed && t.priority === 'High').length;
  const mediumPriority = tasks.filter((t) => !t.completed && t.priority === 'Medium').length;
  const lowPriority = tasks.filter((t) => !t.completed && t.priority === 'Low').length;

  return (
    <div className="card p-5 sm:p-6 transition-all hover:shadow-premium-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Sparkles size={14} aria-hidden />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Workload Breakdown
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Overview</span>
      </div>

      {/* Schedule breakdown */}
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2 text-xs dark:bg-slate-800/50">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock size={13} className="text-amber-500" aria-hidden /> Due today
          </span>
          <span className="font-bold text-slate-900 dark:text-white">{todayCount}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2 text-xs dark:bg-slate-800/50">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Calendar size={13} className="text-indigo-500" aria-hidden /> Upcoming
          </span>
          <span className="font-bold text-slate-900 dark:text-white">{upcoming}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2 text-xs dark:bg-slate-800/50">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <AlertTriangle size={13} className="text-rose-500" aria-hidden /> Overdue
          </span>
          <span
            className={`font-bold ${
              overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {overdue}
          </span>
        </div>
      </div>

      {/* Priority micro distribution */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Active Priority Balance
        </p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> High: <strong>{highPriority}</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Med: <strong>{mediumPriority}</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low: <strong>{lowPriority}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

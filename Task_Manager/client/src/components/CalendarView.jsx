import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Check,
  Clock,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Sparkles,
  CalendarDays,
} from 'lucide-react';
import {
  getMonthMatrix,
  getWeekDays,
  formatMonthYear,
  formatWeekRange,
  groupTasksByDate,
} from '@/lib/calendar';
import { todayISO, isOverdue } from '@/lib/datetime';
import { CATEGORY_STYLES, PRIORITY_STYLES, CATEGORY_DOT_COLORS } from '@/types';

export function CalendarView({ tasks, onToggle, onEdit, onDelete, onQuickAdd }) {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  const today = todayISO();
  const todayDate = new Date();

  // Navigation state
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [anchorDate, setAnchorDate] = useState(todayDate);

  // Selected date inspector
  const [selectedDate, setSelectedDate] = useState(today);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Group tasks by dueDate
  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);

  // Month matrix
  const monthDays = useMemo(
    () => getMonthMatrix(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Week days
  const weekInfo = useMemo(() => getWeekDays(anchorDate), [anchorDate]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else {
      const prev = new Date(anchorDate);
      prev.setDate(prev.getDate() - 7);
      setAnchorDate(prev);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    } else {
      const next = new Date(anchorDate);
      next.setDate(next.getDate() + 7);
      setAnchorDate(next);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setAnchorDate(now);
    setSelectedDate(todayISO());
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setInspectorOpen(true);
  };

  // Tasks for selected date in inspector
  const selectedDateTasks = useMemo(() => {
    return tasksByDate[selectedDate] || [];
  }, [tasksByDate, selectedDate]);

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDate) return '';
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(y, m - 1, d));
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      {/* Calendar Top Navigation Toolbar */}
      <div className="card p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25">
            <CalendarDays size={19} aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl dark:text-white">
              {viewMode === 'month'
                ? formatMonthYear(currentYear, currentMonth)
                : formatWeekRange(weekInfo.startOfWeek)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive timeline of all scheduled deliverables
            </p>
          </div>
        </div>

        {/* View Switcher and Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher [Month | Week] */}
          <div
            className="inline-flex rounded-xl border border-slate-200/90 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-900/70"
            role="group"
            aria-label="Calendar view selector"
          >
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                viewMode === 'month'
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                viewMode === 'week'
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Week View
            </button>
          </div>

          {/* Jump to Today Button */}
          <button
            type="button"
            onClick={handleToday}
            className="btn-secondary py-1.5 px-3 text-xs"
          >
            Today
          </button>

          {/* Prev / Next Month/Week Buttons */}
          <div className="flex items-center rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-0.5">
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Previous period"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Next period"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar View Area */}
      {viewMode === 'month' ? (
        <MonthlyCalendarGrid
          days={monthDays}
          tasksByDate={tasksByDate}
          selectedDate={selectedDate}
          onSelectDate={handleDateClick}
          onToggle={onToggle}
          onQuickAdd={onQuickAdd}
        />
      ) : (
        <WeeklyCalendarGrid
          days={weekInfo.days}
          tasksByDate={tasksByDate}
          selectedDate={selectedDate}
          onSelectDate={handleDateClick}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onQuickAdd={onQuickAdd}
        />
      )}

      {/* Selected Date Details Inspector Dialog / Sheet */}
      {inspectorOpen && (
        <DateInspectorModal
          dateStr={selectedDate}
          formattedDate={selectedDateFormatted}
          tasks={selectedDateTasks}
          onClose={() => setInspectorOpen(false)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onQuickAdd={() => onQuickAdd(selectedDate)}
        />
      )}
    </div>
  );
}

function MonthlyCalendarGrid({
  days,
  tasksByDate,
  selectedDate,
  onSelectDate,
  onToggle,
  onQuickAdd,
}) {
  const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="card overflow-hidden">
      {/* Day of Week Header */}
      <div className="grid grid-cols-7 border-b border-slate-200/90 bg-slate-50/80 text-center dark:border-slate-800 dark:bg-slate-900/60">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/70 border-b border-slate-100 dark:border-slate-800/70">
        {days.map((cell) => {
          const dateTasks = tasksByDate[cell.dateStr] || [];
          const hasOverdue = dateTasks.some((t) => isOverdue(t));
          const isSelected = selectedDate === cell.dateStr;

          return (
            <div
              key={cell.dateStr}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`group relative min-h-[105px] sm:min-h-[120px] p-2 transition-all cursor-pointer flex flex-col justify-between ${
                !cell.isCurrentMonth
                  ? 'bg-slate-50/50 text-slate-300 dark:bg-slate-950/30 dark:text-slate-600'
                  : 'bg-white hover:bg-indigo-50/20 dark:bg-surface-cardDark dark:hover:bg-indigo-950/15'
              } ${
                cell.isToday
                  ? 'ring-2 ring-inset ring-indigo-500/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                  : ''
              } ${isSelected ? 'border-2 border-indigo-600 dark:border-indigo-400' : ''}`}
            >
              {/* Day Header Row */}
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                    cell.isToday
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : cell.isCurrentMonth
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                <div className="flex items-center gap-1">
                  {hasOverdue && (
                    <span
                      title="Contains overdue tasks"
                      className="h-2 w-2 rounded-full bg-rose-500 shadow-sm animate-pulse-subtle"
                    />
                  )}
                  {/* Quick Add Button on Hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(cell.dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
                    title={`Add task for ${cell.dateStr}`}
                    aria-label={`Add task for ${cell.dateStr}`}
                  >
                    <Plus size={13} aria-hidden />
                  </button>
                </div>
              </div>

              {/* Tasks List inside Day Cell */}
              <div className="mt-1 flex-1 space-y-1 overflow-hidden">
                {dateTasks.slice(0, 3).map((t) => {
                  const overdue = isOverdue(t);
                  return (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(cell.dateStr);
                      }}
                      className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium truncate transition ${
                        t.completed
                          ? 'bg-slate-100 text-slate-400 line-through dark:bg-slate-800/60 dark:text-slate-500'
                          : overdue
                          ? 'bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40'
                      }`}
                      title={`${t.title} (${t.priority} priority - ${t.category})`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(t.id || t._id);
                        }}
                        className={`h-3 w-3 shrink-0 rounded flex items-center justify-center border ${
                          t.completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-400 hover:border-indigo-600 text-transparent'
                        }`}
                      >
                        {t.completed && <Check size={8} aria-hidden />}
                      </button>
                      <span className="truncate">{t.title}</span>
                    </div>
                  );
                })}

                {dateTasks.length > 3 && (
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 pl-1">
                    +{dateTasks.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyCalendarGrid({
  days,
  tasksByDate,
  selectedDate,
  onSelectDate,
  onToggle,
  onEdit,
  onDelete,
  onQuickAdd,
}) {
  const [activeMobileDate, setActiveMobileDate] = useState(() => {
    const today = days.find((d) => d.isToday);
    return today ? today.dateStr : days[0]?.dateStr;
  });

  const activeMobileDay = days.find((d) => d.dateStr === activeMobileDate) || days[0];
  const activeMobileTasks = tasksByDate[activeMobileDay?.dateStr] || [];

  return (
    <div className="space-y-4">
      {/* Mobile Weekly View (< md) */}
      <div className="block md:hidden space-y-3">
        {/* Horizontal Day Selector Strip */}
        <div className="card p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {days.map((day) => {
            const dateTasks = tasksByDate[day.dateStr] || [];
            const isActive = activeMobileDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setActiveMobileDate(day.dateStr)}
                className={`flex-1 min-w-[54px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {day.dayName}
                </span>
                <span className="text-sm font-extrabold mt-0.5">
                  {day.dayNumber}
                </span>
                <div className="h-1.5 mt-1 flex items-center justify-center gap-0.5">
                  {day.isToday && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-amber-300' : 'bg-indigo-600'}`} />
                  )}
                  {dateTasks.length > 0 && !day.isToday && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Mobile Day Task List Card */}
        {activeMobileDay && (
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {activeMobileDay.dayName}, {activeMobileDay.dateStr}
                  </h3>
                  {activeMobileDay.isToday && (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {activeMobileTasks.length} {activeMobileTasks.length === 1 ? 'task scheduled' : 'tasks scheduled'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onQuickAdd(activeMobileDay.dateStr)}
                className="btn-primary py-1.5 px-3 text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Plus size={13} aria-hidden />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {activeMobileTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                  <p className="text-xs font-medium">No tasks scheduled for this day</p>
                  <button
                    type="button"
                    onClick={() => onQuickAdd(activeMobileDay.dateStr)}
                    className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus size={12} /> Add a task
                  </button>
                </div>
              ) : (
                activeMobileTasks.map((t) => {
                  const overdue = isOverdue(t);
                  return (
                    <div
                      key={t.id || t._id}
                      className={`group rounded-xl border p-3 transition-all ${
                        t.priority === 'High'
                          ? 'border-l-4 border-l-rose-500'
                          : t.priority === 'Medium'
                          ? 'border-l-4 border-l-amber-500'
                          : 'border-l-4 border-l-emerald-500'
                      } ${
                        t.completed
                          ? 'border-slate-200 bg-slate-50/70 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
                          : overdue
                          ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-cardDark'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={t.completed}
                            onClick={() => onToggle(t.id || t._id)}
                            className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                              t.completed
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300 text-transparent hover:border-indigo-500 dark:border-slate-600'
                            }`}
                          >
                            {t.completed && <Check size={11} className="stroke-[3]" aria-hidden />}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-bold leading-tight ${
                                t.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {t.title}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className={`badge py-0 px-1.5 text-[9px] ${CATEGORY_STYLES[t.category]}`}>
                                {t.category}
                              </span>
                              <span className={`badge py-0 px-1.5 text-[9px] ${PRIORITY_STYLES[t.priority]}`}>
                                {t.priority}
                              </span>
                              {overdue && (
                                <span className="badge py-0 px-1.5 text-[9px] bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onEdit(t)}
                            className="rounded-lg p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="Edit"
                          >
                            <Pencil size={13} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(t)}
                            className="rounded-lg p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 size={13} aria-hidden />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop & Tablet Unified 7-Column Grid (md+) */}
      <div className="hidden md:block card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[760px] lg:min-w-0">
            {/* 7-Column Header */}
            <div className="grid grid-cols-7 border-b border-slate-200/90 bg-slate-50/80 divide-x divide-slate-200/70 dark:border-slate-800 dark:bg-slate-900/60 dark:divide-slate-800/70 text-center">
              {days.map((day) => {
                const dateTasks = tasksByDate[day.dateStr] || [];
                const isSelected = selectedDate === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    className={`group relative p-2.5 transition-colors ${
                      day.isToday ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {day.dayName}
                      </span>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(day.dateStr)}
                        className="opacity-0 group-hover:opacity-100 rounded-md p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/60 dark:hover:bg-slate-800 dark:hover:text-indigo-300 transition-all"
                        title={`Add task for ${day.dateStr}`}
                        aria-label={`Add task for ${day.dateStr}`}
                      >
                        <Plus size={13} aria-hidden />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onSelectDate(day.dateStr)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all ${
                          day.isToday
                            ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 font-extrabold text-white shadow-md shadow-indigo-600/30'
                            : isSelected
                            ? 'border-2 border-indigo-600 font-bold text-indigo-600 dark:text-indigo-400'
                            : 'font-bold text-slate-700 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                        title="Inspect date"
                      >
                        {day.dayNumber}
                      </button>
                    </div>

                    <div className="mt-1 flex items-center justify-center">
                      {dateTasks.length > 0 ? (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                          {dateTasks.length} {dateTasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          No tasks
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 7-Column Body */}
            <div className="grid grid-cols-7 divide-x divide-slate-200/70 dark:divide-slate-800/70 h-[500px] xl:h-[560px] bg-white dark:bg-surface-cardDark">
              {days.map((day) => {
                const dateTasks = tasksByDate[day.dateStr] || [];

                return (
                  <div
                    key={day.dateStr}
                    className={`p-2 h-full flex flex-col justify-between min-h-0 transition-colors ${
                      day.isToday ? 'bg-indigo-50/15 dark:bg-indigo-950/10' : ''
                    }`}
                  >
                    {/* Task cards list with independent vertical scroll */}
                    <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                      {dateTasks.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => onQuickAdd(day.dateStr)}
                            className="group/empty w-full h-full min-h-[140px] rounded-xl border border-dashed border-slate-200/80 p-3 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-800/80 dark:text-slate-600 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
                          >
                            <Plus size={16} className="group-hover/empty:scale-125 group-hover/empty:text-indigo-600 dark:group-hover/empty:text-indigo-400 transition-transform" />
                            <span className="mt-1.5 text-[11px] font-medium group-hover/empty:text-indigo-600 dark:group-hover/empty:text-indigo-400">
                              Add task
                            </span>
                          </button>
                        </div>
                      ) : (
                        dateTasks.map((t) => {
                          const overdue = isOverdue(t);
                          return (
                            <div
                              key={t.id || t._id}
                              className={`group relative rounded-xl border p-2 transition-all ${
                                t.priority === 'High'
                                  ? 'border-l-3 border-l-rose-500'
                                  : t.priority === 'Medium'
                                  ? 'border-l-3 border-l-amber-500'
                                  : 'border-l-3 border-l-emerald-500'
                              } ${
                                t.completed
                                  ? 'border-slate-200/70 bg-slate-50/80 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
                                  : overdue
                                  ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20'
                                  : 'border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs dark:border-slate-800 dark:bg-surface-cardDark'
                              }`}
                            >
                              <div className="flex items-start gap-1.5">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={t.completed}
                                  onClick={() => onToggle(t.id || t._id)}
                                  className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition ${
                                    t.completed
                                      ? 'border-indigo-600 bg-indigo-600 text-white'
                                      : 'border-slate-300 text-transparent hover:border-indigo-500 dark:border-slate-600'
                                  }`}
                                >
                                  {t.completed && <Check size={9} aria-hidden />}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`truncate text-xs font-bold leading-tight ${
                                      t.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-800 dark:text-slate-200'
                                    }`}
                                    title={t.title}
                                  >
                                    {t.title}
                                  </p>

                                  <div className="mt-1 flex items-center justify-between gap-1">
                                    <span className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                      {t.category}
                                    </span>
                                    {overdue && (
                                      <span className="shrink-0 text-[9px] font-extrabold text-rose-600 dark:text-rose-400">
                                        Overdue
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons on card hover */}
                              <div className="mt-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => onEdit(t)}
                                  className="rounded p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                  title="Edit"
                                >
                                  <Pencil size={11} aria-hidden />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDelete(t)}
                                  className="rounded p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 size={11} aria-hidden />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Column footer button */}
                    {dateTasks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onSelectDate(day.dateStr)}
                        className="mt-2 shrink-0 w-full rounded-lg py-1 text-center text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-slate-800/60 dark:hover:text-indigo-300 transition-colors"
                      >
                        Inspect ({dateTasks.length})
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInspectorModal({
  dateStr,
  formattedDate,
  tasks,
  onClose,
  onToggle,
  onEdit,
  onDelete,
  onQuickAdd,
}) {
  const isTodayDate = dateStr === todayISO();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-modal-in dark:border-slate-800 dark:bg-surface-cardDark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              <CalendarIcon size={19} aria-hidden />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="inspector-title" className="text-base font-bold text-slate-900 dark:text-white">
                  {formattedDate}
                </h2>
                {isTodayDate && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tasks.length} {tasks.length === 1 ? 'task scheduled' : 'tasks scheduled'}
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

        {/* Task list for this date */}
        <div className="max-h-[380px] overflow-y-auto px-6 py-4 space-y-2.5">
          {tasks.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
                <Sparkles size={22} aria-hidden />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                No tasks scheduled for this day
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                Keep on track by assigning deliverables or action items to this date.
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const overdue = isOverdue(task);
              return (
                <div
                  key={task.id}
                  className={`card flex items-start gap-3 p-3.5 transition ${
                    task.completed ? 'opacity-70' : ''
                  }`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    onClick={() => onToggle(task.id || task._id)}
                    className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                      task.completed
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 text-transparent hover:border-indigo-500 dark:border-slate-600'
                    }`}
                  >
                    {task.completed && <Check size={12} aria-hidden />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold leading-snug ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className={`badge ${CATEGORY_STYLES[task.category]}`}>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT_COLORS[task.category] ?? 'bg-slate-400'}`}
                          aria-hidden
                        />
                        {task.category}
                      </span>
                      <span className={`badge ${PRIORITY_STYLES[task.priority]}`}>
                        {task.priority}
                      </span>
                      {overdue && (
                        <span className="badge bg-rose-500/10 text-rose-600 border border-rose-500/20 font-bold">
                          <AlertCircle size={10} aria-hidden /> Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEdit(task);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                      title="Edit"
                    >
                      <Pencil size={14} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDelete(task);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 dark:hover:text-rose-300"
                      title="Delete"
                    >
                      <Trash2 size={14} aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with "+ Add Task for this date" button */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button type="button" className="btn-ghost text-xs" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onQuickAdd();
            }}
            className="btn-primary py-2 px-3.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus size={15} aria-hidden />
            <span>Add Task for this Date</span>
          </button>
        </div>
      </div>
    </div>
  );
}

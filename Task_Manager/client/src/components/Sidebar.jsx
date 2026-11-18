import {
  LayoutDashboard,
  ListTodo,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCheck,
  X,
  Sparkles,
  FolderKanban,
  Zap,
  Database,
  Layers,
  Plus,
  LogIn,
  LogOut,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_DOT_COLORS } from '@/types';
import { countForView, categoryCount, computeStats } from '@/lib/stats';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all', label: 'My Tasks', icon: ListTodo },
  { id: 'today', label: 'Today', icon: CalendarCheck },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'completed', label: 'Completed', icon: CheckCheck },
];

export function Sidebar({
  open,
  onClose,
  view,
  onView,
  onCategory,
  selectedCategory,
  tasks,
  activeCategory,
  onQuickAdd,
  user,
  isAuthenticated,
  onOpenAuth,
  onLogout,
}) {
  const stats = computeStats(tasks);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-out dark:border-slate-800/80 dark:bg-surface-sidebarDark/95 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-72 lg:shrink-0 lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        {/* Brand / Workspace Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25">
              <Sparkles size={19} className="animate-pulse-subtle" aria-hidden />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Tasker
                </span>
                <span className="rounded-md bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                {user ? `${user.name.split(' ')[0]}’s Workspace` : 'Personal Workspace'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* Quick Add Task Button in Sidebar */}
        <div className="px-4 pt-4 pb-1">
          <button
            type="button"
            onClick={() => {
              if (onQuickAdd) onQuickAdd();
              if (open) onClose();
            }}
            className="btn-primary w-full py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 group"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90 duration-200" aria-hidden />
            <span>Quick Add Task</span>
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="flex items-center justify-between px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Navigation</span>
              <Layers size={13} aria-hidden />
            </div>
            <ul className="space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = view === item.id;
                const count = countForView(tasks, item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onView(item.id)}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/15 to-violet-500/10 text-indigo-700 font-semibold shadow-sm dark:from-indigo-500/20 dark:via-indigo-500/15 dark:to-violet-500/20 dark:text-indigo-200'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-600" />
                      )}
                      <Icon
                        size={18}
                        className={`transition-colors duration-150 ${
                          active
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                        }`}
                        aria-hidden />
                      <span className="flex-1 text-left">{item.label}</span>
                      {count > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                            active
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700/80'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Categories</span>
              <FolderKanban size={13} aria-hidden />
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => onCategory('all')}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    activeCategory === 'all' && selectedCategory === 'all' && view === 'all'
                      ? 'bg-indigo-500/10 text-indigo-700 font-semibold dark:bg-indigo-500/20 dark:text-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-md border border-slate-300 text-slate-400 dark:border-slate-600">
                    <ListTodo size={11} aria-hidden />
                  </span>
                  <span className="flex-1 text-left">All Categories</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {tasks.length}
                  </span>
                </button>
              </li>
              {CATEGORIES.map((c) => {
                const active = activeCategory === c && view === 'all';
                const count = categoryCount(tasks, c);
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => onCategory(c)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-indigo-500/10 text-indigo-700 font-semibold dark:bg-indigo-500/20 dark:text-indigo-200'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex h-4 w-4 items-center justify-center">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOT_COLORS[c] ?? 'bg-slate-400'}`}
                          aria-hidden
                        />
                      </span>
                      <span className="flex-1 text-left">{c}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 group-hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-400">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer Widget */}
        <div className="border-t border-slate-100 p-3.5 dark:border-slate-800/60">
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 p-3.5 shadow-sm dark:border-indigo-900/30 dark:from-indigo-950/20 dark:via-surface-sidebarDark dark:to-violet-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Zap size={14} className="text-indigo-600 dark:text-indigo-400" aria-hidden />
                <span>Task Completion</span>
              </div>
              <span className="rounded-full bg-indigo-600/10 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {stats.completionRate}%
              </span>
            </div>

            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100/80 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Database size={11} aria-hidden /> MongoDB sync
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {stats.completed}/{stats.total} done
              </span>
            </div>
          </div>
        </div>

        {/* User Account / Authentication Footer */}
        <div className="border-t border-slate-100 p-3.5 dark:border-slate-800/60">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-sm">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="btn-primary w-full py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <LogIn size={15} aria-hidden />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

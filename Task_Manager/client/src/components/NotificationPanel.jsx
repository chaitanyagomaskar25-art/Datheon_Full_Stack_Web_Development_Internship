import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Check,
} from 'lucide-react';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function NotificationPanel({
  open,
  onClose,
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onRefresh,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const panelRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Only close if click is not inside the trigger button
        const isTrigger = e.target.closest('[data-notification-trigger]');
        if (!isTrigger) onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Floating Notification Panel */}
      <div
        ref={panelRef}
        className="fixed inset-x-3 top-16 z-50 max-h-[85vh] w-auto origin-top rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-surface-dark/95 dark:shadow-slate-950/60 md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2 md:w-[420px] animate-scale-in flex flex-col overflow-hidden"
        role="dialog"
        aria-label="Notification center"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800/70">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Bell size={16} aria-hidden />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Reminders, deadlines, and task alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Check for new reminders"
              aria-label="Check for new reminders"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} aria-hidden />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Close notification panel"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>

        {/* Filter Tabs & Bulk Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2 dark:border-slate-800/50 dark:bg-slate-900/30 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={13} aria-hidden />
                <span>Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 size={13} aria-hidden />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400 mb-2.5">
                <Sparkles size={20} aria-hidden />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 max-w-[240px]">
                {filter === 'unread'
                  ? 'You are all caught up on your reminders and task deadlines!'
                  : 'Upcoming deadlines, overdue reminders, and task completion notices will appear here.'}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const id = item.id || item._id;
              const isOverdue = item.type === 'task_overdue';
              const isUpcoming = item.type === 'deadline_upcoming';
              const isCompleted = item.type === 'task_completed';

              return (
                <div
                  key={id}
                  className={`group relative flex items-start gap-3 p-3.5 transition-colors ${
                    !item.read
                      ? 'bg-indigo-50/40 hover:bg-indigo-50/70 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5 shrink-0">
                    {isOverdue && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        <AlertTriangle size={15} aria-hidden />
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                        <Clock size={15} aria-hidden />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <CheckCircle2 size={15} aria-hidden />
                      </div>
                    )}
                    {!isOverdue && !isUpcoming && !isCompleted && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        <Bell size={15} aria-hidden />
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4
                          className={`truncate text-xs font-bold ${
                            !item.read
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span
                            className="h-2 w-2 rounded-full bg-indigo-600 shrink-0"
                            title="Unread notification"
                            aria-hidden
                          />
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.message}
                    </p>

                    {/* Metadata tags if present */}
                    {item.metadata && (item.metadata.dueDate || item.metadata.priority) && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                        {item.metadata.dueDate && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            Due {item.metadata.dueDate}
                          </span>
                        )}
                        {item.metadata.priority && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 font-semibold ${
                              item.metadata.priority === 'High'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                : item.metadata.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {item.metadata.priority}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Row Actions */}
                  <div className="flex flex-col items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => onMarkAsRead(id)}
                        className="rounded-md p-1 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 transition-colors"
                        title="Mark as read"
                        aria-label="Mark as read"
                      >
                        <Check size={13} aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(id)}
                      className="rounded-md p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <X size={13} aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center text-[11px] font-medium text-slate-500 dark:border-slate-800/70 dark:bg-slate-900/40 dark:text-slate-400">
          Reminders auto-sync with your MongoDB task deadlines
        </div>
      </div>
    </>
  );
}

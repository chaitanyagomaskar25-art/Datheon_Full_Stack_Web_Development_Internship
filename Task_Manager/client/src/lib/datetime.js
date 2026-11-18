export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function getTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const formatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function formatLongDate(d = new Date()) {
  return formatter.format(d);
}

export function formatDueDate(iso) {
  if (!iso) return '';
  const date = new Date(iso + 'T00:00:00');
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  const opts =
    diffDays < 0
      ? { month: 'short', day: 'numeric' }
      : target.getFullYear() === today.getFullYear()
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat(undefined, opts).format(date);
}

export function getDaysUntil(iso) {
  if (!iso) return null;
  const date = new Date(iso + 'T00:00:00');
  if (isNaN(date.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function isOverdue(task) {
  if (!task || task.completed || !task.dueDate) return false;
  return task.dueDate < todayISO();
}

export function isDueToday(task) {
  if (!task) return false;
  return !task.completed && task.dueDate === todayISO();
}

export function isUpcoming(task) {
  if (!task) return false;
  return !task.completed && !!task.dueDate && task.dueDate > todayISO();
}

export function formatRelativeCreated(iso) {
  if (!iso) return 'recently';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return 'recently';
  const now = Date.now();
  const sec = Math.max(1, Math.round((now - then) / 1000));
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(iso));
}

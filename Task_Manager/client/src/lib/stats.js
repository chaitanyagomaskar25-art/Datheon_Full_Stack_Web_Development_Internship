import { isOverdue, isDueToday, isUpcoming } from '@/lib/datetime';

export function computeStats(tasks) {
  if (!Array.isArray(tasks)) {
    return { total: 0, active: 0, completed: 0, overdue: 0, completionRate: 0 };
  }
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(isOverdue).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, active, completed, overdue, completionRate };
}

export function countForView(tasks, view) {
  if (!Array.isArray(tasks)) return 0;
  switch (view) {
    case 'all':
      return tasks.length;
    case 'today':
      return tasks.filter(isDueToday).length;
    case 'upcoming':
      return tasks.filter(isUpcoming).length;
    case 'calendar':
      return tasks.filter((t) => !!t.dueDate).length;
    case 'completed':
      return tasks.filter((t) => t.completed).length;
    case 'dashboard':
      return tasks.length;
    default:
      return 0;
  }
}

export function categoryCount(tasks, category) {
  if (!Array.isArray(tasks)) return 0;
  return tasks.filter((t) => t.category === category).length;
}

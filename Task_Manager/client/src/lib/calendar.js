import { todayISO } from '@/lib/datetime';

export function toLocalISOString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(isoStr) {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatMonthYear(year, month) {
  const date = new Date(year, month, 1);
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatWeekRange(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const startMonth = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(startDate);
  const endMonth = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(endDate);
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

export function getMonthMatrix(year, month) {
  const today = todayISO();
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const dateObj = new Date(year, month - 1, dayNumber);
    const dateStr = toLocalISOString(dateObj);
    days.push({
      dateStr,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateStr === today,
      isPast: dateStr < today,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = toLocalISOString(dateObj);
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === today,
      isPast: dateStr < today,
    });
  }

  // Next month padding to make full 5 or 6 weeks (total cells multiple of 7, up to 35 or 42)
  const remainingCells = (7 - (days.length % 7)) % 7;
  // If month view is 35 and we have 28, add 7, or if 35 is not enough, add up to 42
  const totalTarget = days.length + remainingCells <= 35 ? 35 : 42;
  const nextMonthPadding = totalTarget - days.length;

  for (let day = 1; day <= nextMonthPadding; day++) {
    const dateObj = new Date(year, month + 1, day);
    const dateStr = toLocalISOString(dateObj);
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === today,
      isPast: dateStr < today,
    });
  }

  return days;
}

export function getWeekDays(anchorDate) {
  const today = todayISO();
  const date = new Date(anchorDate);
  const dayOfWeek = date.getDay(); // 0 is Sunday
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);

  const days = [];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const current = new Date(startOfWeek);
    current.setDate(startOfWeek.getDate() + i);
    const dateStr = toLocalISOString(current);
    days.push({
      dateStr,
      dayName: DAY_NAMES[i],
      dayNumber: current.getDate(),
      isToday: dateStr === today,
      isPast: dateStr < today,
      dateObj: current,
    });
  }

  return {
    days,
    startOfWeek,
  };
}

export function groupTasksByDate(tasks) {
  const map = {};
  for (const t of tasks) {
    if (!t.dueDate) continue;
    if (!map[t.dueDate]) {
      map[t.dueDate] = [];
    }
    map[t.dueDate].push(t);
  }
  return map;
}

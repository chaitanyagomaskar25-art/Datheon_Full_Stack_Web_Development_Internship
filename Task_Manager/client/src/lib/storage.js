const TASKS_KEY = 'productivity_tasks';
const THEME_KEY = 'productivity_theme';

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (t) =>
          t !== null &&
          typeof t === 'object' &&
          typeof t.id === 'string' &&
          typeof t.title === 'string'
      )
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: typeof t.description === 'string' ? t.description : '',
        category: t.category,
        priority: t.priority,
        dueDate: t.dueDate ?? null,
        completed: !!t.completed,
        createdAt: t.createdAt,
      }));
  } catch (err) {
    // Malformed JSON — do NOT overwrite existing data. Surface a warning.
    console.warn('Failed to parse saved tasks:', err);
    return [];
  }
}

export function saveToLocalStorage(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.warn('Failed to save tasks:', err);
    return false;
  }
}

export function loadThemeFromLocalStorage() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'dark' || t === 'light' ? t : null;
  } catch {
    return null;
  }
}

export function saveThemeToLocalStorage(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* non-fatal */
  }
}

export function storageAvailable() {
  try {
    const k = '__pt_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

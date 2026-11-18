import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Trash2,
  Calendar,
  Sparkles,
  Plus,
  LayoutList,
  Columns2,
  Columns3,
  LogIn,
  LogOut,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { PRIORITY_RANK } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { useToasts } from '@/hooks/useToast';
import { computeStats } from '@/lib/stats';
import {
  isDueToday,
  isUpcoming,
  formatLongDate,
  todayISO,
  getTomorrowISO,
} from '@/lib/datetime';

import { Sidebar } from '@/components/Sidebar';
import {
  SummaryCards,
  ProgressIndicator,
  QuickInsights,
  TodaysTasksSection,
  UpcomingDeadlinesSection,
} from '@/components/SummaryCards';
import { CalendarView } from '@/components/CalendarView';
import { TaskForm } from '@/components/TaskForm';
import { FilterBar } from '@/components/FilterBar';
import { TaskItem, EmptyState } from '@/components/TaskItem';
import { StatusKanbanBoard, PriorityKanbanBoard } from '@/components/TaskBoard';
import { EditTaskModal } from '@/components/EditTaskModal';
import { QuickAddModal } from '@/components/QuickAddModal';
import { NotificationPanel } from '@/components/NotificationPanel';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ToastContainer } from '@/components/Toasts';
import { WelcomePage } from '@/pages/WelcomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

function getGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}

const VIEW_TITLES = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'Overview of your productivity metrics, priority backlog, and task velocity.',
  },
  all: {
    title: 'My Tasks',
    subtitle: 'Comprehensive view of all active, in-progress, and backlog tasks.',
  },
  today: {
    title: 'Today’s Tasks',
    subtitle: 'Critical tasks scheduled for today — execute and clear your queue.',
  },
  upcoming: {
    title: 'Upcoming Deadlines',
    subtitle: 'Milestones and upcoming deadlines scheduled on your timeline.',
  },
  calendar: {
    title: 'Schedule & Calendar',
    subtitle: 'Monthly and weekly view of tasks and deadlines across your timeline.',
  },
  completed: {
    title: 'Completed Archive',
    subtitle: 'A historical record of completed objectives and milestones.',
  },
};

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  category: 'all',
  priority: 'all',
  sort: 'recent',
};

export default function App() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const {
    tasks,
    initialized,
    storageOk,
    apiOk,
    addTask,
    updateTask,
    toggleTask,
    setTaskCompleted,
    setTaskPriority,
    deleteTask,
    reorder,
    clearAll,
  } = useTasks(user);
  const { theme, toggleTheme } = useTheme();
  const { toasts, toast, dismiss } = useToasts();

  const [view, setView] = useState('dashboard');
  const [layoutMode, setLayoutMode] = useState('list'); // 'list' | 'status' | 'priority'
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddDefaultDate, setQuickAddDefaultDate] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [authPage, setAuthPage] = useState('welcome'); // 'welcome' | 'login' | 'register'
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const navigateAuth = useCallback((page) => {
    setAuthPage(page);
    try {
      window.location.hash = page;
    } catch {
      // non-fatal
    }
  }, []);

  // Synchronize hash in URL for bookmarking and back button
  useEffect(() => {
    const handleHash = () => {
      const h = (window.location.hash || '').replace('#', '').toLowerCase();
      if (h === 'login') setAuthPage('login');
      else if (h === 'register') setAuthPage('register');
      else if (h === 'welcome') setAuthPage('welcome');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const {
    notifications,
    unreadCount,
    isLoading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    checkReminders,
    refreshNotifications,
  } = useNotifications(user);

  const handleLogin = useCallback(
    async (email, password) => {
      const res = await login(email, password);
      if (res && res.success) {
        toast('success', `Welcome back, ${res.user?.name || 'User'}!`);
      }
      return res;
    },
    [login, toast]
  );

  const handleRegister = useCallback(
    async (name, email, password) => {
      const res = await register(name, email, password);
      if (res && res.success) {
        toast('success', `Welcome to Tasker Pro, ${res.user?.name || 'User'}!`);
      }
      return res;
    },
    [register, toast]
  );

  const handleDemoLogin = useCallback(async () => {
    const res = await login('demo@tasker.pro', 'password123');
    if (res && res.success) {
      toast('success', `Welcome to Tasker Pro, ${res.user?.name || 'Alex'}!`);
    } else {
      toast('error', res?.error || 'Demo login failed.');
    }
  }, [login, toast]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigateAuth('welcome');
    toast('info', 'You have been signed out.');
  }, [logout, navigateAuth, toast]);

  const handleView = useCallback((v) => {
    setView(v);
    setFilters((f) => ({
      ...f,
      status: v === 'completed' ? 'completed' : v === 'all' || v === 'dashboard' ? 'all' : 'active',
      category: 'all',
    }));
    setSidebarOpen(false);
  }, []);

  const handleCategory = useCallback((c) => {
    setView('all');
    setFilters((f) => ({ ...f, category: c, status: 'all' }));
    setSidebarOpen(false);
  }, []);

  const patchFilters = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const handleAdd = useCallback(
    async (input) => {
      if (!isAuthenticated) {
        toast('info', 'Please sign in to create tasks.');
        navigateAuth('login');
        return { success: false, error: 'Authentication required' };
      }
      const res = await addTask(input);
      if (res && res.success) {
        toast('success', 'Task created successfully.');
        if (!storageOk) toast('error', 'Storage unavailable — task won’t persist after refresh.');
        return res;
      } else {
        toast('error', res?.error || 'Failed to add task.');
        return res;
      }
    },
    [addTask, toast, storageOk, isAuthenticated, navigateAuth]
  );

  const openQuickAdd = useCallback(
    (datePreset = '') => {
      if (!isAuthenticated) {
        toast('info', 'Please sign in to create and manage tasks.');
        navigateAuth('login');
        return;
      }
      setQuickAddDefaultDate(datePreset);
      setQuickAddOpen(true);
    },
    [isAuthenticated, toast, navigateAuth]
  );

  const handleSaveEdit = useCallback(
    async (id, patch) => {
      const res = await updateTask(id, patch);
      if (res && res.success) {
        setEditOpen(false);
        setEditing(null);
        toast('success', 'Task updated successfully.');
        if (patch.completed || patch.dueDate) {
          setTimeout(() => refreshNotifications(false), 300);
        }
        return res;
      } else {
        toast('error', res?.error || 'Failed to update task.');
        return res;
      }
    },
    [updateTask, toast, refreshNotifications]
  );

  const handleToggle = useCallback(
    async (id) => {
      const res = await toggleTask(id);
      if (res && res.success) {
        if (res.completed) {
          toast('success', 'Task marked as completed!');
          setTimeout(() => refreshNotifications(false), 300);
        } else {
          toast('info', 'Task reopened as active.');
        }
      }
    },
    [toggleTask, toast, refreshNotifications]
  );

  const handleDelete = useCallback((task) => setConfirmDelete(task), []);
  const confirmDeleteTask = useCallback(() => {
    if (confirmDelete) {
      const res = deleteTask(confirmDelete.id);
      if (res && res.success) {
        toast('success', 'Task deleted successfully.');
      } else {
        toast('error', res?.error || 'Failed to delete task.');
      }
    }
    setConfirmDelete(null);
  }, [confirmDelete, deleteTask, toast]);

  // Drag and drop state & handlers
  const [dragId, setDragId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  const handleDragStart = useCallback((id) => {
    setDragId(id);
  }, []);

  const handleDragEnter = useCallback(
    (targetId) => {
      setDropTargetId(targetId);
      if (layoutMode === 'list' && dragId && targetId && targetId !== dragId) {
        reorder(dragId, targetId);
      }
    },
    [dragId, layoutMode, reorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDropTargetId(null);
  }, []);

  const handleMoveToStatus = useCallback(
    async (taskId, isCompleted) => {
      const res = await setTaskCompleted(taskId, isCompleted);
      setDragId(null);
      setDropTargetId(null);
      if (res && res.success) {
        if (isCompleted) {
          toast('success', 'Task marked as Completed.');
          setTimeout(() => refreshNotifications(false), 300);
        } else {
          toast('info', 'Task reopened as Active.');
        }
      }
    },
    [setTaskCompleted, toast, refreshNotifications]
  );

  const handleMoveToPriority = useCallback(
    (taskId, priority) => {
      const res = setTaskPriority(taskId, priority);
      setDragId(null);
      setDropTargetId(null);
      if (res && res.success) {
        toast('success', `Task priority set to ${priority}.`);
      }
    },
    [setTaskPriority, toast]
  );

  // View-scoped tasks
  const viewScoped = useMemo(() => {
    switch (view) {
      case 'all':
      case 'dashboard':
      case 'calendar':
        return tasks;
      case 'today':
        return tasks.filter(isDueToday);
      case 'upcoming':
        return tasks.filter(isUpcoming);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, view]);

  // Apply filters + search + sort
  const visibleTasks = useMemo(() => {
    let list = viewScoped || [];
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (filters.status === 'active') list = list.filter((t) => !t.completed);
    else if (filters.status === 'completed') list = list.filter((t) => t.completed);
    if (filters.category !== 'all') list = list.filter((t) => t.category === filters.category);
    if (filters.priority !== 'all') list = list.filter((t) => t.priority === filters.priority);

    const sorted = [...list];
    switch (filters.sort) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'dueDate':
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
        break;
      case 'priority':
        sorted.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
        break;
      default:
        break;
    }
    return sorted;
  }, [viewScoped, filters]);

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const hasActiveFilters = useMemo(
    () =>
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.category !== 'all' ||
      filters.priority !== 'all' ||
      filters.sort !== 'recent',
    [filters]
  );

  const activeCategory = filters.category;
  const header = VIEW_TITLES[view];
  const greeting = getGreeting();

  // Dedicated routing for unauthenticated users
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return (
        <>
          <LoginPage
            onNavigateRegister={() => navigateAuth('register')}
            onNavigateWelcome={() => navigateAuth('welcome')}
            onLogin={handleLogin}
            onDemoLogin={handleDemoLogin}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
      );
    }
    if (authPage === 'register') {
      return (
        <>
          <RegisterPage
            onNavigateLogin={() => navigateAuth('login')}
            onNavigateWelcome={() => navigateAuth('welcome')}
            onRegister={handleRegister}
            onDemoLogin={handleDemoLogin}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
      );
    }
    return (
      <>
        <WelcomePage
          onNavigateLogin={() => navigateAuth('login')}
          onNavigateRegister={() => navigateAuth('register')}
          onDemoLogin={handleDemoLogin}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-glow-indigo">
            <Sparkles className="animate-spin" size={22} />
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Initializing your workspace…
          </span>
        </div>
      </div>
    );
  }

  const showSummary = view === 'dashboard';
  const showCalendar = view === 'calendar';
  const showForm = view !== 'completed' && view !== 'calendar';
  const showFilters =
    view === 'all' || view === 'dashboard' || view === 'today' || view === 'upcoming';
  const showTaskList = view !== 'calendar';

  return (
    <div className="flex h-screen overflow-hidden bg-surface-light text-slate-900 dark:bg-surface-dark dark:text-slate-100 ambient-glow antialiased selection:bg-indigo-500/20">
      {/* Sidebar Navigation */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        onView={handleView}
        onCategory={handleCategory}
        selectedCategory={filters.category}
        activeCategory={activeCategory}
        tasks={tasks}
        onQuickAdd={() => openQuickAdd('')}
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => navigateAuth('login')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-y-auto scroll-smooth">
        {/* Modern SaaS Header Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-dark/80">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={19} aria-hidden />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                    {header.title}
                  </h1>
                  {view === 'dashboard' && (
                    <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 sm:inline-flex dark:bg-indigo-500/15 dark:text-indigo-300">
                      {user ? `${greeting}, ${user.name.split(' ')[0]}` : greeting}
                    </span>
                  )}
                </div>
                <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                  {header.subtitle}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <Calendar size={13} className="text-indigo-500" aria-hidden />
                <span>{formatLongDate()}</span>
              </div>

              {/* Quick Add Button in Header */}
              <button
                type="button"
                onClick={() => openQuickAdd('')}
                className="btn-primary py-2 px-3.5 text-xs font-semibold shadow-sm flex items-center gap-1.5"
                aria-label="Quick add task"
              >
                <Plus size={15} aria-hidden />
                <span className="hidden sm:inline">Quick Add</span>
              </button>

              {tasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="btn-ghost text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hidden sm:inline-flex"
                  aria-label="Clear all tasks"
                  title="Clear all tasks"
                >
                  <Trash2 size={14} aria-hidden />
                  <span>Clear All</span>
                </button>
              )}

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-ghost relative rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? (
                  <Sun size={17} className="text-amber-400 animate-fade-in" aria-hidden />
                ) : (
                  <Moon size={17} className="text-indigo-600 animate-fade-in" aria-hidden />
                )}
              </button>

              {/* Notification Center Trigger & Panel */}
              <div className="relative">
                <button
                  type="button"
                  data-notification-trigger="true"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast('info', 'Please sign in to view your notifications.');
                      setAuthMode('login');
                      setAuthModalOpen(true);
                      return;
                    }
                    setNotificationPanelOpen((prev) => !prev);
                  }}
                  className={`btn-ghost relative rounded-xl border p-2 text-slate-600 transition-all dark:text-slate-300 ${
                    notificationPanelOpen
                      ? 'border-indigo-400 bg-indigo-50/80 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'border-slate-200/80 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400'
                  }`}
                  aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                  title="Notifications & reminders"
                >
                  <Bell size={17} aria-hidden />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-surface-dark animate-pulse-subtle">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Floating Notification Panel */}
                <NotificationPanel
                  open={notificationPanelOpen}
                  onClose={() => setNotificationPanelOpen(false)}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  isLoading={notificationsLoading}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onDelete={deleteNotification}
                  onClearAll={clearAllNotifications}
                  onRefresh={checkReminders}
                />
              </div>

              {/* Authentication Button in Header */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
                  <div
                    className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 py-1 px-2.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                    title={`Signed in as ${user.name} (${user.email})`}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-[10px] font-bold text-white">
                        {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="hidden md:inline max-w-[110px] truncate font-semibold text-slate-800 dark:text-slate-200">
                      {user.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-ghost rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:text-rose-400"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut size={16} aria-hidden />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="btn-secondary py-2 px-3 text-xs font-semibold flex items-center gap-1.5 ml-1 shadow-sm"
                  aria-label="Sign In"
                >
                  <LogIn size={15} aria-hidden />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {!isAuthenticated && (
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-violet-50/80 to-purple-50/90 p-5 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-violet-950/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                    <ShieldCheck size={22} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Authentication Required for Isolated Workspace
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Sign in or use the 1-click Demo Account to access, create, and manage your private tasks securely persisted in MongoDB.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="btn-primary flex-1 sm:flex-initial py-2 px-4 text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <LogIn size={14} aria-hidden />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="btn-ghost flex-1 sm:flex-initial py-2 px-4 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40"
                  >
                    <span>Register</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!apiOk && isAuthenticated && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-medium text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
              Backend Notice: Could not connect to Express &amp; MongoDB backend at {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}. Ensure MongoDB and the backend are running with <code className="bg-amber-200/50 px-1 py-0.5 rounded font-mono">npm run server</code>.
            </div>
          )}

          {/* Professional Dashboard Overview Section */}
          {showSummary && (
            <section aria-label="Dashboard Overview" className="space-y-5">
              {/* Overview with Total Tasks, Active Tasks, Completed Tasks, and Overdue Tasks */}
              <SummaryCards stats={stats} onSelectView={handleView} />

              {/* Task Completion Progress Indicator & Workload Breakdown */}
              <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                <ProgressIndicator
                  rate={stats.completionRate}
                  completed={stats.completed}
                  total={stats.total}
                />
                <QuickInsights tasks={tasks} />
              </div>

              {/* Today's Tasks Section & Upcoming Deadlines Section */}
              <div className="grid gap-4 md:grid-cols-2">
                <TodaysTasksSection
                  tasks={tasks}
                  onToggle={handleToggle}
                  onNavigateToToday={() => handleView('today')}
                  onQuickAdd={() => openQuickAdd(todayISO())}
                />
                <UpcomingDeadlinesSection
                  tasks={tasks}
                  onToggle={handleToggle}
                  onNavigateToUpcoming={() => handleView('upcoming')}
                  onQuickAdd={() => openQuickAdd(getTomorrowISO())}
                />
              </div>
            </section>
          )}

          {/* Interactive Modern Calendar View */}
          {showCalendar && (
            <section aria-label="Interactive Calendar Schedule">
              <CalendarView
                tasks={tasks}
                onToggle={handleToggle}
                onEdit={(t) => {
                  setEditing(t);
                  setEditOpen(true);
                }}
                onDelete={handleDelete}
                onQuickAdd={openQuickAdd}
              />
            </section>
          )}

          {/* Inline Quick Task Creation Form */}
          {showForm && (
            <section aria-label="Task Creator">
              <TaskForm onAdd={handleAdd} />
            </section>
          )}

          {/* Search & Filter Toolbar */}
          {showFilters && (
            <section aria-label="Filter Controls">
              <FilterBar
                filters={filters}
                onChange={patchFilters}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </section>
          )}

          {/* Task Management Section (List, Status Board, Priority Board) */}
          {showTaskList && (
            <section aria-label="Task Backlog" className="space-y-3.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                    {layoutMode === 'list'
                      ? 'Task Backlog'
                      : layoutMode === 'status'
                      ? 'Status Kanban Board'
                      : 'Priority Organization Board'}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {visibleTasks.length}
                  </span>
                  {hasActiveFilters && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      Filtered
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Layout View Switcher */}
                  <div
                    className="inline-flex rounded-xl border border-slate-200/90 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-900/70"
                    role="group"
                    aria-label="Layout view mode"
                  >
                    <button
                      type="button"
                      onClick={() => setLayoutMode('list')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        layoutMode === 'list'
                          ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                      title="List View with Drag Reorder"
                    >
                      <LayoutList size={13} aria-hidden />
                      <span>List</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLayoutMode('status')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        layoutMode === 'status'
                          ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                      title="Active vs Completed Status Board"
                    >
                      <Columns2 size={13} aria-hidden />
                      <span>Status Board</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLayoutMode('priority')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        layoutMode === 'priority'
                          ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                      title="High, Medium, Low Priority Board"
                    >
                      <Columns3 size={13} aria-hidden />
                      <span>Priority Board</span>
                    </button>
                  </div>
                </div>
              </div>

              {visibleTasks.length === 0 ? (
                <EmptyState
                  message={
                    tasks.length === 0
                      ? 'No tasks created yet — begin by adding your first task above.'
                      : 'No tasks match your selected filter criteria.'
                  }
                  hint={
                    tasks.length === 0
                      ? 'Capture action items, assign due dates, and track progress effortlessly.'
                      : 'Try clearing your search keyword or switching your category/status filters.'
                  }
                  onReset={tasks.length === 0 ? undefined : resetFilters}
                />
              ) : layoutMode === 'status' ? (
                <StatusKanbanBoard
                  tasks={visibleTasks}
                  onToggle={handleToggle}
                  onEdit={(t) => {
                    setEditing(t);
                    setEditOpen(true);
                  }}
                  onDelete={handleDelete}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  dragId={dragId}
                  dropTargetId={dropTargetId}
                  onMoveToStatus={handleMoveToStatus}
                />
              ) : layoutMode === 'priority' ? (
                <PriorityKanbanBoard
                  tasks={visibleTasks}
                  onToggle={handleToggle}
                  onEdit={(t) => {
                    setEditing(t);
                    setEditOpen(true);
                  }}
                  onDelete={handleDelete}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  dragId={dragId}
                  dropTargetId={dropTargetId}
                  onMoveToPriority={handleMoveToPriority}
                />
              ) : (
                <ul className="space-y-3">
                  {visibleTasks.map((task) => (
                    <li key={task.id} className="animate-slide-in">
                      <TaskItem
                        task={task}
                        onToggle={handleToggle}
                        onEdit={(t) => {
                          setEditing(t);
                          setEditOpen(true);
                        }}
                        onDelete={handleDelete}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        isDragging={dragId === task.id}
                        isDragOver={dropTargetId === task.id}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Footer Info */}
          <footer className="pt-6 pb-2 text-center text-xs font-medium text-slate-400 dark:text-slate-600">
            Tasker MERN Dashboard • Powered by Express &amp; MongoDB • {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} persisted
          </footer>
        </main>
      </div>

      {/* Quick Add Task Modal */}
      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAdd={handleAdd}
        defaultDueDate={quickAddDefaultDate}
      />

      {/* Edit Modal */}
      <EditTaskModal
        open={editOpen}
        task={editing}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this task?"
        message={`Are you sure you want to remove "${confirmDelete?.title ?? ''}"? This action cannot be reversed.`}
        confirmLabel="Delete Task"
        destructive
        onConfirm={confirmDeleteTask}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Clear All Tasks Confirmation Dialog */}
      <ConfirmDialog
        open={confirmClear}
        title="Clear all tasks from workspace?"
        message="Every task in this workspace will be permanently deleted. This action cannot be undone."
        confirmLabel="Clear Workspace"
        destructive
        onConfirm={() => {
          const res = clearAll();
          setConfirmClear(false);
          if (res && res.success) {
            toast('success', 'All tasks cleared from workspace.');
          } else {
            toast('error', res?.error || 'Failed to clear tasks.');
          }
        }}
        onCancel={() => setConfirmClear(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

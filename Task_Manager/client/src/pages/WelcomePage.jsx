import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  LayoutList,
  BellRing,
  Sun,
  Moon,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  LogIn,
  UserPlus,
} from 'lucide-react';

export function WelcomePage({
  onNavigateLogin,
  onNavigateRegister,
  onDemoLogin,
  theme,
  onToggleTheme,
}) {
  return (
    <div className="min-h-screen bg-surface-light text-slate-900 dark:bg-surface-dark dark:text-slate-100 antialiased selection:bg-indigo-500/20 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-dark/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25">
              <Sparkles size={19} className="animate-pulse-subtle" aria-hidden />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Tasker
              </span>
              <span className="rounded-md bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                PRO
              </span>
            </div>
          </div>

          {/* Center Navigation Links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Security
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="btn-ghost rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun size={17} className="text-amber-400" aria-hidden />
              ) : (
                <Moon size={17} className="text-indigo-600" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              className="btn-ghost text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 px-3 py-2 flex items-center gap-1.5"
            >
              <LogIn size={14} aria-hidden />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={onNavigateRegister}
              className="btn-primary py-2 px-4 text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <UserPlus size={14} aria-hidden />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
          {/* Subtle Ambient Background Gradient Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 to-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="mx-auto max-w-5xl text-center space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-bold text-indigo-700 backdrop-blur-md dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 animate-slide-in">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Full-Stack MERN Architecture • Secure Cookie Authentication</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12]">
              Master your productivity with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                intelligent task velocity
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Organize personal sprints, manage high-priority deliverables, and automate deadline reminders with interactive calendars and drag-and-drop kanban boards.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onNavigateRegister}
                className="btn-primary py-3 px-6 text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 group"
              >
                <span>Create Free Workspace</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 duration-200" aria-hidden />
              </button>

              <button
                type="button"
                onClick={onNavigateLogin}
                className="btn-secondary py-3 px-5 text-sm font-bold flex items-center gap-2"
              >
                <LogIn size={16} aria-hidden />
                <span>Sign In to Account</span>
              </button>

              <button
                type="button"
                onClick={onDemoLogin}
                className="btn-ghost rounded-xl border border-indigo-200/90 bg-indigo-50/40 py-3 px-5 text-sm font-bold text-indigo-700 hover:bg-indigo-100/60 dark:border-indigo-800/60 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-900/40 flex items-center gap-2 shadow-xs"
              >
                <Zap size={16} className="text-amber-500 fill-amber-500" aria-hidden />
                <span>1-Click Instant Demo</span>
              </button>
            </div>

            {/* Interactive Preview Dashboard Card */}
            <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-surface-dark/90 dark:shadow-slate-950/50 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-3 gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                    tasker-cloud-dashboard • MongoDB Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Cloud Synchronized</span>
                </div>
              </div>

              {/* Sample Metrics Strip */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
                  <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">6</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500">Active</span>
                  <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">5</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Completed</span>
                  <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">1</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Overdue</span>
                  <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">1</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="border-t border-slate-200/80 bg-slate-50/50 py-16 dark:border-slate-800/80 dark:bg-slate-900/20 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Core Capabilities
              </h2>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                Everything required for peak team velocity
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="card p-5 space-y-3 hover:shadow-premium-hover transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <CalendarDays size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Schedule &amp; Calendar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Monthly and weekly views mapped to real task deadlines with one-click direct creation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-5 space-y-3 hover:shadow-premium-hover transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                  <Layers size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Drag &amp; Drop Kanban
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Status and Priority kanban columns with fluid animations and automatic position persistence.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-5 space-y-3 hover:shadow-premium-hover transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                  <BellRing size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Automated Reminders
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Backend scheduler generating overdue warnings and upcoming milestone notices.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="card p-5 space-y-3 hover:shadow-premium-hover transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cookie &amp; JWT Security
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Strict user isolation, bcrypt password hashing, and HTTP-only cookie authorization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-8 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Tasker PRO Productivity Dashboard • Powered by Express, MongoDB, &amp; React
      </footer>
    </div>
  );
}

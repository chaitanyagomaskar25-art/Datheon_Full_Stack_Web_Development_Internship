import { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  AlertCircle,
  Loader2,
  Zap,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';

export function LoginPage({
  onNavigateRegister,
  onNavigateWelcome,
  onLogin,
  onDemoLogin,
  theme,
  onToggleTheme,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email || !email.trim()) {
      setError('Email address is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please provide a valid email format.');
      return false;
    }
    if (!password) {
      setError('Password is required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await onLogin(email.trim(), password);
      if (res && res.success === false) {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-light text-slate-900 dark:bg-surface-dark dark:text-slate-100 antialiased selection:bg-indigo-500/20 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateWelcome}
          className="btn-ghost flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} aria-hidden />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm">
              <Sparkles size={16} aria-hidden />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tasker
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-ghost rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-amber-400" aria-hidden />
            ) : (
              <Moon size={16} className="text-indigo-600" aria-hidden />
            )}
          </button>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="my-auto mx-auto w-full max-w-md py-6">
        <div className="card p-6 sm:p-8 shadow-2xl backdrop-blur-2xl border-slate-200/90 dark:border-slate-800/90">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-sm">
              <LogIn size={24} aria-hidden />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to access your private task workspace
            </p>
          </div>

          {/* 1-Click Instant Demo Access */}
          <div className="mb-6">
            <button
              type="button"
              onClick={onDemoLogin}
              className="w-full flex items-center justify-between rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-violet-50/90 p-3 text-xs font-bold text-indigo-700 hover:border-indigo-300 hover:shadow-md transition-all dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-violet-950/40 dark:text-indigo-300"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Zap size={14} className="fill-white" aria-hidden />
                </div>
                <div className="text-left">
                  <p className="font-bold">Instant Demo Account</p>
                  <p className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                    Pre-populated with tasks • 1-click
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-extrabold text-white">
                Launch
              </span>
            </button>
          </div>

          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-surface-dark dark:text-slate-500">
              or sign in with email
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300 animate-shake">
              <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={16} aria-hidden />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="alex@tasker.pro"
                  required
                  className="input pl-10 text-xs sm:text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} aria-hidden />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  required
                  className="input pl-10 pr-10 text-xs sm:text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span>Remember this session</span>
              </label>

              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>Cookie protected</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  <span>Verifying credentials…</span>
                </>
              ) : (
                <>
                  <LogIn size={16} aria-hidden />
                  <span>Sign In to Workspace</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create account
            </button>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 dark:text-slate-500">
        Secured with bcrypt hash &amp; HTTP-only JWT cookies
      </footer>
    </div>
  );
}

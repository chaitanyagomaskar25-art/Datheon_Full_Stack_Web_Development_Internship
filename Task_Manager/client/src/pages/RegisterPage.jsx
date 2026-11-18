import { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
  AlertCircle,
  Loader2,
  Zap,
  Sun,
  Moon,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function RegisterPage({
  onNavigateLogin,
  onNavigateWelcome,
  onRegister,
  onDemoLogin,
  theme,
  onToggleTheme,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!name || !name.trim()) {
      setError('Full name is required.');
      return false;
    }
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
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (!agreeTerms) {
      setError('Please accept the terms to proceed.');
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
      const res = await onRegister(name.trim(), email.trim(), password);
      if (res && res.success === false) {
        setError(res.error || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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

      {/* Main Centered Register Card */}
      <main className="my-auto mx-auto w-full max-w-md py-6">
        <div className="card p-6 sm:p-8 shadow-2xl backdrop-blur-2xl border-slate-200/90 dark:border-slate-800/90">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-sm">
              <UserPlus size={24} aria-hidden />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Start organizing your tasks with private cloud persistence
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300 animate-shake">
              <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={16} aria-hidden />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Alex Rivers"
                  required
                  className="input pl-10 text-xs sm:text-sm"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                  placeholder="alex@example.com"
                  required
                  className="input pl-10 text-xs sm:text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Password
              </label>
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
                  placeholder="At least 6 characters"
                  required
                  className="input pl-10 pr-10 text-xs sm:text-sm"
                  autoComplete="new-password"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} aria-hidden />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Confirm your password"
                  required
                  className="input pl-10 text-xs sm:text-sm"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-[11px] leading-snug">
                  I agree to create an isolated workspace with cookie-based session storage.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  <span>Creating your account…</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} aria-hidden />
                  <span>Create Workspace Account</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo alternative */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={onDemoLogin}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 inline-flex items-center gap-1.5"
            >
              <Zap size={13} className="text-amber-500 fill-amber-500" />
              <span>Or test with 1-click Demo Account</span>
            </button>
          </div>

          {/* Switch to Login link */}
          <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Sign in
            </button>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 dark:text-slate-500">
        Passwords hashed using bcrypt with salt rounds • Signed HTTP-only JWT
      </footer>
    </div>
  );
}

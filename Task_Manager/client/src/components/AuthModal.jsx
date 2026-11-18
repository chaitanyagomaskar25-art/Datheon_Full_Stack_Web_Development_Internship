import { useState } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';

export function AuthModal({ open, onClose, onLogin, onRegister, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setIsSubmitting(false);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const validate = () => {
    if (mode === 'register' && (!name || !name.trim())) {
      setError('Please provide your full name.');
      return false;
    }
    if (!email || !email.trim()) {
      setError('Email address is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.');
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
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let res;
      if (mode === 'login') {
        res = await onLogin(email.trim(), password);
      } else {
        res = await onRegister(name.trim(), email.trim(), password);
      }

      if (res && res.success) {
        resetForm();
        onClose();
      } else {
        setError(res?.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = async () => {
    setEmail('demo@tasker.pro');
    setPassword('password123');
    setError('');
    setIsSubmitting(true);
    try {
      const res = await onLogin('demo@tasker.pro', 'password123');
      if (res && res.success) {
        resetForm();
        onClose();
      } else {
        setError(res?.error || 'Demo login failed. Make sure server is running.');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-modal-in dark:border-slate-800 dark:bg-surface-cardDark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25">
              <Sparkles size={17} aria-hidden />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {mode === 'login' ? 'Sign in to Tasker' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Secure JWT &amp; MongoDB authentication
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/80">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`rounded-lg py-2 text-xs font-semibold transition ${
                mode === 'login'
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`rounded-lg py-2 text-xs font-semibold transition ${
                mode === 'register'
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5" noValidate>
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50/80 p-3 text-xs font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300 animate-slide-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="label">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="input pl-10"
                  placeholder="e.g. Alex Rivers"
                  autoComplete="name"
                />
                <User
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="label">
              Email Address
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="input pl-10"
                placeholder="you@domain.com"
                autoComplete="email"
              />
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="label">
              Password {mode === 'register' && <span className="text-[11px] font-normal text-slate-400">(min. 6 chars)</span>}
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={isSubmitting}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="input pl-10 pr-10"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden />
                <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn size={16} aria-hidden />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus size={16} aria-hidden />
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Quick Demo Login Option */}
          {mode === 'login' && (
            <div className="pt-2">
              <div className="relative flex items-center justify-center border-t border-slate-100 dark:border-slate-800">
                <span className="bg-white px-2 text-[10px] uppercase tracking-wider text-slate-400 dark:bg-surface-cardDark">
                  or quick test
                </span>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFillDemo}
                className="btn-secondary w-full mt-3 py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={14} className="text-indigo-500" aria-hidden />
                <span>Sign in as Demo User (demo@tasker.pro)</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

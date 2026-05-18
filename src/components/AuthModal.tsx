import { useState } from 'react';
import { X, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = {
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
};

const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[a-z]/.test(password);
};

export default function AuthModal({ onClose, defaultTab = 'login' }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleTabChange = (t: 'login' | 'signup') => {
    setTab(t);
    setError('');
    setEmailError('');
    setPasswordError('');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) {
      setEmailError('Email is required');
    } else if (!isValidEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (!/[a-z]/.test(value)) {
      setPasswordError('Password must contain at least one lowercase letter');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let hasError = false;
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    if (!isValidPassword(password)) {
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters');
      } else if (!/[a-z]/.test(password)) {
        setPasswordError('Password must contain at least one lowercase letter');
      }
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    const fn = tab === 'login' ? signIn : signUp;
    const { error: authError } = await fn(email, password);
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,30,0.97) 0%, rgba(15,20,40,0.97) 100%)',
          boxShadow: '0 0 60px rgba(6,182,212,0.15), 0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white/80"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
          >
            <span className="text-2xl">✦</span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {tab === 'login'
              ? 'Sign in to continue your journey'
              : 'Start your inner journey today'}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="mb-6 flex rounded-xl border border-white/10 p-1"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {(['login', 'signup'] as const).map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className="flex-1 rounded-lg py-2 text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'rgba(6,182,212,0.2)' : 'transparent',
                color: tab === t ? '#06b6d4' : 'rgba(255,255,255,0.4)',
                border: tab === t ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
              }}
            >
              {t === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                required
                className={`w-full rounded-xl border bg-white/5 py-3 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/8 ${
                  emailError
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-cyan-500/50'
                }`}
              />
            </div>
            {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className={`w-full rounded-xl border bg-white/5 py-3 pl-9 pr-10 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/8 ${
                  passwordError
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-cyan-500/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-xs text-red-400">{passwordError}</p>}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!emailError || !!passwordError}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-98 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-white/30">
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/* ── Icons ── */
const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
const SpinIcon = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

/* ── Field ── */
function Field({ id, label, type, placeholder, value, onChange, icon, onToggleEye, showEye, eyeOpen }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold tracking-widest uppercase text-[#64748B]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          autoComplete={id === 'email' ? 'email' : id === 'name' ? 'name' : 'current-password'}
          className="w-full rounded-xl bg-[#0F172A] border border-[#1E3A5F] text-[#F8FAFC] placeholder-[#475569]
                     pl-10 pr-10 py-3 text-sm outline-none
                     transition-all duration-200
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
        />
        {showEye && (
          <button
            type="button"
            onClick={onToggleEye}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-indigo-400 transition-colors"
          >
            <EyeIcon open={eyeOpen} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main Auth Card ── */
export default function AuthCard({ tab, setTab }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = tab === 'login';

  const handleSwitch = (t) => {
    setTab(t);
    setError('');
    setPassword('');
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const { data } = await api.post(endpoint, payload);

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('splitsmart_user', JSON.stringify(data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || (isLogin ? 'Invalid email or password.' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md animate-fade-up">
      {/* Glassmorphism card */}
      <div className="rounded-2xl border border-white/10 bg-[#1E293B]/70 backdrop-blur-xl shadow-2xl px-8 py-10 sm:px-10">

        {/* Welcome text */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {isLogin
              ? 'Login to continue managing your expenses'
              : 'Start splitting smarter with SplitSmart Pro'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-6 rounded-xl bg-[#0F172A] p-1 border border-white/5">
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              id={`tab-${t}`}
              type="button"
              onClick={() => handleSwitch(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-250 ${
                tab === t
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Name – signup only */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: isLogin ? '0px' : '100px', opacity: isLogin ? 0 : 1 }}
          >
            {!isLogin && (
              <Field
                id="name" label="Full Name" type="text"
                placeholder="Alex Johnson" value={name}
                onChange={(e) => setName(e.target.value)} icon={<UserIcon />}
              />
            )}
          </div>

          <Field
            id="email" label="Email Address" type="email"
            placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} icon={<MailIcon />}
          />

          <Field
            id="password" label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<LockIcon />}
            showEye eyeOpen={showPass}
            onToggleEye={() => setShowPass((p) => !p)}
          />

          {/* Forgot password */}
          {isLogin && (
            <div className="flex justify-end -mt-1">
              <a href="#" className="text-xs text-[#64748B] hover:text-indigo-400 transition-colors font-medium">
                Forgot password?
              </a>
            </div>
          )}

          {/* Error */}
          {error && (
            <div role="alert" className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-1 rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2
                       bg-gradient-to-r from-indigo-600 to-violet-600
                       hover:from-indigo-500 hover:to-violet-500
                       shadow-lg shadow-indigo-500/30
                       active:scale-[0.98] transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <><SpinIcon />{isLogin ? 'Signing in…' : 'Creating account…'}</> : <>{isLogin ? 'Login' : 'Sign Up'}<ArrowIcon /></>}
          </button>
        </form>

        {/* Bottom link */}
        <p className="mt-6 text-center text-xs text-[#64748B]">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => handleSwitch(isLogin ? 'signup' : 'login')}
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
          >
            {isLogin ? 'Sign up for free' : 'Log in'}
          </button>
        </p>
      </div>

      <p className="mt-5 text-center text-xs text-[#1E3A5F]">
        © {new Date().getFullYear()} SplitSmart Pro · 256-bit encrypted
      </p>
    </div>
  );
}

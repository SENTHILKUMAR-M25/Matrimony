import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, LogIn, Eye, EyeOff, Heart, Sparkles, ArrowRight } from 'lucide-react';
import API from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const KolamMotif = ({ className = '', uid }) => {
  const unitId = `kolam-unit-${uid}`;
  const cells = Array.from({ length: 5 }).flatMap((_, row) =>
    Array.from({ length: 5 }).map((_, col) => ({ row, col }))
  );

  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" focusable="false">
      <defs>
        <g id={unitId}>
          <circle cx="0" cy="0" r="2.4" fill="currentColor" />
          <path
            d="M0,0 C14,-14 14,14 0,28 C-14,14 -14,-14 0,0 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </defs>
      {cells.map(({ row, col }) => (
        <use
          key={`${row}-${col}`}
          href={`#${unitId}`}
          x={col * 48 + 24}
          y={row * 48 + 24}
          transform={`rotate(${(row + col) % 2 ? 45 : 0} ${col * 48 + 24} ${row * 48 + 24})`}
        />
      ))}
    </svg>
  );
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('admin_remember_identifier') || '');

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_remember_identifier');
    if (saved) {
      setFormData((prev) => ({ ...prev, identifier: saved }));
      setRememberMe(saved);
    }
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      localStorage.setItem('admin_remember_identifier', formData.identifier);
      setRememberMe(formData.identifier);
    } else {
      localStorage.removeItem('admin_remember_identifier');
      setRememberMe('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.identifier || !formData.password) {
      setError('Please fill in both fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/admin-login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      login(user, token);
      if (rememberMe) {
        localStorage.setItem('admin_remember_identifier', formData.identifier);
      }
      const redirect = searchParams.get('redirect');
      navigate(redirect || '/admin', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Access',
      desc: 'Role-based authentication with encrypted sessions',
    },
    {
      icon: Sparkles,
      title: 'Full Control',
      desc: 'Manage users, approvals, subscriptions & more',
    },
    {
      icon: Heart,
      title: 'Platform Oversight',
      desc: 'Monitor and manage the entire matrimony platform',
    },
  ];

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#0a0a14] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-16 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-36 -left-20 w-72 h-72 sm:w-[26rem] sm:h-[26rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <KolamMotif
        uid="admtr"
        className="hidden sm:block absolute -top-4 -right-4 w-36 h-36 lg:w-52 lg:h-52 text-indigo-400 opacity-[0.04] pointer-events-none"
      />
      <KolamMotif
        uid="admbl"
        className="hidden sm:block absolute -bottom-8 -left-8 w-36 h-36 lg:w-52 lg:h-52 text-violet-400 opacity-[0.05] pointer-events-none rotate-45"
      />

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] items-stretch lg:items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
              className="lg:col-span-7 order-1 lg:order-2 w-full max-w-md sm:max-w-lg mx-auto"
            >
              <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 p-5 sm:p-8 md:p-10">
                <div className="lg:hidden text-center mb-5">
                  <Link to="/" className="font-display text-lg font-bold text-white inline-block">
                    JOD <span className="text-indigo-400">Matrimony</span>
                  </Link>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 mb-3">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                    Admin Portal
                  </h2>
                  <p className="text-sm text-slate-400">Authorized personnel only</p>
                </div>

                {error && (
                  <motion.div
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label
                      htmlFor="admin-identifier"
                      className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide"
                    >
                      Email or Mobile
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        id="admin-identifier"
                        type="text"
                        name="identifier"
                        autoComplete="username"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Enter admin email or mobile"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 outline-none transition-colors duration-200 text-sm font-medium text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="admin-password"
                        className="block text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wide"
                      >
                        Password
                      </label>
                      <Link
                        to="/admin-forgot-password"
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-700 bg-slate-800/50 outline-none transition-colors duration-200 text-sm font-medium text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <label htmlFor="admin-remember" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 cursor-pointer w-fit">
                    <input
                      id="admin-remember"
                      type="checkbox"
                      checked={!!rememberMe}
                      onChange={handleRememberChange}
                      className="h-4 w-4 rounded accent-indigo-500 border-slate-600 bg-slate-700"
                    />
                    Remember me
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[3rem] py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In to Admin
                        <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <Link
                    to="/signin"
                    className="block text-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Back to User Sign In
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-600">
                Secure admin access &bull; JOD Matrimony
              </p>
            </motion.div>

            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6 lg:space-y-8 text-center lg:text-left max-w-md mx-auto lg:max-w-none">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-300 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
                  <ShieldCheck size={13} />
                  Admin Access Only
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-tight text-white tracking-tight">
                  Admin{' '}
                  <span className="block sm:inline bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
              </motion.div>

              <motion.p
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-base sm:text-lg text-slate-400 leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-md"
              >
                Sign in to manage users, approve profiles, oversee subscriptions, and keep the JOD Matrimony platform running smoothly.
              </motion.p>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5 lg:gap-4 pt-2"
              >
                {features.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-2.5 lg:gap-4"
                  >
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-400 border border-indigo-500/10">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">{title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-700/50 mx-auto lg:mx-0 max-w-sm lg:max-w-md"
              >
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">50K+</p>
                  <p className="text-xs sm:text-sm text-slate-400">Success Stories</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">10M+</p>
                  <p className="text-xs sm:text-sm text-slate-400">Active Members</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">99%</p>
                  <p className="text-xs sm:text-sm text-slate-400">Verified Users</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

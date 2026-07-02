import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, Heart, Sparkles, ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';
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

const SignInPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.identifier || !formData.password) {
      setError('Please fill in both fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      login(user, token);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (user.profileCompleted) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/dashboard/create-profile', { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Personalised Matches',
      desc: 'Recommendations based on your preferences',
    },
    {
      icon: Heart,
      title: 'Verified Profiles',
      desc: 'Connect with genuine, verified members',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy Protected',
      desc: 'Your details are visible only to who you choose',
    },
  ];

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#EEEEEE] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-16 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#D4BEE4]/45 blur-3xl" />
        <div className="absolute -bottom-36 -left-20 w-72 h-72 sm:w-[26rem] sm:h-[26rem] rounded-full bg-[#9B7EBD]/25 blur-3xl" />
      </div>

      {/* Kolam motifs — hidden on small phones to keep things calm */}
      <KolamMotif
        uid="tr"
        className="hidden sm:block absolute -top-4 -right-4 w-36 h-36 lg:w-52 lg:h-52 text-[#3B1E54] opacity-[0.07] pointer-events-none"
      />
      <KolamMotif
        uid="bl"
        className="hidden sm:block absolute -bottom-8 -left-8 w-36 h-36 lg:w-52 lg:h-52 text-[#9B7EBD] opacity-[0.09] pointer-events-none rotate-45"
      />

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] items-stretch lg:items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">

            {/* ─── Form (shows first on mobile) ─── */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
              className="lg:col-span-7 order-1 lg:order-2 w-full pt-13 max-w-md sm:max-w-lg mx-auto"
            >
              <div className="rounded-3xl border border-[#D4BEE4]/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-[#3B1E54]/10 p-5 sm:p-8 md:p-10">
                {/* Brand mark on mobile only */}
                <div className="lg:hidden text-center mb-5">
                  <Link to="/" className="font-display text-lg font-bold text-[#3B1E54] inline-block">
                    JOD <span className="text-[#9B7EBD]">Matrimony</span>
                  </Link>
                </div>

                <div className="mb-6">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B1E54] mb-1">
                    Sign In
                  </h2>
                  <p className="text-sm text-slate-500">Access your account to continue</p>
                </div>

                {error && (
                  <motion.div
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200"
                  >
                    <p className="text-sm text-rose-600 font-medium">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label
                      htmlFor="identifier"
                      className="block text-xs font-bold text-[#3B1E54] mb-1.5 ml-1 uppercase tracking-wide"
                    >
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="identifier"
                        type="text"
                        name="identifier"
                        autoComplete="username"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Enter email or mobile"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50/40 outline-none transition-colors duration-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/50 focus:bg-white hover:border-[#D4BEE4]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="password"
                        className="block text-xs font-bold text-[#3B1E54] ml-1 uppercase tracking-wide"
                      >
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-[11px] font-semibold text-[#6A3E8C] hover:text-[#3B1E54]">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-200 bg-slate-50/40 outline-none transition-colors duration-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/50 focus:bg-white hover:border-[#D4BEE4]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#3B1E54] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] rounded"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <label htmlFor="remember" className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 cursor-pointer w-fit">
                    <input id="remember" type="checkbox" className="h-4 w-4 rounded accent-[#3B1E54]" />
                    Remember me
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[3rem] py-3 bg-[#3B1E54] hover:bg-[#2c1640] active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                

                  
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-[#6A3E8C] hover:text-[#3B1E54] transition-colors">
                    Register Now
                  </Link>
                </p>
                <p className="mt-6 text-center text-sm text-slate-600">
                
                  <Link to="/admin-login" className="font-semibold text-[#6A3E8C] hover:text-[#3B1E54] transition-colors">
                    Admin Login
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Trusted by families across India</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                  <span className="text-[11px] text-slate-400 ml-1">(4.9/5 from 50K+ reviews)</span>
                </div>
              </div>
            </motion.div>

            {/* ─── Brand / Welcome panel ─── */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6 lg:space-y-8 text-center lg:text-left max-w-md mx-auto lg:max-w-none">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B1E54] bg-[#D4BEE4]/40 px-4 py-1.5 rounded-full">
                  <Heart size={13} className="fill-[#9B7EBD] text-[#9B7EBD]" />
                  Welcome Back
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-tight text-[#3B1E54] tracking-tight">
                  Sign In to{' '}
                  <span className="block sm:inline bg-gradient-to-r from-[#3B1E54] via-[#6A3E8C] to-[#9B7EBD] bg-clip-text text-transparent">
                    JOD Matrimony
                  </span>
                </h1>
              </motion.div>

              <motion.p
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-base sm:text-lg text-slate-600 leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-md"
              >
                Continue your journey to finding the perfect life partner. Your matches, messages, and preferences are waiting for you.
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
                    <div className="w-10 h-10 bg-[#D4BEE4]/40 rounded-xl flex items-center justify-center flex-shrink-0 text-[#3B1E54]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3B1E54] text-sm sm:text-base">{title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-[#D4BEE4]/50 mx-auto lg:mx-0 max-w-sm lg:max-w-md"
              >
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#3B1E54]">50K+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Success Stories</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#3B1E54]">10M+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Active Members</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#3B1E54]">99%</p>
                  <p className="text-xs sm:text-sm text-slate-500">Verified Users</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import API from '../api/axios';

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

const AdminForgotPasswordPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your admin email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/admin-forgot-password', { email: email.trim() });
      setSuccess(response.data.message);
      setEmail('');
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#0a0a14] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-16 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-36 -left-20 w-72 h-72 sm:w-[26rem] sm:h-[26rem] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <KolamMotif
        uid="afptr"
        className="hidden sm:block absolute -top-4 -right-4 w-36 h-36 lg:w-52 lg:h-52 text-indigo-400 opacity-[0.04] pointer-events-none"
      />
      <KolamMotif
        uid="afpbl"
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
                    Admin Forgot Password
                  </h2>
                  <p className="text-sm text-slate-400">
                    Enter your registered admin email and we'll send you a reset link
                  </p>
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

                {success && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <p className="text-sm text-emerald-400 font-medium">{success}</p>
                  </motion.div>
                )}

                {!success && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="admin-reset-email"
                        className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide"
                      >
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          id="admin-reset-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter admin email"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 outline-none transition-colors duration-200 text-sm font-medium text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[3rem] py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <Link
                    to="/admin-login"
                    className="inline-flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Admin Login
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
                  Admin Password Reset
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-tight text-white tracking-tight">
                  Reset{' '}
                  <span className="block sm:inline bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Admin Password
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
                Forgot your admin password? No worries. Enter your registered admin email and we'll send you a secure link to reset it.
              </motion.p>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5 lg:gap-4 pt-2"
              >
                {[
                  { icon: ShieldCheck, title: 'Secure Process', desc: 'End-to-end encrypted password reset' },
                  { icon: Mail, title: 'Email Verification', desc: 'Reset link sent to registered admin email' },
                  { icon: ArrowLeft, title: 'Quick Recovery', desc: 'Back to admin panel in minutes' },
                ].map(({ icon: Icon, title, desc }) => (
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
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPasswordPage;

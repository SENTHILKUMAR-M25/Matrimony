import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Heart, ArrowLeft, ShieldCheck, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
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

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return score;
};

const strengthConfig = [
  { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-600' },
  { label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-600' },
  { label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  { label: 'Strong', color: 'bg-lime-500', textColor: 'text-lime-600' },
  { label: 'Very Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
];

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const shouldReduceMotion = useReducedMotion();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenState, setTokenState] = useState('loading');

  useEffect(() => {
    if (!token) {
      setTokenState('invalid');
      setError('No reset token provided. Please use the link from your email.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await API.get(`/auth/verify-reset-token/${token}`);
        if (response.data.valid) {
          setTokenState('valid');
        } else {
          setTokenState('invalid');
          setError(response.data.message || 'Invalid or expired token.');
        }
      } catch (err) {
        setTokenState('invalid');
        setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
      }
    };

    verifyToken();
  }, [token]);

  const strength = getStrength(password);
  const strengthInfo = strengthConfig[Math.min(strength, strengthConfig.length - 1)];
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (strength < 2) {
      setError('Please choose a stronger password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/reset-password', { token, password });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#EEEEEE] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-16 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#D4BEE4]/45 blur-3xl" />
        <div className="absolute -bottom-36 -left-20 w-72 h-72 sm:w-[26rem] sm:h-[26rem] rounded-full bg-[#9B7EBD]/25 blur-3xl" />
      </div>

      <KolamMotif
        uid="rptr"
        className="hidden sm:block absolute -top-4 -right-4 w-36 h-36 lg:w-52 lg:h-52 text-[#3B1E54] opacity-[0.07] pointer-events-none"
      />
      <KolamMotif
        uid="rpbl"
        className="hidden sm:block absolute -bottom-8 -left-8 w-36 h-36 lg:w-52 lg:h-52 text-[#9B7EBD] opacity-[0.09] pointer-events-none rotate-45"
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
              <div className="rounded-3xl border border-[#D4BEE4]/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-[#3B1E54]/10 p-5 sm:p-8 md:p-10">
                <div className="lg:hidden text-center mb-5">
                  <Link to="/" className="font-display text-lg font-bold text-[#3B1E54] inline-block">
                    JOD <span className="text-[#9B7EBD]">Matrimony</span>
                  </Link>
                </div>

                <div className="mb-6">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B1E54] mb-1">
                    {tokenState === 'valid' ? 'Set New Password' : 'Reset Password'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {tokenState === 'loading' && 'Verifying your reset link...'}
                    {tokenState === 'valid' && 'Choose a strong password for your account'}
                    {tokenState === 'invalid' && 'This link is invalid or has expired'}
                  </p>
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

                {success && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 flex items-start gap-3 px-4 py-4 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-emerald-700 font-medium">{success}</p>
                      <p className="text-xs text-emerald-600 mt-1">Redirecting you to sign in...</p>
                    </div>
                  </motion.div>
                )}

                {tokenState === 'valid' && !success && (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-xs font-bold text-[#3B1E54] mb-1.5 ml-1 uppercase tracking-wide"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
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
                      {password && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                  i < strength ? strengthInfo.color : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${strengthInfo.textColor}`}>
                            {strengthInfo.label}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-xs font-bold text-[#3B1E54] mb-1.5 ml-1 uppercase tracking-wide"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="confirm-password"
                          type={showConfirm ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-200 bg-slate-50/40 outline-none transition-colors duration-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/50 focus:bg-white hover:border-[#D4BEE4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#3B1E54] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] rounded"
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {confirmPassword && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {passwordsMatch ? (
                            <>
                              <CheckCircle size={14} className="text-emerald-500" />
                              <span className="text-xs text-emerald-600 font-medium">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={14} className="text-rose-500" />
                              <span className="text-xs text-rose-600 font-medium">Passwords do not match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !passwordsMatch}
                      className="w-full min-h-[3rem] py-3 bg-[#3B1E54] hover:bg-[#2c1640] active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>
                )}

                {tokenState === 'invalid' && !success && (
                  <div className="text-center py-4">
                    <Link
                      to="/forgot-password"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#6A3E8C] hover:text-[#3B1E54] transition-colors text-sm"
                    >
                      Request a new reset link
                    </Link>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#6A3E8C] hover:text-[#3B1E54] transition-colors text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
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

            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6 lg:space-y-8 text-center lg:text-left max-w-md mx-auto lg:max-w-none">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B1E54] bg-[#D4BEE4]/40 px-4 py-1.5 rounded-full">
                  <Heart size={13} className="fill-[#9B7EBD] text-[#9B7EBD]" />
                  Secure Reset
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-tight text-[#3B1E54] tracking-tight">
                  Create a New{' '}
                  <span className="block sm:inline bg-gradient-to-r from-[#3B1E54] via-[#6A3E8C] to-[#9B7EBD] bg-clip-text text-transparent">
                    Password
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
                Choose a strong, unique password that you haven't used before to keep your account secure.
              </motion.p>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5 lg:gap-4 pt-2"
              >
                {[
                  { icon: ShieldCheck, title: 'Encrypted', desc: '256-bit encryption protects your data' },
                  { icon: CheckCircle, title: 'Instant Update', desc: 'Your new password takes effect immediately' },
                  { icon: Heart, title: 'Safe & Secure', desc: 'Old tokens are invalidated on reset' },
                ].map(({ icon: Icon, title, desc }) => (
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

export default ResetPasswordPage;

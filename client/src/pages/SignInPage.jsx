// import { useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Mail, Lock, Heart, Sparkles, ArrowRight, LogIn } from 'lucide-react';
// import API from '../api/axios';
// import useAuthStore from '../store/useAuthStore';

// const fadeUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: (i = 0) => ({
//     opacity: 1, y: 0,
//     transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
//   }),
// };

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { login } = useAuthStore();
//   const [formData, setFormData] = useState({ identifier: '', password: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!formData.identifier || !formData.password) {
//       setError('Please fill in both fields');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const response = await API.post('/auth/login', formData);
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       login(user, token);
//       const redirect = searchParams.get('redirect');
//       if (redirect) {
//         navigate(redirect, { replace: true });
//       } else if (user.profileCompleted) {
//         navigate('/dashboard', { replace: true });
//       } else {
//         navigate('/dashboard/create-profile', { replace: true });
//       }
//     } catch (err) {
//       const message = err.response?.data?.message || 'Something went wrong. Please try again.';
//       setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
//       {/* Background orbs */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-pink-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
//         <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
//       </div>

//       {/* Main */}
//       <div className="relative z-10 min-h-screen flex items-center">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

//             {/* ─── Left Side: Brand / Welcome ─── */}
//             <div className="lg:col-span-5 space-y-6 lg:space-y-8 order-2 lg:order-1">
//               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
//                 <div className="inline-block">
//                   <span className="text-sm font-semibold text-pink-600 bg-pink-100/50 px-4 py-2 rounded-full backdrop-blur-sm">
//                     <Heart size={14} className="inline mr-1 -mt-0.5" />
//                     Welcome Back
//                   </span>
//                 </div>
//                 <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight text-gray-900 tracking-tight">
//                   Sign In to{' '}
//                   <span className="block sm:inline bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800 text-transparent bg-clip-text">
//                     JOD Matrimony
//                   </span>
//                 </h1>
//               </motion.div>

//               <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md">
//                 Continue your journey to finding the perfect life partner. Your matches, messages, and preferences are waiting for you.
//               </motion.p>

//               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4 pt-2">
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                     <Sparkles size={20} className="text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Personalized Matches</h3>
//                     <p className="text-xs sm:text-sm text-gray-600">Get recommendations based on your preferences</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                     <Heart size={20} className="text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Verified Profiles</h3>
//                     <p className="text-xs sm:text-sm text-gray-600">Connect with genuine, verified members</p>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Stats */}
//               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-3 gap-4 pt-6 border-t border-pink-100/50 max-w-md">
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">50K+</p>
//                   <p className="text-xs sm:text-sm text-gray-600">Success Stories</p>
//                 </div>
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">10M+</p>
//                   <p className="text-xs sm:text-sm text-gray-600">Active Members</p>
//                 </div>
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">99%</p>
//                   <p className="text-xs sm:text-sm text-gray-600">Verified Users</p>
//                 </div>
//               </motion.div>
//             </div>

//             {/* ─── Right Side: Form ─── */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="lg:col-span-7 w-full max-w-xl lg:max-w-none mx-auto order-1 lg:order-2"
//             >
//               <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
//                 {/* Brand on mobile */}
//                 <div className="lg:hidden text-center mb-6">
//                   <Link to="/" className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-pink-700 text-transparent bg-clip-text inline-block">
//                     JOD Matrimony
//                   </Link>
//                 </div>

//                 <div className="mb-6">
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
//                   <p className="text-sm text-gray-500">Access your account to continue</p>
//                 </div>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
//                   >
//                     <p className="text-sm text-red-600 font-medium">{error}</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   <div>
//                     <label className="block text-xs font-bold text-[#3B1E54] mb-1.5 ml-1 uppercase tracking-wide">
//                       Email or Mobile Number
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                         <Mail size={18} />
//                       </div>
//                       <input
//                         type="text"
//                         name="identifier"
//                         value={formData.identifier}
//                         onChange={handleChange}
//                         placeholder="Enter email or mobile"
//                         className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 bg-gray-50/30 outline-none transition-all duration-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 focus:bg-white hover:border-[#D4BEE4]"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <div className="flex justify-between items-center mb-1.5">
//                       <label className="block text-xs font-bold text-[#3B1E54] ml-1 uppercase tracking-wide">
//                         Password
//                       </label>
//                       <a href="#" className="text-[11px] font-semibold text-pink-600 hover:text-pink-700">
//                         Forgot Password?
//                       </a>
//                     </div>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                         <Lock size={18} />
//                       </div>
//                       <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="Enter password"
//                         className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 bg-gray-50/30 outline-none transition-all duration-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 focus:bg-white hover:border-[#D4BEE4]"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <input id="remember" type="checkbox" className="h-4 w-4 accent-pink-600 border-gray-300 rounded" />
//                     <label htmlFor="remember" className="text-xs sm:text-sm text-gray-600">
//                       Remember me
//                     </label>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full py-3 bg-[#3B1E54] hover:bg-[#3B1E54]/95 active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         Signing In...
//                       </>
//                     ) : (
//                       <>
//                         Sign In
//                         <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
//                       </>
//                     )}
//                   </button>

//                   {/* Divider */}
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-200" />
//                     </div>
//                     <div className="relative flex justify-center text-xs">
//                       <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-pink-300 transition-all duration-200 gap-2"
//                   >
//                     <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
//                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//                     </svg>
//                     <span>Google</span>
//                   </button>
//                 </form>

//                 <p className="mt-6 text-center text-sm text-gray-600">
//                   Don't have an account?{' '}
//                   <Link to="/signup" className="font-semibold text-pink-700 hover:text-pink-800 transition-colors">
//                     Register Now
//                   </Link>
//                 </p>
//               </div>

//               {/* Social proof */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//                 className="mt-4 text-center"
//               >
//                 <p className="text-xs text-gray-400 mb-1">Trusted by singles worldwide</p>
//                 <div className="flex items-center justify-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <span key={i} className="text-pink-400 text-sm">★</span>
//                   ))}
//                   <span className="text-[11px] text-gray-400 ml-1">(4.9/5 from 50K+ reviews)</span>
//                 </div>
//               </motion.div>
//             </motion.div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;







import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, Heart, Sparkles, ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';
import useAuthStore from '../store/useAuthStore';

/* ── Decorative kolam-inspired motif ──
   A small generated dot-and-petal grid, in the spirit of South Indian
   threshold art, used very sparingly behind the form as a quiet signature
   instead of generic blurred circles. */
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
                      <a href="#" className="text-[11px] font-semibold text-[#6A3E8C] hover:text-[#3B1E54]">
                        Forgot Password?
                      </a>
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

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-slate-400 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-[#D4BEE4] transition-all duration-200 gap-2"
                  >
                    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-[#6A3E8C] hover:text-[#3B1E54] transition-colors">
                    Register Now
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
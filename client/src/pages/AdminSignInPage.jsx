import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const AdminSignInPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await API.post('/auth/admin-login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      login(user, token);
      const redirect = searchParams.get('redirect');
      navigate(redirect || '/admin', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#0f0f1a] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-16 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-36 -left-20 w-72 h-72 sm:w-[26rem] sm:h-[26rem] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 mb-4">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-sm text-slate-400">Authorized personnel only</p>
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
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

            <form onSubmit={handleSubmit} className="space-y-5">
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
      </div>
    </div>
  );
};

export default AdminSignInPage;

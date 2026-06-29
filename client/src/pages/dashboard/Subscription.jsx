import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Zap, Check, X, Sparkles, Shield, Eye, Phone,
  MessageCircle, Heart, Users, Lock, Star, ChevronRight,
  Loader, AlertTriangle, Infinity,
} from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started and explore basic matches.',
    color: 'gray',
    popular: false,
    features: [
      { text: 'View up to 10 profiles per month', included: true },
      { text: 'Blurred profile photos', included: true },
      { text: 'Basic profile details', included: true },
      { text: 'Send up to 3 interest requests', included: true, limit: 3 },
      { text: 'Restricted chat access', included: true },
      { text: 'Full-size photos', included: false },
      { text: 'Phone & email contact details', included: false },
      { text: 'Unlimited interest requests', included: false },
      { text: 'Full chat & messaging', included: false },
      { text: 'Profile visibility boost', included: false },
      { text: 'View horoscope & astro details', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499,
    yearlyPrice: 4999,
    period: 'month',
    description: 'Unlock everything and find your perfect match.',
    color: 'pink',
    popular: true,
    features: [
      { text: 'View up to 1000 profiles per month', included: true },
      { text: 'Full-size unblurred photos', included: true },
      { text: 'Complete profile details', included: true },
      { text: 'Unlimited interest requests', included: true },
      { text: 'Full chat & messaging access', included: true },
      { text: 'Phone & email contact details', included: true },
      { text: 'Profile visibility boost', included: true },
      { text: 'View horoscope & astro details', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'No advertisements', included: true },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
};

const Subscription = () => {
  const { user, token, updateSubscription } = useAuthStore();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const currentPlan = user?.subscription_type || 'free';
  const isPremium = currentPlan === 'premium';

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const currentToken = token || localStorage.getItem('token');
        if (!currentToken) return;
        const res = await API.get('/subscription/status', {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        setStatus(res.data);
      } catch (err) {
        setError('Failed to load subscription status.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [token]);

  const handleUpgrade = async (plan) => {
    try {
      setUpgrading(true);
      const currentToken = token || localStorage.getItem('token');
      await API.post(
        '/subscription/upgrade',
        { plan },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      updateSubscription({ subscription_type: 'premium' });
      setStatus((prev) => prev ? { ...prev, subscription_type: 'premium', limit: 1000 } : prev);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upgrade failed. Please try again.';
      alert(msg);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-100 gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Loading Plans</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-100 text-center px-4">
        <div className="p-3 sm:p-4 rounded-2xl bg-red-50 text-red-400 mb-3 sm:mb-4">
          <AlertTriangle size={32} className="sm:w-[40px] sm:h-[40px]" />
        </div>
        <p className="text-gray-600 text-sm sm:text-base font-medium mb-3 sm:mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[13px] sm:text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer active:scale-[0.97]"
        >
          Retry
        </button>
      </div>
    );
  }

  const viewed = status?.viewed_profiles ?? 0;
  const limit = status?.limit ?? (isPremium ? 1000 : 10);
  const remaining = status?.remaining ?? (limit - viewed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
    >
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-linear-to-br from-pink-500 to-rose-500 shadow-xl shadow-pink-500/20 mb-1 sm:mb-2"
        >
          <Crown size={22} className="sm:w-[28px] sm:h-[28px] text-white" />
        </motion.div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Choose Your{' '}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-rose-500">Plan</span>
        </h1>
        <p className="text-[13px] sm:text-base text-gray-500 max-w-lg mx-auto px-2 sm:px-0">
          Unlock premium features to connect with your perfect match.
        </p>
      </div>

      {/* Current Usage Bar */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl p-3.5 sm:p-4 shadow-sm mx-2 sm:mx-auto"
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isPremium ? 'Premium' : 'Free'} Plan Usage
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-700 whitespace-nowrap">
              {viewed} / {limit} profiles
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((viewed / limit) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isPremium
                  ? 'bg-linear-to-r from-pink-500 to-rose-500'
                  : 'bg-linear-to-r from-gray-400 to-gray-500'
              }`}
            />
          </div>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
            {remaining > 0
              ? `${remaining} profile${remaining !== 1 ? 's' : ''} remaining this month`
              : 'Monthly limit reached. Upgrade to view more.'}
          </p>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8"
      >
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const Icon = plan.id === 'premium' ? Crown : Shield;

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              className={`relative rounded-2xl sm:rounded-3xl border-2 overflow-hidden transition-all duration-300 ${
                plan.popular && !isPremium
                  ? 'border-pink-500 shadow-xl sm:shadow-2xl shadow-pink-500/10 scale-[1.01] sm:scale-105 z-10'
                  : isCurrentPlan
                  ? 'border-emerald-400 shadow-md sm:shadow-lg'
                  : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && !isPremium && (
                <div className="absolute top-0 right-0">
                  <div className="bg-linear-to-r from-pink-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-bl-xl sm:rounded-bl-2xl shadow-lg">
                    <div className="flex items-center gap-1">
                      <Sparkles size={10} className="sm:w-[12px] sm:h-[12px]" /> Recommended
                    </div>
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-0 left-0">
                  <div className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-br-xl sm:rounded-br-2xl shadow-lg flex items-center gap-1">
                    <Check size={10} className="sm:w-[12px] sm:h-[12px]" /> Current Plan
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className={`p-5 sm:p-8 ${isCurrentPlan ? 'bg-linear-to-b from-emerald-50/50 to-white' : 'bg-white'}`}>
                {/* Plan Icon & Name */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-2.5 rounded-xl ${
                    plan.id === 'premium'
                      ? 'bg-linear-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon size={18} className="sm:w-[22px] sm:h-[22px]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 truncate">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  {plan.id === 'premium' ? (
                    <>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                        <button
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                            billingCycle === 'monthly'
                              ? 'bg-pink-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingCycle('yearly')}
                          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                            billingCycle === 'yearly'
                              ? 'bg-pink-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          Yearly
                        </button>
                      </div>
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                          ₹{billingCycle === 'yearly' ? plan.yearlyPrice : plan.price}
                        </span>
                        <span className="text-[13px] sm:text-sm text-gray-400 font-medium">
                          /{billingCycle === 'yearly' ? 'year' : plan.period}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-[11px] sm:text-xs text-emerald-600 font-semibold mt-1">
                          Save ₹{(plan.price * 12 - plan.yearlyPrice).toLocaleString('en-IN')} / year
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-[13px] sm:text-sm text-gray-400 font-medium">/{plan.period}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 sm:gap-3 text-[13px] sm:text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature.included ? (
                        <Check size={14} className="sm:w-[16px] sm:h-[16px] mt-0.5 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <X size={14} className="sm:w-[16px] sm:h-[16px] mt-0.5 flex-shrink-0 text-gray-300" />
                      )}
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                {isCurrentPlan ? (
                  <div className="w-full py-3 sm:py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] sm:text-sm font-bold text-center flex items-center justify-center gap-1.5 sm:gap-2">
                    <Check size={14} className="sm:w-[16px] sm:h-[16px]" />
                    {plan.id === 'premium' ? 'Premium Active' : 'Currently Active'}
                  </div>
                ) : plan.id === 'premium' ? (
                  <button
                    onClick={() => handleUpgrade(billingCycle)}
                    disabled={upgrading}
                    className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-[13px] sm:text-sm font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                  >
                    {upgrading ? (
                      <Loader size={14} className="sm:w-[16px] sm:h-[16px] animate-spin" />
                    ) : (
                      <Zap size={14} className="sm:w-[16px] sm:h-[16px] fill-current" />
                    )}
                    {upgrading ? 'Processing...' : billingCycle === 'yearly' ? 'Upgrade to Yearly Premium' : 'Upgrade to Premium'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 sm:py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 text-[13px] sm:text-sm font-bold cursor-not-allowed"
                  >
                    Downgrade not available
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="p-4 sm:p-8 border-b border-gray-100">
          <h2 className="text-sm sm:text-lg font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <Star size={14} className="sm:w-[18px] sm:h-[18px] text-pink-500" />
            Complete Feature Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] sm:text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-3 sm:px-6 py-2.5 sm:py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs">Feature</th>
                <th className="text-center px-2 sm:px-4 py-2.5 sm:py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px] sm:text-xs">Free</th>
                <th className="text-center px-2 sm:px-4 py-2.5 sm:py-4 font-bold bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 uppercase tracking-wider text-[10px] sm:text-xs">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { feature: 'Monthly Profile Views', free: '10 profiles', premium: '1000 profiles' },
                { feature: 'Profile Photos', free: 'Blurred', premium: 'Full-size HD' },
                { feature: 'Contact Details', free: 'Hidden', premium: 'Phone, Email, Address' },
                { feature: 'Interest Requests', free: '3 per month', premium: 'Unlimited' },
                { feature: 'Chat & Messaging', free: 'Restricted', premium: 'Full access' },
                { feature: 'Horoscope & Astro', free: 'Locked', premium: 'Visible' },
                { feature: 'Profile Visibility', free: 'Standard', premium: 'Boosted' },
                { feature: 'Customer Support', free: 'Email', premium: 'Priority' },
                { feature: 'Advertisements', free: 'Shown', premium: 'None' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 sm:px-6 py-2.5 sm:py-3.5 font-medium text-gray-800 text-[11px] sm:text-sm">{row.feature}</td>
                  <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-center">
                    <span className="text-[11px] sm:text-sm text-gray-500">{row.free}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-center bg-gradient-to-r from-pink-50/50 to-rose-50/50">
                    <span className="text-[11px] sm:text-sm font-semibold text-pink-700">{row.premium}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upgrading overlay */}
      <AnimatePresence>
        {upgrading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <div className="flex flex-col items-center gap-2 sm:gap-3 p-5 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-xl text-center max-w-[260px] sm:max-w-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-900 font-bold text-[13px] sm:text-sm uppercase tracking-wider">Upgrading Account</p>
              <p className="text-gray-400 text-[11px] sm:text-xs">Please wait while we process your upgrade...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subscription;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Clock, BadgeCheck, Crown,
  Heart, DollarSign, ShieldAlert, UserPlus,
  CalendarDays, PieChart, RefreshCw, BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';

const cn = (...inputs) => twMerge(clsx(inputs));

const statsConfig = [
  { title: 'Total Users', icon: Users, gradientClass: 'from-blue-500 to-indigo-600', key: 'totalUsers' },
  { title: 'Active Profiles', icon: UserCheck, gradientClass: 'from-emerald-400 to-teal-600', key: 'activeProfiles' },
  { title: 'Pending Approvals', icon: Clock, gradientClass: 'from-amber-400 to-orange-500', key: 'pendingApprovals' },
  { title: 'Verified Profiles', icon: BadgeCheck, gradientClass: 'from-green-400 to-emerald-600', key: 'verifiedProfiles' },
  { title: 'Premium Members', icon: Crown, gradientClass: 'from-yellow-400 to-amber-600', key: 'premiumMembers' },
  { title: 'Total Matches', icon: Heart, gradientClass: 'from-pink-500 to-rose-600', key: 'totalMatches' },
  { title: 'Revenue', icon: DollarSign, gradientClass: 'from-purple-400 to-violet-600', key: 'revenue', prefix: '$' },
  { title: 'Reported Profiles', icon: ShieldAlert, gradientClass: 'from-red-400 to-rose-600', key: 'reportedProfiles' },
];

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
      <Icon size={20} className="text-pink-700" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
      <ShieldAlert size={32} className="text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
    <p className="text-sm text-gray-500 max-w-md mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm rounded-xl transition-colors"
    >
      <RefreshCw size={16} />
      Try Again
    </button>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/admin/dashboard');
      setData(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load dashboard data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <div>
          <div className="h-7 w-56 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} type="card" count={1} />
          ))}
        </div>
        <LoadingSkeleton type="table" count={1} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboard} />;
  }

  if (!data) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No Dashboard Data"
        description="Dashboard data is not available at the moment. Please check back later."
        action={{ label: 'Refresh', onClick: fetchDashboard }}
      />
    );
  }

  const {
    stats = {},
    recentRegistrations = [],
    monthlyRegistrations = [],
    genderDistribution = { male: 0, female: 0 },
  } = data;

  const totalGender = genderDistribution.male + genderDistribution.female || 1;
  const malePercent = (genderDistribution.male / totalGender) * 100;
  const femalePercent = (genderDistribution.female / totalGender) * 100;
  const maxRegCount = Math.max(...monthlyRegistrations.map((m) => m.count), 1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your matrimony platform at a glance.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {statsConfig.map((stat, index) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stats[stat.key] ?? 0}
            icon={stat.icon}
            gradientClass={stat.gradientClass}
            delay={index * 0.05}
            prefix={stat.prefix || ''}
          />
        ))}
      </div>

      <motion.div variants={itemVariants} className="premium-card p-5 sm:p-6">
        <SectionHeader icon={UserPlus} title="Recent Registrations" subtitle="Latest 10 users who joined the platform" />
        {recentRegistrations.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No recent registrations"
            description="No users have registered yet."
          />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Gender</th>
                  <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Profile Status</th>
                  <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRegistrations.map((user, i) => (
                  <motion.tr
                    key={user._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="hover:bg-pink-50/40 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-gray-500 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        user.gender === 'male' && 'bg-blue-50 text-blue-700',
                        user.gender === 'female' && 'bg-pink-50 text-pink-700',
                        !['male', 'female'].includes(user.gender) && 'bg-gray-50 text-gray-600'
                      )}>
                        {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                      {user.profileStatus === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <BadgeCheck size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <Clock size={12} />
                          Incomplete
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-gray-500 whitespace-nowrap">
                      {user.joinedDate ? format(new Date(user.joinedDate), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="premium-card p-5 sm:p-6">
          <SectionHeader icon={CalendarDays} title="Monthly Registrations" subtitle="Registrations over the last 12 months" />
          {monthlyRegistrations.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No registration data"
              description="Registration data will appear here once users start signing up."
            />
          ) : (
            <div className="flex items-end gap-2 sm:gap-3 pt-4 pb-2" style={{ height: 220 }}>
              {monthlyRegistrations.map((month, i) => {
                const heightPercent = (month.count / maxRegCount) * 100;
                return (
                  <div key={month.month || i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-xs font-semibold text-gray-700">{month.count}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPercent, 4)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                      className="w-full rounded-lg bg-gradient-to-t from-pink-600 to-pink-400 hover:from-pink-500 hover:to-pink-300 transition-colors cursor-pointer relative group"
                      style={{ minHeight: 4 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                        {month.count} registrations
                      </div>
                    </motion.div>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium text-center leading-tight mt-1">
                      {month.month}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="premium-card p-5 sm:p-6">
          <SectionHeader icon={PieChart} title="Gender Distribution" subtitle="Male vs Female user ratio" />
          {genderDistribution.male === 0 && genderDistribution.female === 0 ? (
            <EmptyState
              icon={Users}
              title="No user data"
              description="Gender distribution data will appear once users register."
            />
          ) : (
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="relative w-40 h-40 sm:w-44 sm:h-44">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      #3B82F6 0% ${malePercent}%,
                      #EC4899 ${malePercent}% 100%
                    )`,
                  }}
                />
                <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl font-bold text-gray-900">{totalGender.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">
                    Male <strong className="text-gray-900">{Math.round(malePercent)}%</strong>
                    <span className="text-gray-400 ml-1">({genderDistribution.male.toLocaleString()})</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-sm text-gray-600">
                    Female <strong className="text-gray-900">{Math.round(femalePercent)}%</strong>
                    <span className="text-gray-400 ml-1">({genderDistribution.female.toLocaleString()})</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

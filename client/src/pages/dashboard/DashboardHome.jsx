import { motion } from 'framer-motion';
import { Eye, Users, Heart, Bell } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../../api/axios';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const { user, token, getProfileCompletion } = useAuthStore();
  const completionPercentage = getProfileCompletion(user);

  const [stats, setStats] = useState({
    profileViews: 0,
    newMatches: 0,
    sentInterests: 0,
    receivedInterests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentToken = token || localStorage.getItem('token');
        if (!currentToken) {
          setLoading(false);
          return;
        }
        const response = await API.get('/dashboard/stats', {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        setStats(response.data.stats);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="space-y-8 pb-8">
      {/* Header section is mostly handled by Topbar, but we can add a quick intro */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Here is what is happening with your profile today.</p>
      </motion.div>

      {/* Profile Completion Banner (if < 100%) */}
      {completionPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full mix-blend-screen blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complete your profile</h3>
              <p className="text-gray-600 text-sm mb-4">A complete profile gets 3x more matches. You are almost there!</p>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden border border-transparent">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <p className="text-right text-xs text-pink-600 font-bold">{completionPercentage}% Completed</p>
            </div>
            
            <Link 
              to="/dashboard/profile"
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/25 text-center whitespace-nowrap hover:scale-105"
            >
              Update Profile
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Profile Views" value={stats.profileViews} icon={Eye} colorClass="bg-blue-500 text-blue-400" delay={0.1} />
        <StatCard title="New Matches" value={stats.newMatches} icon={Users} colorClass="bg-green-500 text-green-400" delay={0.2} />
        <StatCard title="Sent Interests" value={stats.sentInterests} icon={Heart} colorClass="bg-pink-500 text-pink-400" delay={0.3} />
        <StatCard title="Notifications" value="0" icon={Bell} colorClass="bg-purple-500 text-purple-400" delay={0.4} />
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {/* Real activity list could go here when implemented */}
            <div className="p-4 rounded-xl bg-gray-50 text-center text-gray-500">
              No recent activity found.
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Premium Plan</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full mix-blend-multiply blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
              <span className="text-2xl font-bold text-white">PRO</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Free Plan</h4>
            <p className="text-sm text-gray-500 mb-6">Upgrade to Premium to message directly and view contacts.</p>
            <Link 
              to="/dashboard/subscription"
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              View Plans
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;

// import { motion } from 'framer-motion';
// import { Eye, Users, Heart, Bell } from 'lucide-react';
// import useAuthStore from '../../store/useAuthStore';
// import { Link } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import API from '../../api/axios';

// const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay }}
//     className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
//   >
//     <div className="flex justify-between items-start">
//       <div>
//         <p className="text-gray-500 text-sm font-medium">{title}</p>
//         <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
//       </div>
//       <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
//         <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
//       </div>
//     </div>
//   </motion.div>
// );

// const DashboardHome = () => {
//   const { user, token, getProfileCompletion } = useAuthStore();
//   const completionPercentage = getProfileCompletion(user);

//   const [stats, setStats] = useState({
//     profileViews: 0,
//     newMatches: 0,
//     sentInterests: 0,
//     receivedInterests: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const currentToken = token || localStorage.getItem('token');
//         if (!currentToken) {
//           setLoading(false);
//           return;
//         }
//         const response = await API.get('/dashboard/stats', {
//           headers: { Authorization: `Bearer ${currentToken}` }
//         });
//         setStats(response.data.stats);
//       } catch (err) {
//         console.error('Failed to fetch dashboard stats', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [token]);

//   return (
//     <div className="space-y-8 pb-8">
//       {/* Header section is mostly handled by Topbar, but we can add a quick intro */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//       >
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard Overview</h1>
//         <p className="text-gray-500 mt-2">Here is what is happening with your profile today.</p>
//       </motion.div>

//       {/* Profile Completion Banner (if < 100%) */}
//       {completionPercentage < 100 && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6 shadow-md relative overflow-hidden"
//         >
//           <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full mix-blend-screen blur-3xl -translate-y-1/2 translate-x-1/3" />
          
//           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex-1 w-full">
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Complete your profile</h3>
//               <p className="text-gray-600 text-sm mb-4">A complete profile gets 3x more matches. You are almost there!</p>
              
//               <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden border border-transparent">
//                 <motion.div 
//                   initial={{ width: 0 }}
//                   animate={{ width: `${completionPercentage}%` }}
//                   transition={{ duration: 1, ease: "easeOut" }}
//                   className="bg-gradient-to-r from-pink-500 to-pink-700 h-3 rounded-full relative"
//                 >
//                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
//                 </motion.div>
//               </div>
//               <p className="text-right text-xs text-pink-600 font-bold">{completionPercentage}% Completed</p>
//             </div>
            
//             <Link 
//               to="/dashboard/profile"
//               className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-500 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/25 text-center whitespace-nowrap hover:scale-105"
//             >
//               Update Profile
//             </Link>
//           </div>
//         </motion.div>
//       )}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Profile Views" value={stats.profileViews} icon={Eye} colorClass="bg-blue-500 text-blue-400" delay={0.1} />
//         <StatCard title="New Matches" value={stats.newMatches} icon={Users} colorClass="bg-green-500 text-green-400" delay={0.2} />
//         <StatCard title="Sent Interests" value={stats.sentInterests} icon={Heart} colorClass="bg-pink-500 text-pink-400" delay={0.3} />
//         <StatCard title="Notifications" value="0" icon={Bell} colorClass="bg-pink-500 text-pink-400" delay={0.4} />
//       </div>

//       {/* Recent Activity & Quick Links */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-6"
//         >
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
//           <div className="space-y-4">
//             {/* Real activity list could go here when implemented */}
//             <div className="p-4 rounded-xl bg-gray-50 text-center text-gray-500">
//               No recent activity found.
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex flex-col"
//         >
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Premium Plan</h3>
//           <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full mix-blend-multiply blur-2xl -translate-y-1/2 translate-x-1/2" />
//             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
//               <span className="text-2xl font-bold text-white">PRO</span>
//             </div>
//             <h4 className="text-lg font-bold text-gray-900 mb-2">Free Plan</h4>
//             <p className="text-sm text-gray-500 mb-6">Upgrade to Premium to message directly and view contacts.</p>
//             <Link 
//               to="/dashboard/subscription"
//               className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
//             >
//               View Plans
//             </Link>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;



import { motion } from 'framer-motion';
import { Eye, Users, Heart, Bell, CheckCircle, ArrowUpRight, Sparkles, UserCheck } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../../api/axios';

// Animated wrapper for clean staggering transitions
const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const StatCard = ({ title, value, icon: Icon, gradientClass, delay, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight mt-1 group-hover:text-pink-600 transition-colors duration-300">
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} text-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
        <Icon size={20} />
      </div>
    </div>
    {label && <span className="text-xs text-gray-400 font-medium">{label}</span>}
  </motion.div>
);

const DashboardHome = () => {
  const { user, token, getProfileCompletion } = useAuthStore();
  const completionPercentage = getProfileCompletion(user) || 65; // fallback definition for demonstration

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
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-2 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      
      {/* Dynamic Personal Welcome Block */}
      <FadeUp>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">{user?.name || 'Partner'}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Your personal matching room. Here is what has changed since your last visit.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full w-fit border border-emerald-100">
            <UserCheck size={14} /> Profile Active & Verified
          </div>
        </div>
      </FadeUp>

      {/* Modern Profile Engagement Callout */}
      {completionPercentage < 100 && (
        <FadeUp delay={0.1}>
          <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm relative overflow-hidden ring-1 ring-pink-500/5">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-pink-50 text-pink-600">
                    <Sparkles size={16} className="animate-spin-slow" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Elevate Your Success Metric</h3>
                </div>
                <p className="text-gray-500 text-sm max-w-2xl">
                  Profiles with absolute configuration enjoy up to <span className="font-semibold text-gray-800">300% increased visibility</span> and high-quality serious matches. Complete yours to stand out.
                </p>
                
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden max-w-md">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-pink-600 shrink-0">{completionPercentage}% Configured</span>
                </div>
              </div>
              
              <Link 
                to="/dashboard/profile"
                className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-pink-500/15 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-0.5"
              >
                Complete Profile Setup
              </Link>
            </div>
          </div>
        </FadeUp>
      )}

      {/* Refined Metric Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Profile Discovered" 
          value={loading ? "..." : stats.profileViews} 
          icon={Eye} 
          gradientClass="from-blue-500 to-indigo-600" 
          delay={0.15} 
          label="Prospects viewed your details"
        />
        <StatCard 
          title="Curated Matches" 
          value={loading ? "..." : stats.newMatches} 
          icon={Users} 
          gradientClass="from-emerald-400 to-teal-600" 
          delay={0.2} 
          label="Matches matching requirements"
        />
        <StatCard 
          title="Interests Extended" 
          value={loading ? "..." : stats.sentInterests} 
          icon={Heart} 
          gradientClass="from-pink-500 to-rose-600" 
          delay={0.25} 
          label="Awaiting responses"
        />
        <StatCard 
          title="Recent Updates" 
          value="0" 
          icon={Bell} 
          gradientClass="from-amber-400 to-orange-500" 
          delay={0.3} 
          label="Unread system notifications"
        />
      </div>

      {/* Balanced Double Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Process Tracking Column */}
        <FadeUp delay={0.35} className="lg:col-span-2">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Interaction Stream</h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time engagement activity for invitations and selections</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/40">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-3 border border-gray-100">
                <CheckCircle size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Perfect alignment here</p>
              <p className="text-xs text-gray-400 text-center mt-1 max-w-xs">
                As prospective matches request details or extend connections, your active responses show up here.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Premium Upgrade Column */}
        <FadeUp delay={0.4}>
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Current Plan Tier</h3>
              <p className="text-xs text-gray-400 mt-0.5">Manage your configuration limits</p>
            </div>
            
            <div className="my-6 p-6 bg-gradient-to-b from-gray-50/80 to-white rounded-2xl border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/10">
                <span className="text-xs font-black text-white tracking-widest">FREE</span>
              </div>
              <h4 className="text-md font-bold text-gray-800">Standard Access Account</h4>
              <p className="text-xs text-gray-400 mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                Unlock direct messaging pipelines, phone verification systems, and expanded filters.
              </p>
            </div>
            
            <Link 
              to="/dashboard/subscription"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm group"
            >
              Examine Membership Plans 
              <ArrowUpRight size={16} className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </div>
        </FadeUp>
        
      </div>
    </div>
  );
};

export default DashboardHome;
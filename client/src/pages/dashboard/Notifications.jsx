import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Briefcase,  Clock, ChevronLeft, ChevronRight,
  Search, Eye, Crown, Lock, AlertTriangle, Users,  
} from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const IMAGE_BASE = API.defaults.baseURL.replace('/api', '');
const getImageUrl = (src) => {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `${IMAGE_BASE}${src}`;
};

const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  let relative;
  if (mins < 60) relative = `${mins}m ago`;
  else if (hrs < 24) relative = `${hrs}h ago`;
  else if (days < 7) relative = `${days}d ago`;
  else relative = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  return { relative, time, full: `${relative} at ${time}` };
};

const VisitCard = ({ visit, type }) => {
  const p = visit;
  const photoUrl = getImageUrl(p.profile_photo);
  const { full: dateTime } = formatDateTime(p.viewed_at);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <Link
          to={`/dashboard/matches/${type === 'visitors' ? p.visitor_user_id : p.visited_user_id}`}
          className="relative w-full sm:w-24 md:w-28 h-36 sm:h-auto shrink-0 overflow-hidden bg-gray-50"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={p.full_name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={28} className="sm:w-[36px] sm:h-[36px] text-gray-300" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 p-3.5 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
            <div className="min-w-0 flex-1">
              <Link
                to={`/dashboard/matches/${type === 'visitors' ? p.visitor_user_id : p.visited_user_id}`}
                className="text-sm sm:text-base font-bold text-gray-900 hover:text-pink-600 transition-colors truncate block"
              >
                {p.full_name}
              </Link>
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-500 mt-0.5">
                {p.age && <span>{p.age} yrs</span>}
                {p.height && <><span className="text-gray-300">|</span><span>{p.height}</span></>}
                {p.religion && <><span className="text-gray-300">|</span><span>{p.religion}</span></>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5 mb-2 sm:mb-3">
            {p.city && (
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                <MapPin size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 shrink-0" />
                <span className="truncate">{p.city}{p.state ? `, ${p.state}` : ''}</span>
              </div>
            )}
            {p.occupation && (
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                <Briefcase size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 shrink-0" />
                <span className="truncate">{p.occupation}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500">
              <Clock size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 shrink-0" />
              <span className="truncate">{dateTime}</span>
            </div>
          </div>

          <Link
            to={`/dashboard/matches/${type === 'visitors' ? p.visitor_user_id : p.visited_user_id}`}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-[11px] sm:text-xs font-bold hover:bg-gray-100 transition-all active:scale-[0.97]"
          >
            <Eye size={11} className="sm:w-[13px] sm:h-[13px]" />
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 sm:py-16 px-4"
  >
    <div className="p-3 sm:p-4 rounded-2xl bg-pink-50 text-pink-300 mb-3 sm:mb-4">
      <Icon size={36} className="sm:w-[48px] sm:h-[48px]" />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 text-center">{title}</h3>
    <p className="text-[13px] sm:text-sm text-gray-500 text-center max-w-xs sm:max-w-sm">{description}</p>
  </motion.div>
);

const PremiumLockCard = ({ onUpgrade }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6 text-center shadow-sm"
  >
    <div className="p-2 sm:p-3 rounded-2xl bg-amber-100 inline-flex mb-2 sm:mb-3">
      <Lock size={22} className="sm:w-[28px] sm:h-[28px] text-amber-600" />
    </div>
    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">Limited Access</h3>
    <p className="text-[13px] sm:text-sm text-gray-500 max-w-xs sm:max-w-sm mx-auto mb-3 sm:mb-4 px-1 sm:px-0">
      Upgrade to Premium to view your complete visit history with search, filters, and full pagination.
    </p>
    <Link
      to="/dashboard/subscription"
      className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-linear-to-r from-amber-500 to-yellow-600 text-white text-[13px] sm:text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all active:scale-[0.97]"
    >
      <Crown size={14} className="sm:w-[16px] sm:h-[16px]" />
      Upgrade to Premium
    </Link>
  </motion.div>
);

const Notifications = () => {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('visitors');
  const [visitors, setVisitors] = useState([]);
  const [visited, setVisited] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isPremium, setIsPremium] = useState(false);

  const fetchData = useCallback(async (tab, p, q, f) => {
    try {
      setLoading(true);
      setError('');
      const currentToken = token || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${currentToken}` };
      const endpoint = tab === 'visitors' ? '/views/visitors' : '/views/visited';
      const res = await API.get(`${endpoint}?page=${p}&limit=10&filter=${f}&search=${encodeURIComponent(q)}`, { headers });
      if (tab === 'visitors') {
        setVisitors(res.data.visitors || []);
        setIsPremium(res.data.isPremium);
      } else {
        setVisited(res.data.visited || []);
        setIsPremium(res.data.isPremium);
      }
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData(activeTab, page, search, filter);
  }, [activeTab, page, fetchData]);

  const handleSearch = () => {
    setPage(1);
    fetchData(activeTab, 1, search, filter);
  };

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
    fetchData(activeTab, 1, search, f);
  };

  const tabs = [
    { key: 'visitors', label: 'Profile Visits', icon: Eye, count: 0 },
    { key: 'visited', label: 'Visited Profiles', icon: Users, count: 0 },
  ];

  const currentList = activeTab === 'visitors' ? visitors : visited;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-5 sm:space-y-6 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Visits</h1>
        <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5 sm:mt-1">Track who viewed your profile and who you have visited.</p>
      </div>

      {/* Subscription Status */}
      <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold ${
        isPremium
          ? 'bg-linear-to-r from-pink-50 to-rose-50 text-pink-700 border border-pink-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}>
        {isPremium ? <Crown size={12} className="sm:w-[14px] sm:h-[14px]" /> : <Lock size={12} className="sm:w-[14px] sm:h-[14px]" />}
        <span className="truncate">
          {isPremium ? 'Premium — Full visit history accessible' : 'Free Plan — Upgrade for full visit history.'}
        </span>
        {!isPremium && (
          <Link to="/dashboard/subscription" className="ml-auto shrink-0 text-amber-700 underline hover:no-underline font-bold flex items-center gap-0.5 sm:gap-1">
            Upgrade <ChevronRight size={10} className="sm:w-[12px] sm:h-[12px]" />
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); setSearch(''); setFilter('all'); }}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                isActive
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={14} className="sm:w-[16px] sm:h-[16px]" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="sm:w-[16px] sm:h-[16px] absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'visitors' ? 'visitors' : 'profiles'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all"
          />
        </div>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto -mx-1 sm:mx-0 px-1 sm:px-0 pb-0.5 sm:pb-0">
          {['all', 'today', 'week', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`shrink-0 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer capitalize active:scale-[0.97] ${
                filter === f
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-red-50 text-red-400 mb-3 sm:mb-4">
            <AlertTriangle size={32} className="sm:w-[40px] sm:h-[40px]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-[13px] sm:text-sm text-gray-500 mb-3 sm:mb-4">{error}</p>
          <button
            onClick={() => fetchData(activeTab, page, search, filter)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[13px] sm:text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer active:scale-[0.97]"
          >
            Try Again
          </button>
        </div>
      ) : currentList.length === 0 ? (
        activeTab === 'visitors' ? (
          <EmptyState icon={Eye} title="No Profile Visits Yet" description="When someone views your profile, they will appear here." />
        ) : (
          <EmptyState icon={Users} title="No Profiles Visited" description="Profiles you view will be listed here." />
        )
      ) : (
        <>
          <div className="space-y-2 sm:space-y-3">
            <AnimatePresence mode="popLayout">
              {currentList.map((v) => (
                <VisitCard key={v.view_id} visit={v} type={activeTab} />
              ))}
            </AnimatePresence>
          </div>

          {/* Premium Upgrade Prompt for free users with limited results */}
          {!isPremium && pagination?.limited && (
            <PremiumLockCard />
          )}

          {/* Pagination */}
          {isPremium && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 sm:p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-[0.97]"
              >
                <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <span className="text-[13px] sm:text-sm font-medium text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 sm:p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-[0.97]"
              >
                <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Notifications;

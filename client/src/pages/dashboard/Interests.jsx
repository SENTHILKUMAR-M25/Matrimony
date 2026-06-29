import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, User, MapPin, Briefcase, Calendar, Check, X,
  Clock, CheckCircle, AlertTriangle, Eye, Shield, Ban,
} from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const IMAGE_BASE = API.defaults.baseURL.replace('/api', '');
const getImageUrl = (src) => {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `${IMAGE_BASE}${src}`;
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };
  const icons = {
    pending: Clock,
    accepted: CheckCircle,
    rejected: Ban,
  };
  const labels = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      <Icon size={10} className="sm:w-[12px] sm:h-[12px]" />
      {labels[status] || status}
    </span>
  );
};

const InterestCard = ({ interest, type, onAccept, onReject, onViewProfile }) => {
  const p = interest;
  const photoUrl = getImageUrl(p.profile_photo);
  const sentDate = new Date(p.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Photo Section */}
        <Link
          to={`/dashboard/matches/${type === 'received' ? p.sender_user_id : p.receiver_user_id}`}
          className="relative w-full sm:w-32 md:w-36 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-50"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={p.full_name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={32} className="sm:w-[40px] sm:h-[40px] text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:hidden" />
          <div className="absolute bottom-2 left-2 sm:hidden">
            <StatusBadge status={p.status} />
          </div>
        </Link>

        {/* Info Section */}
        <div className="flex-1 p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="space-y-2 sm:space-y-2.5">
            {/* Name + Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Link
                  to={`/dashboard/matches/${type === 'received' ? p.sender_user_id : p.receiver_user_id}`}
                  className="text-sm sm:text-base font-bold text-gray-900 hover:text-pink-600 transition-colors truncate block"
                >
                  {p.full_name}
                </Link>
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  {p.age && <span>{p.age} yrs</span>}
                  {p.height && <><span className="text-gray-300">|</span><span>{p.height}</span></>}
                  {p.marital_status && <><span className="text-gray-300">|</span><span>{p.marital_status}</span></>}
                </div>
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <StatusBadge status={p.status} />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5">
              {p.city && (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                  <MapPin size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 flex-shrink-0" />
                  <span className="truncate">{p.city}{p.state ? `, ${p.state}` : ''}</span>
                </div>
              )}
              {p.occupation && (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                  <Briefcase size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 flex-shrink-0" />
                  <span className="truncate">{p.occupation}</span>
                </div>
              )}
              {p.religion && (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                  <Shield size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 flex-shrink-0" />
                  <span className="truncate">{p.religion}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                <Calendar size={11} className="sm:w-[12px] sm:h-[12px] text-gray-400 flex-shrink-0" />
                <span className="truncate">Sent {sentDate}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100">
            {type === 'received' && p.status === 'pending' && (
              <>
                <button
                  onClick={() => onAccept(p.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] sm:text-xs font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer active:scale-[0.97]"
                >
                  <Check size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Accept
                </button>
                <button
                  onClick={() => onReject(p.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-red-200 text-red-600 text-[11px] sm:text-xs font-bold hover:bg-red-50 transition-all cursor-pointer active:scale-[0.97]"
                >
                  <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Reject
                </button>
              </>
            )}
            <Link
              to={`/dashboard/matches/${type === 'received' ? p.sender_user_id : p.receiver_user_id}`}
              className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-[11px] sm:text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer active:scale-[0.97]"
            >
              <Eye size={12} className="sm:w-[14px] sm:h-[14px]" />
              View Profile
            </Link>
          </div>
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

const Interests = () => {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const currentToken = token || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${currentToken}` };

      const [recRes, sentRes] = await Promise.all([
        API.get('/interests/received', { headers }),
        API.get('/interests/sent', { headers }),
      ]);

      setReceived(recRes.data.interests || []);
      setSent(sentRes.data.interests || []);
    } catch (err) {
      setError('Failed to load interests.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAccept = async (interestId) => {
    try {
      const currentToken = token || localStorage.getItem('token');
      await API.put(`/interests/${interestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setReceived((prev) =>
        prev.map((i) => (i.id === interestId ? { ...i, status: 'accepted' } : i))
      );
    } catch (err) {
      console.error('Accept failed:', err);
    }
  };

  const handleReject = async (interestId) => {
    try {
      const currentToken = token || localStorage.getItem('token');
      await API.put(`/interests/${interestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setReceived((prev) => prev.filter((i) => i.id !== interestId));
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  const tabs = [
    { key: 'received', label: 'Received', icon: Heart, count: received.filter((i) => i.status === 'pending').length },
    { key: 'sent', label: 'Sent', icon: SendIcon, count: sent.length },
  ];

  const currentList = activeTab === 'received' ? received : sent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-5 sm:space-y-6 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Interests</h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5 sm:mt-1">Manage your connections and interest requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                isActive
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={14} className="sm:w-1.5 sm:h-0.75" />
              <span className="truncate">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 sm:px-1.5 rounded-full text-[9px] sm:text-[10px] font-bold ${
                  isActive ? 'bg-pink-100 text-pink-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Loading Interests</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-red-50 text-red-400 mb-3 sm:mb-4">
            <AlertTriangle size={32} className="sm:w-[40px] sm:h-[40px]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-[13px] sm:text-sm text-gray-500 mb-3 sm:mb-4">{error}</p>
          <button
            onClick={fetchAll}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[13px] sm:text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer active:scale-[0.97]"
          >
            Try Again
          </button>
        </div>
      ) : currentList.length === 0 ? (
        activeTab === 'received' ? (
          <EmptyState
            icon={Heart}
            title="No Interests Received"
            description="When someone sends you an interest request, it will appear here."
          />
        ) : (
          <EmptyState
            icon={SendIcon}
            title="No Interests Sent"
            description="Browse profiles and send interest requests to start connecting."
          />
        )
      ) : (
        <div className="space-y-2 sm:space-y-3">
          <AnimatePresence mode="popLayout">
            {currentList.map((interest) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                type={activeTab}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

const SendIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export default Interests;

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, CheckCircle, XCircle, RefreshCw,
  Calendar, MapPin, AlertCircle, FileText, Edit3, RotateCcw,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const cn = (...inputs) => twMerge(clsx(inputs));

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'revision', label: 'Revision' },
];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  revision: 'bg-blue-100 text-blue-700 border-blue-200',
};

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  revision: 'Under Revision',
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const getGradientForName = (name) => {
  const gradients = [
    'from-pink-400 to-rose-500',
    'from-purple-400 to-pink-500',
    'from-red-400 to-pink-500',
    'from-pink-500 to-rose-600',
    'from-rose-400 to-pink-500',
    'from-fuchsia-400 to-pink-500',
  ];
  if (!name) return gradients[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full" />
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{title}</h4>
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pl-3">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <p className="text-sm text-gray-700 mt-0.5">{value || 'N/A'}</p>
  </div>
);

const ProfileDetailModal = ({ profile, open, onOpenChange, onApprove, onRejectClick, onReviseClick, actionLoading }) => {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm py-8 px-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto"
          >
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X size={18} />
              </button>
              <div className="absolute -bottom-12 left-6">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br ${getGradientForName(profile.name)} flex items-center justify-center text-white text-2xl font-bold`}>
                    {getInitials(profile.name)}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-16 px-6 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.name || 'Unknown'}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    {profile.gender && <span>{profile.gender}</span>}
                    {profile.age && <span>{profile.age} yrs</span>}
                    {profile.profileId && <span>ID: {profile.profileId}</span>}
                  </div>
                </div>
                <span className={cn('px-3 py-1 rounded-lg text-xs font-semibold border', STATUS_STYLES[profile.status])}>
                  {STATUS_LABELS[profile.status] || profile.status}
                </span>
              </div>

              <div className="mt-8 space-y-6">
                <Section title="Personal Info">
                  <Field label="Full Name" value={profile.name} />
                  <Field label="Gender" value={profile.gender} />
                  <Field label="Age" value={profile.age} />
                  <Field label="Date of Birth" value={profile.dob ? formatDate(profile.dob) : 'N/A'} />
                  <Field label="Religion" value={profile.religion} />
                  <Field label="Caste" value={profile.caste} />
                  <Field label="Mother Tongue" value={profile.motherTongue} />
                  <Field label="Marital Status" value={profile.maritalStatus} />
                </Section>

                <Section title="Education & Career">
                  <Field label="Education" value={profile.education} />
                  <Field label="Occupation" value={profile.occupation} />
                  <Field label="Annual Income" value={profile.annualIncome} />
                  <Field label="Employed In" value={profile.employedIn} />
                </Section>

                <Section title="Family Details">
                  <Field label="Father's Occupation" value={profile.fatherOccupation} />
                  <Field label="Mother's Occupation" value={profile.motherOccupation} />
                  <Field label="Siblings" value={profile.siblings} />
                  <Field label="Family Type" value={profile.familyType} />
                  <Field label="Family Values" value={profile.familyValues} />
                </Section>

                <Section title="Location">
                  <Field label="City" value={profile.city} />
                  <Field label="State" value={profile.state} />
                  <Field label="Country" value={profile.country} />
                  <Field label="Citizenship" value={profile.citizenship} />
                </Section>

                <Section title="Astrology">
                  <Field label="Rasi" value={profile.rasi} />
                  <Field label="Nakshatra" value={profile.nakshatra} />
                  <Field label="Lagnam" value={profile.laknam || profile.horoscopeData?.fields?.lagnam} />
                  <Field label="Dosham" value={profile.dhosham || profile.horoscopeData?.fields?.dosham} />
                  <Field label="Gothram" value={profile.gothram || profile.horoscopeData?.fields?.gothram} />
                  <Field label="Pada" value={profile.horoscopeData?.fields?.pada} />
                  <Field label="Nadi" value={profile.horoscopeData?.fields?.nadi} />
                  <Field label="Gana" value={profile.horoscopeData?.fields?.gana} />
                  <Field label="Dasa" value={profile.horoscopeData?.fields?.dasa} />
                  <Field label="Mahadasa" value={profile.horoscopeData?.fields?.mahadasa} />
                  {profile.horoscopeData?.saved && (
                    <Field label="Horoscope" value="Structured chart saved" />
                  )}
                </Section>

                <Section title="Contact Info">
                  <Field label="Email" value={profile.email} />
                  <Field label="Phone" value={profile.phone} />
                </Section>

                {profile.approvalHistory && profile.approvalHistory.length > 0 && (
                  <Section title="Approval History">
                    <div className="col-span-2 space-y-3">
                      {profile.approvalHistory.map((entry, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                            <FileText size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-gray-900 capitalize">{entry.action}</span>
                              <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', STATUS_STYLES[entry.status] || 'bg-gray-100 text-gray-600 border-gray-200')}>
                                {STATUS_LABELS[entry.status] || entry.status}
                              </span>
                            </div>
                            {entry.reason && <p className="text-xs text-gray-500 mt-0.5">{entry.reason}</p>}
                            {entry.performedBy && <p className="text-xs text-gray-400 mt-0.5">by {entry.performedBy}</p>}
                            <p className="text-xs text-gray-400 mt-0.5">{entry.date ? formatDate(entry.date) : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 flex-wrap">
                  {(profile.status === 'pending' || profile.status === 'revision') && (
                    <>
                      <button
                        onClick={() => onApprove(profile._id)}
                        disabled={actionLoading?.[`${profile._id}-approve`]}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-300/40"
                      >
                        {actionLoading?.[`${profile._id}-approve`] ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectClick(profile._id)}
                        disabled={actionLoading?.[`${profile._id}-reject`]}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-300/40"
                      >
                        {actionLoading?.[`${profile._id}-reject`] ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <XCircle size={16} />
                        )}
                        Reject
                      </button>
                      <button
                        onClick={() => onReviseClick(profile._id)}
                        disabled={actionLoading?.[`${profile._id}-request-update`]}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-300/40"
                      >
                        {actionLoading?.[`${profile._id}-request-update`] ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Edit3 size={16} />
                        )}
                        Request Update
                      </button>
                    </>
                  )}
                  {profile.status === 'approved' && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                      <CheckCircle size={16} />
                      Profile Approved
                    </span>
                  )}
                  {profile.status === 'rejected' && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                      <XCircle size={16} />
                      Profile Rejected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Profile created on {profile.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileApprovals = () => {
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, revision: 0, approvedToday: 0, rejectedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectProfileId, setRejectProfileId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [reviseOpen, setReviseOpen] = useState(false);
  const [reviseProfileId, setReviseProfileId] = useState(null);
  const [reviseReason, setReviseReason] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [actionLoading, setActionLoading] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);
  const initialFetchDone = useRef(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, limit: 10 };
      if (activeTab !== 'all') params.status = activeTab;
      const { data } = await API.get('/admin/profiles/pending', { params });
      setProfiles(data.profiles || data.data || []);
      setTotalPages(data.totalPages || data.pages || 1);
      setTotalProfiles(data.total || data.count || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profiles');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab]);

  const fetchStats = useCallback(async (showLoading = false) => {
    if (showLoading) setStatsLoading(true);
    try {
      const { data } = await API.get('/admin/profiles/stats');
      setStats({
        pending: data.pending || 0,
        approved: data.approved || 0,
        rejected: data.rejected || 0,
        revision: data.revision || 0,
        approvedToday: data.approvedToday || 0,
        rejectedToday: data.rejectedToday || 0,
      });
    } catch (err) {
      console.error('[ProfileApprovals] Failed to fetch stats:', err.response?.data?.message || err.message);
    } finally {
      if (showLoading) setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    fetchStats(true);
  }, [fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const onFocus = () => {
      if (initialFetchDone.current) {
        fetchStats();
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && initialFetchDone.current) {
        fetchStats();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    initialFetchDone.current = true;
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchStats]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openDetail = (profile) => {
    setSelectedProfile(profile);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setSelectedProfile(null), 200);
  };

  const performAction = async (id, action, body = {}) => {
    setActionLoading((prev) => ({ ...prev, [`${id}-${action}`]: true }));
    try {
      let endpoint;
      let successMsg;
      switch (action) {
        case 'approve':
          endpoint = `/admin/profiles/${id}/approve`;
          successMsg = 'Profile approved successfully';
          break;
        case 'reject':
          endpoint = `/admin/profiles/${id}/reject`;
          successMsg = 'Profile rejected';
          break;
        case 'request-update':
          endpoint = `/admin/profiles/${id}/request-update`;
          successMsg = 'Update requested from user';
          break;
        default:
          return;
      }
      await API.put(endpoint, body);
      toast.success(successMsg);
      fetchProfiles();
      fetchStats();
      if (detailOpen) closeDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} profile`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${id}-${action}`]: false }));
    }
  };

  const handleApprove = (id) => {
    setConfirmAction({
      id,
      action: 'approve',
      title: 'Approve Profile',
      message: 'Are you sure you want to approve this profile? It will become visible to other users.',
      confirmText: 'Approve',
      variant: 'info',
    });
    setConfirmOpen(true);
  };

  const handleRejectClick = (id) => {
    setRejectProfileId(id);
    setRejectReason('');
    setRejectOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    performAction(rejectProfileId, 'reject', { reason: rejectReason.trim() });
    setRejectOpen(false);
    setRejectProfileId(null);
    setRejectReason('');
  };

  const handleReviseClick = (id) => {
    setReviseProfileId(id);
    setReviseReason('');
    setReviseOpen(true);
  };

  const handleReviseConfirm = () => {
    if (!reviseReason.trim()) {
      toast.error('Please provide details for the update request');
      return;
    }
    performAction(reviseProfileId, 'request-update', { reason: reviseReason.trim() });
    setReviseOpen(false);
    setReviseProfileId(null);
    setReviseReason('');
  };

  const handleConfirm = () => {
    if (confirmAction) {
      performAction(confirmAction.id, confirmAction.action);
      setConfirmAction(null);
    }
  };

  const ProfileCard = ({ profile, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      className="premium-card p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => openDetail(profile)}
    >
      <div className="flex items-start gap-4">
        {profile.profilePhoto ? (
          <img
            src={profile.profilePhoto}
            alt={profile.name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-2 ring-pink-100"
          />
        ) : (
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradientForName(profile.name)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-pink-100`}>
            {getInitials(profile.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                {profile.name || 'Unknown'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                <span>{profile.gender || 'N/A'}</span>
                {profile.age && <><span className="text-gray-300">|</span><span>{profile.age} yrs</span></>}
                {profile.religion && <><span className="text-gray-300">|</span><span>{profile.religion}</span></>}
              </div>
            </div>
            <span className={cn('px-2.5 py-0.5 rounded-lg text-xs font-semibold border shrink-0', STATUS_STYLES[profile.status])}>
              {STATUS_LABELS[profile.status] || profile.status}
            </span>
          </div>

          {(profile.caste || profile.education || profile.occupation) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
              {profile.caste && <span>{profile.caste}</span>}
              {profile.education && <><span className="text-gray-300">|</span><span>{profile.education}</span></>}
              {profile.occupation && <><span className="text-gray-300">|</span><span>{profile.occupation}</span></>}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
            {profile.city && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {profile.city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(profile.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        {profile.status === 'pending' && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handleApprove(profile._id); }}
              disabled={actionLoading[`${profile._id}-approve`]}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-300/30"
            >
              {actionLoading[`${profile._id}-approve`] ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <CheckCircle size={14} />
              )}
              Approve
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRejectClick(profile._id); }}
              disabled={actionLoading[`${profile._id}-reject`]}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-300/30"
            >
              {actionLoading[`${profile._id}-reject`] ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <XCircle size={14} />
              )}
              Reject
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleReviseClick(profile._id); }}
              disabled={actionLoading[`${profile._id}-request-update`]}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-300/30"
            >
              {actionLoading[`${profile._id}-request-update`] ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Edit3 size={14} />
              )}
              Request Update
            </button>
          </>
        )}
        {profile.status === 'revision' && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handleApprove(profile._id); }}
              disabled={actionLoading[`${profile._id}-approve`]}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-300/30"
            >
              {actionLoading[`${profile._id}-approve`] ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <CheckCircle size={14} />
              )}
              Approve
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRejectClick(profile._id); }}
              disabled={actionLoading[`${profile._id}-reject`]}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-300/30"
            >
              {actionLoading[`${profile._id}-reject`] ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <XCircle size={14} />
              )}
              Reject
            </button>
          </>
        )}
        {(profile.status === 'approved' || profile.status === 'rejected') && (
          <span className="text-xs text-gray-400 italic">No actions available</span>
        )}
      </div>
    </motion.div>
  );

  const RejectModal = ({ open, onOpenChange, onConfirm, reason, setReason, loading }) => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-200 p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">Reject Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Provide a reason for rejecting this profile.</p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition-all"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!reason.trim() || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                Reject Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ReviseModal = ({ open, onOpenChange, onConfirm, reason, setReason, loading }) => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-200 p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Edit3 size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">Request Profile Update</h3>
                <p className="text-sm text-gray-600 mt-1">Specify what changes are needed from the user.</p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe what needs to be updated..."
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!reason.trim() || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                Send Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => { setConfirmOpen(open); if (!open) setConfirmAction(null); }}
        title={confirmAction?.title || 'Confirm'}
        message={confirmAction?.message || 'Are you sure?'}
        confirmText={confirmAction?.confirmText || 'Confirm'}
        variant={confirmAction?.variant || 'info'}
        onConfirm={handleConfirm}
      />

      <RejectModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleRejectConfirm}
        reason={rejectReason}
        setReason={setRejectReason}
        loading={actionLoading[`${rejectProfileId}-reject`]}
      />

      <ReviseModal
        open={reviseOpen}
        onOpenChange={setReviseOpen}
        onConfirm={handleReviseConfirm}
        reason={reviseReason}
        setReason={setReviseReason}
        loading={actionLoading[`${reviseProfileId}-request-update`]}
      />

      <ProfileDetailModal
        profile={selectedProfile}
        open={detailOpen}
        onOpenChange={closeDetail}
        onApprove={handleApprove}
        onRejectClick={handleRejectClick}
        onReviseClick={handleReviseClick}
        actionLoading={actionLoading}
      />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Profile Approvals</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Review and manage user profile registrations. Approve, reject, or request updates for pending profiles.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Reviews"
          value={stats.pending}
          icon={Clock}
          gradientClass="bg-gradient-to-br from-amber-400 to-orange-500"
          delay={0}
        />
        <StatCard
          title="Approved Today"
          value={stats.approvedToday}
          icon={CheckCircle}
          gradientClass="bg-gradient-to-br from-green-400 to-emerald-500"
          delay={0.1}
        />
        <StatCard
          title="Rejected Today"
          value={stats.rejectedToday}
          icon={XCircle}
          gradientClass="bg-gradient-to-br from-red-400 to-rose-500"
          delay={0.2}
        />
        <StatCard
          title="Under Revision"
          value={stats.revision}
          icon={RefreshCw}
          gradientClass="bg-gradient-to-br from-blue-400 to-indigo-500"
          delay={0.3}
        />
      </div>

      <div className="premium-card">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500',
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-300/40'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                )}
              >
                {tab.label}
                {tab.key !== 'all' && stats[tab.key] !== undefined && stats[tab.key] > 0 && (
                  <span className={cn(
                    'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}>
                    {stats[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loading ? (
            <LoadingSkeleton type="card" count={4} />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to Load Profiles</h3>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchProfiles}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 active:scale-95"
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </motion.div>
          ) : profiles.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Profiles Found"
              description={
                activeTab === 'all'
                  ? 'There are no profiles to review at the moment.'
                  : `No ${STATUS_LABELS[activeTab]?.toLowerCase() || activeTab} profiles found.`
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{profiles.length}</span> of{' '}
                  <span className="font-medium text-gray-700">{totalProfiles}</span> profiles
                </p>
              </div>
              <div className="space-y-3">
                {profiles.map((profile, index) => (
                  <ProfileCard key={profile._id} profile={profile} index={index} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileApprovals;

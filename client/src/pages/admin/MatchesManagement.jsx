import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Heart, Users, CalendarDays, Activity, Eye, Trash2, X,
  Mail, MapPin, AlertTriangle, Loader2, User,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';

const cn = (...inputs) => twMerge(clsx(inputs));

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const thClass = 'px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider';
const tdClass = 'px-3 py-3.5 text-sm text-gray-700';

const UserProfile = ({ user, label }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
      {getInitials(user?.fullName)}
    </div>
    <div className="min-w-0">
      <p className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[140px] text-xs leading-tight">
        {user?.fullName || 'N/A'}
        <span className="block text-[11px] text-gray-400 font-normal">{label}</span>
      </p>
    </div>
  </div>
);

const MatchesManagement = () => {
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, active: 0, matchRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRef = useRef();

  useEffect(() => {
    fetchRef.current = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/admin/matches', { params: { page, limit: 15 } });
        const data = res.data;
        setMatches(data.matches || data.data || []);
        setStats({
          total: data.stats?.total ?? data.total ?? 0,
          thisMonth: data.stats?.thisMonth ?? 0,
          active: data.stats?.active ?? 0,
          matchRate: data.stats?.matchRate ?? 0,
        });
        setTotalPages(data.pagination?.totalPages || data.totalPages || 1);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load matches';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchRef.current();
  }, [page]);

  const refresh = () => fetchRef.current?.();

  const openViewModal = (match) => {
    setSelectedMatch(match);
    setViewModalOpen(true);
  };

  const handleRemove = async () => {
    if (!deleteTarget) return;
    const match = deleteTarget;
    setDeleteTarget(null);
    setDeleting(true);
    try {
      await API.delete(`/admin/matches/${match._id}`);
      toast.success('Match removed successfully');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove match');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return format(parseISO(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  };

  const p1 = (m) => m.partner1 || m.user1 || m.firstUser || {};
  const p2 = (m) => m.partner2 || m.user2 || m.secondUser || {};

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Matches Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all matched pairs on the platform</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Matches"
          value={stats.total}
          icon={Heart}
          gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
          delay={0}
        />
        <StatCard
          title="Matches This Month"
          value={stats.thisMonth}
          icon={CalendarDays}
          gradientClass="bg-gradient-to-br from-purple-400 to-purple-600"
          delay={0.05}
        />
        <StatCard
          title="Active Matches"
          value={stats.active}
          icon={Activity}
          gradientClass="bg-gradient-to-br from-emerald-400 to-teal-600"
          delay={0.1}
        />
        <StatCard
          title="Match Rate"
          value={`${stats.matchRate}%`}
          icon={Users}
          gradientClass="bg-gradient-to-br from-amber-400 to-orange-600"
          delay={0.15}
          subtitle="of all profiles"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="p-6">
            <LoadingSkeleton type="table" count={1} />
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load matches</h3>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              onClick={refresh}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-pink-300/40 transition-all"
            >
              Retry
            </button>
          </div>
        ) : matches.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No matches found"
            description="No matches have been created yet."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className={thClass}>Match ID</th>
                    <th className={thClass}>Partner 1</th>
                    <th className={thClass}>Partner 2</th>
                    <th className={thClass}>Matched Date</th>
                    <th className={thClass}>Status</th>
                    <th className={`${thClass} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {matches.map((match, idx) => (
                    <motion.tr
                      key={match._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      className="hover:bg-pink-50/30 transition-colors group"
                    >
                      <td className={tdClass}>
                        <span className="font-mono text-xs text-gray-500">
                          {match._id ? `#${String(match._id).slice(-6)}` : '—'}
                        </span>
                      </td>

                      <td className={tdClass}>
                        <div className="space-y-1">
                          <UserProfile user={p1(match)} label="Partner 1" />
                          <div className="flex items-center gap-2.5 pl-11">
                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Mail size={10} />
                              <span className="truncate max-w-[80px] sm:max-w-[120px]">{p1(match).email || '—'}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {p1(match).age ?? '—'} yrs
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {p1(match).city || '—'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={tdClass}>
                        <div className="space-y-1">
                          <UserProfile user={p2(match)} label="Partner 2" />
                          <div className="flex items-center gap-2.5 pl-11">
                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Mail size={10} />
                              <span className="truncate max-w-[80px] sm:max-w-[120px]">{p2(match).email || '—'}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {p2(match).age ?? '—'} yrs
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {p2(match).city || '—'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-gray-400" />
                          <span>{formatDate(match.matchedAt || match.createdAt || match.date)}</span>
                        </div>
                      </td>

                      <td className={tdClass}>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>

                      <td className={`${tdClass} text-right`}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openViewModal(match)}
                            aria-label="View pair"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Pair"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(match)}
                            disabled={deleting}
                            aria-label="Remove match"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Remove Match"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && !error && matches.length > 0 && (
              <div className="border-t border-gray-100 px-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* View Pair Modal */}
      <AnimatePresence>
        {viewModalOpen && selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setViewModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-lg font-semibold text-gray-900">Matched Pair Details</h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Heart size={12} className="text-emerald-500" fill="currentColor" />
                    Matched on {formatDate(selectedMatch.matchedAt || selectedMatch.createdAt || selectedMatch.date)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[p1(selectedMatch), p2(selectedMatch)].map((user, i) => (
                    <div
                      key={i}
                      className={cn(
                        'rounded-xl border p-5',
                        i === 0 ? 'border-pink-200 bg-pink-50/30' : 'border-purple-200 bg-purple-50/30'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-md',
                          i === 0
                            ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                            : 'bg-gradient-to-br from-purple-400 to-purple-600'
                        )}>
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.fullName || 'N/A'}</h3>
                          <p className="text-xs text-gray-500">Partner {i + 1}</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{user.email || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                          <span>{[user.city, user.state].filter(Boolean).join(', ') || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={14} className="text-gray-400 flex-shrink-0" />
                          <span>{user.gender ? `${user.gender}, ${user.age ?? '—'} yrs` : '—'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Match Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Remove Match"
        message={`Are you sure you want to remove the match between ${deleteTarget ? (p1(deleteTarget).fullName || 'Partner 1') : 'Partner 1'} and ${deleteTarget ? (p2(deleteTarget).fullName || 'Partner 2') : 'Partner 2'}? This action cannot be undone.`}
        onConfirm={handleRemove}
        confirmText="Remove Match"
        variant="danger"
      />
    </div>
  );
};

export default MatchesManagement;

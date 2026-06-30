import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Crown, Users, UserCheck, DollarSign, CreditCard,
  TrendingUp, ArrowUpRight, Activity,
  CheckCircle, XCircle, ToggleLeft, ToggleRight,
  FilterX, AlertTriangle, Loader2, Calendar,
  Wallet, Receipt, BarChart3,
} from 'lucide-react';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';

const TABS = [
  { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
  { id: 'payments', label: 'Payment History', icon: CreditCard },
];

const thClass = 'px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-default select-none';
const tdClass = 'px-3 py-3.5 text-sm text-gray-700';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    premium: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200',
    free: 'bg-gray-100 text-gray-600 border border-gray-200',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    expired: 'bg-red-50 text-red-700 border border-red-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    failed: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

const formatCurrency = (amount) => {
  if (amount == null) return '$0';
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatDate = (date) => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return '—';
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');

  const [subscriptions, setSubscriptions] = useState([]);
  const [subStats, setSubStats] = useState({ activeSubscriptions: 0, premiumUsers: 0, freeUsers: 0, monthlyRevenue: 0 });
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState(null);
  const [subPage, setSubPage] = useState(1);
  const [subTotalPages, setSubTotalPages] = useState(1);

  const [payments, setPayments] = useState([]);
  const [payStats, setPayStats] = useState({ totalRevenue: 0, totalPayments: 0, averagePayment: 0, highestPayment: 0 });
  const [payLoading, setPayLoading] = useState(true);
  const [payError, setPayError] = useState(null);
  const [payPage, setPayPage] = useState(1);
  const [payTotalPages, setPayTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [toggleTarget, setToggleTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchSubscriptions = useCallback(() => {
    setSubLoading(true);
    setSubError(null);
    API.get('/admin/subscriptions', { params: { page: subPage, limit: 15 } })
      .then((res) => {
        const data = res.data;
        setSubscriptions(data.subscriptions || []);
        setSubStats({
          activeSubscriptions: data.stats?.activeSubscriptions ?? 0,
          premiumUsers: data.stats?.premiumUsers ?? 0,
          freeUsers: data.stats?.freeUsers ?? 0,
          monthlyRevenue: data.stats?.monthlyRevenue ?? 0,
        });
        setSubTotalPages(data.pagination?.totalPages || data.totalPages || 1);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to load subscriptions';
        setSubError(msg);
        toast.error(msg);
      })
      .finally(() => setSubLoading(false));
  }, [subPage]);

  useEffect(() => {
    if (activeTab === 'subscriptions') fetchSubscriptions();
  }, [activeTab, fetchSubscriptions]);

  const fetchPayments = useCallback(() => {
    setPayLoading(true);
    setPayError(null);
    const params = { page: payPage, limit: 15 };
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    API.get('/admin/subscriptions/payments', { params })
      .then((res) => {
        const data = res.data;
        setPayments(data.payments || []);
        setPayStats({
          totalRevenue: data.stats?.totalRevenue ?? 0,
          totalPayments: data.stats?.totalPayments ?? 0,
          averagePayment: data.stats?.averagePayment ?? 0,
          highestPayment: data.stats?.highestPayment ?? 0,
        });
        setPayTotalPages(data.pagination?.totalPages || data.totalPages || 1);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to load payments';
        setPayError(msg);
        toast.error(msg);
      })
      .finally(() => setPayLoading(false));
  }, [payPage, dateFrom, dateTo]);

  useEffect(() => {
    if (activeTab === 'payments') fetchPayments();
  }, [activeTab, fetchPayments]);

  const clearDateFilters = () => {
    setDateFrom('');
    setDateTo('');
    setPayPage(1);
  };

  const hasDateFilters = dateFrom || dateTo;

  const handleToggle = async () => {
    if (!toggleTarget) return;
    const sub = toggleTarget;
    setToggleTarget(null);
    setActionLoading((prev) => ({ ...prev, [`toggle-${sub._id}`]: true }));
    try {
      await API.put(`/admin/subscriptions/${sub._id}/toggle`);
      toast.success('Subscription status updated');
      fetchSubscriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle subscription');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`toggle-${sub._id}`]: false }));
    }
  };

  const renderSubscriptions = () => {
    if (subLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6"><LoadingSkeleton type="table" count={1} /></div>
        </motion.div>
      );
    }

    if (subError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load subscriptions</h3>
            <p className="text-sm text-gray-500 mb-6">{subError}</p>
            <button
              onClick={fetchSubscriptions}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-pink-300/40 transition-all"
            >
              Retry
            </button>
          </div>
        </motion.div>
      );
    }

    if (subscriptions.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <EmptyState
            icon={Crown}
            title="No subscriptions found"
            description="No users have subscribed yet."
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className={thClass}>User Name</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Plan</th>
                <th className={thClass}>Start Date</th>
                <th className={thClass}>End Date</th>
                <th className={thClass}>Amount</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscriptions.map((sub, idx) => {
                const user = sub.userId || {};
                const isActive = sub.status === 'active';
                return (
                  <motion.tr
                    key={sub._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    className="hover:bg-pink-50/30 transition-colors group"
                  >
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            getInitials(user.fullName)
                          )}
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[140px]">
                          {user.fullName || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <span className="text-gray-600 truncate max-w-[100px] sm:max-w-[160px] block">
                        {user.email || '—'}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <Badge variant={sub.plan === 'premium' ? 'premium' : 'free'}>
                        {sub.plan === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{formatDate(sub.startDate)}</span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{formatDate(sub.endDate)}</span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <span className="font-medium text-gray-900">{formatCurrency(sub.amount)}</span>
                    </td>
                    <td className={tdClass}>
                      <Badge variant={isActive ? 'active' : 'expired'}>
                        {isActive ? (
                          <><CheckCircle size={11} /> Active</>
                        ) : (
                          <><XCircle size={11} /> Expired</>
                        )}
                      </Badge>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <button
                        onClick={() => setToggleTarget(sub)}
                        disabled={actionLoading[`toggle-${sub._id}`]}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                          isActive
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={isActive ? 'Deactivate' : 'Activate'}
                      >
                        {actionLoading[`toggle-${sub._id}`] ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : isActive ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {subscriptions.length > 0 && (
          <div className="border-t border-gray-100 px-4">
            <Pagination
              currentPage={subPage}
              totalPages={subTotalPages}
              onPageChange={setSubPage}
            />
          </div>
        )}
      </motion.div>
    );
  };

  const renderPayments = () => {
    const content = () => {
      if (payLoading) {
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6"><LoadingSkeleton type="table" count={1} /></div>
          </div>
        );
      }

      if (payError) {
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load payments</h3>
              <p className="text-sm text-gray-500 mb-6">{payError}</p>
              <button
                onClick={fetchPayments}
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-pink-300/40 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        );
      }

      if (payments.length === 0) {
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <EmptyState
              icon={CreditCard}
              title="No payments found"
              description={hasDateFilters ? 'No payments match the selected date range.' : 'No payments have been recorded yet.'}
              action={hasDateFilters ? { label: 'Clear Filters', onClick: clearDateFilters } : undefined}
            />
          </div>
        );
      }

      return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className={thClass}>User Name</th>
                  <th className={thClass}>Email</th>
                  <th className={thClass}>Plan</th>
                  <th className={thClass}>Amount</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((pay, idx) => {
                  const user = pay.userId || {};
                  return (
                    <motion.tr
                      key={pay._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      className="hover:bg-pink-50/30 transition-colors group"
                    >
                      <td className={tdClass}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                            {user.profilePhoto ? (
                              <img src={user.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              getInitials(user.fullName)
                            )}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[140px]">
                            {user.fullName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className={tdClass}>
                        <span className="text-gray-600 truncate max-w-[100px] sm:max-w-[160px] block">
                          {user.email || '—'}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <Badge variant={pay.plan === 'premium' ? 'premium' : 'free'}>
                          {pay.plan === 'premium' ? 'Premium' : 'Free'}
                        </Badge>
                      </td>
                      <td className={tdClass}>
                        <span className="font-semibold text-gray-900">{formatCurrency(pay.amount)}</span>
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{formatDate(pay.date || pay.createdAt)}</span>
                        </div>
                      </td>
                      <td className={tdClass}>
                        <Badge variant={pay.status === 'completed' ? 'completed' : pay.status === 'pending' ? 'pending' : 'failed'}>
                          {pay.status === 'completed' ? (
                            <><CheckCircle size={11} /> Completed</>
                          ) : pay.status === 'pending' ? (
                            <><Loader2 size={11} className="animate-spin" /> Pending</>
                          ) : (
                            <><XCircle size={11} /> Failed</>
                          )}
                        </Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {payments.length > 0 && (
            <div className="border-t border-gray-100 px-4">
              <Pagination
                currentPage={payPage}
                totalPages={payTotalPages}
                onPageChange={setPayPage}
              />
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Date filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">From</label>
              <input
                type="month"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPayPage(1); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">To</label>
              <input
                type="month"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPayPage(1); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
              />
            </div>
            {hasDateFilters && (
              <button
                onClick={clearDateFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FilterX size={14} />
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {content()}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Subscription Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage subscriptions and view payment history</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Stats row */}
      {activeTab === 'subscriptions' ? (
        <motion.div
          key="sub-stats"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Active Subscriptions"
            value={subStats.activeSubscriptions}
            icon={Activity}
            gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
            delay={0}
          />
          <StatCard
            title="Premium Users"
            value={subStats.premiumUsers}
            icon={Crown}
            gradientClass="bg-gradient-to-br from-amber-400 to-orange-600"
            delay={0.05}
          />
          <StatCard
            title="Free Users"
            value={subStats.freeUsers}
            icon={Users}
            gradientClass="bg-gradient-to-br from-blue-400 to-indigo-600"
            delay={0.1}
          />
          <StatCard
            title="Monthly Revenue"
            value={subStats.monthlyRevenue}
            icon={DollarSign}
            gradientClass="bg-gradient-to-br from-emerald-400 to-teal-600"
            delay={0.15}
            prefix="$"
          />
        </motion.div>
      ) : (
        <motion.div
          key="pay-stats"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Revenue"
            value={payStats.totalRevenue}
            icon={Wallet}
            gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
            delay={0}
            prefix="$"
          />
          <StatCard
            title="Total Payments"
            value={payStats.totalPayments}
            icon={Receipt}
            gradientClass="bg-gradient-to-br from-blue-400 to-indigo-600"
            delay={0.05}
          />
          <StatCard
            title="Average Payment"
            value={payStats.averagePayment}
            icon={BarChart3}
            gradientClass="bg-gradient-to-br from-amber-400 to-orange-600"
            delay={0.1}
            prefix="$"
          />
          <StatCard
            title="Highest Payment"
            value={payStats.highestPayment}
            icon={TrendingUp}
            gradientClass="bg-gradient-to-br from-emerald-400 to-teal-600"
            delay={0.15}
            prefix="$"
          />
        </motion.div>
      )}

      {/* Tab content */}
      {activeTab === 'subscriptions' ? renderSubscriptions() : renderPayments()}

      {/* Toggle Confirm Dialog */}
      <ConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(open) => { if (!open) setToggleTarget(null); }}
        title={toggleTarget?.status === 'active' ? 'Deactivate Subscription' : 'Activate Subscription'}
        message={
          toggleTarget?.status === 'active'
            ? `Deactivate the subscription for ${toggleTarget?.userId?.fullName || 'this user'}? They will lose premium access.`
            : `Activate the subscription for ${toggleTarget?.userId?.fullName || 'this user'}? They will regain premium access.`
        }
        onConfirm={handleToggle}
        confirmText={toggleTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
        variant={toggleTarget?.status === 'active' ? 'warning' : 'info'}
      />
    </div>
  );
};

export default SubscriptionManagement;

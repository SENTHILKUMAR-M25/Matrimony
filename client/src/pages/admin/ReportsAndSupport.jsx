import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Flag, MessageSquare, RefreshCw, ShieldAlert, CheckCircle,
  XCircle, Search, Filter, Mail, User, CalendarDays
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const cn = (...inputs) => twMerge(clsx(inputs));

const REPORT_TYPES = ['Fake Profile', 'Abuse', 'Complaint', 'Other'];
const REPORT_STATUSES = ['Pending', 'Resolved', 'Dismissed'];
const MESSAGE_STATUSES = ['Unread', 'Read', 'Replied'];

const STATUS_BADGES = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Dismissed: 'bg-gray-100 text-gray-600 border-gray-200',
  Unread: 'bg-blue-100 text-blue-700 border-blue-200',
  Read: 'bg-gray-100 text-gray-600 border-gray-200',
  Replied: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const TABS = [
  { key: 'reports', label: 'Reports', icon: Flag },
  { key: 'messages', label: 'Contact Messages', icon: MessageSquare },
];

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

const ReportsAndSupport = () => {
  const [activeTab, setActiveTab] = useState('reports');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0, resolvedToday: 0, totalMessages: 0 });

  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);

  const [reportType, setReportType] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [messageStatus, setMessageStatus] = useState('');

  const [reportPage, setReportPage] = useState(1);
  const [reportTotalPages, setReportTotalPages] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotalPages, setMessageTotalPages] = useState(1);

  const [actionLoading, setActionLoading] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, action: null, title: '', message: '' });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get('/admin/reports/stats');
      setStats({
        totalReports: data.totalReports || 0,
        pendingReports: data.pendingReports || 0,
        resolvedToday: data.resolvedToday || 0,
        totalMessages: data.totalMessages || 0,
      });
    } catch {
      // stats optional
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: reportPage, limit: 10 };
      if (reportType) params.type = reportType;
      if (reportStatus) params.status = reportStatus;
      const { data } = await API.get('/admin/reports', { params });
      setReports(data.reports || data.data || []);
      setReportTotalPages(data.totalPages || data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [reportPage, reportType, reportStatus]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: messagePage, limit: 10 };
      if (messageStatus) params.status = messageStatus;
      const { data } = await API.get('/admin/contact-messages', { params });
      setMessages(data.messages || data.data || []);
      setMessageTotalPages(data.totalPages || data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [messagePage, messageStatus]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'reports') fetchReports();
  }, [fetchReports, activeTab]);

  useEffect(() => {
    if (activeTab === 'messages') fetchMessages();
  }, [fetchMessages, activeTab]);

  useEffect(() => {
    setReportPage(1);
  }, [reportType, reportStatus]);

  useEffect(() => {
    setMessagePage(1);
  }, [messageStatus]);

  const handleResolve = async () => {
    const { id, action } = confirmDialog;
    if (!id) return;
    setActionLoading((prev) => ({ ...prev, [`report-${id}`]: true }));
    try {
      await API.put(`/admin/reports/${id}/resolve`, { action });
      toast.success(action === 'resolve' ? 'Report resolved and user suspended' : 'Report dismissed');
      fetchReports();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update report');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`report-${id}`]: false }));
      setConfirmDialog({ open: false, id: null, action: null, title: '', message: '' });
    }
  };

  const handleMessageStatus = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [`msg-${id}`]: true }));
    try {
      await API.put(`/admin/contact-messages/${id}/status`, { status });
      toast.success(`Message marked as ${status}`);
      fetchMessages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update message status');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`msg-${id}`]: false }));
    }
  };

  const openConfirmResolve = (id) => {
    setConfirmDialog({
      open: true,
      id,
      action: 'resolve',
      title: 'Resolve & Suspend User',
      message: 'This will mark the report as resolved and suspend the reported user. Are you sure?',
    });
  };

  const openConfirmDismiss = (id) => {
    setConfirmDialog({
      open: true,
      id,
      action: 'dismiss',
      title: 'Dismiss Report',
      message: 'This will mark the report as dismissed. Are you sure?',
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Reports & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Manage user reports and contact messages.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={stats.totalReports} icon={Flag} gradientClass="bg-gradient-to-br from-pink-500 to-rose-600" delay={0} />
        <StatCard title="Pending Reports" value={stats.pendingReports} icon={ShieldAlert} gradientClass="bg-gradient-to-br from-amber-400 to-orange-500" delay={0.05} />
        <StatCard title="Resolved Today" value={stats.resolvedToday} icon={CheckCircle} gradientClass="bg-gradient-to-br from-emerald-400 to-teal-600" delay={0.1} />
        <StatCard title="Total Messages" value={stats.totalMessages} icon={MessageSquare} gradientClass="bg-gradient-to-br from-blue-400 to-indigo-600" delay={0.15} />
      </div>

      <div className="premium-card">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-2',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500',
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-300/40'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[160px] max-w-xs">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700 appearance-none"
                  >
                    <option value="">All Types</option>
                    {REPORT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 min-w-[140px] max-w-xs">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    value={reportStatus}
                    onChange={(e) => setReportStatus(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700 appearance-none"
                  >
                    <option value="">All Statuses</option>
                    {REPORT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <LoadingSkeleton type="table" count={1} />
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to Load Reports</h3>
                  <p className="text-sm text-gray-500 mb-4">{error}</p>
                  <button onClick={fetchReports} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 active:scale-95">
                    <RefreshCw size={16} />
                    Retry
                  </button>
                </div>
              ) : reports.length === 0 ? (
                <EmptyState icon={Flag} title="No Reports Found" description={reportType || reportStatus ? 'No reports match the selected filters.' : 'No reports have been submitted yet.'} />
              ) : (
                <>
                  <div className="overflow-x-auto -mx-5 sm:-mx-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">ID</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Reporter</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Reported User</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Type</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Description</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                          <th className="text-right px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {reports.map((report, idx) => (
                          <motion.tr
                            key={report._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03, duration: 0.3 }}
                            className="hover:bg-pink-50/40 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-3.5 text-gray-500 whitespace-nowrap font-mono text-xs">{report._id?.slice(-6) || 'N/A'}</td>
                            <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{report.reporterName || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                              <span className="text-gray-700">{report.reportedUserName || 'N/A'}</span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700">
                                {report.type || 'Other'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-gray-600 max-w-[200px] truncate">{report.description || '—'}</td>
                            <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                              <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_BADGES[report.status] || 'bg-gray-100 text-gray-600')}>
                                {report.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(report.createdAt)}</td>
                            <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                              {report.status === 'Pending' && (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => openConfirmResolve(report._id)}
                                    disabled={actionLoading[`report-${report._id}`]}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 active:scale-95 disabled:opacity-50"
                                  >
                                    <CheckCircle size={14} />
                                    Resolve & Suspend
                                  </button>
                                  <button
                                    onClick={() => openConfirmDismiss(report._id)}
                                    disabled={actionLoading[`report-${report._id}`]}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
                                  >
                                    <XCircle size={14} />
                                    Dismiss
                                  </button>
                                </div>
                              )}
                              {report.status === 'Resolved' && (
                                <span className="text-xs text-emerald-600 font-medium">Resolved</span>
                              )}
                              {report.status === 'Dismissed' && (
                                <span className="text-xs text-gray-500 font-medium">Dismissed</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={reportPage} totalPages={reportTotalPages} onPageChange={setReportPage} />
                </>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[160px] max-w-xs">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    value={messageStatus}
                    onChange={(e) => setMessageStatus(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700 appearance-none"
                  >
                    <option value="">All Statuses</option>
                    {MESSAGE_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <LoadingSkeleton type="table" count={1} />
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to Load Messages</h3>
                  <p className="text-sm text-gray-500 mb-4">{error}</p>
                  <button onClick={fetchMessages} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 active:scale-95">
                    <RefreshCw size={16} />
                    Retry
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <EmptyState icon={MessageSquare} title="No Messages Found" description={messageStatus ? `No ${messageStatus.toLowerCase()} messages.` : 'No contact messages have been submitted yet.'} />
              ) : (
                <>
                  <div className="overflow-x-auto -mx-5 sm:-mx-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Name</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Subject</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Message</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                          <th className="text-left px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                          <th className="text-right px-4 sm:px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {messages.map((msg, idx) => (
                          <motion.tr
                            key={msg._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03, duration: 0.3 }}
                            className="hover:bg-pink-50/40 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{msg.name || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">{msg.email || '—'}</td>
                            <td className="px-4 sm:px-6 py-3.5 text-gray-700 max-w-[100px] sm:max-w-[150px] truncate font-medium">{msg.subject || '—'}</td>
                            <td className="px-4 sm:px-6 py-3.5 text-gray-500 max-w-[120px] sm:max-w-[200px] truncate">{msg.message || '—'}</td>
                            <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                              <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_BADGES[msg.status] || 'bg-gray-100 text-gray-600')}>
                                {msg.status || 'Unread'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                            <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {msg.status === 'Unread' && (
                                  <button
                                    onClick={() => handleMessageStatus(msg._id, 'Read')}
                                    disabled={actionLoading[`msg-${msg._id}`]}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
                                  >
                                    Mark as Read
                                  </button>
                                )}
                                {msg.status !== 'Replied' && (
                                  <button
                                    onClick={() => handleMessageStatus(msg._id, 'Replied')}
                                    disabled={actionLoading[`msg-${msg._id}`]}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
                                  >
                                    Mark as Replied
                                  </button>
                                )}
                                {msg.status === 'Replied' && (
                                  <span className="text-xs text-emerald-600 font-medium">Replied</span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={messagePage} totalPages={messageTotalPages} onPageChange={setMessagePage} />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleResolve}
        confirmText={confirmDialog.action === 'resolve' ? 'Resolve & Suspend' : 'Dismiss'}
        variant={confirmDialog.action === 'resolve' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default ReportsAndSupport;

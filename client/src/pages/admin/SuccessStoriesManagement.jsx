import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Search, Filter, Clock, CheckCircle, XCircle,
  Eye, Trash2, Edit3, X, AlertCircle, RefreshCw, FileText,
  ExternalLink, MessageSquare, Image as ImageIcon,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const cn = (...inputs) => twMerge(clsx(inputs));

const TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const SuccessStoriesManagement = () => {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, approvedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [selectedStory, setSelectedStory] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectRemark, setRejectRemark] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get('/admin/success-stories/stats');
      setStats(data);
    } catch {}
  }, []);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 15 };
      if (activeTab) params.status = activeTab;
      if (search) params.search = search;
      const { data } = await API.get('/admin/success-stories', { params });
      setStories(data.stories || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, search]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchStories(); }, [fetchStories]);
  useEffect(() => { setCurrentPage(1); }, [activeTab, search]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

  const performAction = async (id, action, body = {}) => {
    setActionLoading((p) => ({ ...p, [`${id}-${action}`]: true }));
    try {
      let endpoint, msg;
      if (action === 'approve') { endpoint = `/admin/success-stories/${id}/approve`; msg = 'Story approved'; }
      else if (action === 'reject') { endpoint = `/admin/success-stories/${id}/reject`; msg = 'Story rejected'; }
      else if (action === 'delete') { endpoint = `/admin/success-stories/${id}`; msg = 'Story deleted'; }
      else return;
      await API.put(endpoint, body);
      toast.success(msg);
      fetchStories();
      fetchStats();
      if (detailOpen) setDetailOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action}`);
    } finally {
      setActionLoading((p) => ({ ...p, [`${id}-${action}`]: false }));
    }
  };

  const openDetail = (story) => { setSelectedStory(story); setDetailOpen(true); };
  const closeDetail = () => { setDetailOpen(false); setTimeout(() => setSelectedStory(null), 200); };

  const handleApprove = (id) => {
    setConfirmAction({ id, action: 'approve', title: 'Approve Story', message: 'Approve this success story? It will be published on the website.', confirmText: 'Approve', variant: 'info' });
    setConfirmOpen(true);
  };

  const handleRejectClick = (id) => { setRejectId(id); setRejectRemark(''); setRejectOpen(true); };
  const handleRejectConfirm = () => { performAction(rejectId, 'reject', { remark: rejectRemark.trim() || 'Does not meet guidelines' }); setRejectOpen(false); setRejectId(null); setRejectRemark(''); };

  const handleDeleteClick = (id) => {
    setConfirmAction({ id, action: 'delete', title: 'Delete Story', message: 'Permanently delete this story? This cannot be undone.', confirmText: 'Delete', variant: 'danger' });
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.action === 'approve') performAction(confirmAction.id, 'approve');
    else if (confirmAction.action === 'delete') performAction(confirmAction.id, 'delete');
    setConfirmAction(null);
  };

  const openEdit = (story) => {
    setEditStory(story);
    setEditForm({
      groom_name: story.groomName || '',
      bride_name: story.brideName || '',
      story_title: story.storyTitle || '',
      short_description: story.shortDescription || '',
      full_story: story.fullStory || '',
      wedding_location: story.weddingLocation || '',
      community: story.community || '',
      video_url: story.videoUrl || '',
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    setActionLoading((p) => ({ ...p, [`${editStory._id}-edit`]: true }));
    try {
      await API.put(`/admin/success-stories/${editStory._id}`, editForm);
      toast.success('Story updated');
      setEditOpen(false);
      fetchStories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setActionLoading((p) => ({ ...p, [`${editStory._id}-edit`]: false }));
    }
  };

  const formatDate = (d) => { if (!d) return '—'; try { return format(parseISO(d), 'MMM dd, yyyy'); } catch { return d; } };

  const getImageUrl = (filename) => filename ? `http://localhost:5000/uploads/${filename}` : null;

  return (
    <div className="space-y-6">
      <ConfirmDialog open={confirmOpen} onOpenChange={(o) => { setConfirmOpen(o); if (!o) setConfirmAction(null); }}
        title={confirmAction?.title} message={confirmAction?.message} confirmText={confirmAction?.confirmText}
        variant={confirmAction?.variant} onConfirm={handleConfirm} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Success Stories</h1>
        <p className="text-sm text-gray-500 mt-1.5">Manage user-submitted success stories. Approve, reject, or edit stories.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} gradientClass="bg-gradient-to-br from-amber-400 to-orange-500" delay={0} />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle} gradientClass="bg-gradient-to-br from-green-400 to-emerald-500" delay={0.1} />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircle} gradientClass="bg-gradient-to-br from-red-400 to-rose-500" delay={0.2} />
        <StatCard title="Approved Today" value={stats.approvedToday} icon={Heart} gradientClass="bg-gradient-to-br from-pink-400 to-rose-500" delay={0.3} />
      </div>

      <div className="premium-card">
        <div className="border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="flex overflow-x-auto gap-1">
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn('px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap',
                    activeTab === tab.key ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-300/40'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700')}>
                  {tab.label}
                  {tab.key && stats[tab.key] !== undefined && stats[tab.key] > 0 && (
                    <span className={cn('ml-2 px-1.5 py-0.5 text-xs rounded-full', activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500')}>{stats[tab.key]}</span>
                  )}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search couples..."
                  className="w-48 lg:w-64 pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
              </div>
              <button type="submit" className="p-2 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors"><Search size={16} /></button>
              {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>}
            </form>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loading ? (
            <LoadingSkeleton type="card" count={5} />
          ) : stories.length === 0 ? (
            <EmptyState icon={FileText} title="No Stories Found"
              description={search ? 'Try a different search term.' : 'No success stories yet.'} />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Showing <span className="font-medium text-gray-700">{stories.length}</span> of <span className="font-medium text-gray-700">{total}</span> stories</p>
              {stories.map((story, i) => (
                <motion.div key={story._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition-all group cursor-pointer"
                  onClick={() => openDetail(story)}>
                  {story.couplePhoto ? (
                    <img src={getImageUrl(story.couplePhoto)} alt="" className="w-12 h-12 rounded-lg object-cover ring-2 ring-pink-100 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 ring-2 ring-pink-100">
                      <Heart size={16} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-pink-700 transition-colors">{story.storyTitle}</h3>
                        <p className="text-xs text-gray-500">{story.groomName} & {story.brideName}</p>
                      </div>
                      <span className={cn('px-2 py-0.5 rounded-lg text-xs font-medium border shrink-0', STATUS_STYLES[story.status])}>
                        {story.status?.charAt(0).toUpperCase() + story.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{story.shortDescription}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                      <span>{formatDate(story.submittedAt)}</span>
                      {story.weddingDate && <span>Wedding: {story.weddingDate}</span>}
                      {story.community && <span>{story.community}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    {story.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(story._id)} disabled={actionLoading[`${story._id}-approve`]}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                          {actionLoading[`${story._id}-approve`] ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        </button>
                        <button onClick={() => handleRejectClick(story._id)} disabled={actionLoading[`${story._id}-reject`]}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                          {actionLoading[`${story._id}-reject`] ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
                        </button>
                      </>
                    )}
                    <button onClick={() => openEdit(story)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit3 size={14} /></button>
                    <button onClick={() => handleDeleteClick(story._id)} disabled={actionLoading[`${story._id}-delete`]}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      {actionLoading[`${story._id}-delete`] ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </motion.div>
              ))}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>{detailOpen && selectedStory && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm py-8 px-4"
          onClick={closeDetail}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto">
            <div className="relative">
              <div className="h-36 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />
              <button onClick={closeDetail} className="absolute top-4 right-4 p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full text-white transition-colors"><X size={18} /></button>
              <div className="absolute -bottom-12 left-6">
                {selectedStory.couplePhoto ? (
                  <img src={getImageUrl(selectedStory.couplePhoto)} alt="" className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                    <Heart size={28} className="text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="pt-16 px-6 pb-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStory.storyTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedStory.groomName} & {selectedStory.brideName}</p>
                </div>
                <span className={cn('px-3 py-1 rounded-lg text-xs font-semibold border', STATUS_STYLES[selectedStory.status])}>
                  {selectedStory.status?.charAt(0).toUpperCase() + selectedStory.status?.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><span className="text-xs font-medium text-gray-400 uppercase">Wedding Date</span><p className="text-gray-700 mt-0.5">{selectedStory.weddingDate || '—'}</p></div>
                <div><span className="text-xs font-medium text-gray-400 uppercase">Location</span><p className="text-gray-700 mt-0.5">{selectedStory.weddingLocation || '—'}</p></div>
                <div><span className="text-xs font-medium text-gray-400 uppercase">Community</span><p className="text-gray-700 mt-0.5">{selectedStory.community || '—'}</p></div>
                <div><span className="text-xs font-medium text-gray-400 uppercase">Submitted</span><p className="text-gray-700 mt-0.5">{formatDate(selectedStory.submittedAt)}</p></div>
              </div>

              <div><h4 className="text-sm font-semibold text-gray-900 mb-2">Short Description</h4><p className="text-sm text-gray-600">{selectedStory.shortDescription}</p></div>
              <div><h4 className="text-sm font-semibold text-gray-900 mb-2">Full Story</h4><p className="text-sm text-gray-600 whitespace-pre-line">{selectedStory.fullStory}</p></div>

              {selectedStory.weddingGallery?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Wedding Gallery ({selectedStory.weddingGallery.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {selectedStory.weddingGallery.map((f, i) => (
                      <img key={i} src={getImageUrl(f)} alt="" className="w-full h-20 rounded-lg object-cover" />
                    ))}
                  </div>
                </div>
              )}

              {selectedStory.videoUrl && (
                <div><h4 className="text-sm font-semibold text-gray-900 mb-2">Video</h4>
                  <a href={selectedStory.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                    <ExternalLink size={14} /> Watch Video
                  </a>
                </div>
              )}

              {selectedStory.rejectionRemark && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl"><p className="text-xs text-red-700"><span className="font-medium">Rejection Reason:</span> {selectedStory.rejectionRemark}</p></div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {selectedStory.status === 'pending' && (
                  <>
                    <button onClick={() => { handleApprove(selectedStory._id); closeDetail(); }} disabled={actionLoading[`${selectedStory._id}-approve`]}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-green-300/40">
                      {actionLoading[`${selectedStory._id}-approve`] ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />} Approve
                    </button>
                    <button onClick={() => { handleRejectClick(selectedStory._id); closeDetail(); }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-rose-700 transition-all active:scale-95 shadow-sm shadow-red-300/40">
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <AnimatePresence>{rejectOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setRejectOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><AlertCircle size={20} className="text-red-600" /></div>
              <div className="flex-1"><h3 className="text-lg font-semibold text-gray-900">Reject Story</h3><p className="text-sm text-gray-600 mt-1">Provide a reason for rejection.</p></div>
              <button onClick={() => setRejectOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <textarea value={rejectRemark} onChange={(e) => setRejectRemark(e.target.value)} placeholder="Enter rejection reason..." rows={4}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none" autoFocus />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setRejectOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleRejectConfirm} disabled={!rejectRemark.trim()} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50">
                Reject Story
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <AnimatePresence>{editOpen && editStory && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm py-8 px-4" onClick={() => setEditOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Story</h3>
              <button onClick={() => setEditOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Groom Name</label>
                  <input value={editForm.groom_name} onChange={(e) => setEditForm((p) => ({ ...p, groom_name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Bride Name</label>
                  <input value={editForm.bride_name} onChange={(e) => setEditForm((p) => ({ ...p, bride_name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Story Title</label>
                <input value={editForm.story_title} onChange={(e) => setEditForm((p) => ({ ...p, story_title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Short Description</label>
                <textarea value={editForm.short_description} onChange={(e) => setEditForm((p) => ({ ...p, short_description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Full Story</label>
                <textarea value={editForm.full_story} onChange={(e) => setEditForm((p) => ({ ...p, full_story: e.target.value }))} rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Wedding Location</label>
                  <input value={editForm.wedding_location} onChange={(e) => setEditForm((p) => ({ ...p, wedding_location: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Community</label>
                  <input value={editForm.community} onChange={(e) => setEditForm((p) => ({ ...p, community: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" /></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleEditSave} disabled={actionLoading[`${editStory._id}-edit`]}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50">
                {actionLoading[`${editStory._id}-edit`] ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />} Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

export default SuccessStoriesManagement;

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  X, Users, Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';

const cn = (...inputs) => twMerge(clsx(inputs));

const initialForm = { name: '', description: '' };

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteDialog, setDeleteDialog] = useState({ open: false, community: null });

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/admin/communities');
      setCommunities(res.data.data || res.data.communities || res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load communities';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (community) => {
    setEditing(community);
    setForm({ name: community.name, description: community.description || '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Community name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await API.put(`/admin/communities/${editing._id}`, {
          name: form.name.trim(),
          description: form.description.trim(),
        });
        toast.success('Community updated successfully');
      } else {
        await API.post('/admin/communities', {
          name: form.name.trim(),
          description: form.description.trim(),
        });
        toast.success('Community created successfully');
      }
      setModalOpen(false);
      fetchCommunities();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const community = deleteDialog.community;
    if (!community) return;
    try {
      await API.delete(`/admin/communities/${community._id}`);
      toast.success('Community deleted successfully');
      fetchCommunities();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete community';
      toast.error(msg);
    }
  };

  const handleToggle = async (community) => {
    try {
      const res = await API.put(`/admin/communities/${community._id}/toggle`);
      const updated = res.data.data || res.data.community || res.data;
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === community._id
            ? { ...c, isEnabled: updated.isEnabled ?? !c.isEnabled }
            : c
        )
      );
      const status = updated.isEnabled ?? !community.isEnabled;
      toast.success(`Community ${status ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to toggle community';
      toast.error(msg);
    }
  };

  const formatCount = (count) => {
    if (count == null) return '0';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="animate-pulse bg-gray-200 rounded-xl h-8 w-64 mb-2" />
          <div className="animate-pulse bg-gray-200 rounded-xl h-4 w-96" />
        </div>
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  if (error && communities.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your platform communities</p>
          </div>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
            <Plus size={18} /> Add Community
          </button>
        </div>
        <div className="premium-card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Communities</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={fetchCommunities} className="btn-primary text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {communities.length} {communities.length === 1 ? 'community' : 'communities'} on the platform
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 w-fit">
          <Plus size={18} /> Add Community
        </button>
      </motion.div>

      {communities.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Communities Yet"
          description="Create your first community to organize members into groups."
          action={{ label: 'Add Community', onClick: openAdd }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {communities.map((community, index) => (
              <motion.div
                key={community._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="premium-card p-5 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
                      <Building2 size={20} className="text-pink-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{community.name}</h3>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                          community.isEnabled
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {community.isEnabled ? (
                          <><ToggleRight size={12} /> Enabled</>
                        ) : (
                          <><ToggleLeft size={12} /> Disabled</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                  {community.description || 'No description'}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users size={16} className="text-pink-400" />
                  <span className="font-medium text-gray-700">
                    {formatCount(community.memberCount ?? community.totalMembers ?? 0)}
                  </span>
                  <span className="text-gray-400">members</span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(community)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleToggle(community)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors',
                      community.isEnabled
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                        : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                    )}
                  >
                    {community.isEnabled ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                    {community.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, community })}
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                    {editing ? <Pencil size={20} className="text-pink-600" /> : <Plus size={20} className="text-pink-600" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editing ? 'Edit Community' : 'Add Community'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {editing ? 'Update the community details below' : 'Fill in the details to create a new community'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Community Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Hindu Matrimony, Christian Community"
                    className="input-pink w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of the community..."
                    rows={3}
                    className="input-pink w-full resize-none"
                  />
                </div>

                {formError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"
                  >
                    {formError}
                  </motion.p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg hover:shadow-pink-300/50 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        {editing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editing ? 'Update Community' : 'Create Community'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Community"
        message={`Are you sure you want to delete "${deleteDialog.community?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default CommunityManagement;

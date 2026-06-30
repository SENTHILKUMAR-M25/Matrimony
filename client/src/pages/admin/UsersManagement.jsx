import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search, Users, UserCheck, UserX, ShieldCheck,
  Mail, MapPin, Calendar, FilterX, Eye, Edit3,
  Shield, Trash2, AlertTriangle, ChevronDown,
  ChevronUp, X, Ban, User, Verified,
  Fingerprint, VenetianMask, Loader2,
} from 'lucide-react';
import API from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';

const SORT_FIELDS = ['name', 'email', 'age', 'created_at'];

const GenderIcon = ({ gender }) => {
  if (!gender) return <User size={14} className="text-gray-400" />;
  const isMale = String(gender).toLowerCase() === 'male';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>
      {isMale ? <VenetianMask size={14} /> : <Fingerprint size={14} />}
      <span>{isMale ? 'Male' : 'Female'}</span>
    </span>
  );
};

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    premium: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200',
    free: 'bg-gray-100 text-gray-600 border border-gray-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    incomplete: 'bg-amber-50 text-amber-700 border border-amber-200',
    verified: 'bg-blue-50 text-blue-700 border border-blue-200',
    unverified: 'bg-gray-100 text-gray-500 border border-gray-200',
    suspended: 'bg-red-50 text-red-700 border border-red-200',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
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

const SortIcon = ({ sortField, sortOrder, field }) => {
  if (sortField !== field) return <ChevronDown size={12} className="text-gray-300" />;
  return sortOrder === 'asc' ? (
    <ChevronUp size={12} className="text-pink-600" />
  ) : (
    <ChevronDown size={12} className="text-pink-600" />
  );
};

const thClass = 'px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-pink-600 transition-colors';
const tdClass = 'px-3 py-3.5 text-sm text-gray-700';

const UsersManagement = () => {
  const searchTimer = useRef(null);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, verified: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [gender, setGender] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [religion, setReligion] = useState('');
  const [membership, setMembership] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [verification, setVerification] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', mobile: '', gender: '', membership: '' });
  const [editSaving, setEditSaving] = useState(false);

  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [actionLoading, setActionLoading] = useState({});

  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  const fetchUsersRef = useRef();

  useEffect(() => {
    fetchUsersRef.current = () => {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 15,
        sort: sortField,
        order: sortOrder,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (gender) params.gender = gender;
      if (ageMin) params.ageMin = ageMin;
      if (ageMax) params.ageMax = ageMax;
      if (religion) params.religion = religion;
      if (membership) params.membership = membership;
      if (profileStatus) params.profileStatus = profileStatus;
      if (verification) params.verification = verification;

      API.get('/admin/users', { params })
        .then((res) => {
          const data = res.data;
          setUsers(data.users || []);
          setStats({
            total: data.stats?.total ?? data.users?.length ?? 0,
            active: data.stats?.active ?? 0,
            suspended: data.stats?.suspended ?? 0,
            verified: data.stats?.verified ?? 0,
          });
          setTotalPages(data.pagination?.totalPages || data.totalPages || 1);
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Failed to load users';
          setError(msg);
          toast.error(msg);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchUsersRef.current();
  }, [page, debouncedSearch, gender, ageMin, ageMax, religion, membership, profileStatus, verification, sortField, sortOrder]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setGender('');
    setAgeMin('');
    setAgeMax('');
    setReligion('');
    setMembership('');
    setProfileStatus('');
    setVerification('');
    setPage(1);
  };

  const hasFilters = search || gender || ageMin || ageMax || religion || membership || profileStatus || verification;

  const handleSort = (field) => {
    if (!SORT_FIELDS.includes(field)) return;
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const refreshUsers = () => fetchUsersRef.current?.();

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      mobile: user.mobile || '',
      gender: user.gender || '',
      membership: user.subscription_type || 'free',
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setEditSaving(true);
    try {
      await API.put(`/admin/users/${editingUser._id}`, editForm);
      toast.success('User updated successfully');
      setEditModalOpen(false);
      setEditingUser(null);
      refreshUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setEditSaving(false);
    }
  };

  const toggleVerify = async (user) => {
    setActionLoading((prev) => ({ ...prev, [`verify-${user._id}`]: true }));
    try {
      const res = await API.put(`/admin/users/${user._id}/verify`);
      const newStatus = res.data?.isVerified ?? !user.isVerified;
      toast.success(newStatus ? 'User verified successfully' : 'User verification removed');
      refreshUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle verification');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`verify-${user._id}`]: false }));
    }
  };

  const toggleSuspend = async () => {
    if (!suspendTarget) return;
    const user = suspendTarget;
    setSuspendTarget(null);
    setActionLoading((prev) => ({ ...prev, [`suspend-${user._id}`]: true }));
    try {
      await API.put(`/admin/users/${user._id}/suspend`);
      toast.success(user.isSuspended ? 'User unsuspended' : 'User suspended');
      refreshUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle suspension');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`suspend-${user._id}`]: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const user = deleteTarget;
    setDeleteTarget(null);
    setActionLoading((prev) => ({ ...prev, [`delete-${user._id}`]: true }));
    try {
      await API.delete(`/admin/users/${user._id}`);
      toast.success('User deleted successfully');
      refreshUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`delete-${user._id}`]: false }));
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View, verify, suspend, and manage all registered users</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
          delay={0}
        />
        <StatCard
          title="Active Profiles"
          value={stats.active}
          icon={UserCheck}
          gradientClass="bg-gradient-to-br from-emerald-400 to-teal-600"
          delay={0.05}
        />
        <StatCard
          title="Suspended"
          value={stats.suspended}
          icon={UserX}
          gradientClass="bg-gradient-to-br from-red-400 to-red-600"
          delay={0.1}
        />
        <StatCard
          title="Verified"
          value={stats.verified}
          icon={ShieldCheck}
          gradientClass="bg-gradient-to-br from-blue-400 to-indigo-600"
          delay={0.15}
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {/* Search */}
          <div className="relative xl:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, mobile..."
              aria-label="Search users"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none placeholder-gray-400"
            />
          </div>

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => { setGender(e.target.value); setPage(1); }}
            aria-label="Filter by gender"
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Age Range */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={ageMin}
              onChange={(e) => { setAgeMin(e.target.value); setPage(1); }}
              placeholder="Min age"
              aria-label="Minimum age"
              min={18}
              max={99}
              className="w-full px-2.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none placeholder-gray-400"
            />
            <span className="text-gray-400 text-xs">-</span>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => { setAgeMax(e.target.value); setPage(1); }}
              placeholder="Max age"
              aria-label="Maximum age"
              min={18}
              max={99}
              className="w-full px-2.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none placeholder-gray-400"
            />
          </div>

          {/* Religion */}
          <select
            value={religion}
            onChange={(e) => { setReligion(e.target.value); setPage(1); }}
            aria-label="Filter by religion"
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
          >
            <option value="">All Religions</option>
            {religions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Membership */}
          <select
            value={membership}
            onChange={(e) => { setMembership(e.target.value); setPage(1); }}
            aria-label="Filter by membership"
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
          >
            <option value="">All Memberships</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>

          {/* Profile Status */}
          <select
            value={profileStatus}
            onChange={(e) => { setProfileStatus(e.target.value); setPage(1); }}
            aria-label="Filter by profile status"
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
          >
            <option value="">All Profiles</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>

          {/* Verification */}
          <select
            value={verification}
            onChange={(e) => { setVerification(e.target.value); setPage(1); }}
            aria-label="Filter by verification status"
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 bg-gray-50 hover:bg-white transition-colors outline-none text-gray-700"
          >
            <option value="">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FilterX size={14} />
              Clear Filters
            </button>
            <span className="text-xs text-gray-400">
              Filters active
            </span>
          </div>
        )}
      </motion.div>

      {/* Users Table */}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load users</h3>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              onClick={refreshUsers}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-pink-300/40 transition-all"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description={hasFilters ? 'Try adjusting your search filters to find what you\'re looking for.' : 'No users have registered yet.'}
            action={hasFilters ? { label: 'Clear Filters', onClick: clearFilters } : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className={thClass} onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      User <SortIcon sortField={sortField} sortOrder={sortOrder} field="name" />
                    </div>
                  </th>
                  <th className={thClass} onClick={() => handleSort('email')}>
                    <div className="flex items-center gap-1">
                      Email <SortIcon sortField={sortField} sortOrder={sortOrder} field="email" />
                    </div>
                  </th>
                  <th className={`${thClass} cursor-default`}>Gender</th>
                  <th className={thClass} onClick={() => handleSort('age')}>
                    <div className="flex items-center gap-1">
                      Age <SortIcon sortField={sortField} sortOrder={sortOrder} field="age" />
                    </div>
                  </th>
                  <th className={`${thClass} cursor-default`}>Religion/Caste</th>
                  <th className={`${thClass} cursor-default`}>Location</th>
                  <th className={`${thClass} cursor-default`}>Membership</th>
                  <th className={`${thClass} cursor-default`}>Profile</th>
                  <th className={`${thClass} cursor-default`}>Verified</th>
                  <th className={`${thClass} cursor-default`}>Suspended</th>
                  <th className={`${thClass} cursor-default text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    className="hover:bg-pink-50/30 transition-colors group"
                  >
                    {/* Name + Avatar */}
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            getInitials(user.fullName)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[160px]">{user.fullName || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 truncate max-w-[100px] sm:max-w-[160px]">{user.email || '—'}</span>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className={tdClass}>
                      <GenderIcon gender={user.gender} />
                    </td>

                    {/* Age */}
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{user.age ?? '—'}</span>
                      </div>
                    </td>

                    {/* Religion/Caste */}
                    <td className={tdClass}>
                      <span className="text-gray-700">
                        {user.religion || '—'}{user.caste ? ` / ${user.caste}` : ''}
                      </span>
                    </td>

                    {/* Location */}
                    <td className={tdClass}>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[80px] sm:max-w-[120px]">
                          {[user.city, user.state].filter(Boolean).join(', ') || '—'}
                        </span>
                      </div>
                    </td>

                    {/* Membership */}
                    <td className={tdClass}>
                      <Badge variant={user.subscription_type === 'premium' ? 'premium' : 'free'}>
                        {user.subscription_type === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                    </td>

                    {/* Profile Status */}
                    <td className={tdClass}>
                      <Badge variant={user.profileCompleted ? 'completed' : 'incomplete'}>
                        {user.profileCompleted ? 'Completed' : 'Incomplete'}
                      </Badge>
                    </td>

                    {/* Verified */}
                    <td className={tdClass}>
                      <Badge variant={user.isVerified ? 'verified' : 'unverified'}>
                        {user.isVerified ? (
                          <><Verified size={11} className="text-blue-600" /> Verified</>
                        ) : (
                          'Unverified'
                        )}
                      </Badge>
                    </td>

                    {/* Suspended */}
                    <td className={tdClass}>
                      <Badge variant={user.isSuspended ? 'suspended' : 'active'}>
                        {user.isSuspended ? 'Yes' : 'No'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openViewModal(user)}
                          aria-label={`View ${user.fullName}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          aria-label={`Edit ${user.fullName}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => toggleVerify(user)}
                          disabled={actionLoading[`verify-${user._id}`]}
                          aria-label={user.isVerified ? 'Remove verification' : 'Verify user'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isVerified
                              ? 'text-blue-600 hover:bg-blue-50'
                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                          } disabled:opacity-50`}
                          title={user.isVerified ? 'Remove Verification' : 'Verify'}
                        >
                          {actionLoading[`verify-${user._id}`] ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Shield size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setSuspendTarget(user)}
                          disabled={actionLoading[`suspend-${user._id}`]}
                          aria-label={user.isSuspended ? 'Unsuspend user' : 'Suspend user'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isSuspended
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          } disabled:opacity-50`}
                          title={user.isSuspended ? 'Unsuspend' : 'Suspend'}
                        >
                          {actionLoading[`suspend-${user._id}`] ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : user.isSuspended ? (
                            <UserCheck size={16} />
                          ) : (
                            <Ban size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          disabled={actionLoading[`delete-${user._id}`]}
                          aria-label={`Delete ${user.fullName}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {actionLoading[`delete-${user._id}`] ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && users.length > 0 && (
          <div className="border-t border-gray-100 px-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </motion.div>

      {/* ─── View Detail Modal ─── */}
      <AnimatePresence>
        {viewModalOpen && selectedUser && (
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
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-md">
                    {selectedUser.profilePhoto ? (
                      <img src={selectedUser.profilePhoto} alt="" className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      getInitials(selectedUser.fullName)
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.fullName || 'N/A'}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Mobile" value={selectedUser.mobile} />
                  <DetailField label="Gender" value={selectedUser.gender} />
                  <DetailField label="Age" value={selectedUser.age} />
                  <DetailField label="Religion" value={selectedUser.religion} />
                  <DetailField label="Caste" value={selectedUser.caste} />
                  <DetailField label="Location" value={[selectedUser.city, selectedUser.state, selectedUser.country].filter(Boolean).join(', ')} />
                  <DetailField label="Membership" value={selectedUser.subscription_type} />
                  <DetailField label="Profile Status" value={selectedUser.profileCompleted ? 'Completed' : 'Incomplete'} />
                  <DetailField label="Verified" value={selectedUser.isVerified ? 'Yes' : 'No'} />
                  <DetailField
                    label="Joined"
                    value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '—'}
                  />
                </div>
              </div>
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-end rounded-b-2xl">
                <button
                  onClick={() => { setViewModalOpen(false); openEditModal(selectedUser); }}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-pink-300/40 transition-all"
                >
                  Edit User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Edit Modal ─── */}
      <AnimatePresence>
        {editModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <EditField label="Full Name" value={editForm.fullName} onChange={(v) => setEditForm((f) => ({ ...f, fullName: v }))} />
                <EditField label="Email" value={editForm.email} onChange={(v) => setEditForm((f) => ({ ...f, email: v }))} type="email" />
                <EditField label="Mobile" value={editForm.mobile} onChange={(v) => setEditForm((f) => ({ ...f, mobile: v }))} type="tel" />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 outline-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Membership</label>
                  <select
                    value={editForm.membership}
                    onChange={(e) => setEditForm((f) => ({ ...f, membership: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 outline-none bg-white"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving}
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-pink-300/40 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {editSaving && <Loader2 size={15} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Suspend Confirm Dialog ─── */}
      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => { if (!open) setSuspendTarget(null); }}
        title={suspendTarget?.isSuspended ? 'Unsuspend User' : 'Suspend User'}
        message={
          suspendTarget?.isSuspended
            ? `Reactivate ${suspendTarget?.fullName || 'this user'}'s account? They will regain full access to the platform.`
            : `Are you sure you want to suspend ${suspendTarget?.fullName || 'this user'}? They will lose access to their account until unsuspended.`
        }
        onConfirm={toggleSuspend}
        confirmText={suspendTarget?.isSuspended ? 'Unsuspend' : 'Suspend'}
        variant={suspendTarget?.isSuspended ? 'info' : 'danger'}
      />

      {/* ─── Delete Confirm Dialog ─── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete User"
        message={`Permanently delete ${deleteTarget?.fullName || 'this user'}'s account? All their data will be removed. This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
  </div>
);

const EditField = ({ label, value, onChange, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 outline-none bg-white transition-colors"
    />
  </div>
);

export default UsersManagement;

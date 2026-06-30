import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Lock, LogOut, Save, RefreshCw, ShieldAlert,
  Eye, EyeOff, CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';

const cn = (...inputs) => twMerge(clsx(inputs));

const getInitials = (name) => {
  if (!name) return 'A';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/admin/profile');
      const p = data.admin || data.user || data.data || data;
      setProfile({
        first_name: p.first_name || p.firstName || '',
        last_name: p.last_name || p.lastName || '',
        email: p.email || '',
        mobile: p.mobile || p.phone || '',
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      await API.put('/admin/profile', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        mobile: profile.mobile,
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError('');

    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordSaving(true);
    try {
      await API.put('/admin/profile/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogoutAll = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-8 w-56 mb-2" />
          <div className="animate-pulse bg-gray-200 rounded-xl h-4 w-72" />
        </div>
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Admin Profile</h1>
        <div className="premium-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Profile</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={fetchProfile} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium text-sm rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const adminName = `${profile.first_name} ${profile.last_name}`.trim() || user?.fullName || 'Admin';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile, password, and account security.</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="premium-card p-5 sm:p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            {getInitials(adminName)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{adminName}</h2>
            <p className="text-sm text-gray-500">{profile.email || 'Admin'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={profile.first_name}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              className="input-pink w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={profile.last_name}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              className="input-pink w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="input-pink w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="tel"
              value={profile.mobile}
              onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
              className="input-pink w-full"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-pink-300/40"
          >
            {profileSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Change Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card p-5 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <Lock size={20} className="text-pink-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500">Update your account password.</p>
          </div>
        </div>

        <div className="space-y-4">
          {['current_password', 'new_password', 'confirm_password'].map((field) => {
            const labels = {
              current_password: 'Current Password',
              new_password: 'New Password',
              confirm_password: 'Confirm New Password',
            };
            const showKey = field.replace('_password', '');
            return (
              <div key={field} className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">{labels[field]}</label>
                <div className="relative">
                  <input
                    type={showPassword[showKey] ? 'text' : 'password'}
                    value={passwordForm[field]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                    placeholder="••••••••"
                    autoComplete={field === 'current_password' ? 'current-password' : 'new-password'}
                    className="input-pink w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => ({ ...prev, [showKey]: !prev[showKey] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            );
          })}

          {passwordError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"
            >
              {passwordError}
            </motion.p>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handlePasswordSave}
              disabled={passwordSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-pink-300/40"
            >
              {passwordSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="premium-card p-5 sm:p-6 border-red-200 bg-gradient-to-br from-red-50 to-white"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <LogOut size={20} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">Logout from all devices</h2>
            <p className="text-sm text-gray-600 mt-1">
              This will sign you out of all active sessions across all devices. You will need to sign in again.
            </p>
            <button
              onClick={handleLogoutAll}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-95 shadow-sm shadow-red-300/40"
            >
              <LogOut size={16} />
              Logout from all devices
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfile;

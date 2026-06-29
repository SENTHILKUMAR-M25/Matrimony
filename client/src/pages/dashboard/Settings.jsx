import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Shield, Bell, Eye, Lock,
  ChevronRight, Moon, Globe, Trash2, LogOut,
  Crown, Check, X, Save, Loader, AlertTriangle,
  CreditCard, CircleUser,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import API from '../../api/axios';

const SectionCard = ({ icon: Icon, title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600 flex-shrink-0">
        <Icon size={18} className="sm:w-[20px] sm:h-[20px]" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-gray-900">{title}</h3>
        {description && <p className="text-[13px] sm:text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

const Toggle = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-50 last:border-0 gap-3">
    <div className="min-w-0 flex-1">
      <p className="text-[13px] sm:text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 sm:w-11 h-5 sm:h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer active:scale-95 ${
        enabled ? 'bg-pink-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-[18px] sm:translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const { user, token, logout } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Notification toggles (local state)
  const [notifications, setNotifications] = useState({
    interestReceived: true,
    interestAccepted: true,
    profileViews: false,
    matchSuggestions: true,
    emailDigest: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showOnlineStatus: true,
    showLastSeen: false,
  });

  const handleSaveNotifications = async () => {
    setSaving(true);
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      window.location.href = '/signin';
    }
  };

  const currentToken = token || localStorage.getItem('token');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-5 sm:space-y-6 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5 sm:mt-1">Manage your account preferences and privacy.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <SectionCard icon={CircleUser} title="Account Information" description="Your account details and membership status.">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50">
              <Mail size={14} className="sm:w-[16px] sm:h-[16px] text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">Email</p>
                <p className="text-[13px] sm:text-sm font-medium text-gray-800 truncate">{user?.email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50">
              <Phone size={14} className="sm:w-[16px] sm:h-[16px] text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">Mobile</p>
                <p className="text-[13px] sm:text-sm font-medium text-gray-800">{user?.mobile || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <Crown size={14} className="sm:w-[16px] sm:h-[16px] text-pink-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">Membership</p>
                  <p className="text-[13px] sm:text-sm font-bold text-pink-600 capitalize truncate">{user?.subscription_type || 'Free'}</p>
                </div>
              </div>
              {user?.subscription_type !== 'premium' && (
                <a
                  href="/dashboard/subscription"
                  className="shrink-0 text-[10px] sm:text-xs font-bold text-pink-600 hover:underline flex items-center gap-0.5 sm:gap-1"
                >
                  Upgrade <ChevronRight size={10} className="sm:w-[12px] sm:h-[12px]" />
                </a>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Notification Preferences */}
        <SectionCard icon={Bell} title="Notification Preferences" description="Control which updates you receive.">
          <div className="divide-y divide-gray-50">
            <Toggle
              label="Interest Requests"
              description="When someone sends you an interest"
              enabled={notifications.interestReceived}
              onChange={(v) => setNotifications((p) => ({ ...p, interestReceived: v }))}
            />
            <Toggle
              label="Interest Accepted"
              description="When your interest is accepted"
              enabled={notifications.interestAccepted}
              onChange={(v) => setNotifications((p) => ({ ...p, interestAccepted: v }))}
            />
            <Toggle
              label="Profile Views"
              description="When someone views your profile"
              enabled={notifications.profileViews}
              onChange={(v) => setNotifications((p) => ({ ...p, profileViews: v }))}
            />
            <Toggle
              label="Match Suggestions"
              description="Daily match recommendations"
              enabled={notifications.matchSuggestions}
              onChange={(v) => setNotifications((p) => ({ ...p, matchSuggestions: v }))}
            />
            <Toggle
              label="Email Digest"
              description="Weekly summary via email"
              enabled={notifications.emailDigest}
              onChange={(v) => setNotifications((p) => ({ ...p, emailDigest: v }))}
            />
          </div>
          <button
            onClick={handleSaveNotifications}
            disabled={saving}
            className="mt-3 sm:mt-4 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[13px] sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.97]"
          >
            {saving ? <Loader size={13} className="sm:w-[14px] sm:h-[14px] animate-spin" /> : saved ? <Check size={13} className="sm:w-[14px] sm:h-[14px]" /> : <Save size={13} className="sm:w-[14px] sm:h-[14px]" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </SectionCard>

        {/* Privacy Settings */}
        <SectionCard icon={Eye} title="Privacy Settings" description="Control your profile visibility and online presence.">
          <div className="divide-y divide-gray-50">
            <Toggle
              label="Profile Visibility"
              description="Show your profile in search results and matches"
              enabled={privacy.profileVisibility}
              onChange={(v) => setPrivacy((p) => ({ ...p, profileVisibility: v }))}
            />
            <Toggle
              label="Online Status"
              description="Show when you are active"
              enabled={privacy.showOnlineStatus}
              onChange={(v) => setPrivacy((p) => ({ ...p, showOnlineStatus: v }))}
            />
            <Toggle
              label="Last Seen"
              description="Show your last active timestamp"
              enabled={privacy.showLastSeen}
              onChange={(v) => setPrivacy((p) => ({ ...p, showLastSeen: v }))}
            />
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard icon={AlertTriangle} title="Danger Zone" description="Irreversible account actions.">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] sm:text-sm font-bold text-red-800">Delete Account</p>
                <p className="text-[11px] sm:text-xs text-red-600 mt-0.5">Permanently remove your account and all data.</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                <Trash2 size={12} className="sm:w-[14px] sm:h-[14px]" />
                Delete
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] sm:text-sm font-bold text-gray-800">Sign Out</p>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Log out of your account on this device.</p>
              </div>
              <button
                onClick={() => { logout(); window.location.href = '/signin'; }}
                className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 hover:bg-gray-800 text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                <LogOut size={12} className="sm:w-[14px] sm:h-[14px]" />
                Sign Out
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  );
};

export default Settings;

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings2, Palette, Phone, Share2, CreditCard, Home, Mail,
  Save, RefreshCw, ShieldAlert
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';

const cn = (...inputs) => twMerge(clsx(inputs));

const TABS = [
  { key: 'general', label: 'General', icon: Settings2 },
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'social', label: 'Social Media', icon: Share2 },
  { key: 'pricing', label: 'Subscription Pricing', icon: CreditCard },
  { key: 'homepage', label: 'Homepage', icon: Home },
  { key: 'email', label: 'Email', icon: Mail },
];

const SECTION_LABELS = {
  general: 'General Settings',
  branding: 'Branding Settings',
  contact: 'Contact Settings',
  social: 'Social Media Settings',
  pricing: 'Subscription Pricing',
  homepage: 'Homepage Settings',
  email: 'Email Settings',
};

const initialSettings = {
  siteName: 'Matrimony',
  siteDescription: '',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#ec4899',
  address: '',
  phone: '',
  email: '',
  supportEmail: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  freePlanLabel: 'Free',
  premiumMonthlyPrice: '',
  premiumYearlyPrice: '',
  premiumMonthlyLabel: 'Premium Monthly',
  premiumYearlyLabel: 'Premium Yearly',
  heroTitle: '',
  heroSubtitle: '',
  bannerText: '',
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPassword: '',
  fromEmail: '',
  fromName: '',
};

const getSectionFields = (section) => {
  const map = {
    general: ['siteName', 'siteDescription'],
    branding: ['logoUrl', 'faviconUrl', 'primaryColor'],
    contact: ['address', 'phone', 'email', 'supportEmail'],
    social: ['facebookUrl', 'twitterUrl', 'instagramUrl', 'linkedinUrl'],
    pricing: ['freePlanLabel', 'premiumMonthlyPrice', 'premiumYearlyPrice', 'premiumMonthlyLabel', 'premiumYearlyLabel'],
    homepage: ['heroTitle', 'heroSubtitle', 'bannerText'],
    email: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword', 'fromEmail', 'fromName'],
  };
  return map[section] || [];
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/admin/settings');
      setSettings((prev) => ({
        ...prev,
        ...(data.settings || data.data || data),
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load settings';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSection = async (section) => {
    const fields = getSectionFields(section);
    const sectionSettings = {};
    fields.forEach((f) => {
      sectionSettings[f] = settings[f];
    });

    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      await API.put('/admin/settings', { settings: sectionSettings });
      toast.success(`${SECTION_LABELS[section]} saved successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to save ${SECTION_LABELS[section]}`);
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  const renderField = (key, label, type = 'text') => {
    const value = settings[key] || '';

    if (type === 'color') {
      return (
        <div key={key} className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer bg-white p-0.5"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="input-pink flex-1"
            />
          </div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div key={key} className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <textarea
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={3}
            className="input-pink w-full resize-none"
          />
        </div>
      );
    }

    if (type === 'password') {
      return (
        <div key={key} className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type="password"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
            className="input-pink w-full"
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="input-pink w-full"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-8 w-56 mb-2" />
          <div className="animate-pulse bg-gray-200 rounded-xl h-4 w-72" />
        </div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <div className="premium-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Settings</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={fetchSettings} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium text-sm rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your matrimony platform settings.</p>
      </motion.div>

      <div className="premium-card">
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-1 p-1 min-w-max">
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{SECTION_LABELS[activeTab]}</h2>
              <p className="text-sm text-gray-500 mt-0.5">Update the settings below and save.</p>
            </div>
            <button
              onClick={() => handleSaveSection(activeTab)}
              disabled={saving[activeTab]}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-pink-300/40"
            >
              {saving[activeTab] ? (
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
                  Save Section
                </>
              )}
            </button>
          </div>

          <div className="space-y-5">
            {activeTab === 'general' && (
              <>
                {renderField('siteName', 'Site Name')}
                {renderField('siteDescription', 'Site Description', 'textarea')}
              </>
            )}

            {activeTab === 'branding' && (
              <>
                {renderField('logoUrl', 'Logo URL')}
                {renderField('faviconUrl', 'Favicon URL')}
                {renderField('primaryColor', 'Primary Color', 'color')}
              </>
            )}

            {activeTab === 'contact' && (
              <>
                {renderField('address', 'Address', 'textarea')}
                {renderField('phone', 'Phone')}
                {renderField('email', 'Email', 'email')}
                {renderField('supportEmail', 'Support Email', 'email')}
              </>
            )}

            {activeTab === 'social' && (
              <>
                {renderField('facebookUrl', 'Facebook URL', 'url')}
                {renderField('twitterUrl', 'Twitter URL', 'url')}
                {renderField('instagramUrl', 'Instagram URL', 'url')}
                {renderField('linkedinUrl', 'LinkedIn URL', 'url')}
              </>
            )}

            {activeTab === 'pricing' && (
              <>
                {renderField('freePlanLabel', 'Free Plan Label')}
                {renderField('premiumMonthlyPrice', 'Premium Monthly Price')}
                {renderField('premiumYearlyPrice', 'Premium Yearly Price')}
                {renderField('premiumMonthlyLabel', 'Premium Monthly Label')}
                {renderField('premiumYearlyLabel', 'Premium Yearly Label')}
              </>
            )}

            {activeTab === 'homepage' && (
              <>
                {renderField('heroTitle', 'Hero Title')}
                {renderField('heroSubtitle', 'Hero Subtitle')}
                {renderField('bannerText', 'Banner Text', 'textarea')}
              </>
            )}

            {activeTab === 'email' && (
              <>
                {renderField('smtpHost', 'SMTP Host')}
                {renderField('smtpPort', 'SMTP Port')}
                {renderField('smtpUser', 'SMTP User')}
                {renderField('smtpPassword', 'SMTP Password', 'password')}
                {renderField('fromEmail', 'From Email', 'email')}
                {renderField('fromName', 'From Name')}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

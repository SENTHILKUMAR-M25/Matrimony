





import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Zap, X, Eye, Phone, MessageCircle, User, Star, FileText, Loader2
} from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import ProfileBook from '../../components/ProfileBook';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const currentToken = token || localStorage.getItem('token');
        if (!currentToken) return;

        const res = await API.get(`/profile/${id}`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        setProfile(res.data.profile);

        try {
          const sentRes = await API.get('/interests/sent', {
            headers: { Authorization: `Bearer ${currentToken}` },
          });
          const existing = (sentRes.data.interests || []).find(
            (i) => i.receiver_user_id === Number(id)
          );
          if (existing) setInterestStatus(existing.status);
        } catch { /* interest check is non-critical */ }
      } catch (err) {
        setError(err.response?.status === 404 ? 'Profile not found.' : 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, token]);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const currentToken = token || localStorage.getItem('token');
      await API.post('/subscription/upgrade', { plan: 'monthly' }, { headers: { Authorization: `Bearer ${currentToken}` } });
      setShowUpgradeModal(false);
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || 'Upgrade failed. Please try again.';
      alert(msg);
    } finally {
      setUpgrading(false);
    }
  };

  const handleSendInterest = async () => {
    if (!profile) return;
    if (isFree) { setShowUpgradeModal(true); return; }
    try {
      setSendingInterest(true);
      const currentToken = token || localStorage.getItem('token');
      await API.post('/interests/send', { receiverId: Number(id) }, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setInterestStatus('pending');
    } catch (err) {
      if (err.response?.status === 409) {
        setInterestStatus(err.response?.data?.status || 'pending');
      } else {
        console.error('Send interest failed:', err);
      }
    } finally {
      setSendingInterest(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const currentToken = token || localStorage.getItem('token');
      const res = await API.get(`/profile/${id}/biodata`, {
        headers: { Authorization: `Bearer ${currentToken}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const name = profile?.fullName ? `Biodata_${profile.fullName.replace(/\s+/g, '_')}.pdf` : 'Biodata.pdf';
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download biodata. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-[11px] sm:text-xs font-medium uppercase tracking-widest">Loading Profile</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 mb-4"><User size={40} /></div>
        <p className="text-gray-600 font-medium mb-4">{error || 'Profile not found.'}</p>
        <button
          onClick={() => navigate('/dashboard/matches')}
          className="px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Back to Matches
        </button>
      </div>
    );
  }

  const isFree = profile.isFreeProfile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12"
    >
      {profile.profileId && (
        <div className="flex flex-col items-center gap-3 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#3B1E54]/10 text-[#3B1E54] border border-pink-200 tracking-wider shadow-xs">
            <Star size={12} className="text-pink-500" />
            Profile ID: {profile.profileId}
          </span>
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all active:scale-[0.97] shadow-md shadow-pink-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {downloadingPdf ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <FileText size={15} />
            )}
            {downloadingPdf ? 'Generating...' : 'Download Biodata (PDF)'}
          </button>
        </div>
      )}
      <ProfileBook
        profile={profile}
        isFree={isFree}
        onUpgradeClick={() => setShowUpgradeModal(true)}
        onSendInterest={handleSendInterest}
        interestStatus={interestStatus}
        sendingInterest={sendingInterest}
        onBackToMatches={() => navigate('/dashboard/matches')}
      />

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="inline-flex p-3 rounded-2xl bg-pink-50 text-pink-600 mb-4 mt-2">
                <Crown size={28} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Unlock Connections</h2>
              <p className="text-gray-500 text-xs mt-1 mb-6">Upgrade your membership plan to unlock connection capabilities.</p>

              <div className="space-y-3 text-left bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                {[
                  { icon: Eye, text: 'Reveal hidden premium images' },
                  { icon: Phone, text: 'Access telephone & social contacts' },
                  { icon: MessageCircle, text: 'Send direct match expressions' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-700">
                    <item.icon size={14} className="text-pink-500" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-pink-50/50 border border-pink-100 rounded-xl py-3 mb-5">
                <span className="text-2xl font-black text-gray-900">₹499</span>
                <span className="text-gray-400 text-xs"> / month</span>
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-pink-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={14} className="fill-current" /> Upgrade Account
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrading overlay */}
      {upgrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-xl text-center max-w-xs">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-900 font-bold text-xs uppercase tracking-wider">Processing Upgrade</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileDetail;
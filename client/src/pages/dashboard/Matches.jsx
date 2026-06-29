import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, UserX, Phone, MapPin, CheckCircle2,
  Heart, Star, Zap, Check, X, MessageCircle, PhoneCall,
  UserPlus, ChevronRight, Shield, Users,
  AlertTriangle, UsersRound, ImageIcon, Eye, GraduationCap, Briefcase,
  Clock, Ban, Loader, CheckCircle, Filter, RotateCcw, Search, Lock
} from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const FREE_LIMIT = 10;
const PREMIUM_LIMIT = 1000;

/* ─────────── Subscription Badge ─────────── */
const SubscriptionBadge = ({ type }) => {
  const isPremium = type === 'premium';
  return (
    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all ${
      isPremium 
        ? 'bg-pink-500/10 text-pink-300 border-pink-500/30 shadow-[0_0_15px_rgba(155,126,189,0.15)]' 
        : 'bg-pink-50 text-pink-800/70 border-pink-200'
    }`}>
      {isPremium ? <Crown size={14} className="text-pink-400 animate-pulse" /> : <UserX size={14} />}
      {isPremium ? 'Premium Member' : 'Free Tier'}
    </div>
  );
};

/* ─────────── Profile Usage Counter ─────────── */
const ProfileCounter = ({ viewed, limit, type }) => {
  const percentage = Math.min((viewed / limit) * 100, 100);
  const isPremium = type === 'premium';

  return (
    <div className="bg-white border border-pink-100 rounded-2xl p-5 shadow-premium relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Monthly Discoveries</span>
          <h4 className="text-sm text-pink-800 font-semibold mt-0.5">
            Viewed <span className="text-pink-500 font-bold">{viewed}</span> of {limit} verified profiles
          </h4>
        </div>
        {viewed >= limit && (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle size={12} />
            Renew Plan to View More
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden relative z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-800"
        />
      </div>
    </div>
  );
};

/* ─────────── Premium Upgrade Banner ─────────── */
const PremiumBanner = ({ onUpgrade }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-800 via-maroon-700 to-pink-900 p-6 md:p-8 shadow-premium group"
  >
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,190,228,0.12),transparent_50%)]" />
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors duration-700" />
    <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-300/10 rounded-full blur-3xl" />

    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-inner backdrop-blur-sm">
            <Crown size={22} className="text-gold-400" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Unlock Meaningful Connections</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {[
            { icon: Eye, text: 'View 1000 premium profiles monthly' },
            { icon: ImageIcon, text: 'view all match photos' },
            { icon: Phone, text: 'Access direct contact & social handles' },
            { icon: MessageCircle, text: 'Initiate continuous messaging conversations' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-gold-400">
              <item.icon size={14} className="text-pink-400" />
              <span className="text-gray-200">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="text-center">
          <span className="text-3xl font-black text-white">₹499</span>
          <span className="text-pink-300 text-xs ml-1">/ month</span>
        </div>
        <button
          onClick={onUpgrade}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0 group/btn cursor-pointer"
        >
          <Zap size={16} className="fill-current" />
          Upgrade to Premium
          <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  </motion.div>
);

/* ─────────── Premium Upgrade Modal ─────────── */
const UpgradeModal = ({ isOpen, onClose, onUpgrade, reachedLimit }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#3B1E54]/40 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 380 }}
          className="relative w-full max-w-2xl rounded-xl bg-white border border-gray-100 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Action Trigger */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-[#EEEEEE] text-gray-400 hover:text-[#3B1E54] transition-colors cursor-pointer z-10"
          >
            <X size={14} />
          </button>

          {/* Core Content Shell */}
          <div className="p-4 sm:p-5  gap-4">
            
            {/* Left Column: Heading & Value Proposition Banner */}
            <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
              <div className="flex items-center gap-3 md:flex-col md:items-start md:text-left text-left">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#3B1E54] to-[#9B7EBD] text-white shadow-xs flex-shrink-0">
                  <Crown size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#3B1E54] tracking-tight leading-tight">
                    {reachedLimit ? "Limit Reached" : "Go Premium"}
                  </h2>
                  <p className="text-gray-500 text-xs mt-0.5 max-w-[200px] leading-snug">
                    {reachedLimit 
                      ? "Extend your active profile search parameters instantly." 
                      : "Uncover deeper connection metrics with uncompromised data tiers."}
                  </p>
                </div>
              </div>

              {/* Price Tier Tag */}
              <div className="hidden md:block mt-4 bg-gradient-to-r from-[#D4BEE4]/30 to-[#EEEEEE] rounded-xl p-2.5 text-center border border-[#D4BEE4]/30">
                <span className="text-xl font-black text-[#3B1E54] tracking-tight">₹499</span>
                <span className="text-gray-500 text-[10px]"> / month</span>
              </div>
            </div>

            {/* Right Column: Features List & Action Triggers */}
            <div className="md:col-span-7 flex flex-col justify-between gap-3">
              <div className="grid grid-cols-1 gap-1.5 bg-[#EEEEEE]/40 border border-[#EEEEEE] p-2.5 rounded-xl">
                {[
                  { text: 'View up to 20 profiles monthly' },
                  { text: 'Reveal premium profile pictures' },
                  { text: 'Access numbers & emails ' },
                  { text: 'Express unlimited match interests' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="p-0.5 rounded-md bg-[#D4BEE4] text-[#3B1E54] flex-shrink-3">
                      <Check size={11} className="stroke-[3]" />
                    </div>
                    <span className="text-gray-700 font-medium truncate">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Price Tag Fallback for Mobile views */}
              <div className="md:hidden flex items-center justify-center gap-1.5 bg-[#EEEEEE]/50 py-1.5 rounded-lg border border-[#EEEEEE]">
                <span className="text-base font-extrabold text-[#3B1E54]">₹499</span>
                <span className="text-gray-500 text-[10px]">/ month</span>
              </div>

              {/* Confirmation Interactive CTA */}
              <button
                onClick={onUpgrade}
                className="w-full py-2.5 bg-[#3B1E54] hover:bg-[#3B1E54]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-[#3B1E54]/10 flex items-center justify-center gap-1.5 text-xs cursor-pointer tracking-wide"
              >
                <Zap size={13} className="fill-current text-[#D4BEE4]" />
                Upgrade Instantly
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


const IMAGE_BASE = API.defaults.baseURL.replace('/api', '');
const getImageUrl = (src, token) => {
  if (!src) return null;
  const filename = src.split('/').pop();
  return `${IMAGE_BASE}/api/images/${filename}?token=${token}`;
};

/* ─────────── Profile Photo ─────────── */
const ProfilePhoto = ({ src, alt, token }) => {
  const [imgError, setImgError] = useState(false);

  const imageSrc = src && !imgError ? getImageUrl(src, token) : null;

  if (!imageSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EEEEEE] via-white to-[#D4BEE4]/20">
        <div className="flex flex-col items-center gap-2">
          <UserX size={32} className="text-[#9B7EBD]/40" />
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No Photo Uploaded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden group/image">
      <img
        src={imageSrc}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/image:scale-110"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3B1E54]/80 via-[#3B1E54]/10 to-transparent" />
    </div>
  );
};

/* ─────────── Contact Actions ─────────── */
const ContactActions = ({ profile, interestStatus, onSendInterest, sendingInterest }) => {
  if (!profile.mobile) return null;
  const phoneNumber = profile.mobile;

  if (interestStatus === 'pending') {
    return (
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
          <Clock size={13} /> Interest Sent
        </div>
      </div>
    );
  }

  if (interestStatus === 'accepted') {
    return (
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <CheckCircle size={13} /> Connected
        </div>
      </div>
    );
  }

  if (interestStatus === 'rejected') {
    return (
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          <Ban size={13} /> Declined
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
      
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSendInterest?.(); }}
        disabled={sendingInterest}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#3B1E54]/90 text-white text-xs font-bold shadow-md shadow-[#3B1E54]/10 transition-all cursor-pointer disabled:opacity-60"
      >
        {sendingInterest ? (
          <Loader size={13} className="animate-spin" />
        ) : (
          <Heart size={13} className="fill-current text-[#D4BEE4]" />
        )}
        {sendingInterest ? 'Sending...' : 'Connect'}
      </button>
    </div>
  );
};

/* ─────────── Redesigned Profile Card ─────────── */
const ProfileCard = ({ profile, isFree, token, interestStatus, onSendInterest, sendingInterest }) => {
  const showInterestStatus = interestStatus === 'pending' || interestStatus === 'accepted' || interestStatus === 'rejected';

  return (
  <Link to={`/dashboard/matches/${profile.id}`} className="block h-full">
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#9B7EBD]/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out h-full flex flex-col"
    >
      {/* Profile Frame */}
      <div className="relative aspect-[4/5] overflow-hidden flex-shrink-0">
        <ProfilePhoto src={profile.profilePhoto} alt={profile.fullName} token={token} />

        {/* Interest Status Badge */}
        {interestStatus && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wider ${
              interestStatus === 'accepted'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : interestStatus === 'rejected'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {interestStatus === 'accepted' ? <CheckCircle size={10} /> : interestStatus === 'rejected' ? <Ban size={10} /> : <Clock size={10} />}
              {interestStatus === 'accepted' ? 'Connected' : interestStatus === 'rejected' ? 'Declined' : 'Pending'}
            </span>
          </div>
        )}

        {/* Verified Badge + Profile ID */}
        

        {/* Floating Identity Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#3B1E54] via-[#3B1E54]/30 to-transparent handle z-10 flex items-end justify-between">
          <div className="max-w-[75%]">
            {profile.profileId && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#3B1E54]/90 backdrop-blur-xs text-pink-200 border border-pink-500/30 shadow-xs tracking-wider">
              {profile.profileId}
            </span>
          )}
            <h3 className="text-white font-bold text-base leading-tight truncate tracking-tight group-hover:text-[#D4BEE4] transition-colors">
              {profile.fullName || 'Priya S.'}
            </h3>
            {profile.city && (
              <p className="text-[#D4BEE4] text-xs mt-1 flex items-center gap-1 font-medium opacity-90">
                <MapPin size={11} className="text-[#9B7EBD]" />
                <span className="truncate">{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
              </p>
            )}
          </div>
          <span className="text-[#3B1E54] font-bold text-sm bg-white px-2.5 py-0.5 rounded-lg shadow-xs border border-gray-100">
            {profile.age || '27'} 
          </span>
        </div>
      </div>

      {/* Profile Details Meta Block */}
      <div className="p-4 flex-1 flex flex-col gap-3 bg-white">
        <div className="space-y-2 text-xs text-gray-500">
          {profile.education && (
            <p className="flex items-center gap-2">
              <GraduationCap size={14} className="text-[#9B7EBD] flex-shrink-0" />
              <span className="truncate text-gray-700 font-medium">{profile.education}</span>
            </p>
          )}
          {profile.occupation && (
            <p className="flex items-center gap-2">
              <Briefcase size={13} className="text-[#9B7EBD] flex-shrink-0" />
              <span className="truncate text-gray-700 font-medium">{profile.occupation}</span>
            </p>
          )}
        </div>

        {/* Action Button Segment */}
        <div className="mt-auto pt-1">
          {!isFree ? (
            <ContactActions
              profile={profile}
              interestStatus={interestStatus}
              onSendInterest={onSendInterest}
              sendingInterest={sendingInterest}
            />
          ) : showInterestStatus ? (
            <div className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold ${
              interestStatus === 'accepted'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : interestStatus === 'rejected'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}>
              {interestStatus === 'accepted' ? <CheckCircle size={13} /> : interestStatus === 'rejected' ? <Ban size={13} /> : <Clock size={13} />}
              {interestStatus === 'accepted' ? 'Connected' : interestStatus === 'rejected' ? 'Declined' : 'Interest Sent'}
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSendInterest?.(); }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              <Heart size={13} className="fill-current text-[#D4BEE4]" />
              {isFree ? 'Unlock to Interest' : 'Express Interest'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
  );
};

/* ─────────── Limit Reached State ─────────── */
const LimitReached = ({ onUpgrade }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white border border-pink-100 rounded-2xl shadow-premium"
  >
    <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 mb-5 text-pink-800 shadow-inner">
      <Crown size={40} className="animate-pulse" />
    </div>
    <h3 className="text-xl font-bold text-pink-800 mb-2 tracking-tight">Monthly Allocation Completed</h3>
    <p className="text-gray-500 text-sm text-center max-w-sm mb-6 leading-relaxed">
      You have successfully utilized all allocated custom match profiles for your member tier this month.
    </p>
    <button
      onClick={onUpgrade}
      className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-600/25 hover:shadow-pink-600/40 flex items-center gap-2 text-sm cursor-pointer"
    >
      <Zap size={14} className="fill-current text-pink-200" />
      Upgrade Membership Tier
    </button>
  </motion.div>
);

/* ─────────── Community Filter Chips ─────────── */
const CommunityChips = ({ communities, selected, onSelect, onClear, locked }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Caste</span>
    <button
      onClick={locked ? undefined : onClear}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
        !selected
          ? 'bg-[#3B1E54] text-white border-[#3B1E54] shadow-xs'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
      } ${locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={locked}
    >
      All
    </button>
    {communities.map((c) => (
      <button
        key={c}
        onClick={() => onSelect(c)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border inline-flex items-center gap-1.5 ${
          selected === c
            ? 'bg-[#3B1E54] text-white border-[#3B1E54] shadow-xs'
            : 'bg-white text-gray-600 border-gray-200 hover:border-[#9B7EBD] hover:text-[#3B1E54]'
        }`}
      >
        {selected === c && locked && <Lock size={11} />}
        {c}
      </button>
    ))}
  </div>
);

/* ─────────── Filter Panel ─────────── */
const FilterPanel = ({ filters, onChange, onClear, profiles }) => {
  const uniqueValues = (field) => {
    const vals = [...new Set(profiles.filter((p) => p[field]).map((p) => p[field]))];
    return vals.sort();
  };

  const renderSelect = (label, field, options) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <select
        value={filters[field] || ''}
        onChange={(e) => onChange(field, e.target.value || null)}
        className="w-full text-xs rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-700 focus:border-[#9B7EBD] focus:ring-1 focus:ring-[#9B7EBD] outline-none"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-premium">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Filter size={12} /> Advanced Filters
        </h4>
        <button
          onClick={onClear}
          className="text-[10px] font-semibold text-[#9B7EBD] hover:text-[#3B1E54] transition-colors flex items-center gap-1"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {renderSelect('Age', 'age', ['18-25', '26-30', '31-35', '36-40', '41-45', '46+'])}
        {renderSelect('Religion', 'religion', uniqueValues('religion'))}
        {renderSelect('Sub Caste', 'subCaste', uniqueValues('subCaste'))}
        {renderSelect('Education', 'education', uniqueValues('education'))}
        {renderSelect('Occupation', 'occupation', uniqueValues('occupation'))}
        {renderSelect('Location', 'city', uniqueValues('city'))}
        {renderSelect('Height', 'height', ['Below 5ft', '5ft-5.5ft', '5.5ft-6ft', 'Above 6ft'])}
        {renderSelect('Marital Status', 'maritalStatus', ['Never Married', 'Divorced', 'Widowed', 'Separated'])}
        {renderSelect('Subscription', 'subscriptionType', ['free', 'premium'])}
        {renderSelect('Rasi', 'rasi', uniqueValues('rasi'))}
        {renderSelect('Nakshatra', 'nakshatra', uniqueValues('nakshatra'))}
        {renderSelect('Lagnam', 'laknam', uniqueValues('laknam'))}
      </div>
    </div>
  );
};

/* ─────────── Main Matches Page ─────────── */
const Matches = () => {
  const { user, token, updateSubscription } = useAuthStore();
  const [searchParams] = useSearchParams();
  const communityParam = searchParams.get('community');
  const [matches, setMatches] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');
  const [interestStatuses, setInterestStatuses] = useState({});
  const [sendingInterestId, setSendingInterestId] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [communityLocked, setCommunityLocked] = useState(!!communityParam);

  useEffect(() => {
    if (communityParam) {
      setSelectedCommunity(communityParam);
    }
  }, [communityParam]);

  const communities = useMemo(() => {
    const unique = [...new Set(matches.filter((m) => m.caste).map((m) => m.caste))];
    return unique.sort();
  }, [matches]);

  const filteredMatches = useMemo(() => {
    let result = matches;
    if (selectedCommunity) {
      result = result.filter((m) => m.caste === selectedCommunity);
    }
    if (filters.age) {
      const [min, max] = filters.age.replace('+', '-999').split('-').map(Number);
      result = result.filter((m) => m.age >= min && m.age <= max);
    }
    if (filters.religion) {
      result = result.filter((m) => m.religion === filters.religion);
    }
    if (filters.subCaste) {
      result = result.filter((m) => m.subCaste === filters.subCaste);
    }
    if (filters.education) {
      result = result.filter((m) => m.education === filters.education);
    }
    if (filters.occupation) {
      result = result.filter((m) => m.occupation === filters.occupation);
    }
    if (filters.city) {
      result = result.filter((m) => m.city === filters.city);
    }
    if (filters.maritalStatus) {
      result = result.filter((m) => m.maritalStatus === filters.maritalStatus);
    }
    if (filters.rasi) {
      result = result.filter((m) => m.rasi === filters.rasi);
    }
    if (filters.nakshatra) {
      result = result.filter((m) => m.nakshatra === filters.nakshatra);
    }
    if (filters.laknam) {
      result = result.filter((m) => m.laknam === filters.laknam);
    }
    if (filters.height) {
      result = result.filter((m) => {
        const h = parseFloat(m.height);
        if (isNaN(h)) return false;
        switch (filters.height) {
          case 'Below 5ft': return h < 5;
          case '5ft-5.5ft': return h >= 5 && h < 5.5;
          case '5.5ft-6ft': return h >= 5.5 && h < 6;
          case 'Above 6ft': return h >= 6;
          default: return true;
        }
      });
    }
    if (filters.subscriptionType) {
      result = result.filter((m) => m.subscriptionType === filters.subscriptionType);
    }
    return result;
  }, [matches, selectedCommunity, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === null || value === '') {
        delete next[field];
      } else {
        next[field] = value;
      }
      return next;
    });
  };

  const clearFilters = () => {
    if (!communityLocked) {
      setSelectedCommunity(null);
    }
    setFilters({});
  };

  const hasActiveFilters = selectedCommunity || Object.keys(filters).length > 0;

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const currentToken = token || localStorage.getItem('token');
      if (!currentToken) return;

      const res = await API.get('/matches', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      setMatches(res.data.matches);
      setSubscription(res.data.subscription);

      if (res.data.subscription) {
        updateSubscription({
          subscription_type: res.data.subscription.type,
          viewed_profiles: res.data.subscription.viewed_profiles,
        });
      }

      // Fetch sent interests to pre-populate statuses
      try {
        const sentRes = await API.get('/interests/sent', {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        const statusMap = {};
        (sentRes.data.interests || []).forEach((i) => {
          statusMap[i.receiver_user_id] = i.status;
        });
        setInterestStatuses(statusMap);
      } catch (_) {}
    } catch (err) {
      if (err.response?.status === 403) {
        setError('limit');
        setSubscription(err.response.data);
      } else {
        setError('Failed to load matches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, updateSubscription]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const currentToken = token || localStorage.getItem('token');
      await API.post('/subscription/upgrade', { plan: 'monthly' }, { headers: { Authorization: `Bearer ${currentToken}` } });

      updateSubscription({ subscription_type: 'premium', viewed_profiles: 0 });
      setShowUpgradeModal(false);
      fetchMatches();
    } catch (err) {
      const msg = err.response?.data?.message || 'Upgrade failed. Please try again.';
      alert(msg);
    } finally {
      setUpgrading(false);
    }
  };

  const handleSendInterest = async (profileId) => {
    if (!isPremium) { setShowUpgradeModal(true); return; }
    try {
      setSendingInterestId(profileId);
      const currentToken = token || localStorage.getItem('token');
      await API.post('/interests/send', { receiverId: profileId }, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setInterestStatuses((prev) => ({ ...prev, [profileId]: 'pending' }));
    } catch (err) {
      if (err.response?.status === 409) {
        setInterestStatuses((prev) => ({
          ...prev,
          [profileId]: err.response?.data?.status || 'pending',
        }));
      } else {
        console.error('Send interest failed:', err);
      }
    } finally {
      setSendingInterestId(null);
    }
  };

  const isPremium = subscription?.type === 'premium';
  const limit = isPremium ? PREMIUM_LIMIT : FREE_LIMIT;
  const viewed = subscription?.viewed_profiles ?? 0;
  const isLimitReached = subscription?.reached_limit === true || error === 'limit';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-[#D4BEE4] rounded-full" />
          <div className="absolute inset-0 border-2 border-t-[#3B1E54] rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 text-xs tracking-widest uppercase font-bold animate-pulse">Assembling Partner Handpicks</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12 text-gray-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          {selectedCommunity ? (
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#3B1E54] tracking-tight">
                {selectedCommunity} Community
              </h1>
              {communityLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  <Lock size={10} />
                  Locked
                </span>
              )}
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B1E54] tracking-tight">Your Custom Matches</h1>
          )}
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            {selectedCommunity
              ? `Showing ${filteredMatches.length} ${filteredMatches.length === 1 ? 'profile' : 'profiles'} in the ${selectedCommunity} community`
              : 'Handpicked premium matrimonial selections tailored to your partner parameters'
            }
          </p>
        </div>
        <SubscriptionBadge type={subscription?.type || 'free'} />
      </div>

      {/* Progress Element */}
      {subscription && (
        <ProfileCounter viewed={viewed} limit={limit} type={subscription.type} />
      )}

      {/* Upsell Banner Segment */}
      {!isPremium && !isLimitReached && (
        <PremiumBanner onUpgrade={() => setShowUpgradeModal(true)} />
      )}

      {/* Filter Section */}
      {matches.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key="filters"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Community Chips */}
            {communities.length > 1 && (
              <CommunityChips
                communities={communities}
                selected={selectedCommunity}
                onSelect={(c) => { setSelectedCommunity(c); setCommunityLocked(false); }}
                onClear={() => setSelectedCommunity(null)}
                locked={communityLocked}
              />
            )}

            {/* Active filter heading + filter toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {hasActiveFilters ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 flex-wrap"
                >
                  <h2 className="text-sm font-bold text-[#3B1E54]">
                    {selectedCommunity
                      ? `Matches in ${selectedCommunity} Community`
                      : 'Filtered Matches'}
                  </h2>
                  <span className="text-[10px] font-semibold bg-[#D4BEE4]/30 text-[#3B1E54] px-2 py-0.5 rounded-full">
                    {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
                  >
                    <RotateCcw size={10} /> Clear
                  </button>
                </motion.div>
              ) : (
                <div />
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  showFilters
                    ? 'bg-[#3B1E54] text-white border-[#3B1E54]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#9B7EBD]'
                }`}
              >
                <Filter size={12} />
                Filters
                {Object.keys(filters).length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FilterPanel
                    filters={filters}
                    onChange={handleFilterChange}
                    onClear={() => setFilters({})}
                    profiles={matches}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Matches Grid Architecture */}
      {isLimitReached ? (
        <LimitReached onUpgrade={() => setShowUpgradeModal(true)} />
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 border-dashed rounded-2xl">
          <Users size={40} className="text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-700">No Custom Matches Available</h3>
          <p className="text-gray-400 text-xs mt-1 max-w-xs text-center leading-normal">
            Refine your criteria preference parameters inside your profile setup to regenerate new discoveries.
          </p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white border border-gray-100 rounded-2xl shadow-sm"
        >
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 flex items-center justify-center">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 animate-pulse opacity-50" />
              <Search size={36} className="text-pink-400 relative z-10" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            {selectedCommunity
              ? `No profiles found in ${selectedCommunity}`
              : 'No matching profiles found'}
          </h3>
          <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed px-4">
            {selectedCommunity
              ? 'Please check back later or explore other communities.'
              : 'No matching profiles found for the selected filters. Try adjusting your criteria.'}
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 text-xs font-semibold text-[#9B7EBD] hover:text-[#3B1E54] transition-all flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#D4BEE4] hover:border-[#3B1E54] hover:bg-pink-50"
          >
            <RotateCcw size={11} /> Clear All Filters
          </button>
          {selectedCommunity && (
            <button
              onClick={() => {
                setSelectedCommunity(null);
                setCommunityLocked(false);
              }}
              className="mt-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 px-4 py-2"
            >
              <Users size={12} /> Browse All Communities
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((profile, index) => (
              <motion.div
                key={profile.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProfileCard
                  profile={profile}
                  isFree={profile.isFreeProfile}
                  token={token || localStorage.getItem('token')}
                  interestStatus={interestStatuses[profile.id]}
                  onSendInterest={() => handleSendInterest(profile.id)}
                  sendingInterest={sendingInterestId === profile.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upgrade Modal Portal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        reachedLimit={isLimitReached}
      />

      {/* Global Loading Spinner for Upgrading State */}
      {upgrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B1E54]/40 backdrop-blur-xs">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-xl text-center max-w-xs">
            <div className="w-8 h-8 border-2 border-[#D4BEE4] border-t-[#3B1E54] rounded-full animate-spin" />
            <p className="text-[#3B1E54] font-bold text-xs uppercase tracking-wider">Activating Premium Status</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Matches;
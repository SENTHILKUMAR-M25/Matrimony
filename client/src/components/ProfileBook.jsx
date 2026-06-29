import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight, User, Sparkles, Briefcase, Phone, Heart,
  Star, MapPin, UsersRound, ArrowLeft, Eye, FileText
} from 'lucide-react';
import logo from '../assets/logo.png';

const COLORS = {
  primary: '#7F55B1',
  secondary: '#9B7EBD',
  accent: '#F49BAB',
  light: '#FFE1E0',
};

// ─── Coil Ring Component ──────────────────────────────────────────
const RING_COUNT = 8;

const CoilRing = ({ index }) => {
  const top = `${((index + 1) / (RING_COUNT + 1)) * 100}%`;
  return (
    <div className="absolute left-1/2 -translate-x-1/2" style={{ top }}>
      {/* Paper hole */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full"
        style={{ background: '#3a2a3a', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)' }}
      />
      {/* Metal coil ring */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[10px] rounded-[50%]"
        style={{
          background: 'linear-gradient(180deg, #e8e8e8 0%, #ffffff 25%, #b8b8b8 55%, #888888 80%, #666666 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.6)',
          border: '0.5px solid rgba(0,0,0,0.15)',
          transform: 'translate(-50%, -50%) rotate(-5deg)',
        }}
      />
      {/* Ring inner shadow for depth */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12px] h-[6px] rounded-[50%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
          transform: 'translate(-50%, -50%) rotate(-5deg)',
        }}
      />
      {/* Highlight dot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[3px] rounded-full"
        style={{
          background: 'rgba(255,255,255,0.7)',
          transform: 'translate(-60%, -80%) rotate(-5deg)',
        }}
      />
    </div>
  );
};

// ─── Cover Page ────────────────────────────────────────────────────
const CoverPage = ({ onTurnOver }) => (
  <div className="flex flex-col items-center justify-center h-full px-4 sm:px-10 py-4 sm:py-14 select-none">
    <div className="flex flex-col items-center gap-1 mb-3 sm:mb-8">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F49BAB]/30 to-[#9B7EBD]/30 blur-2xl scale-150" />
        <img
          src={logo}
          alt="JOD Matrimony Logo"
          className="w-14 h-14 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-xl"
        />
      </div>
    </div>

    <h1
      className="text-xl sm:text-4xl md:text-5xl font-display font-bold mb-1 sm:mb-2 text-center leading-tight"
      style={{
        background: 'linear-gradient(135deg, #D4A847 0%, #F5D77B 25%, #B8860B 50%, #F5D77B 75%, #D4A847 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 2px 4px rgba(212, 168, 71, 0.3))',
      }}
    >
      JOD Matrimony
    </h1>

    <p className="font-great text-base sm:text-xl md:text-2xl text-[#2E073F] italic mb-3 sm:mb-8 text-center">
      Where Hearts Meet Forever
    </p>

    <div className="flex items-center gap-2 sm:gap-4 w-24 sm:w-48 mb-3 sm:mb-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F49BAB] to-transparent" />
      <div className="w-1 h-1 sm:w-2 sm:h-2 rotate-45 border border-[#F49BAB]" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F49BAB] to-transparent" />
    </div>

    <p className="text-[9px] sm:text-xs text-[#2E073F] text-center font-light max-w-[140px] sm:max-w-[220px] leading-relaxed">
      Your Journey to a Lifetime Partner Begins Here
    </p>

    <motion.button
      onClick={onTurnOver}
      className="absolute bottom-3 right-3 sm:bottom-8 sm:right-8 group cursor-pointer active:scale-95"
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative flex items-center gap-1 sm:gap-2.5 px-2 sm:px-5 py-1 sm:py-2.5">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7F55B1] to-[#9B7EBD] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        <span className="text-[10px] sm:text-sm font-semibold tracking-wide text-[#7F55B1] group-hover:text-[#9B7EBD] transition-colors duration-300">
          Turn Over
        </span>
        <div className="relative flex items-center justify-center w-3.5 h-3.5 sm:w-5 sm:h-5">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#7F55B1] group-hover:border-[#9B7EBD] transition-colors duration-300"
            whileHover={{ scale: 1.3 }}
          />
          <ChevronRight
            size={10}
            className="text-[#7F55B1] group-hover:text-[#9B7EBD] transition-all duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </motion.button>

    <div className="absolute bottom-3 left-3 sm:bottom-8 sm:left-8 flex items-center gap-1.5 sm:gap-2">
      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-[#9B7EBD]/30 flex items-center justify-center">
        <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-[#F49BAB]" />
      </div>
      <div className="w-5 sm:w-12 h-px bg-[#9B7EBD]/20" />
      <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">Cover</span>
    </div>
  </div>
);

// ─── Photo Page (Page 2 - Profile Photo, Name, Age) ────────────────
const PhotoPage = ({ profile }) => {
  const defaultPhoto = 'https://via.placeholder.com/400x500?text=No+Photo';

  return (
    <div className="h-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 overflow-y-auto flex flex-col items-center">
      {/* Profile Photo */}
      <div className="w-full max-w-[160px] sm:max-w-[240px] md:max-w-[280px] mx-auto mt-1 sm:mt-4 mb-3 sm:mb-6">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg shadow-[#7F55B1]/10 ring-2 ring-[#9B7EBD]/20">
          <img
            src={profile.profilePhoto || defaultPhoto}
            alt={profile.fullName || 'Profile'}
            className="w-full h-full object-cover"
          />
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-5 sm:w-8 h-5 sm:h-8 border-t-2 border-l-2 border-[#F49BAB]/40 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-5 sm:w-8 h-5 sm:h-8 border-t-2 border-r-2 border-[#F49BAB]/40 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-5 sm:w-8 h-5 sm:h-8 border-b-2 border-l-2 border-[#F49BAB]/40 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-5 sm:w-8 h-5 sm:h-8 border-b-2 border-r-2 border-[#F49BAB]/40 rounded-br-lg" />
        </div>
      </div>
      {/* Name & Age */}
      <div className="text-center">
        <h3 className="text-base sm:text-xl md:text-2xl font-display font-bold text-gray-900 mb-0.5 sm:mb-1">
          {profile.fullName || 'Profile Name'}
        </h3>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {profile.age && (
            <span className="text-[13px] sm:text-base text-[#7F55B1] font-semibold">{profile.age} Years</span>
          )}
          {profile.height && (
            <>
              <span className="text-[#9B7EBD]/40 text-[10px] sm:text-xs">|</span>
              <span className="text-[13px] sm:text-base text-gray-500">{profile.height}</span>
            </>
          )}
        </div>
        {profile.city && (
          <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-[11px] sm:text-sm text-gray-400">
            <MapPin size={10} className="sm:w-[12px] sm:h-[12px]" /> {profile.city}{profile.state ? `, ${profile.state}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Content Page Components ──────────────────────────────────────
const DetailRow = ({ label, value }) => (
  <div className="flex items-baseline gap-1.5 sm:gap-4 py-1.5 sm:py-2 border-b border-[#9B7EBD]/10 last:border-0">
    <span className="text-[9px] sm:text-[11px] font-semibold text-[#7F55B1] uppercase tracking-wider whitespace-nowrap min-w-[80px] sm:min-w-[120px]">
      {label}
    </span>
    <span className="text-[11px] sm:text-sm text-gray-700 font-medium truncate">
      {value || '\u2014'}
    </span>
  </div>
);

const PageHeader = ({ icon: Icon, title, pageNum, totalPages }) => (
  <div className="flex items-center justify-between mb-2 sm:mb-5 pb-1.5 sm:pb-3 border-b border-[#9B7EBD]/20">
    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
      <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#F49BAB]/20 to-[#9B7EBD]/20 shrink-0">
        <Icon size={11} className="sm:w-[13px] sm:h-[13px]" style={{ color: COLORS.primary }} />
      </div>
      <h2 className="font-display text-[13px] sm:text-base font-bold text-gray-800 truncate">{title}</h2>
    </div>
    <span className="text-[8px] sm:text-[10px] text-gray-400 font-mono shrink-0">
      {pageNum}/{totalPages}
    </span>
  </div>
);

const BasicInfoPage = ({ profile }) => (
  <div className="h-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 overflow-y-auto">
    <PageHeader icon={User} title="Basic Overview" pageNum={3} totalPages={7} />
    <div className="mb-2 sm:mb-5">
      <h3 className="text-sm sm:text-lg md:text-xl font-display font-bold text-gray-900 mb-0.5 truncate">
        {profile.fullName || 'Profile Name'}
      </h3>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {profile.age && <span className="text-[11px] sm:text-sm text-[#7F55B1] font-medium">{profile.age} Years</span>}
        {profile.height && (
          <>
            <span className="text-[#9B7EBD]/40 text-xs">|</span>
            <span className="text-[11px] sm:text-sm text-gray-500">{profile.height}</span>
          </>
        )}
      </div>
    </div>
    <div className="space-y-0.5">
      <DetailRow label="Religion" value={profile.religion} />
      <DetailRow label="Mother Tongue" value={profile.motherTongue} />
      <DetailRow label="Marital Status" value={profile.maritalStatus} />
      <DetailRow label="Education" value={profile.education} />
      <DetailRow label="Occupation" value={profile.occupation} />
      <DetailRow label="Caste" value={profile.caste} />
      <DetailRow label="Sub Caste" value={profile.subCaste} />
    </div>
    {profile.aboutMe && (
      <div className="mt-2 sm:mt-5 pt-2 sm:pt-4 border-t border-[#9B7EBD]/10">
        <p className="text-[9px] sm:text-[11px] font-semibold text-[#7F55B1] uppercase tracking-wider mb-1 sm:mb-2">About</p>
        <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed italic font-light line-clamp-3 sm:line-clamp-none">
          &ldquo;{profile.aboutMe}&rdquo;
        </p>
      </div>
    )}
  </div>
);

const AstroPage = ({ profile }) => (
  <div className="h-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 overflow-y-auto">
    <PageHeader icon={Sparkles} title="Horoscope & Astro" pageNum={5} totalPages={7} />
    <div className="space-y-0.5">
      <DetailRow label="Date of Birth" value={profile.dateOfBirth} />
      <DetailRow label="Time of Birth" value={profile.timeOfBirth} />
      <DetailRow label="Place of Birth" value={profile.placeOfBirth} />
      <div className="border-b border-[#9B7EBD]/10 my-1.5 sm:my-3" />
      <DetailRow label="Rasi" value={profile.rasi} />
      <DetailRow label="Nakshatra" value={profile.nakshatra} />
      <DetailRow label="Laknam" value={profile.laknam} />
      <DetailRow label="Gothram" value={profile.gothram} />
      <DetailRow label="Dhosham" value={profile.dhosham} />
    </div>
    {profile.horoscopeAvailable && (
      <div className="mt-2 sm:mt-5 pt-2 sm:pt-4 border-t border-[#9B7EBD]/10 flex flex-wrap gap-2 sm:gap-3">
        {profile.horoscopePdf && (
          <a href={profile.horoscopePdf} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#7F55B1] hover:text-[#9B7EBD] transition-colors active:scale-95">
            <FileText size={10} className="sm:w-[11px] sm:h-[11px]" /> View Horoscope PDF
          </a>
        )}
        {profile.horoscopeImage && (
          <a href={profile.horoscopeImage} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#7F55B1] hover:text-[#9B7EBD] transition-colors active:scale-95">
            <Eye size={10} className="sm:w-[11px] sm:h-[11px]" /> View Horoscope Image
          </a>
        )}
      </div>
    )}
  </div>
);

// ─── Partner Preferences Page (Page 4) ────────────────────────────
const PartnerPrefsPage = ({ profile }) => (
  <div className="h-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 overflow-y-auto">
    <PageHeader icon={Heart} title="Partner Preferences" pageNum={4} totalPages={7} />
    {profile.preferredRasi?.length > 0 && <DetailRow label="Preferred Rasi" value={profile.preferredRasi.join(', ')} />}
    {profile.preferredNakshatra?.length > 0 && <DetailRow label="Preferred Nakshatra" value={profile.preferredNakshatra.join(', ')} />}
    {profile.preferredLagnam?.length > 0 && <DetailRow label="Preferred Lagnam" value={profile.preferredLagnam.join(', ')} />}
    {profile.preferredDhosham?.length > 0 && <DetailRow label="Preferred Dosham" value={profile.preferredDhosham.join(', ')} />}
    <DetailRow label="Horoscope Match Required" value={profile.horoscopeMatchRequired ? 'Yes' : 'No'} />
  </div>
);

const CareerFamilyPage = ({ profile, isFree, onUpgradeClick }) => (
  <div className="h-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 overflow-y-auto">
    <PageHeader icon={Briefcase} title="Career & Family" pageNum={6} totalPages={7} />
    <div>
      <p className="text-[9px] sm:text-[11px] font-semibold text-[#7F55B1] uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1 sm:gap-1.5">
        <Briefcase size={9} className="sm:w-[10px] sm:h-[10px]" /> Career
      </p>
      <div className="space-y-0.5">
        {isFree ? (
          <div className="py-1.5 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-400 italic border-b border-[#9B7EBD]/10">
            <Heart size={9} className="sm:w-[10px] sm:h-[10px] text-[#F49BAB]" />
            Unlock with Premium to view
          </div>
        ) : (
          <>
            <DetailRow label="Company" value={profile.companyName} />
            <DetailRow label="Annual Income" value={profile.annualIncome} />
          </>
        )}
      </div>
    </div>
    <div className="mt-2 sm:mt-5">
      <p className="text-[9px] sm:text-[11px] font-semibold text-[#7F55B1] uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1 sm:gap-1.5">
        <MapPin size={9} className="sm:w-[10px] sm:h-[10px]" /> Location
      </p>
      {isFree ? (
        <div className="py-1.5 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-400 italic border-b border-[#9B7EBD]/10">
          <Heart size={9} className="sm:w-[10px] sm:h-[10px] text-[#F49BAB]" />
          Unlock with Premium to view
        </div>
      ) : (
        <div className="space-y-0.5">
          <DetailRow label="City" value={profile.city} />
          <DetailRow label="State" value={profile.state} />
          <DetailRow label="Country" value={profile.country} />
        </div>
      )}
    </div>
    <div className="mt-2 sm:mt-5">
      <p className="text-[9px] sm:text-[11px] font-semibold text-[#7F55B1] uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1 sm:gap-1.5">
        <UsersRound size={9} className="sm:w-[10px] sm:h-[10px]" /> Family
      </p>
      {isFree ? (
        <div className="py-1.5 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-400 italic border-b border-[#9B7EBD]/10">
          <Heart size={9} className="sm:w-[10px] sm:h-[10px] text-[#F49BAB]" />
          Unlock with Premium to view
        </div>
      ) : (
        <div className="space-y-0.5">
          <DetailRow label="Father" value={profile.fatherName} />
          <DetailRow label="Mother" value={profile.motherName} />
          {profile.brotherCount != null && <DetailRow label="Brothers" value={String(profile.brotherCount)} />}
          {profile.sisterCount != null && <DetailRow label="Sisters" value={String(profile.sisterCount)} />}
        </div>
      )}
    </div>
    {isFree && (
      <motion.button onClick={onUpgradeClick}
        className="mt-2 sm:mt-5 w-full py-2 sm:py-2.5 rounded-lg bg-linear-to-r from-[#7F55B1] to-[#9B7EBD] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#7F55B1]/30 transition-all cursor-pointer active:scale-95"
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        Unlock Full Profile
      </motion.button>
    )}
  </div>
);

const ContactPage = ({ profile, isFree, onUpgradeClick, onSendInterest, interestStatus, sendingInterest }) => (
  <div className="h-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 overflow-y-auto flex flex-col">
    <PageHeader icon={Phone} title="Connect" pageNum={7} totalPages={7} />
    {isFree ? (
      <div className="flex flex-col items-center justify-center flex-1 text-center px-2">
        <div className="p-2.5 sm:p-4 rounded-full bg-[#FFE1E0] mb-2 sm:mb-4">
          <Heart size={18} className="sm:w-[22px] sm:h-[22px]" style={{ color: COLORS.accent }} />
        </div>
        <h3 className="font-display text-sm sm:text-lg font-bold text-gray-800 mb-0.5 sm:mb-1">Premium Connection</h3>
        <p className="text-[10px] sm:text-xs text-gray-400 max-w-[140px] sm:max-w-[200px] mb-2 sm:mb-5">
          Upgrade to view contact details and connect directly
        </p>
        <motion.button onClick={onUpgradeClick}
          className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#7F55B1] to-[#9B7EBD] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#7F55B1]/30 transition-all cursor-pointer active:scale-95"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          Unlock Premium
        </motion.button>
      </div>
    ) : (
      <div className="space-y-2 sm:space-y-4 flex-1">
        <div className="space-y-0.5">
          <DetailRow label="Mobile" value={profile.mobile} />
          <DetailRow label="Email" value={profile.email} />
        </div>
        {profile.mobile && (
          <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            <a href={`tel:${profile.mobile}`}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-2.5 rounded-lg bg-gray-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all active:scale-95">
              <Phone size={10} className="sm:w-[11px] sm:h-[11px]" /> Call
            </a>
            <a href={`https://wa.me/${profile.mobile.replace(/[^0-9]/g, '')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-2.5 rounded-lg bg-emerald-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all active:scale-95">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        )}
      </div>
    )}
    <div className="pt-3 sm:pt-6 border-t border-[#9B7EBD]/10 mt-auto">
      <div className="flex gap-1.5 sm:gap-2">
        {interestStatus === 'accepted' ? (
          <span className="flex-1 py-2 sm:py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-bold text-center">Connected</span>
        ) : interestStatus === 'pending' ? (
          <span className="flex-1 py-2 sm:py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-bold text-center">Interest Sent</span>
        ) : interestStatus === 'rejected' ? (
          <span className="flex-1 py-2 sm:py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] sm:text-xs font-bold text-center">Declined</span>
        ) : (
          <motion.button onClick={onSendInterest} disabled={sendingInterest}
            className="flex-1 py-2.5 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#F49BAB] to-[#FFE1E0] text-[#7F55B1] text-[10px] sm:text-xs font-bold tracking-wider hover:shadow-lg hover:shadow-[#F49BAB]/30 transition-all cursor-pointer disabled:opacity-60 active:scale-95"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {sendingInterest ? 'Sending...' : isFree ? 'Unlock to Interest' : 'Express Interest'}
          </motion.button>
        )}
        <motion.button
          className="px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-lg border border-[#9B7EBD]/30 text-[#7F55B1] text-[10px] sm:text-xs font-bold hover:bg-[#9B7EBD]/5 transition-all cursor-pointer active:scale-95"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Star size={10} className="sm:w-[11px] sm:h-[11px]" />
        </motion.button>
      </div>
    </div>
  </div>
);

// ─── Page Definitions ──────────────────────────────────────────────
const pages = [
  { key: 'cover', render: (_, { onTurnOver }) => <CoverPage onTurnOver={onTurnOver} /> },
  { key: 'photo', render: (profile) => <PhotoPage profile={profile} /> },
  { key: 'basic', render: (profile) => <BasicInfoPage profile={profile} /> },
  { key: 'partner-prefs', render: (profile) => <PartnerPrefsPage profile={profile} /> },
  { key: 'astro', render: (profile) => <AstroPage profile={profile} /> },
  { key: 'career', render: (profile, { isFree, onUpgradeClick }) => (
    <CareerFamilyPage profile={profile} isFree={isFree} onUpgradeClick={onUpgradeClick} />
  )},
  { key: 'contact', render: (profile, { isFree, onUpgradeClick, onSendInterest, interestStatus, sendingInterest }) => (
    <ContactPage profile={profile} isFree={isFree} onUpgradeClick={onUpgradeClick}
      onSendInterest={onSendInterest} interestStatus={interestStatus} sendingInterest={sendingInterest} />
  )},
];

// ─── Page Flip Overlay (Forward) ──────────────────────────────────
const PageTurnOverlay = ({ content, onFlipComplete }) => (
  <motion.div
    className="absolute inset-0 z-30 rounded-[inherit] overflow-hidden"
    initial={{ rotateY: 0 }}
    animate={{ rotateY: -180 }}
    onAnimationComplete={onFlipComplete}
    style={{
      transformOrigin: 'left center',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}
    transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
  >
    <div className="absolute inset-0 rounded-[inherit]" style={{ background: '#FFFBFA' }}>
      {content}
    </div>
    {/* Paper bend shadow - right side */}
    <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none rounded-r-[inherit]"
      style={{
        background: 'linear-gradient(to left, rgba(0,0,0,0.1), rgba(0,0,0,0.02) 60%, transparent)',
      }}
    />
    {/* Paper curl highlight */}
    <div className="absolute inset-y-0 right-0 w-6 z-10 pointer-events-none"
      style={{
        background: 'linear-gradient(to left, rgba(255,255,255,0.4), transparent)',
      }}
    />
  </motion.div>
);

// ─── Page Flip Overlay (Reverse / Previous Page) ─────────────────
const PageTurnOverlayReverse = ({ content, onFlipComplete }) => (
  <motion.div
    className="absolute inset-0 z-30 rounded-[inherit] overflow-hidden"
    initial={{ rotateY: 0 }}
    animate={{ rotateY: 180 }}
    onAnimationComplete={onFlipComplete}
    style={{
      transformOrigin: 'right center',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}
    transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
  >
    <div className="absolute inset-0 rounded-[inherit]" style={{ background: '#FFFBFA' }}>
      {content}
    </div>
    {/* Paper bend shadow - left side */}
    <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none rounded-l-[inherit]"
      style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.02) 60%, transparent)',
      }}
    />
    {/* Paper curl highlight */}
    <div className="absolute inset-y-0 left-0 w-6 z-10 pointer-events-none"
      style={{
        background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)',
      }}
    />
  </motion.div>
);

// ─── Shadow Sweep ─────────────────────────────────────────────────
const ShadowSweep = () => (
  <motion.div
    className="absolute inset-y-0 left-0 w-32 z-20 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    style={{
      background: 'linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.02) 50%, transparent)',
    }}
  />
);

// ─── Page Navigation ──────────────────────────────────────────────
const PageNavigation = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-between border-t border-[#9B7EBD]/10 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3">
    <button onClick={onPrev} disabled={currentPage === 0}
      className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-gray-400 hover:text-[#7F55B1] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer py-1.5 px-2 -ml-2 active:scale-95">
      <ArrowLeft size={11} /> Prev
    </button>
    <div className="flex items-center gap-1.5 sm:gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <div key={i}
          className={`rounded-full transition-all duration-300 ${
            i === currentPage
              ? 'bg-[#7F55B1] w-3 sm:w-4 h-1.5 sm:h-2'
              : i < currentPage
              ? 'bg-[#9B7EBD]/40 w-1.5 h-1.5 sm:w-2 sm:h-2'
              : 'bg-gray-200 w-1.5 h-1.5 sm:w-2 sm:h-2'
          }`}
        />
      ))}
    </div>
    {currentPage < totalPages - 1 ? (
      <button onClick={onNext}
        className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#7F55B1] hover:text-[#9B7EBD] transition-all cursor-pointer py-1.5 px-2 -mr-2 active:scale-95">
        Next <ChevronRight size={11} />
      </button>
    ) : (
      <span className="text-[10px] sm:text-[11px] text-gray-300">End</span>
    )}
  </div>
);

// ─── Spiral Binding ───────────────────────────────────────────────
const SpiralBinding = () => (
    <div
      className="relative h-full shrink-0"
      style={{ width: 'clamp(14px, 3vw, 24px)', minWidth: '14px' }}
    >
    {/* Paper margin strip */}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, #f5edf0 0%, #faf2f5 40%, #FFFBFA 100%)',
        borderRight: '1px solid rgba(155,126,189,0.15)',
      }}
    />
    {/* Perforation line */}
    <div
      className="absolute inset-y-0 right-0 w-px opacity-30"
      style={{
        background: 'repeating-linear-gradient(to bottom, rgba(155,126,189,0.3) 0px, rgba(155,126,189,0.3) 4px, transparent 4px, transparent 8px)',
      }}
    />
    {/* Coil rings */}
    {Array.from({ length: RING_COUNT }, (_, i) => (
      <CoilRing key={i} index={i} />
    ))}
  </div>
);

// ─── Main ProfileBook Component ───────────────────────────────────
const ProfileBook = ({
  profile,
  isFree = false,
  onUpgradeClick,
  onSendInterest,
  interestStatus,
  sendingInterest,
  onBackToMatches,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('forward');

  const totalPages = pages.length;

  const handleTurnOver = useCallback(() => {
    if (isFlipping || currentPage >= totalPages - 1) return;
    setFlipDirection('forward');
    setIsFlipping(true);
  }, [isFlipping, currentPage, totalPages]);

  const onFlipComplete = useCallback(() => {
    setCurrentPage((p) => {
      if (flipDirection === 'forward') {
        const next = p + 1;
        return next >= totalPages ? p : next;
      } else {
        const prev = p - 1;
        return prev < 0 ? p : prev;
      }
    });
    setIsFlipping(false);
  }, [totalPages, flipDirection]);

  const goToNext = useCallback(() => {
    if (isFlipping || currentPage >= totalPages - 1) return;
    setFlipDirection('forward');
    setIsFlipping(true);
  }, [isFlipping, currentPage, totalPages]);

  const goToPrev = useCallback(() => {
    if (isFlipping || currentPage <= 0) return;
    setFlipDirection('backward');
    setIsFlipping(true);
  }, [isFlipping, currentPage]);

  const pageActions = {
    isFree, onUpgradeClick, onSendInterest, interestStatus, sendingInterest,
    onTurnOver: handleTurnOver,
  };

  return (
    <div className="w-full md:w-[85%] lg:w-[75%] mx-auto">
      <button onClick={onBackToMatches}
        className="mb-2 sm:mb-4 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer py-1.5 -ml-1 active:scale-95">
        <ArrowLeft size={12} /> Back to Matches
      </button>

      {/* Notebook Card Container */}
      <div className="relative" style={{ perspective: '1500px' }}>
        {/* Outer drop shadow for floating card effect */}
        <div
          className="absolute -inset-1 sm:-inset-1.5 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(127,85,177,0.06), rgba(155,126,189,0.04), transparent)',
            filter: 'blur(8px)',
          }}
        />

        {/* Notebook Page Card */}
        <div
          className="relative flex rounded-xl sm:rounded-2xl p-2 sm:p-3 overflow-hidden"
          style={{
            minHeight: 'min(80vh, 600px)',
            maxHeight: 'min(90vh, 750px)',
            boxShadow: `
              0 2px 4px rgba(0,0,0,0.02),
              0 8px 24px rgba(127,85,177,0.08),
              0 16px 48px rgba(127,85,177,0.06),
              0 1px 0 rgba(255,255,255,0.6) inset
            `,
          }}
        >
          {/* ─── Spiral Binding (Fixed) ─── */}
          <SpiralBinding />

          {/* ─── Content Page ─── */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #FFFBFA 0%, #FFF5F7 30%, #F8F0FF 70%, #FFFBFA 100%)',
            }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 40%, #9B7EBD 1px, transparent 1px),
                  radial-gradient(circle at 75% 60%, #F49BAB 1px, transparent 1px),
                  radial-gradient(circle at 50% 80%, #7F55B1 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px, 80px 80px, 100px 100px',
              }}
            />

            {/* Top edge shadow */}
            <div
              className="absolute top-0 inset-x-0 h-5 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(155,126,189,0.05), transparent)' }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col">
              <div className="flex-1 relative">
                {/* Normal state - current page */}
                {!isFlipping && (
                  <div className="absolute inset-0 rounded-[inherit]" key={currentPage}>
                    {pages[currentPage].render(profile, pageActions)}
                  </div>
                )}

                {/* Flipping state - Forward */}
                {isFlipping && flipDirection === 'forward' && currentPage < totalPages - 1 && (
                  <div className="absolute inset-0">
                    {/* Next page (underneath - revealed as current flips away) */}
                    <div className="absolute inset-0 z-10 rounded-[inherit]" style={{ background: '#FFFBFA' }}>
                      {pages[currentPage + 1].render(profile, pageActions)}
                    </div>

                    {/* Shadow sweep across next page */}
                    <ShadowSweep />

                    {/* Flipping current page */}
                    <PageTurnOverlay
                      content={pages[currentPage].render(profile, pageActions)}
                      onFlipComplete={onFlipComplete}
                    />
                  </div>
                )}

                {/* Flipping state - Backward */}
                {isFlipping && flipDirection === 'backward' && currentPage > 0 && (
                  <div className="absolute inset-0">
                    {/* Previous page (underneath - revealed as current flips back) */}
                    <div className="absolute inset-0 z-10 rounded-[inherit]" style={{ background: '#FFFBFA' }}>
                      {pages[currentPage - 1].render(profile, pageActions)}
                    </div>

                    {/* Shadow sweep across previous page (from right) */}
                    <motion.div
                      className="absolute inset-y-0 right-0 w-32 z-20 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        background: 'linear-gradient(to left, rgba(0,0,0,0.08), rgba(0,0,0,0.02) 50%, transparent)',
                      }}
                    />

                    {/* Flipping current page backwards */}
                    <PageTurnOverlayReverse
                      content={pages[currentPage].render(profile, pageActions)}
                      onFlipComplete={onFlipComplete}
                    />
                  </div>
                )}
              </div>

              {/* Page navigation */}
              {currentPage > 0 && (
                <PageNavigation
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={goToPrev}
                  onNext={goToNext}
                />
              )}
            </div>

            {/* Right edge shadow */}
            <div
              className="absolute inset-y-0 right-0 w-3 sm:w-4 pointer-events-none"
              style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.03))' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBook;

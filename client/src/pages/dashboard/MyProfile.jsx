import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, MapPin, Briefcase, Users, Phone, Heart, Star, FileText, CheckCircle2, ShieldCheck, Calendar,
  FileDown, Loader2, Lock, X
} from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const DetailItem = ({ label, value }) => (
  <div className="py-3 px-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 hover:bg-white transition-all duration-200">
    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
  </div>
);

const SectionBlock = ({ icon: Icon, title, description, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.04)] space-y-5"
  >
    <div className="flex items-start justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-pink-50/80 text-pink-600 border border-pink-100/40">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">{title}</h3>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">{children}</div>
  </motion.div>
);

const MyProfile = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentToken = token || localStorage.getItem('token');
        if (!currentToken) {
          setLoading(false);
          return;
        }
        const response = await API.get('/profile/me', {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        setProfile(response.data.user);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const isPremium = user?.subscription_type === 'premium';

  const handleDownloadBiodata = async () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setDownloading(true);
    try {
      const currentToken = token || localStorage.getItem('token');
      const response = await API.get('/profile/me/biodata', {
        headers: { Authorization: `Bearer ${currentToken}` },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.fullName || 'Profile'}_Biodata.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 403) {
        setShowPremiumModal(true);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-xs font-medium tracking-wide">Assembling Profile Elements...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto text-center p-12 bg-white border border-gray-200 rounded-2xl my-12">
        <p className="text-gray-500 font-medium">No active profile details found matching this account.</p>
      </div>
    );
  }

  const primaryName = profile.fullName || `${profile.firstName} ${profile.lastName}`;

  return (
    <>
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/40 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sticky Bio Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)]">
            <div className="h-32 bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 tracking-wider shadow-sm uppercase border border-emerald-100">
                <ShieldCheck size={12} /> Verified Profile
              </div>
            </div>
            
            <div className="px-6 pb-6 text-center relative flex flex-col items-center">
              <div className="w-28 h-28 rounded-2xl border-4 border-white bg-gray-50 overflow-hidden shadow-md -mt-14 flex items-center justify-center shrink-0">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-gray-300" />
                )}
              </div>

              <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-4 mb-1">
                {primaryName}
              </h1>
              
              <p className="text-sm font-semibold text-pink-600 bg-pink-50/60 px-3 py-1 rounded-full w-fit">
                {[profile.age && `${profile.age} yrs`, profile.maritalStatus].filter(Boolean).join(' • ')}
              </p>
              {profile.profileId && (
                <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-bold bg-[#3B1E54]/10 text-[#3B1E54] border border-pink-200 tracking-wider">
                  {profile.profileId}
                </span>
              )}

              <div className="w-full border-t border-gray-100/80 my-5 pt-4 space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Briefcase size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">{profile.occupation || 'Profession Unspecified'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">{[profile.city, profile.state].filter(Boolean).join(', ') || 'Location Unspecified'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span>Joined Matrimonial Hub</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard/create-profile')}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.99]"
              >
                Modify Registration Particulars
              </button>

              <button
                onClick={handleDownloadBiodata}
                disabled={downloading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : isPremium ? <FileDown size={16} /> : <Lock size={16} />}
                {downloading ? 'Generating PDF\u2026' : 'Download Biodata (PDF)'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabular Detail View */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section: Core Personal Profile */}
          <SectionBlock icon={User} title="Core Personal Background" description="Primary personal identity attributes">
            <DetailItem label="FullName" value={profile.fullName} />
            <DetailItem label=" Age" value={profile.age ? `${profile.age} Years` : null} />
            <DetailItem label="Gender " value={profile.gender} />
            <DetailItem label="Height" value={profile.height} />
            <DetailItem label=" Weight" value={profile.weight ? `${profile.weight} kg` : null} />
            <DetailItem label="Marital Status" value={profile.maritalStatus} />
            <DetailItem label="Religion" value={profile.religion} />
            <DetailItem label="Caste" value={profile.caste} />
            <DetailItem label="Sub Caste" value={profile.subCaste} />
            <DetailItem label="Mother Tongue" value={profile.motherTongue} />
          </SectionBlock>

          {/* Section: Professional Status */}
          <SectionBlock icon={Briefcase} title="Professional Profile & Capital" description="Educational records and income metrics">
            <DetailItem label="Highest Degree" value={profile.education} />
            <DetailItem label="Job Designation" value={profile.occupation} />
            <DetailItem label="Employer Organization" value={profile.companyName} />
            <DetailItem label="Annual Income" value={profile.annualIncome} />
          </SectionBlock>

          {/* Section: Family Lineage */}
          <SectionBlock icon={Users} title="Lineage & Household Setup" description="Details about parentage and environment">
            <DetailItem label="Father's Name" value={profile.fatherName} />
            <DetailItem label="Mother's Name" value={profile.motherName} />
            <DetailItem label="Sibling Count" value={profile.siblings != null ? String(profile.siblings) : null} />
          </SectionBlock>

          {/* Section: Physical Address */}
          <SectionBlock icon={MapPin} title="Geographic Coordinates" description="Current active residential location parameters">
            <DetailItem label=" Country" value={profile.country} />
            <DetailItem label="State " value={profile.state} />
            <DetailItem label="City " value={profile.city} />
          </SectionBlock>

          {/* Section: Astrological Matrix */}
          {profile.rasi && (
            <SectionBlock icon={Star} title="Astrological Alignment Chart" description="Traditional alignment parameters">
              <DetailItem label="Date of Birth" value={profile.dateOfBirth} />
              <DetailItem label=" Time of Birth" value={profile.timeOfBirth} />
              <DetailItem label="Place of Birth" value={profile.placeOfBirth} />
              <DetailItem label="Moon Sign / Rasi" value={profile.rasi} />
              <DetailItem label="Birth Star / Nakshatra" value={profile.nakshatra} />
              <DetailItem label="Ascendant / Laknam" value={profile.laknam} />
              <DetailItem label="Gothram Lineage" value={profile.gothram} />
              <DetailItem label="Dhosham Presences" value={profile.dhosham} />
              
              {profile.horoscopeAvailable && (
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 pt-4 border-t border-gray-100">
                  {profile.horoscopePdf && (
                    <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Natal Chart PDF</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Official traditional generated layout</p>
                      </div>
                      <a href={profile.horoscopePdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-700 bg-white shadow-sm border border-gray-100 px-3 py-2 rounded-lg w-fit transition-all">
                        <FileText size={14} /> Review Document
                      </a>
                    </div>
                  )}
                  {profile.horoscopeImage && (
                    <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Chart Visualization</p>
                        <p className="text-[11px] text-gray-400">Raster graphic image matrix file</p>
                      </div>
                      <a href={profile.horoscopeImage} target="_blank" rel="noopener noreferrer" className="shrink-0 group relative rounded-lg overflow-hidden border border-gray-200">
                        <img src={profile.horoscopeImage} alt="Horoscope Thumbnail" className="h-12 w-12 object-cover group-hover:scale-105 transition-transform duration-200" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </SectionBlock>
          )}

          {/* Section: Encrypted Contact Channels */}
          <SectionBlock icon={Phone} title="Secure Access Channels" description="Verified private contact records">
            <DetailItem label=" Mail " value={profile.email} />
            <DetailItem label="Mobile No" value={profile.mobile} />
          </SectionBlock>

          {/* Section: Intended Partner Matrix */}
          {profile.prefAgeMin && (
            <SectionBlock icon={Heart} title="Intended Partner Framework" description="Primary physical and background matching metrics">
              <DetailItem label="Age Boundary" value={`${profile.prefAgeMin} - ${profile.prefAgeMax} years`} />
              <DetailItem label="Stature Height" value={profile.prefHeight} />
              <DetailItem label="Academic Qualification" value={profile.prefEducation} />
              <DetailItem label="Location" value={profile.prefLocation} />
              <DetailItem label="Religion" value={profile.prefReligion} />
            </SectionBlock>
          )}

          {/* Section: Partner Astrological Mandates */}
          {(profile.preferredRasi?.length > 0 || profile.preferredLagnam?.length > 0 || profile.preferredDhosham?.length > 0) && (
            <SectionBlock icon={Star} title="Target Astrological Boundaries" description="Mandatory planetary match matrices">
              {Array.isArray(profile.preferredRasi) && profile.preferredRasi.length > 0 && <DetailItem label=" Moon Signs (Rasi)" value={profile.preferredRasi.join(', ')} />}
              {Array.isArray(profile.preferredNakshatra) && profile.preferredNakshatra.length > 0 && <DetailItem label="Acceptable Birth Stars" value={profile.preferredNakshatra.join(', ')} />}
              {Array.isArray(profile.preferredLagnam) && profile.preferredLagnam.length > 0 && <DetailItem label="Preferred Lagnam" value={profile.preferredLagnam.join(', ')} />}
              {Array.isArray(profile.preferredDhosham) && profile.preferredDhosham.length > 0 && <DetailItem label="Preferred Dosham" value={profile.preferredDhosham.join(', ')} />}
              {profile.dhoshamPreference && <DetailItem label="Dhosham Match Mandates" value={profile.dhoshamPreference} />}
              <DetailItem label="Natal Horoscope Verification" value={profile.horoscopeMatchRequired ? 'Absolute Requirement' : 'Optional Element'} />
            </SectionBlock>
          )}

        </div>
      </div>
    </div>

    {/* Premium Upgrade Modal */}
    {showPremiumModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
          <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Lock size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Premium Feature</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              This feature is available exclusively for Premium Members. Upgrade your membership to download your complete matrimonial biodata.
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowPremiumModal(false); navigate('/dashboard/subscription'); }}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all shadow-md"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default MyProfile;
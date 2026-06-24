import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, BookOpen, Heart, Activity } from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const MyProfile = () => {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-gray-900 p-8 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-gray-900 p-8 text-center">Profile not found.</div>;
  }

  const profileImageUrl = profile.profilePhoto 
    ? `http://localhost:5000${profile.profilePhoto}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-pink-100 to-purple-100 relative">
          <div className="absolute inset-0 bg-white/20" />
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 sm:-mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md z-10 flex-shrink-0 flex justify-center items-center">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-500" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left pt-16 sm:pt-0 z-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.fullName || `${profile.firstName} ${profile.lastName}`}</h1>
              <p className="text-pink-600 font-medium text-lg">
                {profile.age ? `${profile.age} yrs` : ''} 
                {profile.height ? ` • ${profile.height}` : ''} 
                {profile.maritalStatus ? ` • ${profile.maritalStatus}` : ''}
              </p>
            </div>
            <div className="z-10">
              <button className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-pink-500/25">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                <User size={20} className="text-pink-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <p className="text-gray-500">Religion</p>
                <p className="text-gray-900 font-medium">{profile.religion || 'Not specified'}</p>
                
                <p className="text-gray-500">Caste</p>
                <p className="text-gray-900 font-medium">{profile.caste || 'Not specified'}</p>
                
                <p className="text-gray-500">Mother Tongue</p>
                <p className="text-gray-900 font-medium">{profile.motherTongue || 'Not specified'}</p>
                
                <p className="text-gray-500">Gender</p>
                <p className="text-gray-900 font-medium">{profile.gender || 'Not specified'}</p>
              </div>
            </div>

            {/* Education & Career */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Briefcase size={20} className="text-pink-500" /> Education & Career
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <p className="text-gray-500">Education</p>
                <p className="text-gray-900 font-medium">{profile.education || 'Not specified'}</p>
                
                <p className="text-gray-500">Occupation</p>
                <p className="text-gray-900 font-medium">{profile.occupation || 'Not specified'}</p>
                
                <p className="text-gray-500">Annual Income</p>
                <p className="text-gray-900 font-medium">{profile.annualIncome || 'Not specified'}</p>

                <p className="text-gray-500">Location</p>
                <p className="text-gray-900 font-medium">{profile.city ? `${profile.city}, ${profile.state}` : 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyProfile;

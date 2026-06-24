import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, BookOpen, Briefcase, MapPin, Heart, 
  CheckCircle, UploadCloud, X, Users, Image as ImageIcon,
  Ruler, Scale, Languages, Globe, Building, IndianRupee
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import API from '../../api/axios';

// Dummy options for dropdowns
const MARITAL_STATUS_OPTIONS = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const RELIGION_OPTIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const CASTE_OPTIONS = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Others'];
const SUB_CASTE_OPTIONS = ['Iyer', 'Iyengar', 'Smartha', 'Mudaliar', 'Pillai', 'Reddy', 'Naidu', 'Gounder', 'Chettiar', 'Nadar', 'Vanniyar', 'Thevar', 'Yadav', 'Viswakarma', 'Others'];
const MOTHER_TONGUE_OPTIONS = ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'English'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Singapore'];
const STATE_OPTIONS = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala', 'Andhra Pradesh', 'Telangana'];
const CITY_OPTIONS = ['Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];

const InputField = ({ label, icon: Icon, type = "text", register, name, rules, errors, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-200 ml-1">{label} {rules?.required && <span className="text-pink-500">*</span>}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon size={18} />
      </div>
      <input
        type={type}
        {...register(name, rules)}
        className={`w-full bg-white/5 border ${errors[name] ? 'border-pink-500' : 'border-gray-700'} text-white text-sm rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 block p-3.5 pl-11 transition-all placeholder-gray-500`}
        placeholder={placeholder}
      />
    </div>
    {errors[name] && <p className="text-xs text-pink-400 ml-1 mt-1">{errors[name].message}</p>}
  </div>
);

const SelectField = ({ label, icon: Icon, register, name, rules, errors, options }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-200 ml-1">{label} {rules?.required && <span className="text-pink-500">*</span>}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon size={18} />
      </div>
      <select
        {...register(name, rules)}
        className={`w-full bg-white/5 border ${errors[name] ? 'border-pink-500' : 'border-gray-700'} text-white text-sm rounded-xl focus:ring-2 focus:ring-pink-500/20 block p-3.5 pl-11 transition-all appearance-none`}
      >
        <option value="" className="bg-gray-900 text-gray-500">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-gray-800 text-white">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
    {errors[name] && <p className="text-xs text-pink-400 ml-1 mt-1">{errors[name].message}</p>}
  </div>
);

// ✅ Defined OUTSIDE CreateProfile so React doesn't create a new component type on every re-render
// which would cause inputs to lose focus after every keystroke.
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
      <div className="p-2 bg-pink-600/20 rounded-lg text-pink-500">
        <Icon size={24} />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const CreateProfile = () => {
  const { user, token, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Photo states
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [additionalPhotosPreview, setAdditionalPhotosPreview] = useState([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      age: '',
      height: '',
      weight: '',
      maritalStatus: '',
      religion: '',
      caste: '',
      subCaste: '',
      motherTongue: '',
      
      education: '',
      occupation: '',
      companyName: '',
      annualIncome: '',
      
      fatherName: '',
      motherName: '',
      siblings: '',
      
      country: '',
      state: '',
      city: '',
      
      prefAgeMin: '',
      prefAgeMax: '',
      prefHeight: '',
      prefEducation: '',
      prefLocation: '',
      prefReligion: '',
    },
    mode: 'onBlur'
  });

  // ✅ Use watch with specific field names to avoid triggering re-render for every field
  const watchedFields = watch([
    'fullName', 'age', 'height', 'maritalStatus', 'religion', 'motherTongue',
    'education', 'occupation', 'country', 'state', 'city', 'prefAgeMin', 'prefAgeMax'
  ]);
  useEffect(() => {
    const requiredFields = [
      'fullName', 'age', 'height', 'maritalStatus', 'religion', 'motherTongue',
      'education', 'occupation', 'country', 'state', 'city', 'prefAgeMin', 'prefAgeMax'
    ];
    let filled = 0;
    requiredFields.forEach((field, i) => {
      const val = watchedFields[i];
      if (val && val.toString().trim() !== '') filled++;
    });
    if (profilePhotoPreview) filled++;
    const totalRequired = requiredFields.length + 1;
    setProgress(Math.round((filled / totalRequired) * 100));
  }, [watchedFields, profilePhotoPreview]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalPhotos(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setAdditionalPhotosPreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview('');
  };

  const removeAdditionalPhoto = (index) => {
    setAdditionalPhotos(prev => prev.filter((_, i) => i !== index));
    setAdditionalPhotosPreview(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (!profilePhotoPreview && !profilePhoto) {
      alert('Please upload a profile photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build multipart form data
      const formData = new FormData();

      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      // Append photo files
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      additionalPhotos.forEach((file) => {
        formData.append('additionalPhotos', file);
      });

      const response = await API.post('/profile/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Persist returned profile data in auth store
      updateProfile({ ...response.data.profile, profileCompleted: true });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save profile. Please try again.';
      alert(message);
      console.error('Profile creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      
      {/* Sticky Top Bar for Progress & Save */}
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/10 p-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-b-3xl sm:mb-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white font-medium">Profile Completion</span>
            <span className="text-pink-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-pink-600 to-pink-400 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 px-8 rounded-xl shadow-lg shadow-pink-600/30 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><CheckCircle size={20} /> Save Profile</>
          )}
        </button>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Create Your Profile</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Please provide accurate details to find the most compatible matches. Your information is secure with us.</p>
      </div>

      <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
        
        {/* Personal Details */}
        <SectionCard title="Personal Details" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Full Name" name="fullName" icon={User} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Age" name="age" type="number" icon={Calendar} register={register} errors={errors} rules={{ required: 'Required', min: 18, max: 80 }} />
            <InputField label="Height (e.g. 5'8&quot;)" name="height" icon={Ruler} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Weight (kg)" name="weight" type="number" icon={Scale} register={register} errors={errors} />
            <SelectField label="Marital Status" name="maritalStatus" icon={Heart} register={register} errors={errors} options={MARITAL_STATUS_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="Mother Tongue" name="motherTongue" icon={Languages} register={register} errors={errors} options={MOTHER_TONGUE_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="Religion" name="religion" icon={BookOpen} register={register} errors={errors} options={RELIGION_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="Caste" name="caste" icon={Users} register={register} errors={errors} options={CASTE_OPTIONS} />
            <SelectField label="Sub Caste" name="subCaste" icon={Users} register={register} errors={errors} options={SUB_CASTE_OPTIONS} />
          </div>
        </SectionCard>

        {/* Education & Career */}
        <SectionCard title="Education & Career" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Highest Qualification" name="education" icon={BookOpen} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Occupation" name="occupation" icon={Briefcase} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Company Name" name="companyName" icon={Building} register={register} errors={errors} />
            <InputField label="Annual Income (approx)" name="annualIncome" icon={IndianRupee} register={register} errors={errors} />
          </div>
        </SectionCard>

        {/* Family Details */}
        <SectionCard title="Family Details" icon={Users}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Father's Name" name="fatherName" icon={User} register={register} errors={errors} />
            <InputField label="Mother's Name" name="motherName" icon={User} register={register} errors={errors} />
            <InputField label="Number of Siblings" name="siblings" type="number" icon={Users} register={register} errors={errors} />
          </div>
        </SectionCard>

        {/* Location Details */}
        <SectionCard title="Location Details" icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectField label="Country" name="country" icon={Globe} register={register} errors={errors} options={COUNTRY_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="State" name="state" icon={MapPin} register={register} errors={errors} options={STATE_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="City" name="city" icon={MapPin} register={register} errors={errors} options={CITY_OPTIONS} rules={{ required: 'Required' }} />
          </div>
        </SectionCard>

        {/* Partner Preferences */}
        <SectionCard title="Partner Preferences" icon={Heart}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <InputField label="Min Age" name="prefAgeMin" type="number" icon={Calendar} register={register} errors={errors} rules={{ required: 'Required' }} />
              </div>
              <div className="w-1/2">
                <InputField label="Max Age" name="prefAgeMax" type="number" icon={Calendar} register={register} errors={errors} rules={{ required: 'Required' }} />
              </div>
            </div>
            <InputField label="Preferred Height" name="prefHeight" icon={Ruler} register={register} errors={errors} />
            <SelectField label="Preferred Religion" name="prefReligion" icon={BookOpen} register={register} errors={errors} options={RELIGION_OPTIONS} />
            <InputField label="Preferred Education" name="prefEducation" icon={BookOpen} register={register} errors={errors} />
            <InputField label="Preferred Location" name="prefLocation" icon={MapPin} register={register} errors={errors} />
          </div>
        </SectionCard>

        {/* Photo Upload Section */}
        <SectionCard title="Profile Photos" icon={ImageIcon}>
          <div className="space-y-8">
            
            {/* Profile Photo - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Profile Photo <span className="text-pink-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-gray-600 flex items-center justify-center group hover:border-pink-500 transition-colors">
                  {profilePhotoPreview ? (
                    <>
                      <img src={profilePhotoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={removeProfilePhoto}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <User size={40} className="mx-auto text-gray-500 mb-2 group-hover:text-pink-400 transition-colors" />
                      <span className="text-xs text-gray-400">Upload Photo</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePhotoChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    disabled={!!profilePhotoPreview}
                  />
                </div>
                <div className="text-sm text-gray-400 max-w-sm">
                  <p className="mb-2 text-white font-medium">Why is a profile photo important?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Profiles with photos get 10x more responses.</li>
                    <li>Must be a clear front-facing photo.</li>
                    <li>Max file size 5MB. Formats: JPG, PNG.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Additional Photos (Optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                
                {additionalPhotosPreview.map((preview, index) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={index} 
                    className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10"
                  >
                    <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeAdditionalPhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}

                {additionalPhotosPreview.length < 5 && (
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border-2 border-dashed border-gray-600 flex items-center justify-center group hover:border-pink-500 transition-colors">
                    <div className="text-center">
                      <UploadCloud size={28} className="mx-auto text-gray-500 mb-2 group-hover:text-pink-400 transition-colors" />
                      <span className="text-xs text-gray-400">Add More</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleAdditionalPhotosChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

      </form>
    </div>
  );
};

export default CreateProfile;

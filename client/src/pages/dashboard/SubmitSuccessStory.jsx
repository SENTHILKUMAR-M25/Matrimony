import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Upload, X, ImagePlus, Calendar, MapPin, Users,
  FileText, MessageSquare, Link, CheckCircle, Loader2,
  ArrowLeft, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const SubmitSuccessStory = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    groomName: '', brideName: '', weddingDate: '', weddingLocation: '',
    community: '', storyTitle: '', shortDescription: '', fullStory: '',
    videoUrl: '', consent: false,
  });
  const [couplePhoto, setCouplePhoto] = useState(null);
  const [couplePreview, setCouplePreview] = useState('');
  const [gallery, setGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleCouplePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return; }
    setCouplePhoto(file);
    setCouplePreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) toast.error('Some images exceeded 5MB and were skipped');
    setGallery((p) => [...p, ...valid]);
    setGalleryPreviews((p) => [...p, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const removeGallery = (idx) => {
    setGallery((p) => p.filter((_, i) => i !== idx));
    setGalleryPreviews((p) => {
      URL.revokeObjectURL(p[idx]);
      return p.filter((_, i) => i !== idx);
    });
  };

  const validate = () => {
    const e = {};
    if (!form.groomName.trim()) e.groomName = 'Required';
    if (!form.brideName.trim()) e.brideName = 'Required';
    if (!form.storyTitle.trim()) e.storyTitle = 'Required';
    if (!form.shortDescription.trim()) e.shortDescription = 'Required';
    else if (form.shortDescription.length > 300) e.shortDescription = 'Max 300 characters';
    if (!form.fullStory.trim()) e.fullStory = 'Required';
    if (!form.consent) e.consent = 'You must consent to share your story';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (couplePhoto) fd.append('couplePhoto', couplePhoto);
      gallery.forEach((f) => fd.append('weddingGallery', f));

      await API.post('/stories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Your success story has been submitted for review!');
      navigate('/dashboard/my-stories');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit story');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Share Your Success Story</h1>
            <p className="text-sm text-gray-500">Inspire others by sharing your journey of finding the perfect match.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 my-8">
        {['Couple Details', 'Your Story', 'Review & Submit'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>{step > i + 1 ? <CheckCircle size={16} /> : i + 1}</div>
            <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? 'text-pink-700' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <motion.form
        key={step}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
        className="space-y-8"
      >
        {step === 1 && (
          <div className="premium-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Couple Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Groom Name <span className="text-red-500">*</span></label>
                <input value={form.groomName} onChange={(e) => update('groomName', e.target.value)} placeholder="e.g. Arun Kumar"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                {errors.groomName && <p className="text-xs text-red-500 mt-1">{errors.groomName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bride Name <span className="text-red-500">*</span></label>
                <input value={form.brideName} onChange={(e) => update('brideName', e.target.value)} placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                {errors.brideName && <p className="text-xs text-red-500 mt-1">{errors.brideName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Wedding Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={form.weddingDate} onChange={(e) => update('weddingDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Wedding Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.weddingLocation} onChange={(e) => update('weddingLocation', e.target.value)} placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Community</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.community} onChange={(e) => update('community', e.target.value)} placeholder="e.g. Iyer, Reddy, Sharma"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Couple Photo</label>
                <div className="flex items-start gap-4">
                  {couplePreview ? (
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200">
                      <img src={couplePreview} alt="Couple" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setCouplePhoto(null); setCouplePreview(''); }} className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all">
                      <Upload size={20} className="text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-400">Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleCouplePhoto} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Wedding Gallery <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex flex-wrap gap-3">
                  {galleryPreviews.map((p, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGallery(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {gallery.length < 10 && (
                    <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all">
                      <ImagePlus size={18} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400 mt-0.5">Add Photos</span>
                      <input type="file" accept="image/*" multiple onChange={handleGallery} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setStep(2)} className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all active:scale-[0.98]">
                Next: Your Story
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="premium-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Story</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Story Title <span className="text-red-500">*</span></label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.storyTitle} onChange={(e) => update('storyTitle', e.target.value)} placeholder="e.g. A Match Made in Heaven"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
              </div>
              {errors.storyTitle && <p className="text-xs text-red-500 mt-1">{errors.storyTitle}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description <span className="text-red-500">*</span></label>
              <textarea value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} placeholder="A brief summary for the story card (max 300 characters)"
                rows={3} maxLength={300}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none transition-all" />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.shortDescription.length}/300</p>
              {errors.shortDescription && <p className="text-xs text-red-500">{errors.shortDescription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Success Story <span className="text-red-500">*</span></label>
              <textarea value={form.fullStory} onChange={(e) => update('fullStory', e.target.value)} placeholder="Share your journey in detail — how you met, your experiences, and your happily ever after..."
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none transition-all" />
              {errors.fullStory && <p className="text-xs text-red-500 mt-1">{errors.fullStory}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.videoUrl} onChange={(e) => update('videoUrl', e.target.value)} placeholder="e.g. https://youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Back</button>
              <button type="button" onClick={() => setStep(3)} className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all active:scale-[0.98]">
                Next: Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="premium-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Review & Submit</h2>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                {couplePreview ? (
                  <img src={couplePreview} alt="" className="w-16 h-16 rounded-xl object-cover ring-2 ring-pink-200" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                    <Heart size={24} className="text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{form.groomName || 'Groom'} & {form.brideName || 'Bride'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{form.weddingLocation || 'Location not specified'}{form.weddingDate ? ` • ${form.weddingDate}` : ''}</p>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{form.storyTitle}</p>
                <p className="text-gray-500 mt-1">{form.shortDescription}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">Your story will be reviewed by our team before being published. You will be notified once it is approved or if any changes are needed.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
              <span className="text-sm text-gray-600">I consent to share my success story and photos on the JOD Matrimony platform. <span className="text-red-500">*</span></span>
            </label>
            {errors.consent && <p className="text-xs text-red-500">{errors.consent}</p>}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setStep(2)} className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Back</button>
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default SubmitSuccessStory;

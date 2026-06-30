import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Users, Quote, ChevronLeft,
  Share2,    Link as LinkIcon,
  Check, Play, X,
} from 'lucide-react';
import { FaFacebook as Facebook , FaTwitter as Twitter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import API from '../api/axios';

const StoryDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
    <div className="w-full h-72 sm:h-96 bg-gray-200 rounded-2xl" />
    <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto" />
    <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto" />
    <div className="space-y-3 mt-8">
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
    </div>
  </div>
);

const SuccessStoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get(`/stories/${id}`);
        setStory(data.story);
      } catch (err) {
        setError(err.response?.data?.message || 'Story not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo({ top: 0 });
  }, [id]);

  const formatDate = (d) => {
    if (!d) return '';
    try { return format(parseISO(d), 'MMMM dd, yyyy'); } catch { return d; }
  };

  const shareUrl = window.location.href;
  const shareText = `Check out the beautiful love story of ${story?.groomName} & ${story?.brideName} on JOD Matrimony!`;

  const share = (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); toast.success('Link copied!'); setTimeout(() => setCopied(false), 2000); });
      return;
    }
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) return <StoryDetailSkeleton />;
  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4"><Heart size={28} className="text-red-500" /></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Story Not Found</h2>
      <p className="text-sm text-gray-500 mb-6">{error}</p>
      <Link to="/#success-stories" className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-xl hover:bg-pink-700 transition-colors">
        <ChevronLeft size={16} /> Back to Stories
      </Link>
    </div>
  );
  if (!story) return null;

  const gallery = story.weddingGallery || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-linear-to-b from-pink-50/30 via-white to-rose-50/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 mb-8">
          {story.couplePhoto ? (
            <img src={`http://localhost:5000/uploads/${story.couplePhoto}`} alt={`${story.groomName} & ${story.brideName}`}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-pink-400 via-rose-500 to-pink-600 flex items-center justify-center">
              <Heart size={60} className="text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">{story.groomName} & {story.brideName}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/80">
              {story.weddingDate && <span className="flex items-center gap-1.5"><Calendar size={14} />{formatDate(story.weddingDate)}</span>}
              {story.weddingLocation && <span className="flex items-center gap-1.5"><MapPin size={14} />{story.weddingLocation}</span>}
              {story.community && <span className="flex items-center gap-1.5"><Users size={14} />{story.community}</span>}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-linear-to-b from-pink-500 to-rose-600 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{story.storyTitle}</h2>
          </div>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {story.fullStory}
          </div>
        </motion.div>

        {gallery.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wedding Gallery ({gallery.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((f, i) => (
                <button key={i} onClick={() => { setLightboxIdx(i); setLightboxOpen(true); }}
                  className="relative aspect-4/3 rounded-xl overflow-hidden group">
                  <img src={`http://localhost:5000/uploads/${f}`} alt="" loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {story.videoUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Wedding Video</h3>
            <a href={story.videoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-300/40">
              <Play size={16} className="fill-white" /> Watch Wedding Video
            </a>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Share2 size={16} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Share This Story</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => share('whatsapp')} className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-700 transition-colors"><Heart size={16} /></button>
            <button onClick={() => share('facebook')} className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-700 transition-colors"><Facebook size={16} /></button>
            <button onClick={() => share('twitter')} className="w-10 h-10 rounded-xl bg-sky-100 hover:bg-sky-200 flex items-center justify-center text-sky-700 transition-colors"><Twitter size={16} /></button>
            <button onClick={() => share('copy')} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
              {copied ? <Check size={16} className="text-green-600" /> : <LinkIcon size={16} />}
            </button>
          </div>
        </motion.div>

        {story.relatedStories?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More Love Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {story.relatedStories.map((rs) => (
                <Link key={rs._id} to={`/story/${rs._id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="h-28 overflow-hidden">
                      {rs.couplePhoto ? (
                        <img src={`http://localhost:5000/uploads/${rs.couplePhoto}`} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center"><Heart size={20} className="text-white/50" /></div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">{rs.groomName} & {rs.brideName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{rs.weddingDate || ''}{rs.community ? ` • ${rs.community}` : ''}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden">
          <Quote size={50} className="absolute top-4 left-4 text-white/10" />
          <h3 className="text-xl sm:text-2xl font-bold relative z-10">Your Perfect Match Is Waiting</h3>
          <p className="text-white/80 mt-2 text-sm relative z-10">Join thousands of couples who found love through JOD Matrimony.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-pink-700 text-sm font-semibold rounded-xl hover:bg-pink-50 transition-all active:scale-[0.98] shadow-lg relative z-10">
            Find Your Perfect Match <Heart size={16} className="fill-pink-700" />
          </Link>
        </motion.div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><X size={24} /></button>
          <div className="flex items-center gap-4 max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightboxIdx((p) => (p - 1 + gallery.length) % gallery.length)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><ChevronLeft size={20} /></button>
            <img src={`http://localhost:5000/uploads/${gallery[lightboxIdx]}`} alt=""
              className="max-h-[85vh] max-w-full rounded-xl object-contain" />
            <button onClick={() => setLightboxIdx((p) => (p + 1) % gallery.length)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><ChevronLeft size={20} className="rotate-180" /></button>
          </div>
          <p className="absolute bottom-4 text-white/60 text-sm">{lightboxIdx + 1} / {gallery.length}</p>
        </div>
      )}
    </motion.div>
  );
};

export default SuccessStoryDetail;

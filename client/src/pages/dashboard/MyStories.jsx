import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, Clock, CheckCircle, XCircle, Eye, Edit3,
  Plus, ChevronRight, AlertCircle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import API from '../../api/axios';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/my-stories');
        setStories(data.stories || []);
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try { return format(parseISO(d), 'MMM dd, yyyy'); } catch { return d; }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Success Stories</h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">Track your submitted stories and their review status.</p>
        </div>
        <Link to="/dashboard/submit-story"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all active:scale-[0.98] shadow-md shadow-pink-300/30">
          <Plus size={16} /> New Story
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : stories.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Stories Yet"
          description="Share your journey and inspire others by submitting your success story."
          action={{ label: 'Share Your Story', onClick: () => navigate('/dashboard/submit-story') }}
        />
      ) : (
        <div className="space-y-4">
          {stories.map((story, i) => {
            const StatusIcon = STATUS_ICONS[story.status] || Clock;
            return (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {story.couplePhoto ? (
                    <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/../uploads/${story.couplePhoto}`} alt=""
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-pink-100 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 ring-2 ring-pink-100">
                      <Heart size={22} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{story.storyTitle}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{story.groomName} & {story.brideName}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${STATUS_STYLES[story.status] || 'bg-gray-100 text-gray-600'}`}>
                        <StatusIcon size={12} />
                        {story.status?.charAt(0).toUpperCase() + story.status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{story.shortDescription}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>Submitted {formatDate(story.submittedAt)}</span>
                      {story.weddingDate && <span>Wedding: {story.weddingDate}</span>}
                    </div>
                    {story.status === 'rejected' && story.rejectionRemark && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-xs text-red-700"><span className="font-medium">Reason:</span> {story.rejectionRemark}</p>
                      </div>
                    )}
                    {story.status === 'pending' && (
                      <div className="mt-3">
                        <Link to={`/dashboard/submit-story?edit=${story._id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                          <Edit3 size={12} /> Edit Story
                        </Link>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-2" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyStories;

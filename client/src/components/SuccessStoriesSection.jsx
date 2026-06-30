import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Quote, ArrowRight, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import API from '../api/axios';

const formatDate = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

const StoryCardSkeleton = () => (
  <div className="rounded-2xl bg-white/50 border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/3] sm:h-48 bg-gray-200" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  </div>
);

const SuccessStoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiperReady, setSwiperReady] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/stories?limit=12');
        setStories(data?.stories || []);
      } catch (err) {
        console.debug('SuccessStoriesSection fetch error:', err?.message);
        setStories([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="success-stories" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/60 via-white to-rose-50/40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-pink-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 rounded-full text-pink-700 text-xs font-medium mb-4">
            <Heart size={14} className="fill-pink-700" /> Real Love Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Success <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Every day, couples find their perfect match through JOD Matrimony. Here are some of their beautiful journeys.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => <StoryCardSkeleton key={i} />)}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-pink-500 sm:hidden" />
              <Heart size={28} className="text-pink-500 hidden sm:block" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">No Stories Yet</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Success stories will appear here once couples share their journey.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Navigation Arrows */}
            <button
              ref={prevRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-white transition-all opacity-0 group-hover/swiper:opacity-100 focus:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              ref={nextRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-white transition-all opacity-0 group-hover/swiper:opacity-100 focus:opacity-100"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
                1280: { slidesPerView: 4, spaceBetween: 28 },
              }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swip) => {
                if (swip.params.navigation && typeof swip.params.navigation === 'object') {
                  swip.params.navigation.prevEl = prevRef.current;
                  swip.params.navigation.nextEl = nextRef.current;
                }
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              speed={600}
              grabCursor
              className="pb-14"
              onInit={() => setSwiperReady(true)}
            >
              {stories.map((story) => (
                <SwiperSlide key={story._id}>
                  <Link to={`/story/${story._id}`} className="group block h-full">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                      <div className="relative overflow-hidden aspect-[4/3] sm:h-48">
                        {story.couplePhoto ? (
                          <img
                            src={`http://localhost:5000/uploads/${story.couplePhoto}`}
                            alt={`${story.groomName} & ${story.brideName}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 flex items-center justify-center">
                            <Heart size={40} className="text-white/60" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                          <h3 className="text-white font-semibold text-xs sm:text-sm drop-shadow-lg leading-tight">
                            {story.groomName} & {story.brideName}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs text-gray-400 mb-2">
                          {story.weddingDate && (
                            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(story.weddingDate)}</span>
                          )}
                          {story.community && (
                            <span className="flex items-center gap-1"><Users size={11} />{story.community}</span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 line-clamp-1">{story.storyTitle}</h4>
                        <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3 flex-1">{story.shortDescription}</p>
                        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-50">
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-pink-600 group-hover:text-pink-700 transition-colors">
                            Read Full Story <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden">
            <Quote size={40} className="absolute top-4 left-4 text-white/10 hidden sm:block" />
            <Quote size={28} className="absolute top-3 left-3 text-white/10 sm:hidden" />
            <p className="text-sm sm:text-lg md:text-xl font-medium italic leading-relaxed relative z-10">
              &ldquo;Love isn&rsquo;t just a feeling &mdash; it&rsquo;s finding someone who makes your heart feel at home. Start your journey today.&rdquo;
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-pink-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-pink-50 transition-all active:scale-[0.98] shadow-lg"
            >
              Start Your Love Story <Heart size={16} className="fill-pink-700" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;

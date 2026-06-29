import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const stories = [
  {
    id: 1,
    name: 'Rahul & Priya',
    image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    story: 'We met on JOD Matrimony. The smart matchmaking understood exactly what we were looking for. Today, we are happily married and thankful to the platform!',
    rating: 5
  },
  {
    id: 2,
    name: 'Vikram & Anjali',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    story: 'Finding someone who shares the same cultural values was our top priority. JOD made it seamless. It was truly a match made in heaven.',
    rating: 5
  },
  {
    id: 3,
    name: 'Arjun & Neha',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    story: 'We lived in different cities, but JOD Matrimony brought us together. The community matching was incredibly accurate.',
    rating: 4
  }
];

const SuccessStories = () => {
  return (
    <section id="success-stories" className="py-16 sm:py-20 gradient-gold overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">Success Stories</h2>
          <div className="decorative-line !bg-white/50"></div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-10 sm:pb-12"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.id}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-2">
                <img src={story.image} alt={story.name} className="w-full h-48 sm:h-56 md:h-64 object-cover" />
                <div className="p-5 sm:p-6 md:p-8 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">{story.name}</h3>
                  <div className="flex text-gold-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < story.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic flex-grow">"{story.story}"</p>
                  <button className="text-maroon-700 font-semibold hover:text-maroon-800 transition-colors self-start mt-auto">
                    Read Full Story &rarr;
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SuccessStories;

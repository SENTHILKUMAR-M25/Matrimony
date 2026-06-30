import { Heart, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useLandingData from '../hooks/useLandingData';

const iconMap = { Heart, Users, ShieldCheck };

const WePromiseFor = () => {
  const { data, loading } = useLandingData();
  const promises = data?.promises || [
    { icon: 'Heart', title: 'Best Matches', desc: 'Smart matchmaking based on your preferences and compatibility.' },
    { icon: 'Users', title: 'Max Responses', desc: 'Connect with genuine profiles and increase response rates.' },
    { icon: 'ShieldCheck', title: 'Fully Secured', desc: 'Privacy protection and verified profiles for safe matchmaking.' },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">We Promise For</h2>
          <div className="decorative-line"></div>
        </div>

        {/* Mobile Carousel */}
        <div className="block sm:hidden w-full">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            className="pb-8"
          >
            {promises.map((item, i) => {
              const IconComp = iconMap[item.icon] || Heart;
              return (
                <SwiperSlide key={i}>
                  <div className="premium-card p-6 rounded-2xl text-center card-hover flex flex-col items-center mx-2">
                    <div className="w-16 h-16 rounded-full bg-maroon-50 flex items-center justify-center mb-4">
                      <IconComp className="w-10 h-10 text-maroon-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {promises.map((item, i) => {
            const IconComp = iconMap[item.icon] || Heart;
            return (
              <div key={i} className="premium-card p-6 sm:p-8 rounded-2xl text-center card-hover flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-maroon-50 flex items-center justify-center mb-4 sm:mb-6">
                  <IconComp className="w-10 h-10 text-maroon-700 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link to="/signup" className="btn-primary text-sm sm:text-base">
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WePromiseFor;

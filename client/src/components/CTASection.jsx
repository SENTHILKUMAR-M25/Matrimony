import { Link } from 'react-router-dom';
import useLandingData from '../hooks/useLandingData';

const CTASection = () => {
  const { data } = useLandingData();
  const cta = data?.cta;
  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-4 border-black"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-4 border-black"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-black mb-6 sm:mb-8">
          {cta?.heading || 'Your Perfect Match Is Waiting'}
        </h2>
        <Link to={cta?.buttonLink || '/signup'} className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 shadow-glow-gold bg-white !text-maroon-700 hover:!bg-gray-100 hover:!text-maroon-800 before:!hidden w-full sm:w-auto inline-block">
          {cta?.buttonText || 'Register Free Today'}
        </Link>
      </div>
    </section>
  );
};

export default CTASection;

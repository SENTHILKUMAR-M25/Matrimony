import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-white">
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6 animate-fade-in-up">
            Find Your <span className="text-gold-400">Perfect</span> Life Partner
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
            Join thousands of verified members and start your journey towards a happy marriage.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 shadow-glow-gold">
              Register Free
            </Link>
            <a href="#search" className="btn-outline border-white text-white hover:border-gold-500 hover:text-white hover:bg-gold-600 px-8 py-4">
              Find Matches
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-gold-400">50K+</div>
              <div className="text-sm text-gray-300 mt-1">Verified Profiles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">10K+</div>
              <div className="text-sm text-gray-300 mt-1">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">100%</div>
              <div className="text-sm text-gray-300 mt-1">Secure Platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

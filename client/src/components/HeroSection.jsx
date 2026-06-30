import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import useLandingData from '../hooks/useLandingData';

const fmtCount = (n) => {
  if (!n && n !== 0) return null;
  const num = Number(n);
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
  return num + '+';
};

const HeroSection = () => {
  const { data } = useLandingData();
  const hero = data?.hero;

  const stats = [
    { label: 'Verified Profiles', value: fmtCount(data?.stats?.users) || '50K+' },
    { label: 'Success Stories', value: fmtCount(data?.stats?.approvedStories) || '10K+' },
    { label: 'Secure Platform', value: '100%' },
  ];
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/60 lg:to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 sm:mb-6 animate-fade-in-up"
            dangerouslySetInnerHTML={{ __html: hero?.heading || 'Find Your <span class="text-gold-400">Perfect</span> Life Partner' }}
          />
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
            {hero?.subtitle || 'Join thousands of verified members and start your journey towards a happy marriage.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10">
            <Link to="/signup" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-glow-gold w-full sm:w-auto text-center">
              {hero?.buttonText || 'Register Free'}
            </Link>
            <a href="#features" className="btn-outline border-white text-white hover:border-gold-500 hover:text-white hover:bg-gold-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto text-center">
              Find Matches
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-white/20">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-400">{s.value}</div>
                <div className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityMatching = () => {
  const benefits = [
    'Better Compatibility',
    'Family Preference Matching',
    'Cultural Understanding',
    'Higher Marriage Success Rate'
  ];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Cards Stack */}
          <div className="w-full lg:w-1/2 relative h-[500px]">
            <div className="absolute top-0 left-0 w-64 glass-card bg-white p-4 rounded-2xl shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
              <img src="https://images.unsplash.com/photo-1542241647-9cbbada29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Community 1" className="w-full h-48 object-cover rounded-xl mb-4" />
              <h4 className="font-bold text-gray-900">Tamil Brahmin</h4>
              <p className="text-sm text-gray-500">10,000+ Profiles</p>
            </div>
            
            <div className="absolute top-20 left-24 w-64 glass-card bg-white p-4 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
              <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Community 2" className="w-full h-48 object-cover rounded-xl mb-4" />
              <h4 className="font-bold text-gray-900">Punjabi Khatri</h4>
              <p className="text-sm text-gray-500">8,500+ Profiles</p>
            </div>
            
            <div className="absolute top-40 left-8 w-64 glass-card bg-white p-4 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-30">
              <img src="https://images.unsplash.com/photo-1610173665545-219d36323c91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Community 3" className="w-full h-48 object-cover rounded-xl mb-4" />
              <h4 className="font-bold text-gray-900">Telugu Reddy</h4>
              <p className="text-sm text-gray-500">12,000+ Profiles</p>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Profile Matches Your Community</h2>
            <div className="decorative-line-left"></div>
            <p className="text-lg text-gray-600 mb-8">
              We understand that marriage is not just the union of two individuals, but of two families and cultures. Our advanced community-based matchmaking ensures you find someone who truly resonates with your roots.
            </p>
            
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-maroon-700 shrink-0" />
                  <span className="text-gray-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Link to="/signup" className="btn-primary shadow-maroon">
              Register Now
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CommunityMatching;

import { Heart, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const WePromiseFor = () => {
  const promises = [
    {
      icon: <Heart className="w-10 h-10 text-maroon-700" />,
      title: 'Best Matches',
      desc: 'Smart matchmaking based on your preferences and compatibility.',
    },
    {
      icon: <Users className="w-10 h-10 text-maroon-700" />,
      title: 'Max Responses',
      desc: 'Connect with genuine profiles and increase response rates.',
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-maroon-700" />,
      title: 'Fully Secured',
      desc: 'Privacy protection and verified profiles for safe matchmaking.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">We Promise For</h2>
          <div className="decorative-line"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {promises.map((item, i) => (
            <div key={i} className="premium-card p-8 rounded-2xl text-center card-hover flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-maroon-50 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 mb-6">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/signup" className="btn-primary">
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WePromiseFor;

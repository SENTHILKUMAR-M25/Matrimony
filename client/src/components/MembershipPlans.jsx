import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Forever',
    features: ['Create Profile', 'Search Profiles'],
    buttonText: 'Current Plan',
    highlight: false,
    color: 'border-gray-200'
  },
  {
    name: 'Silver',
    price: '₹1,499',
    duration: '3 Months',
    features: ['Create Profile', 'Search Profiles', 'View Contact Details', 'Unlimited Interests'],
    buttonText: 'Upgrade',
    highlight: false,
    color: 'border-gray-300'
  },
  {
    name: 'Gold',
    price: '₹2,999',
    duration: '6 Months',
    features: ['All Silver Features', 'Advanced Search', 'Priority Listing'],
    buttonText: 'Upgrade',
    highlight: false,
    color: 'border-gold-300'
  },
  {
    name: 'Platinum',
    price: '₹4,999',
    duration: '12 Months',
    features: ['All Gold Features', 'Featured Profile', 'Unlimited Chat', 'Profile Boost'],
    buttonText: 'Get Platinum',
    highlight: true,
    color: 'border-maroon-700'
  }
];

const MembershipPlans = () => {
  return (
    <section id="membership" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Choose Your Membership Plan</h2>
          <div className="decorative-line"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-white rounded-2xl p-8 border-2 transition-transform duration-300 hover:-translate-y-2 ${plan.highlight ? 'border-maroon-700 shadow-premium-lg plan-recommended' : `border-gray-100 shadow-premium ${plan.color}`}`}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-maroon-700">{plan.price}</span>
                <span className="text-gray-500">/{plan.duration}</span>
              </div>
              
              <div className="w-full h-px bg-gray-100 mb-6"></div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-maroon-700' : 'text-gold-500'}`} />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full !py-3 ${plan.highlight ? 'btn-primary' : 'btn-outline border-gray-300 text-gray-700 hover:border-gold-500 hover:text-white hover:bg-gold-500'}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;

import { CheckCircle2, X, Crown, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import useLandingData from "../hooks/useLandingData";

import "swiper/css";
import "swiper/css/pagination";

const PlanCard = ({ plan }) => (
  <div
    className={`relative flex flex-col rounded-2xl transition-all duration-500 ${
      plan.highlight
        ? "bg-gradient-to-b from-pink-800 to-maroon-700 shadow-premium md:scale-105 lg:scale-110 border-0"
        : "bg-white border-2 border-pink-100 shadow-premium"
    }`}
  >
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full shadow-lg shadow-pink-500/30">
          <Sparkles size={10} className="fill-current" />
          Most Popular
          <Sparkles size={10} className="fill-current" />
        </div>
      </div>
    )}

    <div className="p-5 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        {plan.highlight ? (
          <Crown size={18} className="text-gold-400" />
        ) : (
          <CheckCircle2 size={18} className="text-pink-400" />
        )}
        <h3 className={`text-lg sm:text-xl font-bold font-display ${
          plan.highlight ? "text-white" : "text-pink-800"
        }`}>
          {plan.name}
        </h3>
      </div>

      <p className={`text-xs sm:text-sm mt-2 mb-4 sm:mb-5 ${
        plan.highlight ? "text-pink-200" : "text-gray-500"
      }`}>
        {plan.description}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
        <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
          plan.highlight ? "text-white" : "text-pink-800"
        }`}>
          {plan.price}
        </span>
        {plan.duration && (
          <span className={`text-xs sm:text-sm ${plan.highlight ? "text-pink-300" : "text-gray-400"}`}>
            /{plan.duration}
          </span>
        )}
      </div>

      <div className={`w-full h-px mb-4 sm:mb-6 ${
        plan.highlight ? "bg-white/10" : "bg-pink-100"
      }`}></div>

      {/* Features */}
      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {plan.features.map((feature, j) => (
          <li key={j} className="flex items-start gap-2 sm:gap-3">
            {feature.included ? (
              <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                plan.highlight ? "text-gold-400" : "text-pink-500"
              }`} />
            ) : (
              <X className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                plan.highlight ? "text-pink-400/50" : "text-gray-300"
              }`} />
            )}
            <span className={`text-xs sm:text-sm ${
              feature.included
                ? plan.highlight
                  ? "text-pink-100"
                  : "text-gray-700"
                : plan.highlight
                  ? "text-pink-400/50 line-through"
                  : "text-gray-400 line-through"
            }`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to={plan.buttonLink}
        className={`block w-full text-center py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
          plan.highlight
            ? "bg-white text-pink-800 hover:bg-pink-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5"
        }`}
      >
        {plan.buttonText}
      </Link>
    </div>
  </div>
);

const MembershipPlans = () => {
  const { data } = useLandingData();
  const plans = data?.membership?.plans || [
    {
      name: "Free", price: "₹0", duration: "Forever",
      description: "Get started and explore basic features at no cost.",
      features: [
        { text: "Create Your Profile", included: true },
        { text: "Search & Browse Profiles", included: true },
        { text: "View Contact Details", included: false },
        { text: "Unlimited Interests", included: false },
        { text: "Priority Listing", included: false },
        { text: "Profile Boost", included: false },
      ],
      buttonText: "Get Started Free", buttonLink: "/signup",
      highlight: false, popular: false,
    },
    {
      name: "Premium", price: "₹499", duration: "month",
      description: "Unlock full access and find your perfect match faster.",
      features: [
        { text: "Create Your Profile", included: true },
        { text: "Search & Browse Profiles", included: true },
        { text: "View Contact Details", included: true },
        { text: "Unlimited Interests", included: true },
        { text: "Priority Listing", included: true },
        { text: "Profile Boost", included: true },
      ],
      buttonText: "Upgrade to Premium", buttonLink: "/signup",
      highlight: true, popular: true,
    },
  ];
  return (
    <section id="membership" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-pink-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Choose Your <span className="gradient-text-pink">Membership</span>
          </h2>
          <div className="decorative-line"></div>
        </div>

        <div className="flex justify-center">
          {/* Mobile Carousel */}
          <div className="block md:hidden w-full max-w-xs sm:max-w-sm">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
            >
              {plans.map((plan, i) => (
                <SwiperSlide key={i}>
                  <PlanCard plan={plan} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 max-w-2xl w-full">
            {plans.map((plan, i) => (
              <PlanCard key={i} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
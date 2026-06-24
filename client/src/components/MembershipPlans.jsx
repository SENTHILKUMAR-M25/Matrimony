import { CheckCircle2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const plans = [
  {
    name: "Free",
    price: "₹0",
    duration: "Forever",
    features: ["Create Profile", "Search Profiles"],
    buttonText: "Current Plan",
    highlight: false,
    color: "border-gray-200",
  },
  {
    name: "Silver",
    price: "₹1,499",
    duration: "3 Months",
    features: [
      "Create Profile",
      "Search Profiles",
      "View Contact Details",
      "Unlimited Interests",
    ],
    buttonText: "Upgrade",
    highlight: false,
    color: "border-gray-300",
  },
  {
    name: "Gold",
    price: "₹2,999",
    duration: "6 Months",
    features: [
      "All Silver Features",
      "Advanced Search",
      "Priority Listing",
    ],
    buttonText: "Upgrade",
    highlight: false,
    color: "border-yellow-300",
  },
  {
    name: "Platinum",
    price: "₹4,999",
    duration: "12 Months",
    features: [
      "All Gold Features",
      "Featured Profile",
      "Unlimited Chat",
      "Profile Boost",
    ],
    buttonText: "Get Platinum",
    highlight: false,
    color: "border-maroon-700",
  },
];

const PlanCard = ({ plan }) => (
  <div
    className={`relative bg-white rounded-2xl p-10 border-2 flex flex-col transition-transform duration-300 hover:-translate-y-2 ${
      plan.highlight
        ? "border-pink-600 shadow-lg"
        : `${plan.color} shadow-md`
    }`}
  >
    <h3 className="text-2xl font-bold text-gray-900 mb-2">
      {plan.name}
    </h3>

    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-bold text-maroon-700">
        {plan.price}
      </span>
      <span className="text-gray-500">/{plan.duration}</span>
    </div>

    <div className="w-full h-px bg-gray-100 mb-6"></div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, j) => (
        <li key={j} className="flex items-start gap-3">
          <CheckCircle2
            className={`w-5 h-5 shrink-0 ${
              plan.highlight
                ? "text-maroon-700"
                : "text-yellow-500"
            }`}
          />
          <span className="text-gray-600 text-sm">
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <button
      className={`w-full py-3 mt-auto rounded-lg ${
        plan.highlight
          ? "bg-maroon-700 text-white"
          : "border border-gray-300 text-gray-700 hover:bg-pink-600 hover:text-white"
      }`}
    >
      {plan.buttonText}
    </button>
  </div>
);

const MembershipPlans = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Choose Your Membership Plan
        </h2>

        {/* Mobile Carousel */}
        <div className="block md:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
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
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <PlanCard key={i} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
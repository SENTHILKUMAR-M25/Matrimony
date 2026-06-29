import HeroSection from '../components/HeroSection'
import WePromiseFor from '../components/WePromiseFor'
import SuccessStories from '../components/SuccessStories'
import MembershipPlans from '../components/MembershipPlans'
import CTASection from '../components/CTASection'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-section text-gray-800">
      <HeroSection />
      <WePromiseFor />
      <SuccessStories />
      <MembershipPlans />
      <CTASection />
    </div>
  )
}

export default HomePage

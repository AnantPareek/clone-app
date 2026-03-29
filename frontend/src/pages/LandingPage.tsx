import { Info } from 'lucide-react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrustedBy from '../components/landing/TrustedBy'
import HowItWorks from '../components/landing/HowItWorks'
import BenefitsIntro from '../components/landing/BenefitsIntro'
import BenefitsGrid from '../components/landing/BenefitsGrid'
import MoreFeaturesGrid from '../components/landing/MoreFeaturesGrid'
import Testimonials from '../components/landing/Testimonials'
import AppStoreShowcase from '../components/landing/AppStoreShowcase'
import WallOfLove from '../components/landing/WallOfLove'
import FinalCta from '../components/landing/FinalCta'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="pageWrapper">
      <Header />

      <div className="mainContainer">
        <div className="banner">
          <div className="bannerContent">
            <Info size={16} />
            <span>Moving from Clockwise? - Set a priority call with our team today!</span>
          </div>
          <a href="#demo" className="bannerBtn">
            Book a demo &gt;
          </a>
        </div>

        <main>
          <Hero />
          <TrustedBy />
          <HowItWorks />
          <BenefitsIntro />
          <BenefitsGrid />
          <MoreFeaturesGrid />
          <Testimonials />
          <AppStoreShowcase />
          <WallOfLove />
        </main>
      </div>

      <FinalCta />
      <Footer />
    </div>
  )
}

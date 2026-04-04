import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import NotificationBar from '../components/landing/NotificationBar'
import TrustedBy from '../components/landing/TrustedBy'
import HowItWorks from '../components/landing/HowItWorks'
import DashboardCTA from '../components/landing/DashboardCTA'
import Testimonials from '../components/landing/Testimonials'
import Footer from '../components/landing/Footer'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface font-body">
      <Header />
      
      <main className="pt-16">
        <NotificationBar />
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <DashboardCTA />
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage

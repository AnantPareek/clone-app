import React from 'react'
import { Link } from 'react-router-dom'

const DashboardCTA: React.FC = () => {
  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1a1c1c] rounded-[2.5rem] p-12 md:p-24 overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Manage everything from your dashboard
                </h2>
                <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                  Get a bird's eye view of all your bookings, availability, and event types in one beautiful place.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/dashboard" 
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                >
                  Go to Admin Dashboard <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <button className="bg-transparent border border-gray-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors">
                  View analytics
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <div className="bg-[#2d3030] rounded-2xl p-4 shadow-2xl border border-white/5 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="aspect-video bg-[#1a1c1c] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                   <div className="text-white/10 flex flex-col items-center gap-4">
                      <span className="material-symbols-outlined text-6xl">dashboard</span>
                      <span className="text-sm font-bold tracking-widest uppercase">Admin Interface</span>
                   </div>
                </div>
              </div>
              {/* Accents */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardCTA

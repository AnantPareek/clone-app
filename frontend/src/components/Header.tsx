import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-xl font-bold tracking-tighter text-black">
            CalSync
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 text-gray-600 hover:text-black font-medium text-sm transition-colors">
                Solutions <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
            <Link to="/enterprise" className="text-gray-600 hover:text-black font-medium text-sm transition-colors">
              Enterprise
            </Link>
            <Link to="/sync-ai" className="text-gray-600 hover:text-black font-medium text-sm transition-colors">
              Sync.ai
            </Link>
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 text-gray-600 hover:text-black font-medium text-sm transition-colors">
                Developer <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 text-gray-600 hover:text-black font-medium text-sm transition-colors">
                Resources <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
            <Link to="/pricing" className="text-gray-600 hover:text-black font-medium text-sm transition-colors">
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-900 font-bold text-sm">
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="bg-[#262626] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-black transition-all"
          >
            Get started <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 absolute w-full shadow-xl">
          <div className="flex flex-col gap-4">
            <Link to="/solutions" className="text-gray-600 font-medium py-2 border-b border-gray-50">Solutions</Link>
            <Link to="/enterprise" className="text-gray-600 font-medium py-2 border-b border-gray-50">Enterprise</Link>
            <Link to="/sync-ai" className="text-gray-600 font-medium py-2 border-b border-gray-50">Sync.ai</Link>
            <Link to="/developer" className="text-gray-600 font-medium py-2 border-b border-gray-50">Developer</Link>
            <Link to="/pricing" className="text-gray-600 font-medium py-2 border-b border-gray-50">Pricing</Link>
            <Link to="/dashboard" className="bg-[#262626] text-white px-5 py-3 rounded-lg font-bold text-center mt-4">
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Header

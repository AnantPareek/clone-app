import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 px-8 py-20 max-w-7xl mx-auto">
                <div className="col-span-2">
                    <span className="text-lg font-bold text-black block mb-6">CalSync</span>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-8 max-w-xs">The infrastructure for scheduling meetings. Simple. Powerful. Open.</p>
                    <div className="text-xs uppercase tracking-widest text-black">© 2024 CalSync, Inc.</div>
                </div>
                <div>
                    <h4 className="font-inter text-xs uppercase tracking-widest text-black font-bold mb-6">Solutions</h4>
                    <ul className="space-y-4">
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">For Teams</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">For Enterprise</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">For Education</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-inter text-xs uppercase tracking-widest text-black font-bold mb-6">Company</h4>
                    <ul className="space-y-4">
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">About</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">Careers</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">Blog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-inter text-xs uppercase tracking-widest text-black font-bold mb-6">Privacy</h4>
                    <ul className="space-y-4">
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">Privacy Policy</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">Terms</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">Security</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-inter text-xs uppercase tracking-widest text-black font-bold mb-6">Social</h4>
                    <ul className="space-y-4 flex flex-col">
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">Twitter</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">GitHub</Link></li>
                        <li><Link to="#" className="font-inter text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-all">LinkedIn</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer

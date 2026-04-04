import React from 'react'

const Hero: React.FC = () => {
    return (
        <section className="px-6 py-12 md:py-16">
            <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-16 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Content */}
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                            CalSync launches v6.3 <span className="material-symbols-outlined text-xs">chevron_right</span>
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-wall text-6xl md:text-8xl font-bold text-black max-w-lg">
                                The better way to schedule your meetings
                            </h1>
                            <p className="text-lg text-gray-500 max-w-md leading-snug font-medium">
                                A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
                            </p>
                        </div>
                        <div className="space-y-4 max-w-sm">
                            <button className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Sign up with Google
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                Sign up with email <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                            <p className="text-xs text-gray-400 font-medium">No credit card required</p>
                        </div>
                    </div>
                    {/* Right Content: Integrated Booking Widget */}
                    <div className="relative lg:mt-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                            {/* Left panel of widget */}
                            <div className="p-8 md:w-[45%] border-b md:border-b-0 md:border-r border-gray-100">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrKOfepEIugDoYkq4tJEDsMDkF_UF7QFVRRVBUdr1rX69vD0SSN4Z9KHsZp3ADUdkzuYPJH80gaof1vAUb9dXUXhYTBqFNRYC1NM70NmZXHCbbG0xVkTWvZIQAEKmLZwCSX6UhqWzrmiVwVZw0CGTcmdlD8HuCD1wCPlSt7K5BD9T4dhUf6956MhkQmv6LSqS_v6FvL7SK9rlmpHuKVyIHl--Wu98zMlIgMZS64Nm-j3s99W0mtHgwGLMq4RXS6xkcH0xpgneZ7Zo" alt="Isabella Valce" className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Isabella Valce</p>
                                            <h3 className="text-2xl font-bold text-black mt-1">Photoshoot</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        Capture your special moments with our professional photography services today.
                                    </p>
                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">schedule</span>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 bg-gray-50 text-xs font-bold text-gray-600 rounded-md">15m</button>
                                                <button className="px-3 py-1 bg-gray-50 text-xs font-bold text-gray-600 rounded-md">30m</button>
                                                <button className="px-3 py-1 bg-gray-50 text-xs font-bold text-gray-600 rounded-md">45m</button>
                                                <button className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold text-black rounded-md shadow-sm">1h</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">location_on</span>
                                            <span className="text-sm font-bold text-gray-700">Rock Wall Woods</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">public</span>
                                            <div className="flex items-center gap-1 cursor-pointer">
                                                <span className="text-sm font-bold text-gray-700">South America/Rio de Janeiro</span>
                                                <span className="material-symbols-outlined text-sm">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Calendar panel */}
                            <div className="p-8 flex-1 bg-white">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-lg font-bold text-black">May <span className="text-gray-300 font-medium">2025</span></h4>
                                </div>
                                <div className="grid grid-cols-7 gap-y-6 text-center">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day}</div>
                                    ))}
                                    <div className="text-sm py-2 text-gray-300"></div>
                                    <div className="text-sm py-2 text-gray-300"></div>
                                    <div className="text-sm py-2 text-gray-300"></div>
                                    <div className="relative py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1 flex items-center justify-center">
                                        1<span className="absolute bottom-1 w-1 h-1 bg-black rounded-full"></span>
                                    </div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">2</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">3</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">4</div>
                                    <div className="text-sm py-2 text-gray-400">5</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">6</div>
                                    <div className="py-2 bg-[#2d333b] rounded-lg text-sm font-bold text-white mx-1">7</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">8</div>
                                    <div className="relative py-2 text-sm font-bold text-gray-900 flex items-center justify-center">
                                        9<span className="absolute bottom-1 w-1 h-1 bg-black rounded-full"></span>
                                    </div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">10</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">11</div>
                                    <div className="text-sm py-2 text-gray-400">12</div>
                                    <div className="text-sm py-2 text-gray-400">13</div>
                                    <div className="text-sm py-2 text-gray-400">14</div>
                                    <div className="text-sm py-2 text-gray-400">15</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">16</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">17</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">18</div>
                                    <div className="text-sm py-2 text-gray-400">19</div>
                                    <div className="text-sm py-2 text-gray-400">20</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">21</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">22</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">23</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">24</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">25</div>
                                    <div className="text-sm py-2 text-gray-400">26</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">27</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">28</div>
                                    <div className="py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 mx-1">29</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">30</div>
                                    <div className="text-sm py-2 text-gray-900 font-bold">31</div>
                                </div>
                            </div>
                        </div>
                        {/* Trust Badges Overlay */}
                        <div className="mt-12 flex flex-wrap gap-12 items-center justify-start lg:pl-12">
                            <div className="flex flex-col gap-1">
                                <div className="flex text-[#00b67a]">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <span key={i} className={`material-symbols-outlined text-lg ${i === 5 ? 'opacity-40' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[#00b67a] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="text-xs font-bold tracking-tight text-black">Trustpilot</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex text-[#ff6154]">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-5 h-5 rounded-full bg-[#ff6154] flex items-center justify-center text-white text-[10px] font-bold">P</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero

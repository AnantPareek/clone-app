import { motion } from 'framer-motion'

const HowItWorks: React.FC = () => {
    const calendarIcons = [
        { 
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs4WUnJffDh9WbOjvKNoZNReUmSP_OyPtLXAnfMOf_M0eK1FtuPlAC-bNUcYiPrlMpFNkKWDK54GWUnc_KnwR3ZgnN5VNp6KYPgFrKLm7w_v0Exe1YaGJnWEtCJOSFuYNTI93djtvlxLWGK_oB4cTXVRtWolqBwwaIEaR474cV0p-bVTMqagp_DgmI-LIiMwKjZzwto1OKLO2tPBsMMRQkiFk7ci_106SZ1EbRmKN1caMetrBYnn9lYoPmsp9uPI-4i9H3QgwL2wY", 
            alt: "Outlook",
            angle: 0
        },
        { 
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVMFMeUkadG-GTnA1Jwswa4uF7b3GDs-C57YcE1d501QTTfr2X3kLc9fPJ-Fa6d7AclA6ndAAJhZJ01tV6mzqEdjZhxK_fma-0yOu5azKIuBkPcVcGUwZPRLP_ccXbOxnwIsl9oDrQRY6dKnxZLCODcSQNx9oC5bujRHmjXD3tpk7HzlyaDULJZ6a440TtUGX7aqVpRDalp6fumDOh-bv6jUVPyeEkZ33FrFwEOjGFmq4cpNT5aQ64TOZKJe5F0g9-mroYwGS4Sic", 
            alt: "Google Calendar",
            angle: 120
        },
        { 
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY3gRpIi50ygsmBjmiXl40llQN0Put3Db-19HvHHMwL_-gUfsjxy0Vo5QxrJf1Q3M7uWzS_5qbKpY8Hv-0Ll-zfFlJO9nyl9aFRPNb3xGdzYFgTF_MAEiK5nz-I97KZMJs6C9dy1yQzJjk1hP0N0gnxjMXyCsEaiY_1t60g7kGo_EtIEwGmjcdKOH6mROfXV4rS9AwNAZxX-FEEzji9p5a45rpSPy2LvZabeFoWzqU5MD3mzxRBfsQ4mnDGUJl3sMwdyfQ058ZA0Y", 
            alt: "Apple",
            angle: 240
        }
    ];

    return (
        <section className="px-6 py-24 bg-white">
            <div className="max-w-7xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span> How it works
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">With us, appointment scheduling is easy</h2>
                    <p className="text-lg text-gray-500 leading-relaxed">Effortless scheduling for business and individuals, powerful solutions for fast-growing modern companies.</p>
                </div>
                <div className="flex items-center justify-center gap-4 pb-12">
                    <a href="#" className="bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                        Get started <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a href="#" className="bg-white border border-gray-100 text-gray-900 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                        Book a demo <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                </div>
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {/* Card 01 */}
                    <div className="bg-[#f9f9f9] rounded-[2rem] p-10 flex flex-col border border-gray-50 shadow-sm">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 mb-8">01</div>
                        <h3 className="text-2xl font-bold text-black mb-4">Connect your calendar</h3>
                        <p className="text-gray-500 text-sm font-medium mb-12">We'll handle all the cross-referencing, so you don't have to worry about double bookings.</p>
                        <div className="mt-auto relative flex items-center justify-center py-12">
                            <div className="w-48 h-48 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-50 font-bold text-sm z-10">CalSync</div>
                                
                                {/* Orbiting Icons Container */}
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full"
                                >
                                    {calendarIcons.map((icon, idx) => (
                                        <div 
                                            key={idx} 
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{ transform: `rotate(${icon.angle}deg)` }}
                                        >
                                            <div 
                                                className="absolute top-0 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg border border-gray-100"
                                            >
                                                <motion.div
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <img src={icon.src} alt={icon.alt} className="w-5 h-5 object-contain" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Card 02 */}
                    <div className="bg-[#f9f9f9] rounded-[2rem] p-10 flex flex-col border border-gray-50 shadow-sm">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 mb-8">02</div>
                        <h3 className="text-2xl font-bold text-black mb-4">Set your availability</h3>
                        <p className="text-gray-500 text-sm font-medium mb-12">Want to block off weekends? Set up any buffers? We make that easy.</p>
                        <div className="mt-auto space-y-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                            {[
                                { day: 'Mon', time: '8:30 am - 5:00 pm' },
                                { day: 'Tue', time: '9:00 am - 6:30 pm' },
                                { day: 'Wed', time: '10:00 am - 7:00 pm' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <motion.div 
                                            animate={{ 
                                                backgroundColor: ["#f3f4f6", "#000", "#000", "#f3f4f6"],
                                                boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 10px rgba(0,0,0,0.1)", "0px 4px 10px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                times: [0, 0.1, 0.25, 0.35],
                                                delay: idx * 1.3,
                                            }}
                                            className="w-8 h-4 bg-gray-100 rounded-full relative"
                                        >
                                            <motion.div 
                                                animate={{ 
                                                    x: [2, 18, 18, 2],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    times: [0, 0.1, 0.25, 0.35],
                                                    delay: idx * 1.3,
                                                }}
                                                className="absolute left-0 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                                            />
                                        </motion.div>
                                        <span className="text-xs font-bold text-gray-700">{item.day}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold">{item.time.split(' - ')[0]}</div>
                                        <span className="text-gray-300">-</span>
                                        <div className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold">{item.time.split(' - ')[1]}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    {/* Card 03 */}
                    <div className="bg-[#f9f9f9] rounded-[2rem] p-10 flex flex-col border border-gray-50 shadow-sm">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 mb-8">03</div>
                        <h3 className="text-2xl font-bold text-black mb-4">Choose how to meet</h3>
                        <p className="text-gray-500 text-sm font-medium mb-12">It could be a video chat, phone call, or a walk in the park!</p>
                        <div className="mt-auto bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                            <div className="h-6 bg-gray-50 flex items-center gap-1 px-3 border-b border-gray-100">
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-300 text-4xl">person</span>
                                </div>
                                <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-300 text-4xl">person</span>
                                </div>
                            </div>
                            <div className="pb-4 flex justify-center gap-3">
                                {['videocam', 'mic', 'desktop_windows'].map((icon) => (
                                    <div key={icon} className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10px]">{icon}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks

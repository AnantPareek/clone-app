import React from 'react'

const NotificationBar: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 mt-8">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="material-symbols-outlined text-brand-blue text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                    <p className="font-medium">Scheduling software that checks every compliance box: SOC 2 Type II, HIPAA, GDPR, CCPA, ISO 27001 & more.</p>
                </div>
                <button className="bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors">
                    Learn more <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
            </div>
        </div>
    )
}

export default NotificationBar

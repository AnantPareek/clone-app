import React from 'react'

const testimonials = [
    {
        quote: "CalSync is the most flexible scheduling platform I've ever used. The open-source nature means it grows with our needs.",
        author: "Alex Rivera",
        role: "Founder, TechStack",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAv5uoPGwxjxkuA2BEw0NaNF7x9XbKqGHJLhccVway35higKy4cmzFf2y1iM1iTaMfIHugAsNopOS_5XzklJKlSo44-mzxJMzvBlq6nChS9VQ-kIdlCwHgdQbIc-jkiE5oE_Gv-ceTZJ9ktOgItutETcN9NkNdu1SKMBdyo2CEMujPZWC3mjCxk2wQRGycjMNO8heGBzTLgBrdzKQRvQeCSHBWoW4yNca7YUU05KlzQdrlng22SNiDp4a4voPjfl4bHmSvX4FClZY"
    },
    {
        quote: "We switched from Calendly and never looked back. The API is a dream for our development team to integrate with.",
        author: "Sarah Jenkins",
        role: "CTO at Nexus",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrKOfepEIugDoYkq4tJEDsMDkF_UF7QFVRRVBUdr1rX69vD0SSN4Z9KHsZp3ADUdkzuYPJH80gaof1vAUb9dXUXhYTBqFNRYC1NM70NmZXHCbbG0xVkTWvZIQAEKmLZwCSX6UhqWzrmiVwVZw0CGTcmdlD8HuCD1wCPlSt7K5BD9T4dhUf6956MhkQmv6LSqS_v6FvL7SK9rlmpHuKVyIHl--Wu98zMlIgMZS64Nm-j3s99W0mtHgwGLMq4RXS6xkcH0xpgneZ7Zo"
    },
    {
        quote: "Minimalist design, incredibly fast, and solves scheduling headaches globally. A must-have tool for any modern team.",
        author: "Marcus Chen",
        role: "VP Sales, Global Corp",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9OXRfq09WQOucFvlKpG1A0JH-DWfMc4Vf8d3imetdbCIAb50ABbxupBqQkfcSGvPAkQHWxqzctaWF60CArOZRpwzHcP329ahYFH7mHenKwQcSW7RfYbqnLSXuTuzhIgRpMzr5gNPSvXQtE1Oy2GNO9lzYt7Y3Ho-IvpEtBLworhWCIeEgxSgDcKXr9yICUgCoSvvzouW8TqcDgcV8Q1imUBF6irXhfA7QZgcF9TfHQdEgTg-8FXqhG3qmDyAld7LcZ-NEVlBDHPU"
    }
]

const Testimonials: React.FC = () => {
    return (
        <section className="px-6 py-24 bg-surface">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Loved by 100,000+ users</h2>
                <p className="text-secondary">Join the movement for better scheduling.</p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, idx) => (
                    <div key={idx} className="p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-on-surface/80 italic mb-8">"{t.quote}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-surface-container-low overflow-hidden">
                                <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-sm">{t.author}</div>
                                <div className="text-xs text-secondary">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Testimonials

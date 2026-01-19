
import React from 'react';

const steps = [
  {
    n: "01",
    title: "Create a Group",
    desc: "Set up a shared space for any event or household in seconds. Invite your friends via a simple link.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    n: "02",
    title: "Add Expenses",
    desc: "Scan receipts or enter amounts manually. Choose from equal splits, percentages, or exact amounts.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    n: "03",
    title: "Track & Settle",
    desc: "Real-time ledger tracking shows exactly who owes what. Mark settlements with one tap when paid.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    image: "https://www.mmcdlaw.com/wp-content/uploads/2024/09/What-Is-The-Average-Settlement-For-A-Personal-Injury-In-Louisiana.jpg"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-custom-success-green/10 text-custom-dark-teal rounded-full font-bold text-xs uppercase tracking-widest mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Process workflow
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-custom-ink-black mb-6">Split Bills in 3 Easy Steps</h2>
          <p className="text-custom-air-force-blue text-xl max-w-2xl mx-auto">Our automated system handles the math so you can focus on the memories.</p>
        </div>

        <div className="space-y-32">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-16 animate-on-scroll ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="text-7xl font-bold text-custom-dark-teal/10 mb-4 tracking-tighter">{step.n}</div>
                <div className="bg-custom-dark-teal w-20 h-20 rounded-[2rem] flex items-center justify-center text-custom-success-green mb-8 shadow-2xl">
                  {step.icon}
                </div>
                <h3 className="text-4xl font-bold text-custom-ink-black mb-6">{step.title}</h3>
                <p className="text-xl text-custom-air-force-blue leading-relaxed mb-8">{step.desc}</p>
                <div className="flex items-center gap-4 text-custom-dark-teal font-bold hover:gap-6 transition-all cursor-pointer group">
                  <span className="text-sm uppercase tracking-widest">Learn more</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-custom-success-green/20 rounded-[3rem] translate-x-4 translate-y-4"></div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-[400px] object-cover rounded-[3rem] shadow-2xl relative z-10 border-4 border-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

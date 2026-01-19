
import React from 'react';
import { TESTIMONIALS, STATS_DATA } from '../constants.jsx';

const SocialProof = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl font-bold text-custom-ink-black mb-4">Trusted by Thousands of Groups</h2>
          <p className="text-custom-air-force-blue text-lg">Join the community making finances fair and simple.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-custom-beige/30 p-8 rounded-[2.5rem] border border-transparent hover:border-custom-success-green transition-all animate-on-scroll shadow-sm hover:shadow-xl group">
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-custom-success-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-custom-ink-black font-medium leading-relaxed mb-8 italic">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                <div>
                  <h4 className="font-bold text-custom-ink-black">{t.name}</h4>
                  <p className="text-sm text-custom-air-force-blue font-semibold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-custom-ash-grey/30">
          {STATS_DATA.map((stat, idx) => (
            <div key={idx} className="text-center animate-on-scroll">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
              <p className="text-4xl font-bold text-custom-dark-teal mb-2">{stat.value}</p>
              <p className="text-custom-air-force-blue font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

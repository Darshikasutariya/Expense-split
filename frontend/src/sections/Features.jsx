
import React from 'react';
import { FEATURES_DATA } from '../constants.jsx';

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-custom-success-green/5 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center text-custom-ink-black mb-16 animate-on-scroll">
          Everything You Need to Stay Balanced
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white p-10 rounded-[2.5rem] border border-transparent hover:border-custom-success-green hover:shadow-2xl transition-all animate-on-scroll group"
            >
              <div className="w-16 h-16 bg-custom-dark-teal text-custom-success-green rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-custom-ink-black mb-4">{feature.title}</h3>
              <p className="text-custom-air-force-blue leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

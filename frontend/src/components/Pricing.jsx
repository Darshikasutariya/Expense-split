
import React from 'react';
import { PRICING_TIERS } from '../constants.jsx';

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-6 bg-custom-ash-grey/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-custom-ink-black mb-16 animate-on-scroll">
          Fair Pricing for Every Squad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier, idx) => (
            <div 
              key={idx} 
              className={`relative p-10 rounded-[3rem] animate-on-scroll flex flex-col border-2 
                ${tier.popular ? 'bg-white border-custom-success-green shadow-2xl scale-105 z-10' : 'bg-custom-beige border-transparent'}
              `}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-custom-success-green text-custom-ink-black font-bold text-xs uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-custom-dark-teal mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-custom-ink-black">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-custom-air-force-blue font-medium">/mo</span>}
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-custom-air-force-blue font-medium">
                    <svg className="w-5 h-5 text-custom-success-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-bold transition-all shadow-sm 
                ${tier.popular ? 'bg-custom-success-green text-custom-ink-black hover:bg-custom-light-green' : 'bg-custom-dark-teal text-white hover:bg-custom-ink-black'}
              `}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

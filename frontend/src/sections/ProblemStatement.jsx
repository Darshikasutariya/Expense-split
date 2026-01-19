
import React from 'react';
import { PROBLEM_CARDS } from '../constants.jsx';

const ProblemStatement = () => {
  return (
    <section className="py-24 px-6 bg-custom-beige">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-custom-ink-black mb-16 animate-on-scroll">
          Tired of These Money Headaches?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEM_CARDS.map((card, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-custom-air-force-blue/20 shadow-sm hover:shadow-md transition-all animate-on-scroll group">
              <div className="text-custom-success-green mb-6 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-custom-ink-black mb-4">{card.title}</h3>
              <p className="text-custom-air-force-blue">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;

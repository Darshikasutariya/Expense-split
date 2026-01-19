
import React, { useState } from 'react';
import { FAQ_DATA } from '../constants.jsx';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-custom-ink-black mb-16 animate-on-scroll">
          Questions? We've Got Answers
        </h2>
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => (
            <div key={idx} className="border-2 border-custom-beige rounded-3xl overflow-hidden animate-on-scroll">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full px-8 py-6 text-left flex justify-between items-center bg-white hover:bg-custom-beige/30 transition-colors"
              >
                <span className="text-lg font-bold text-custom-ink-black">{item.q}</span>
                <svg className={`w-6 h-6 text-custom-success-green transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${openIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 text-custom-air-force-blue leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

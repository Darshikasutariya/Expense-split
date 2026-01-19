
import React from 'react';
import { USE_CASES } from '../constants.jsx';

const UseCases = () => {
  return (
    <section className="py-24 px-6 bg-custom-beige/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-on-scroll">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-custom-success-green rounded-lg flex items-center justify-center text-custom-dark-teal">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2.5"/></svg>
                </div>
                <span className="font-bold text-custom-dark-teal text-xs tracking-widest uppercase">Everyday Utility</span>
             </div>
            <h2 className="text-4xl md:text-5xl font-bold text-custom-ink-black">Perfect for All Your <br/><span className="text-custom-dark-teal">Shared Moments</span></h2>
          </div>
          <p className="text-custom-air-force-blue text-lg max-w-sm">Whether you live together or travel together, we've got your splits covered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {USE_CASES.map((uc, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all animate-on-scroll group border-b-8 border-transparent hover:border-custom-success-green">
              <div className="w-16 h-16 bg-custom-beige rounded-3xl flex items-center justify-center text-custom-dark-teal mb-8 group-hover:bg-custom-dark-teal group-hover:text-custom-success-green transition-all">
                {uc.icon}
              </div>
              <h3 className="text-2xl font-bold text-custom-ink-black mb-4">{uc.title}</h3>
              <p className="text-custom-air-force-blue leading-relaxed text-sm font-medium">{uc.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-custom-dark-teal font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  See Example
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;

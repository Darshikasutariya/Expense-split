
import React from 'react';
import { STATS_DATA, SECURITY_DATA } from '../constants.jsx';

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 animate-on-scroll">
          {STATS_DATA.map((stat, idx) => (
            <div key={idx} className="bg-custom-beige p-10 rounded-[3rem] text-center border border-custom-dark-teal/5 hover:border-custom-dark-teal/20 transition-all group">
              <div className="inline-flex text-custom-dark-teal mb-6 group-hover:scale-125 transition-transform duration-500">
                {stat.icon}
              </div>
              <p className="text-5xl font-bold text-custom-dark-teal mb-2">{stat.value}</p>
              <p className="text-custom-air-force-blue font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-custom-dark-teal mb-10">
              Safe. Private. <br />Trustworthy.
            </h2>
            <div className="space-y-8">
              {SECURITY_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl bg-custom-ash-grey/10 hover:bg-custom-ash-grey/20 transition-colors group">
                  <div className="bg-white p-4 rounded-2xl text-custom-dark-teal group-hover:bg-custom-dark-teal group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <span className="text-xl font-bold text-custom-dark-teal">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/id/${i + 50}/100/100`} className="w-12 h-12 rounded-full border-4 border-white shadow-lg" alt="User" />
                ))}
              </div>
              <p className="text-custom-air-force-blue text-sm font-semibold">Join 50,000+ happy splitters</p>
            </div>
          </div>

          <div className="relative animate-on-scroll delay-200">
            <div className="absolute inset-0 bg-custom-dark-teal/5 rounded-[4rem] -rotate-3"></div>
            <div className="relative bg-custom-beige p-12 rounded-[4rem] shadow-xl border border-white">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-5 h-5 text-custom-dark-teal" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <span className="text-custom-dark-teal font-bold text-sm">MARCH 2026</span>
              </div>
              <p className="text-2xl text-custom-ink-black font-semibold italic leading-relaxed mb-8">
                "The only app that actually understands how roommate life works. Simple, fast, and gorgeous UI. No more Excel sheets!"
              </p>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-custom-ash-grey rounded-2xl flex items-center justify-center text-custom-dark-teal font-bold text-2xl">MK</div>
                <div>
                  <h4 className="font-bold text-xl text-custom-dark-teal">Mark Kovacs</h4>
                  <p className="text-custom-air-force-blue text-sm uppercase tracking-widest font-bold">House Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

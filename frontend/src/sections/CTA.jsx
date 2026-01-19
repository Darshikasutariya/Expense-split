
import React from 'react';

const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-custom-beige/50 -skew-y-3 z-0"></div>
      
      <div className="max-w-6xl mx-auto bg-custom-dark-teal rounded-[4rem] p-12 md:p-24 text-center relative z-10 shadow-[0_50px_100px_-20px_rgba(1,22,30,0.4)]">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex p-4 bg-white/10 rounded-3xl mb-10 text-custom-light-green">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5"/></svg>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Stop Calculating. <br/>Start Splitting.
          </h2>
          <p className="text-custom-ash-grey text-xl md:text-2xl mb-14 opacity-90 leading-relaxed">
            Ready for a fairer financial life with your group? It takes less than 60 seconds to get your first group running.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="flex items-center justify-center gap-3 bg-custom-light-green text-custom-dark-teal px-12 py-6 rounded-3xl font-bold text-xl hover:bg-custom-light-green-hover hover:-translate-y-1 transition-all shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5"/></svg>
              Create Free Account
            </button>
            <button className="flex items-center justify-center gap-3 border-2 border-white/20 text-white px-12 py-6 rounded-3xl font-bold text-xl hover:bg-white/10 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2.5"/></svg>
              Get App Store Link
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-custom-ash-grey/60">
             <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/></svg>
                Secure
             </div>
             <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg>
                Transparent
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

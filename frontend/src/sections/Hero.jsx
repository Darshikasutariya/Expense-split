
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-custom-beige pt-20 pb-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 animate-on-scroll">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-custom-dark-teal p-3 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-custom-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-custom-dark-teal tracking-widest uppercase text-xs">Simplify your group expenses</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-custom-ink-black leading-[1.1] mb-8">
            Split Bills Fairly. <br />
            <span className="text-custom-dark-teal">Live Tension-Free.</span>
          </h1>
          <p className="text-xl text-custom-air-force-blue leading-relaxed mb-12 max-w-xl">
            The smart way to manage shared expenses with friends, family, and roommates. Stop the math and start the fun.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <button className="flex items-center justify-center gap-3 bg-custom-dark-teal text-custom-beige px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] hover:-translate-y-1 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Create First Group
            </button>
            <button className="flex items-center justify-center gap-3 border-2 border-custom-dark-teal text-custom-dark-teal px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Interactive Guide
            </button>
          </div>
        </div>

        <div className="flex-1 relative animate-on-scroll delay-200">
          <div className="relative">
            {/* <div className="absolute -top-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-10 animate-float border border-custom-ash-grey/30">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-custom-success-green" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                <p className="text-xs font-bold text-custom-air-force-blue">YOU'RE OWED</p>
              </div>
              <p className="text-3xl font-bold text-custom-success-green">₹1,250.00</p>
            </div> */}
            {/* <div className="absolute -bottom-10 -right-10 bg-custom-dark-teal p-8 rounded-3xl shadow-2xl z-10 text-white animate-float-delayed">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-custom-success-green flex items-center justify-center">
                  <svg className="w-6 h-6 text-custom-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold">Goa Trip 🏖️</p>
                  <p className="text-xs opacity-60">6 Members • Active</p>
                </div>
              </div>
            </div> */}
            <img
              src="https://media.istockphoto.com/id/2163640206/photo/divorce-law-and-inheritance-separation-concept-hand-separate-saving-money-finance-home-loan.jpg?s=612x612&w=0&k=20&c=Iq4ZLhbr3LmekRa6X0305QlOIa6mTzXlMPQRIaxTD88="
              alt="Friends splitting bill"
              className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float 4s ease-in-out infinite 2s; }
      `}</style>
    </section>
  );
};

export default Hero;

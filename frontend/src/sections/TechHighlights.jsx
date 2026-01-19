
import React from 'react';

const TechHighlights = () => {
  return (
    <section className="py-24 px-6 bg-custom-dark-teal text-custom-beige overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Built for Scale <br /> & <span className="text-custom-success-green">Security.</span>
          </h2>
          <ul className="space-y-6">
            {[
              "JWT authentication with secure refresh tokens",
              "Bank-level 256-bit data encryption",
              "Real-time balance updates via high-speed cache",
              "Scalable Docker-based cloud infrastructure",
              "Automated backup and disaster recovery"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 text-lg font-medium">
                <div className="bg-custom-success-green/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-custom-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" /></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="flex-1 relative animate-on-scroll delay-200">
          <div className="absolute inset-0 bg-custom-success-green/10 rounded-full blur-3xl"></div>
          <div className="relative bg-custom-ink-black/40 border border-white/10 p-10 rounded-[3rem] backdrop-blur-sm">
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center gap-2"><span className="text-custom-success-green">●</span> <span className="opacity-60">system:</span> checking integrity...</div>
              <div className="flex items-center gap-2"><span className="text-custom-success-green">●</span> <span className="opacity-60">auth:</span> session verified</div>
              <div className="flex items-center gap-2"><span className="text-custom-success-green">●</span> <span className="opacity-60">db:</span> transactions synced</div>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                <code className="text-custom-success-green">encryption_standard: AES_256_GCM</code>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default TechHighlights;

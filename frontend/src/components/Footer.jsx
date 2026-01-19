
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-custom-ink-black text-white pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-custom-success-green p-2 rounded-xl shadow-lg shadow-custom-success-green/20">
                <svg className="w-8 h-8 text-custom-ink-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8h6V2h-6v6z" />
                  <path d="M2 22h6v-6H2v6z" />
                  <path d="M16 22h6v-6h-6v6z" />
                  <path d="M2 8h6V2H2v6z" />
                </svg>
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">Expense Split</span>
            </div>
            <p className="text-custom-ash-grey text-lg leading-relaxed mb-10 opacity-80">
              Transforming the way groups handle money in India. We make shared expenses simple, transparent, and fair for everyone.
            </p>
            <div className="flex gap-4">
              {[
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              ].map((icon, i) => (
                <a key={i} href="#" className="bg-white/10 hover:bg-custom-success-green hover:text-custom-ink-black w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/5">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 lg:gap-32">
            <div>
              <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-custom-success-green animate-pulse"></div>
                Company
              </h4>
              <ul className="space-y-4 text-custom-ash-grey font-medium">
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-custom-success-green animate-pulse"></div>
                Privacy
              </h4>
              <ul className="space-y-4 text-custom-ash-grey font-medium">
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Data Safety</a></li>
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Split Logic API</a></li>
                <li><a href="#" className="hover:text-custom-success-green transition-colors">Security Audit</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-custom-ash-grey font-medium opacity-60">© 2026 Expense Split India. Made with ❤️ for group harmony.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.341c-.551 0-1-.449-1-1 0-.551.449-1 1-1 .552 0 1 .449 1 1 0 .551-.448 1-1 1zm-11 0c-.551 0-1-.449-1-1 0-.551.449-1 1-1s1 .449 1 1c0 .551-.449 1-1 1zm12.333-5.268c-.911 0-1.65-.739-1.65-1.65s.739-1.65 1.65-1.65 1.65.739 1.65 1.65-.739 1.65-1.65 1.65zm-12.666 0c-.911 0-1.65-.739-1.65-1.65s.739-1.65 1.65-1.65 1.65.739 1.65 1.65-.739 1.65-1.65 1.65zM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM12 4.14C7.659 4.14 4.14 7.659 4.14 12s3.519 7.86 7.86 7.86 7.86-3.519 7.86-7.86S16.341 4.14 12 4.14z"/></svg>
                 <span className="text-sm font-bold">App Store</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5.625 21l3.75-6.563-3.75-6.562h7.5l3.75 6.562-3.75 6.563h-7.5z"/></svg>
                 <span className="text-sm font-bold">Play Store</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    navigate('/auth');
  }
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-custom-ash-grey/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-custom-dark-teal p-1.5 rounded-lg group-hover:bg-custom-success-green transition-colors">
            <svg className="w-7 h-7 text-custom-success-green group-hover:text-custom-dark-teal transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8h6V2h-6v6z" />
              <path d="M2 22h6v-6H2v6z" />
              <path d="M16 22h6v-6h-6v6z" />
              <path d="M2 8h6V2H2v6z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-custom-dark-teal tracking-tight">Expense Split</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-custom-ink-black font-semibold text-sm uppercase tracking-wider">
          <a href="#features" className="flex items-center gap-2 hover:text-custom-dark-teal transition-colors group">
            <svg className="w-4 h-4 text-custom-success-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" strokeWidth="2.5" strokeLinecap="round" /></svg>
            Features
          </a>
          <a href="#how-it-works" className="flex items-center gap-2 hover:text-custom-dark-teal transition-colors group">
            <svg className="w-4 h-4 text-custom-success-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            How it Works
          </a>
          <a href="#faq" className="flex items-center gap-2 hover:text-custom-dark-teal transition-colors group">
            <svg className="w-4 h-4 text-custom-success-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            FAQ
          </a>
        </div>

        <button className="flex items-center gap-2 bg-custom-dark-teal text-white px-6 py-2.5 rounded-xl font-bold hover:bg-custom-ink-black transition-all shadow-lg group" onClick={handleGetStartedClick}>
          <svg className="w-4 h-4 text-custom-success-green group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

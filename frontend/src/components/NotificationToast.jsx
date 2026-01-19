
import React from 'react';

const NotificationToast = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] animate-bounce-in">
      <div className="bg-white border-l-4 border-custom-success-green shadow-2xl rounded-2xl p-6 flex items-center gap-4 min-w-[300px]">
        <div className="bg-custom-success-green/20 p-3 rounded-full">
          <svg className="w-6 h-6 text-custom-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" /></svg>
        </div>
        <div>
          <p className="font-bold text-custom-ink-black">Sarah added an expense</p>
          <p className="text-sm text-custom-air-force-blue">$52.40 for Dinner 🍕</p>
        </div>
        <button onClick={onClose} className="ml-4 text-custom-ash-grey hover:text-custom-ink-black">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
        </button>
      </div>
      <style>{`
        @keyframes bounce-in {
          0% { transform: translateX(100%); opacity: 0; }
          60% { transform: translateX(-10%); opacity: 1; }
          100% { transform: translateX(0); }
        }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default NotificationToast;

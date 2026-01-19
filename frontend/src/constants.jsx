
import React from 'react';

export const PROBLEM_CARDS = [
  {
    title: "Tracking who owes what",
    desc: "The constant mental load of remembering who paid for coffee, groceries, or gas.",
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="1.5" /></svg>
  },
  {
    title: "Complicated Group math",
    desc: "Spending hours after a trip calculating uneven splits and multi-currency bills.",
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="1.5" /></svg>
  },
  {
    title: "Awkward reminders",
    desc: "Feeling like the 'bad guy' when you have to remind friends to pay you back.",
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="1.5" /></svg>
  }
];

export const USE_CASES = [
  {
    title: "Group Travel",
    desc: "From flights to street food, track every rupee spent during your gang's adventures.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" /></svg>
  },
  {
    title: "Apartment Life",
    desc: "Split rent, electricity, and the 20-litre water bottle without any monthly confusion.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2.5" /></svg>
  },
  {
    title: "Dining Out",
    desc: "Don't ruin a good meal with math. Split the bill instantly including taxes and tips.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 4a2 2 0 100-4m0 4a2 2 0 110-4m-6 0a2 2 0 100 4m0-4a2 2 0 110 4m-3-2h6m-3-6v6m-4 8h8a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" strokeWidth="2.5" /></svg>
  },
  {
    title: "Daily Tasks",
    desc: "Shared groceries, movie tickets, or group gifts—manage every small expense daily.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2.5" /></svg>
  }
];

export const FAQ_DATA = [
  {
    q: "How does expense splitting work?",
    a: "Simply create a group, invite members, and add expenses. Our engine calculates the net balances so you only need to make one settlement instead of dozens of small payments."
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. We use bank-level encryption for all data and never store your raw banking passwords. Your privacy is our top priority."
  },
  {
    q: "Can I use this for business expenses?",
    a: "Absolutely! Many of our users use groups to track office petty cash or shared project supplies."
  },
  {
    q: "What payment methods are supported?",
    a: "We support recording settlements via Cash, UPI, and Bank Transfer. We help you track the payment even if it happens outside the app."
  }
];

export const FEATURES_DATA = [
  {
    title: "Smart Split Engine",
    description: "Split equally, by percentage, exact amounts, or custom shares. Supports multiple payers.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
  },
  {
    title: "Group Management",
    description: "Create unlimited groups for trips, households, or events. Add/remove members anytime.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  },
  {
    title: "Live Balances",
    description: "Real-time ledger tracking. Always know who owes what with simplified debt settlements.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    title: "Settlement Tracking",
    description: "Record settlements via Cash, UPI, or Bank Transfer. Keep a complete payment history.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  },
  {
    title: "Smart Notifications",
    description: "Get push and email alerts for new expenses, settlements, and payment reminders.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  },
  {
    title: "Cloud Sync",
    description: "Access your expenses on web, mobile, or tablet. Your data is always in sync.",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
  }
];

export const STATS_DATA = [
  { label: "Groups Created", value: "10,000+", icon: "👥" },
  { label: "Expenses Tracked", value: "50,000+", icon: "💸" },
  { label: "Reliability", value: "99.9%", icon: "⚡" }
];

export const TESTIMONIALS = [
  {
    name: "Arjun S.",
    role: "Flatmate",
    quote: "Finally, an app that makes splitting rent and groceries simple. No more monthly spreadsheets!",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    rating: 5
  },
  {
    name: "Priya V.",
    role: "Group Traveler",
    quote: "Used this for our Goa trip. Handled uneven splits perfectly when some friends ordered extra drinks!",
    avatar: "https://i.pravatar.cc/150?u=priya",
    rating: 5
  },
  {
    name: "Rohan M.",
    role: "Office Manager",
    quote: "The UPI settlement tracking is a lifesaver. Everyone pays back on time now.",
    avatar: "https://i.pravatar.cc/150?u=rohan",
    rating: 5
  }
];

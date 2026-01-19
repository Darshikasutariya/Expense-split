
import React, { useState } from 'react';

const SplitDemo = () => {
  const [amount, setAmount] = useState(1200);
  const [splitType, setSplitType] = useState('Equal');
  const people = ['You', 'Amit', 'Sneha', 'Rahul'];

  const getSplitValue = (personIdx) => {
    if (splitType === 'Equal') return (amount / people.length).toFixed(2);
    if (splitType === 'Exact') {
        // Simple mock for exact: You pay 50%, others split rest
        if (personIdx === 0) return (amount * 0.5).toFixed(2);
        return (amount * 0.166).toFixed(2);
    }
    if (splitType === 'Percentage') {
        // Simple mock for percentage: 40/20/20/20
        const weights = [40, 20, 20, 20];
        return (amount * (weights[personIdx] / 100)).toFixed(2);
    }
    return 0;
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-4 bg-custom-success-green/10 text-custom-dark-teal px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2.5"/></svg>
            Interactive Calculator
        </div>
        <h2 className="text-4xl font-bold text-custom-ink-black mb-6">See Splitting in Action</h2>
        <p className="text-custom-air-force-blue mb-12 text-lg">Pick a split method and see how instantly it calculates balances.</p>
        
        <div className="bg-custom-beige/30 p-8 md:p-12 rounded-[3rem] shadow-xl border border-custom-ash-grey/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-custom-air-force-blue mb-4 text-left">Expense Amount</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-custom-dark-teal">₹</span>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl text-2xl font-bold text-custom-dark-teal border-2 border-transparent focus:border-custom-success-green outline-none transition-all shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-custom-air-force-blue mb-4 text-left">Split Type</label>
              <div className="flex gap-2 h-[64px]">
                {['Equal', 'Exact', 'Percentage'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setSplitType(type)}
                    className={`flex-1 rounded-2xl font-bold transition-all border-2 ${splitType === type ? 'bg-custom-dark-teal text-white border-custom-dark-teal shadow-lg' : 'bg-white text-custom-dark-teal border-transparent hover:border-custom-ash-grey'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {people.map((person, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border-2 border-transparent hover:border-custom-success-green transition-all shadow-sm group">
                <div className="w-10 h-10 bg-custom-beige rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-custom-success-green group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2"/></svg>
                </div>
                <p className="text-sm font-bold text-custom-air-force-blue mb-2">{person}</p>
                <p className="text-xl font-bold text-custom-success-green">₹{getSplitValue(idx)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-3 text-custom-dark-teal font-bold bg-white/50 py-4 rounded-2xl">
            <svg className="w-5 h-5 text-custom-success-green" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Active Logic: {splitType} Splitting Applied
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitDemo;

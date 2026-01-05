
import React, { useState } from 'react';

interface PaymentModalProps {
  amount: number;
  eventName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, eventName, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-white placeholder-gray-600";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-2xl">
      <div className="glass rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-300">
        
        {step === 'details' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Secure Checkout</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Order #CC-{Math.floor(Math.random() * 9999)}</p>
              </div>
              <div className="bg-indigo-600/20 px-3 py-1 rounded-full">
                <span className="text-xs font-black text-indigo-400">SSL ENCRYPTED</span>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl mb-8 border border-white/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total to pay</p>
              <p className="text-2xl font-black text-white">₹{amount}.00</p>
              <p className="text-xs font-bold text-gray-400 mt-1 line-clamp-1">{eventName}</p>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Card Number</label>
                <div className="relative">
                  <input 
                    required 
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className={inputClasses}
                    value={cardData.number}
                    onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim()})}
                  />
                  <div className="absolute right-4 top-3.5 flex gap-1 opacity-50">
                    <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                    <div className="w-6 h-4 bg-amber-500 rounded-sm"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Expiry</label>
                  <input 
                    required 
                    placeholder="MM/YY"
                    className={inputClasses}
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">CVC</label>
                  <input 
                    required 
                    type="password" 
                    maxLength={3}
                    placeholder="•••"
                    className={inputClasses}
                    value={cardData.cvc}
                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-gray-200 transition-all mt-4"
              >
                Confirm Payment
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
              >
                Cancel Transaction
              </button>
            </form>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-16 text-center">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-black text-white mb-2">Validating Payment</h2>
            <p className="text-gray-500 text-sm font-medium">Securing your spot at the event...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-sm font-medium">Redirecting to your ticket...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

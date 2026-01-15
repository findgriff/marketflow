
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    "Preparing secure connection...",
    "Redirection to Stripe gateway...",
    "Verifying business profile...",
    "Authenticating secure access...",
    "Syncing dashboard metadata..."
  ];

  useEffect(() => {
    let interval: any;
    if (isConnecting && step < steps.length) {
      interval = setInterval(() => setStep(s => s + 1), 700);
    } else if (isConnecting && step >= steps.length) {
      setTimeout(() => navigate('/seller/dashboard'), 500);
    }
    return () => clearInterval(interval);
  }, [isConnecting, step, navigate]);

  if (isConnecting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="size-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-8 animate-pulse shadow-inner">
          <svg fill="#635BFF" height="48" viewBox="0 0 40 40" width="48" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.1415 16.7909C19.1415 14.8818 20.7324 13.9182 23.3686 13.9182C24.7777 13.9182 26.6868 14.2364 28.1413 14.7818V10.1455C26.5959 9.6 24.8232 9.28182 23.1413 9.28182C17.5504 9.28182 13.6868 12.2364 13.6868 17.1545C13.6868 24.9273 24.1413 23.6091 24.1413 28.2909C24.1413 30.5636 22.0959 31.4727 19.3233 31.4727C17.5961 31.4727 15.3233 31.0182 13.8232 30.2909V35.0636C15.6868 35.8364 17.8233 36.2 19.8688 36.2C25.5506 36.2 29.5961 33.2 29.5961 28.1545C29.5961 20.0636 19.1415 21.6091 19.1415 16.7909Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black mb-2">Secure Link to Stripe</h2>
        <p className="text-slate-500 font-bold mb-8 transition-all">{steps[Math.min(step, steps.length - 1)]}</p>
        <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${(step / steps.length) * 100}%` }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Step 1 of 3</span>
          <h2 className="text-5xl font-black tracking-tight leading-none">Monetize your creations.</h2>
          <p className="text-lg text-slate-500 font-bold leading-relaxed">
            MarketFlow partners with Stripe to ensure your payouts are secure, fast, and automated. Connect your account to start selling.
          </p>
          <ul className="space-y-4 pt-4">
            {['Instant 1-click payouts', 'Secure PCI-compliant storage', 'Detailed tax reporting support'].map(item => (
              <li key={item} className="flex items-center gap-3 font-bold text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-8 text-center">
          <div className="size-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl text-blue-500">account_balance_wallet</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Stripe Connect</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">You will be redirected to Stripe to securely complete your seller onboarding.</p>
          </div>
          <button 
            onClick={() => setIsConnecting(true)}
            className="w-full h-14 bg-[#635BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
          >
            Initiate Connection
            <span className="material-symbols-outlined text-lg">open_in_new</span>
          </button>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            Bank-grade Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

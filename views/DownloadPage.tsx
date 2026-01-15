
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const DownloadPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 md:p-20">
      <div className="max-w-2xl mx-auto space-y-10">
        <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          <Link to="/buyer/orders" className="hover:text-primary transition-colors">My Purchases</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Order #{orderId}</span>
        </nav>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            <span className="material-symbols-outlined text-sm">verified</span>
            Payment Verified
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Your digital asset is ready.</h1>
          <p className="text-lg text-slate-500 font-bold">Please download your files using the secure, encrypted link below.</p>
        </div>

        <div className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl transition-all hover:shadow-primary/5">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="size-32 rounded-3xl bg-primary/5 flex items-center justify-center border-2 border-dashed border-primary/20 transition-all group-hover:border-primary/40 group-hover:scale-105">
                <span className="material-symbols-outlined text-6xl text-primary">folder_zip</span>
              </div>
              <div className="absolute -top-3 -right-3 size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900">
                <span className="material-symbols-outlined text-base">lock</span>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Premium-Masterclass-Bundle.zip</h3>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>124.5 MB</span>
                <span className="size-1 rounded-full bg-slate-300"></span>
                <span>Zip Archive</span>
                <span className="size-1 rounded-full bg-slate-300"></span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Verified Clean
                </span>
              </div>
              <div className="pt-6">
                <button className="w-full md:w-auto px-12 py-5 bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                  <span className="material-symbols-outlined">download</span>
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-2xl">info</span>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Download Policy</p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                  You have <span className="text-slate-900 dark:text-white">2 of 5</span> attempts remaining for this asset.
                  The secure link expires <span className="text-slate-900 dark:text-white">Dec 31, 2024</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Need help?</p>
              <p className="text-sm font-bold text-slate-500">Support is active 24/7.</p>
            </div>
            <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group">
              Contact
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/buyer/orders" className="flex items-center gap-3 text-sm font-black text-slate-400 hover:text-primary transition-all group uppercase tracking-widest">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to my orders
          </Link>
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Security by MarketFlow Shield</span>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="material-symbols-outlined text-sm">shield</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;

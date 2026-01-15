
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';

const ORDERS: Order[] = [
  { id: 'ORD-8829-X', productName: 'Premium UI Kit Pro', sellerName: 'PixelDesign', date: 'Oct 12, 2023', status: 'Completed', thumbnail: 'https://picsum.photos/seed/ui/100/100' },
  { id: 'ORD-7741-K', productName: 'Abstract 3D Renders', sellerName: 'StudioArc', date: 'Oct 08, 2023', status: 'Completed', thumbnail: 'https://picsum.photos/seed/3d/100/100' },
  { id: 'ORD-6215-M', productName: 'Modern Icon Set', sellerName: 'IconicLabs', date: 'Sep 30, 2023', status: 'Processing', thumbnail: 'https://picsum.photos/seed/icons/100/100' },
];

const BuyerOrders: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Camera access denied:', err);
      setIsScanning(false);
    }
  };

  const stopScan = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 md:p-12">
      <div className="max-w-[1120px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Purchases</h2>
            <p className="text-slate-500 font-bold mt-2">Manage your digital assets and order history.</p>
          </div>
          <button 
            onClick={startScan}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
            Scan Order Code
          </button>
        </header>

        {/* Camera Modal */}
        {isScanning && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={stopScan}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none">
                  <div className="w-full h-full border-2 border-primary animate-pulse"></div>
                </div>
              </div>
              <div className="p-8 text-center">
                <h4 className="text-xl font-black mb-2">Scanning...</h4>
                <p className="text-sm text-slate-500 font-bold mb-6">Align the order QR code from your confirmation email within the frame.</p>
                <button onClick={stopScan} className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={order.thumbnail} className="size-12 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-sm font-black">{order.productName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Order #{order.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">{order.date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link to={`/buyer/download/${order.id}`} className="inline-flex size-10 items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrders;

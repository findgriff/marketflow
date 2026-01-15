
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import SalesBot from './components/SalesBot';
import Marketplace from './views/Marketplace';
import Onboarding from './views/Onboarding';
import AddProduct from './views/AddProduct';
import SellerDashboard from './views/SellerDashboard';
import BuyerOrders from './views/BuyerOrders';
import DownloadPage from './views/DownloadPage';
import AdminOversight from './views/AdminOversight';
import { AppRole } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole>('buyer');
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Navbar currentRole={role} onRoleChange={setRole} cartCount={cartCount} />
        
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <Routes>
            {/* Landing/Marketplace */}
            <Route path="/marketplace" element={<Marketplace onAddToCart={handleAddToCart} />} />
            
            {/* Seller Routes */}
            <Route path="/seller/onboarding" element={<Onboarding />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/add-product" element={<AddProduct />} />
            
            {/* Buyer Routes */}
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/buyer/download/:orderId" element={<DownloadPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/oversight" element={<AdminOversight />} />
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/marketplace" replace />} />
          </Routes>

          {/* AI Sales Bot Assistant */}
          <SalesBot />
        </div>

        {/* Global Floating Context Switcher (Debug Only) */}
        <div className="fixed bottom-4 left-4 z-[9999] p-1 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 flex gap-1 scale-90 md:scale-100">
          <Link 
            to="/marketplace" 
            onClick={() => setRole('buyer')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${role === 'buyer' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            Buyer
          </Link>
          <Link 
            to="/seller/dashboard" 
            onClick={() => setRole('seller')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${role === 'seller' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            Seller
          </Link>
          <Link 
            to="/admin/oversight" 
            onClick={() => setRole('admin')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${role === 'admin' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            Admin
          </Link>
        </div>
      </div>
    </Router>
  );
};

export default App;

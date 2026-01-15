
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppRole } from '../types';

interface NavbarProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  cartCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentRole, cartCount = 0 }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  // Initialize theme state based on current document class
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getActiveStyles = (path: string) => 
    location.pathname.startsWith(path) 
      ? "text-primary border-primary" 
      : "text-slate-500 dark:text-slate-400 border-transparent hover:text-primary transition-colors";

  return (
    <nav className="sticky top-0 z-50 glass-header border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/marketplace" className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined block text-[24px]">layers</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">MarketFlow</h1>
          </Link>

          <div className="hidden md:flex items-center gap-6 h-16">
            <Link to="/marketplace" className={`h-full flex items-center px-1 text-sm font-bold border-b-2 ${getActiveStyles('/marketplace')}`}>
              Marketplace
            </Link>
            
            {currentRole === 'seller' && (
              <>
                <Link to="/seller/dashboard" className={`h-full flex items-center px-1 text-sm font-bold border-b-2 ${getActiveStyles('/seller/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/seller/add-product" className={`h-full flex items-center px-1 text-sm font-bold border-b-2 ${getActiveStyles('/seller/add-product')}`}>
                  Add Product
                </Link>
              </>
            )}

            {currentRole === 'buyer' && (
              <Link to="/buyer/orders" className={`h-full flex items-center px-1 text-sm font-bold border-b-2 ${getActiveStyles('/buyer/orders')}`}>
                My Purchases
              </Link>
            )}

            {currentRole === 'admin' && (
              <Link to="/admin/oversight" className={`h-full flex items-center px-1 text-sm font-bold border-b-2 ${getActiveStyles('/admin/oversight')}`}>
                Oversight
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-48 xl:w-64 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white dark:border-slate-800 px-0.5 animate-in zoom-in duration-300">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-none text-slate-900 dark:text-white group-hover:text-primary transition-colors">Alex Rivera</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tighter">Pro Member</p>
            </div>
            <div className="size-9 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="User profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

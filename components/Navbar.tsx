
import React, { useState } from 'react';
import { ViewState } from '@/lib/types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount, onOpenCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navClass = (view: ViewState) => 
    `cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
      currentView === view 
      ? 'text-fifi-600 border-b-2 border-fifi-500' 
      : 'text-gray-600 hover:text-fifi-500'
    }`;

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-fifi-900 text-fifi-50 text-xs text-center py-2 tracking-wide font-medium">
        ✨ Free Shipping on orders over $150 | Handcrafted with Love 🤎
      </div>

      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-fifi-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer group"
                onClick={() => setView(ViewState.HOME)}
              >
                <span className="text-2xl font-bold font-serif text-fifi-800 tracking-tight group-hover:text-fifi-600 transition-colors">
                  FIFI<span className="text-gray-800 font-sans font-light">-Bags</span>
                </span>
                <span className="ml-1 text-xl group-hover:rotate-12 transition-transform duration-300">👜</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <div onClick={() => setView(ViewState.HOME)} className={navClass(ViewState.HOME)}>Home</div>
                <div onClick={() => setView(ViewState.SHOP)} className={navClass(ViewState.SHOP)}>Shop Collection</div>
                <div onClick={() => setView(ViewState.ABOUT)} className={navClass(ViewState.ABOUT)}>About Fifi</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                  onClick={onOpenCart}
                  className="relative p-2 text-gray-400 hover:text-fifi-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-fifi-600 rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-fifi-500 hover:bg-fifi-50 focus:outline-none"
                >
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-fifi-100">
            <div className="pt-2 pb-3 space-y-1">
              <div onClick={() => { setView(ViewState.HOME); setIsMobileMenuOpen(false); }} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-fifi-600 hover:bg-fifi-50 cursor-pointer">Home</div>
              <div onClick={() => { setView(ViewState.SHOP); setIsMobileMenuOpen(false); }} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-fifi-600 hover:bg-fifi-50 cursor-pointer">Shop</div>
              <div onClick={() => { setView(ViewState.ABOUT); setIsMobileMenuOpen(false); }} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-fifi-600 hover:bg-fifi-50 cursor-pointer">About</div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

import React, { useState } from 'react';
import { Heart, Menu, X, BookOpen, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'recommendation' | 'admin';
  onSelectTab: (tab: 'catalog' | 'recommendation' | 'admin') => void;
  isAdminAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, isAdminAuthenticated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group py-1"
          >
            <img 
              src="/iyum-makeover-logo.png" 
              alt="IYUM MakeOver — Makeup & Wedding Gallery" 
              className="h-11 sm:h-12 w-auto object-contain rounded-md shadow-xs border border-amber-200/50 bg-[#fbf8f3] group-hover:shadow-md transition-all" 
            />
            <div className="hidden xl:flex flex-col justify-center">
              <span className="text-[10px] tracking-wider uppercase text-rose-600 font-bold leading-none">
                Sistem Rekomendasi SAW
              </span>
              <span className="text-[11px] text-stone-500 font-medium mt-0.5">
                Gentan, Sukoharjo
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Katalog Paket
            </button>

            <button
              onClick={() => onSelectTab('recommendation')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                activeTab === 'recommendation'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-200 shadow-md ring-2 ring-rose-300 ring-offset-1'
                  : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow'
              }`}
            >
              <Heart className="w-4 h-4 fill-white/80" />
              Rekomendasi Paket
            </button>

            <div className="h-6 w-px bg-stone-200 mx-2" />

            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Admin</span>
              {isAdminAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sesi admin aktif" />
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white/95 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => {
              onSelectTab('catalog');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'catalog' ? 'bg-rose-50 text-rose-700' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Katalog Paket
          </button>
          <button
            onClick={() => {
              onSelectTab('recommendation');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-rose-500 text-white"
          >
            <Heart className="w-4 h-4 fill-white" />
            Rekomendasi Paket
          </button>
          <button
            onClick={() => {
              onSelectTab('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'admin' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Admin</span>
            </div>
            {isAdminAuthenticated && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                Aktif
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};

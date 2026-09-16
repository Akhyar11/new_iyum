import React, { useState } from 'react';
import { 
  LogOut, 
  User, 
  Shield, 
  X, 
  AlertTriangle,
  LayoutDashboard,
  PackageOpen,
  HelpCircle,
  Sliders,
  FileSpreadsheet,
  BarChart3,
  Menu
} from 'lucide-react';

export interface AdminMenuItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    shortLabel: 'Beranda',
    icon: LayoutDashboard 
  },
  { 
    id: 'packages', 
    label: 'Kelola Paket', 
    shortLabel: 'Paket',
    icon: PackageOpen 
  },
  { 
    id: 'questions', 
    label: 'Kelola Pertanyaan', 
    shortLabel: 'Pertanyaan',
    icon: HelpCircle 
  },
  { 
    id: 'weights', 
    label: 'Atur Bobot & Nilai', 
    shortLabel: 'Bobot SAW',
    icon: Sliders,
    badge: '100%'
  },
  { 
    id: 'recommendations', 
    label: 'Data Rekomendasi', 
    shortLabel: 'Riwayat',
    icon: FileSpreadsheet 
  },
  { 
    id: 'reports', 
    label: 'Laporan', 
    shortLabel: 'Laporan',
    icon: BarChart3 
  }
];

interface AdminHeaderProps {
  onLogout: () => void;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  activeMenu,
  onSelectMenu,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleMenuClick = (menuId: string) => {
    onSelectMenu(menuId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs transition-all">
      {/* Top Bar: Brand & Profile Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <img 
              src="/iyum-makeover-logo.png" 
              alt="IYUM MakeOver" 
              className="h-10 w-auto object-contain rounded-md border border-amber-200/50 bg-[#fbf8f3] shadow-xs" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                  Panel Admin
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                  Admin
                </span>
              </div>
              <span className="text-xs text-stone-500">
                IYUM MakeOver — SAW Decision System
              </span>
            </div>
          </div>

          {/* User Profile & Logout Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-semibold text-stone-800">Administrator</span>
              <Shield className="w-3 h-3 text-emerald-600 ml-0.5" />
            </div>

            {/* Tombol Keluar (Logout) */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 text-stone-700 hover:text-rose-600 text-xs sm:text-sm font-semibold transition-all cursor-pointer group"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Keluar</span>
            </button>

            {/* Mobile Nav Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Buka menu navigasi admin"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Desktop Navigation Bar with Active Indicators */}
      <div className="hidden lg:block border-t border-stone-100 bg-stone-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 py-2 overflow-x-auto" aria-label="Menu Admin">
            {ADMIN_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenuClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white border border-transparent hover:border-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>

                  {/* Optional Badge */}
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu with Active Indicators */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1.5 shadow-lg animate-fadeIn">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
            Menu Pengelolaan
          </p>
          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMenuClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              Konfirmasi Keluar Akun
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
              Apakah Anda yakin ingin keluar dari area pengelolaan admin? Sesi aktif Anda akan ditutup dan Anda akan dialihkan kembali ke beranda katalog.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Ya, Keluar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

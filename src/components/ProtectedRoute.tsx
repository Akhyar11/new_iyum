import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onNavigateToLogin?: () => void;
  onNavigateToCatalog?: () => void;
  title?: string;
  message?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  fallback,
  onNavigateToLogin,
  onNavigateToCatalog,
  title = 'Akses Area Pengelolaan Terproteksi',
  message = 'Halaman ini dilindungi dan hanya dapat diakses oleh administrator resmi. Silakan masuk dengan akun admin Anda untuk melanjutkan.'
}) => {
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-stone-100/60">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200/80 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
              401 Akses Ditolak
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {title}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {onNavigateToLogin && (
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </button>
            )}
            {onNavigateToCatalog && (
              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ke Katalog</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

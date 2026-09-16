import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  XCircle,
  CheckCircle2
} from 'lucide-react';

import { saveAdminSession } from '../lib/adminAuth';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToCatalog: () => void;
  unauthorizedNotice?: string;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToCatalog,
  unauthorizedNotice,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessRedirecting, setIsSuccessRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setHasError(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const normalizedEmail = email.trim().toLowerCase();
      // Kredensial admin yang valid
      const isValidAdmin = 
        (normalizedEmail === 'admin@iyummakeover.com' && password === 'admin123') ||
        (normalizedEmail === 'admin@griyarias.com' && password === 'admin123') ||
        (normalizedEmail === 'admin@makeup.com' && password === 'admin12345');

      if (isValidAdmin) {
        setIsSuccessRedirecting(true);
        saveAdminSession({
          email: normalizedEmail,
          name: 'Administrator IYUM MakeOver',
          role: 'admin'
        });
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
      } else {
        // Tampilkan pesan error kredensial salah
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setHasError(true);

        if (newAttempts >= 3) {
          setErrorMessage(
            'Kredensial tidak cocok setelah beberapa kali percobaan. Silakan gunakan tombol "Gunakan Akun Demo" di bawah jika Anda lupa kata sandi.'
          );
        } else {
          setErrorMessage(
            'Email atau kata sandi yang Anda masukkan salah. Mohon periksa kembali huruf besar/kecil dan kombinasi kata sandi Anda.'
          );
        }
      }
    }, 500);
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@iyummakeover.com');
    setPassword('admin123');
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetic touches */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#f43f5e_0.75px,transparent_0.75px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-700 hover:text-rose-600 text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Icon Header */}
        <div className="text-center">
          <div className="mb-4 inline-block bg-[#fbf8f3] p-3 rounded-2xl border border-amber-200/50 shadow-md">
            <img 
              src="/iyum-makeover-logo.png" 
              alt="IYUM MakeOver" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Masuk Panel Admin
          </h1>
          <p className="mt-1.5 text-stone-600 text-xs sm:text-sm">
            IYUM MakeOver — Pengelolaan Paket & Rekomendasi SAW
          </p>
        </div>

        {/* Login Form Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-stone-200/80 space-y-6">
          
          {/* Route Protection Unauthorized Notice */}
          {unauthorizedNotice && !isSuccessRedirecting && (
            <div 
              role="alert"
              className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-xs"
            >
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block text-amber-800 mb-0.5">
                  Area Terproteksi Administrator
                </strong>
                <p className="leading-relaxed text-amber-700">
                  {unauthorizedNotice}
                </p>
              </div>
            </div>
          )}

          {/* Success Redirect Banner to Dashboard */}
          {isSuccessRedirecting && (
            <div 
              role="alert"
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-3 shadow-xs animate-fadeIn"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block text-emerald-800 mb-0.5">
                  Autentikasi Berhasil!
                </strong>
                <p className="leading-relaxed text-emerald-700">
                  Kredensial valid. Mengarahkan ke Halaman Dashboard Pengelolaan...
                </p>
              </div>
            </div>
          )}

          {/* Prominent Error Banner for Wrong Credentials */}
          {hasError && errorMessage && (
            <div 
              role="alert"
              className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-3 shadow-xs animate-shake"
            >
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block text-rose-800 mb-0.5">
                  Autentikasi Gagal!
                </strong>
                <p className="leading-relaxed text-rose-700">
                  {errorMessage}
                </p>
                {failedAttempts > 0 && (
                  <p className="mt-1 text-[11px] text-rose-500">
                    Jumlah kegagalan login: {failedAttempts} kali
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Alamat Email Admin
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  hasError ? 'text-rose-500' : 'text-stone-400'
                }`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="admin@griyarias.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none transition-all placeholder-stone-400 ${
                    hasError 
                      ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 focus:border-rose-500' 
                      : 'border-stone-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-stone-400">Min. 6 karakter</span>
              </div>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  hasError ? 'text-rose-500' : 'text-stone-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none transition-all placeholder-stone-400 ${
                    hasError 
                      ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 focus:border-rose-500' 
                      : 'border-stone-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  aria-label="Tampilkan sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasError && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Kombinasi email dan sandi tidak cocok.
                </p>
              )}
            </div>

            {/* Remember Me & Note */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-rose-600 focus:ring-rose-400 cursor-pointer"
                />
                <span>Ingat saya</span>
              </label>

              <span className="text-stone-400 text-[11px]">Sesi Terlindungi</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccessRedirecting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSuccessRedirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengarahkan ke Dashboard Admin...</span>
                </>
              ) : isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credential Assistant */}
          <div className="pt-4 border-t border-stone-100">
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Kredensial Akun Demo
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Gunakan Akun Ini
                </button>
              </div>
              <div className="text-[11px] text-amber-800 space-y-0.5 font-mono">
                <p>Email : admin@griyarias.com</p>
                <p>Sandi : admin123</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Koneksi aman terenkripsi SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

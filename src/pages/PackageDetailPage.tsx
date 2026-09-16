import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Heart,
  Share2,
  AlertCircle,
  ChevronRight,
  Home
} from 'lucide-react';
import { Package } from '../types';
import { formatRupiah } from '../utils/formatters';
import { getWhatsAppBookingUrl } from '../lib/businessInfo';

interface PackageDetailPageProps {
  pkg: Package;
  onBack: () => void;
  onStartRecommendation: () => void;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({
  pkg,
  onBack,
  onStartRecommendation,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Allow pressing Escape to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Navigation Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
            <button
              onClick={onBack}
              className="flex items-center gap-1 hover:text-rose-600 transition-colors font-medium cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <button
              onClick={onBack}
              className="hover:text-rose-600 transition-colors font-medium cursor-pointer"
            >
              Katalog Paket
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-800 font-semibold truncate max-w-[200px]">
              {pkg.name}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            {/* Primary Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-rose-600 hover:border-rose-300 text-sm font-medium shadow-xs hover:shadow transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Katalog
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-medium shadow-xs transition-all cursor-pointer"
              title="Bagikan paket"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Tautan Disalin!' : 'Bagikan'}
            </button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photos & Visuals */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-rose-100 bg-stone-200 aspect-[4/3]">
              <img
                src={pkg.photo_url}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/10" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-sm inline-block mb-2">
                  {pkg.category || 'Paket Make Up'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  {pkg.name}
                </h1>
              </div>
            </div>

            {/* Guarantees / Studio Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center gap-3">
                <Clock className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Tahan 12+ Jam</p>
                  <p className="text-[11px] text-stone-500">Formula waterproof & flawless</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Produk Higienis</p>
                  <p className="text-[11px] text-stone-500">Brand premium teruji BPOM</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center gap-3">
                <Calendar className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Booking Aman</p>
                  <p className="text-[11px] text-stone-500">Jadwal eksklusif terikat kontrak</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/80 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Deskripsi Lengkap Paket
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {pkg.description}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Setiap sentuhan riasan disesuaikan dengan kontur wajah, warna kulit (*undertone*), serta gaya adat atau modern yang Anda pilih. Tim MUA kami memastikan hasil riasan tampak mempesona baik secara langsung maupun saat diabadikan oleh fotografer.
              </p>
            </div>

            {/* Facilities List Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/80 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                Rincian Fasilitas & Pelayanan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {pkg.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100/70 text-xs sm:text-sm text-stone-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section from Pricelist 2025 */}
            {pkg.notes && pkg.notes.length > 0 && (
              <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <span>📋</span> Ketentuan &amp; Catatan Tambahan (Pricelist 2025)
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-amber-950/85">
                  {pkg.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Navigation Button — Easy Return to Catalog */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-200">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-rose-600 hover:border-rose-300 text-sm font-medium shadow-xs transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Daftar Semua Paket
              </button>

              <button
                type="button"
                onClick={onStartRecommendation}
                className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold cursor-pointer"
              >
                <span>Coba Rekomendasi SAW</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Pricing, CTA & SAW Match Card */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Price & Action Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-6">
              <div className="border-b border-stone-100 pb-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Biaya Investasi Paket
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                    {formatRupiah(pkg.price)}
                  </span>
                  <span className="text-xs text-stone-500">/ acara</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Status: Tersedia untuk Reservasi
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    ID: {pkg.code}
                  </span>
                </div>
              </div>

              {/* SAW Callout Box */}
              <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 rounded-2xl p-5 border border-rose-200/70 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Heart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 fill-rose-600/30" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Apakah Paket Ini Cocok untuk Anda?
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Gunakan sistem rekomendasi SAW dengan 10 kriteria kami untuk menghitung tingkat kecocokan paket ini dibanding paket lainnya secara objektif.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onStartRecommendation}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Cek Rekomendasi SAW Sekarang
                </button>
              </div>

              {/* Consultation / Booking CTA */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppBookingUrl(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  Tanya Ketersediaan Jadwal via WhatsApp
                </a>

                <div className="flex items-center gap-2 justify-center text-[11px] text-stone-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Respon cepat jam 08.00 - 20.00 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

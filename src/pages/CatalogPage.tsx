import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  Search, 
  X, 
  SearchX, 
  RotateCcw, 
  ArrowRight,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  CalendarCheck
} from 'lucide-react';
import { Package } from '../types';
import { PRICELIST_TERMS } from '../data/mockPackages';
import { getStoredPackages } from '../lib/packageStore';
import { PackageCard } from '../components/PackageCard';
import { PackageDetailModal } from '../components/PackageDetailModal';
import { BUSINESS_INFO } from '../lib/businessInfo';

interface CatalogPageProps {
  onStartRecommendation: () => void;
  onSelectPackage?: (pkg: Package) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ 
  onStartRecommendation,
  onSelectPackage 
}) => {
  const [packages, setPackages] = useState<Package[]>(() => getStoredPackages());
  const [modalPackage, setModalPackage] = useState<Package | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPricelistModalOpen, setIsPricelistModalOpen] = useState(false);
  const [currentPricelistPage, setCurrentPricelistPage] = useState(1);

  useEffect(() => {
    const handleSync = () => {
      setPackages(getStoredPackages());
    };
    window.addEventListener('packages_updated', handleSync);
    return () => window.removeEventListener('packages_updated', handleSync);
  }, []);

  // Categories list based on authentic 2025 pricelist
  const categories = useMemo(() => {
    return ['all', 'Akad & Resepsi', 'Akad Nikah', 'Resepsi', 'Ngunduh Mantu', 'Prosesi Adat'];
  }, []);

  // Filtered packages based on search query and category
  const filteredPackages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    return packages.filter((pkg) => {
      const matchCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
      
      if (!matchCategory) return false;
      if (!q) return true;

      const inName = pkg.name.toLowerCase().includes(q);
      const inDesc = pkg.description.toLowerCase().includes(q);
      const inCategory = pkg.category ? pkg.category.toLowerCase().includes(q) : false;
      const inCode = pkg.code.toLowerCase().includes(q);
      const inFacilities = pkg.facilities.some(f => f.toLowerCase().includes(q));

      return inName || inDesc || inCategory || inCode || inFacilities;
    });
  }, [packages, searchQuery, selectedCategory]);

  const handleCardClick = (pkg: Package) => {
    if (onSelectPackage) {
      onSelectPackage(pkg);
    } else {
      setModalPackage(pkg);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-stone-50 to-stone-50 pt-10 pb-14 sm:pt-16 sm:pb-20 border-b border-rose-100/60">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#f43f5e_0.75px,transparent_0.75px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official Brand Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="bg-[#fbf8f3] px-6 py-3 rounded-2xl border border-amber-200/60 shadow-sm inline-block hover:shadow-md transition-shadow">
              <img 
                src="/iyum-makeover-logo.png" 
                alt="IYUM MakeOver — Makeup & Wedding Gallery" 
                className="h-12 sm:h-16 w-auto object-contain" 
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-stone-500 mt-2.5 font-medium">
              <a 
                href={BUSINESS_INFO.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-rose-600 transition-colors"
              >
                Instagram: <span className="font-semibold text-stone-700">@{BUSINESS_INFO.instagram}</span>
              </a>
              <span className="text-stone-300">•</span>
              <a 
                href={BUSINESS_INFO.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition-colors"
              >
                WA: <span className="font-semibold text-stone-700">{BUSINESS_INFO.phone}</span>
              </a>
              <span className="text-stone-300">•</span>
              <span>{BUSINESS_INFO.address}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            Official Wedding Pricelist 2025 &amp; Sistem Rekomendasi SAW
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Katalog Paket Make Up &amp; Wedding Gallery
          </h1>

          <p className="mt-4 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pilihan paket rias pengantin, ngunduh mantu, resepsi, dan siraman berkelas dengan formula tahan lama, kebaya anggun, dan perhiasan adat eksklusif.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 justify-center items-center">
            {/* Main CTA: Mulai Rekomendasi */}
            <button
              type="button"
              onClick={onStartRecommendation}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-sm shadow-md shadow-rose-300 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Heart className="w-4 h-4 fill-white/80 group-hover:scale-110 transition-transform" />
              Cari Rekomendasi SAW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA: Lihat Brosur Pricelist Asli */}
            <button
              type="button"
              onClick={() => setIsPricelistModalOpen(true)}
              className="px-5 py-3 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Buka Brosur Pricelist (7 Halaman)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/80 mb-10 space-y-5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama paket, fasilitas, atau kata kunci (misal: kebaya, melati, jaga kado)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white focus:outline-hidden text-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-2">
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat === 'all' ? 'Semua Paket (Pricelist 2025)' : cat}
              </button>
            ))}
          </div>

          {/* Search/Filter summary badge */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>
              Menampilkan <strong>{filteredPackages.length}</strong> paket dari total {packages.length} paket resmi IYUM MakeOver
            </span>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="ml-2 inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Packages Grid or Empty State */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onViewDetail={handleCardClick}
                onStartRecommendation={onStartRecommendation}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Results Message */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-stone-300 shadow-xs max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              Tidak Ada Paket yang Ditemukan
            </h3>

            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              Tidak ada paket make up yang sesuai dengan kata kunci{' '}
              <span className="font-semibold text-stone-800">"{searchQuery}"</span>
              {selectedCategory !== 'all' && (
                <span> pada kategori <span className="font-semibold text-stone-800">"{selectedCategory}"</span></span>
              )}.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClearSearch}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Tampilkan Semua Paket
              </button>

              <button
                type="button"
                onClick={onStartRecommendation}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Mulai Rekomendasi SAW
              </button>
            </div>
          </div>
        )}

        {/* Syarat & Ketentuan Section (from Page 7 of Pricelist) */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-snug">
                Syarat dan Ketentuan Pemesanan (Pricelist 2025)
              </h3>
              <p className="text-xs text-stone-500">
                Ketentuan resmi reservasi tanggal dan layanan IYUM MakeOver
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
            {PRICELIST_TERMS.map((term, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl bg-[#fbf8f3] border border-amber-200/60 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-stone-800 font-medium leading-relaxed">
                  {term}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <span>
              Butuh konsultasi tanggal khusus atau lokasi acara di luar Pulau Jawa?
            </span>
            <a 
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Konsultasi Admin WA: {BUSINESS_INFO.phone}</span>
            </a>
          </div>
        </div>

        {/* Bottom Callout Banner with Mulai Rekomendasi */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-white">
              Bingung Menentukan Paket Mana yang Paling Tepat?
            </h3>
            <p className="text-stone-300 text-sm max-w-xl">
              Cukup jawab 10 pertanyaan singkat mengenai jenis acara, tema busana, adat, dan budget Anda. Sistem SAW kami akan merekomendasikan paket paling ideal dari pricelist resmi!
            </p>
          </div>
          <button
            type="button"
            onClick={onStartRecommendation}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-semibold shadow-lg shadow-rose-950/40 hover:shadow-xl transition-all flex-shrink-0 flex items-center gap-2.5 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Mulai Rekomendasi SAW
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Floating Action Button for instant access to Mulai Rekomendasi while scrolling */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          type="button"
          onClick={onStartRecommendation}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-rose-400/40 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
        >
          <Sparkles className="w-4 h-4 animate-bounce" />
          <span>Mulai Rekomendasi</span>
        </button>
      </div>

      {/* Package Detail Modal fallback */}
      <PackageDetailModal
        pkg={modalPackage}
        onClose={() => setModalPackage(null)}
        onStartRecommendation={onStartRecommendation}
      />

      {/* Official Pricelist Brochure Viewer Modal */}
      {isPricelistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-tight">
                    Brosur Resmi — IYUM MakeOver Wedding Pricelist 2025
                  </h3>
                  <span className="text-xs text-stone-500">
                    Halaman {currentPricelistPage} dari 7 Halaman Brosur
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPricelistModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Image Sheet with Navigation */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-stone-900/90 relative">
              <img 
                src={`/images/pricelist/pricelist_page_${currentPricelistPage}.png`}
                alt={`Pricelist Halaman ${currentPricelistPage}`}
                className="max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />

              {/* Prev button */}
              {currentPricelistPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPricelistPage(p => Math.max(1, p - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg transition-all cursor-pointer"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next button */}
              {currentPricelistPage < 7 && (
                <button
                  type="button"
                  onClick={() => setCurrentPricelistPage(p => Math.min(7, p + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg transition-all cursor-pointer"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Modal Footer: Thumbnails / Page buttons */}
            <div className="p-4 border-t border-stone-100 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPricelistPage(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentPricelistPage === num
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    Hal {num}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Tanya Admin via WA</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPricelistModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

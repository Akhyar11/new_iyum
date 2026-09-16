import React from 'react';
import { X, CheckCircle2, Sparkles, PhoneCall } from 'lucide-react';
import { Package } from '../types';
import { formatRupiah } from '../utils/formatters';
import { getWhatsAppBookingUrl } from '../lib/businessInfo';

interface PackageDetailModalProps {
  pkg: Package | null;
  onClose: () => void;
  onStartRecommendation: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  onStartRecommendation,
}) => {
  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-100 flex-shrink-0">
          <img
            src={pkg.photo_url}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-black/20" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white inline-block mb-2 shadow">
              {pkg.category || 'Paket Make Up'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
              {pkg.name}
            </h2>
            <p className="text-rose-300 text-xl sm:text-2xl font-bold font-serif">
              {formatRupiah(pkg.price)}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
              Deskripsi Paket
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {pkg.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-3">
              Fasilitas Lengkap Termasuk:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pkg.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-stone-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes from Pricelist */}
          {pkg.notes && pkg.notes.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span>📋</span> Catatan Tambahan (Pricelist 2025):
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950/80">
                {pkg.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="leading-snug">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info note */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 text-xs text-rose-900 leading-relaxed">
            💡 <em>Rekomendasi Cerdas:</em> Ingin tahu apakah paket ini paling cocok dengan tema acara, konsep busana, dan anggaran Anda? Gunakan fitur rekomendasi otomatis kami yang dihitung dengan metode SAW.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-stone-50 border-t border-stone-100 rounded-b-3xl flex flex-col sm:flex-row gap-3 justify-end items-center">
          <a
            href={getWhatsAppBookingUrl(pkg.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            Konsultasi WhatsApp
          </a>

          <button
            onClick={() => {
              onClose();
              onStartRecommendation();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Mulai Cek Rekomendasi
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  CheckCircle2, 
  Eye, 
  PhoneCall, 
  BarChart3, 
  Layers 
} from 'lucide-react';
import { CalculatedPackageResult } from '../utils/sawEngine';
import { formatRupiah } from '../utils/formatters';
import { Package } from '../types';
import { getWhatsAppBookingUrl } from '../lib/businessInfo';

interface AlternativePackagesListProps {
  alternatives: CalculatedPackageResult[];
  topScore: number;
  onViewDetail: (pkg: Package) => void;
}

export const AlternativePackagesList: React.FC<AlternativePackagesListProps> = ({
  alternatives,
  topScore,
  onViewDetail,
}) => {
  if (!alternatives || alternatives.length === 0) return null;

  const getMatchQuality = (score: number) => {
    if (score >= 80) return { label: 'Sangat Cocok', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 65) return { label: 'Cocok', color: 'bg-blue-100 text-blue-800' };
    if (score >= 50) return { label: 'Cukup Cocok', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Kurang Sesuai', color: 'bg-stone-100 text-stone-600' };
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Paket Pilihan Alternatif (Cadangan)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Paket-paket alternatif dengan urutan skor kecocokan tertinggi berikutnya sebagai bahan pertimbangan Anda.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <BarChart3 className="w-4 h-4 text-rose-500" />
          <span>{alternatives.length} Paket Alternatif Terhitung</span>
        </div>
      </div>

      {/* Alternative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alternatives.map((item) => {
          const { pkg, normalizedScore, rank } = item;
          const scoreDiff = Math.round((topScore - normalizedScore) * 10) / 10;
          const quality = getMatchQuality(normalizedScore);

          return (
            <div
              key={item.packageId}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-rose-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Image */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={pkg.photo_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-900/80 text-white backdrop-blur-md">
                      Peringkat #{rank}
                    </span>
                  </div>

                  {/* Match quality badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md ${quality.color}`}>
                      {quality.label}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-stone-200 block">Biaya Paket</span>
                    <span className="text-xl font-bold font-serif text-white">
                      {formatRupiah(pkg.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Title & category */}
                  <div>
                    <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block mb-1">
                      {pkg.category || 'Paket Pengantin'}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-stone-900 leading-snug group-hover:text-rose-600 transition-colors">
                      {pkg.name}
                    </h4>
                  </div>

                  {/* Score bar */}
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Skor Kecocokan SAW</span>
                      <span className="text-rose-700 font-bold">{normalizedScore}%</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${normalizedScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 text-right">
                      {scoreDiff > 0 ? `-${scoreDiff}% dari pilihan utama` : 'Sama dengan utama'}
                    </p>
                  </div>

                  {/* Key Facilities preview */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Fasilitas Termasuk:
                    </p>
                    <ul className="space-y-1.5">
                      {pkg.facilities.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onViewDetail(pkg)}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat Detail Alternatif
                </button>

                <a
                  href={getWhatsAppBookingUrl(pkg.name, normalizedScore)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

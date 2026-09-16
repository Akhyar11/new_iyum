import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Calculator
} from 'lucide-react';
import { CalculatedPackageResult } from '../utils/sawEngine';
import { formatRupiah } from '../utils/formatters';
import { Package } from '../types';
import { getWhatsAppBookingUrl } from '../lib/businessInfo';

interface TopRecommendationCardProps {
  result: CalculatedPackageResult;
  onViewDetail: (pkg: Package) => void;
}

export const TopRecommendationCard: React.FC<TopRecommendationCardProps> = ({
  result,
  onViewDetail,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { pkg, normalizedScore, breakdown } = result;

  return (
    <div className="relative bg-gradient-to-b from-white via-white to-rose-50/30 rounded-3xl border-2 border-rose-400/80 shadow-xl shadow-rose-200/50 overflow-hidden">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 px-6 py-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-300 fill-amber-300" />
          <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
            Paket Paling Cocok — Peringkat #1
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Hasil Rekomendasi SAW</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Package Image with score floating badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 shadow-md">
              <img
                src={pkg.photo_url}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-rose-700 backdrop-blur-md shadow-sm">
                  {pkg.category || 'Paket Pengantin'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-xs text-rose-200 block font-medium">Harga Investasi</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {formatRupiah(pkg.price)}
                </span>
              </div>
            </div>

            {/* Score Float Pill */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                  Tingkat Kesesuaian Kebutuhan
                </span>
                <span className="text-xs text-stone-600">Metode Simple Additive Weighting</span>
              </div>
              <div className="flex items-baseline gap-0.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-300">
                <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
                  {normalizedScore}
                </span>
                <span className="text-sm font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Right: Details & Included facilities */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Kesesuaian Tertinggi Terhadap 10 Kriteria Anda
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                {pkg.name}
              </h3>
              <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Included Facilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Fasilitas Unggulan Paket Ini:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pkg.facilities.slice(0, 4).map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-stone-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{fac}</span>
                  </div>
                ))}
              </div>
              {pkg.facilities.length > 4 && (
                <p className="mt-2 text-xs text-rose-600 font-semibold pl-1">
                  +{pkg.facilities.length - 4} fasilitas pelengkap lainnya
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppBookingUrl(pkg.name, normalizedScore)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                Pesan via WhatsApp
              </a>

              <button
                type="button"
                onClick={() => onViewDetail(pkg)}
                className="py-3 px-5 rounded-xl bg-white border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600 text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Lihat Detail Lengkap
              </button>
            </div>
          </div>
        </div>

        {/* SAW Score Calculation Breakdown Accordion */}
        <div className="mt-8 pt-6 border-t border-rose-100">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-50/60 hover:bg-rose-100/60 text-xs font-semibold text-rose-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-rose-600" />
              <span>Transparansi Perhitungan SAW (Rincian 10 Kriteria)</span>
            </div>
            {showBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showBreakdown && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Kriteria</th>
                    <th className="py-2.5 px-4">Jawaban Anda</th>
                    <th className="py-2.5 px-4 text-center">Bobot</th>
                    <th className="py-2.5 px-4 text-center">Nilai (1-4)</th>
                    <th className="py-2.5 px-4 text-right">Kontribusi Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {breakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-rose-50/30">
                      <td className="py-2.5 px-4 font-medium text-stone-900">{row.criteriaName}</td>
                      <td className="py-2.5 px-4 text-stone-600 line-clamp-1">{row.optionText}</td>
                      <td className="py-2.5 px-4 text-center text-stone-700">{row.weight}%</td>
                      <td className="py-2.5 px-4 text-center font-bold text-rose-600">{row.score}/4</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-stone-900">
                        {row.weightedContribution.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-rose-50/70 font-bold text-rose-900">
                    <td colSpan={2} className="py-3 px-4">Total Skor Akhir SAW (Σ Bobot × Nilai / 4)</td>
                    <td className="py-3 px-4 text-center">100%</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-right text-base text-rose-700">{normalizedScore}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

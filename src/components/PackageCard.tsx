import React from 'react';
import { CheckCircle2, Sparkles, Eye, ArrowRight, Tag } from 'lucide-react';
import { Package } from '../types';
import { formatRupiah } from '../utils/formatters';

interface PackageCardProps {
  pkg: Package;
  onViewDetail: (pkg: Package) => void;
  onStartRecommendation: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onViewDetail,
  onStartRecommendation,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-rose-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Image container with badges & price overlay */}
      <div className="relative h-60 w-full overflow-hidden bg-stone-100">
        <img
          src={pkg.photo_url}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />
        
        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {pkg.category && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-rose-700 backdrop-blur-md shadow-sm">
              {pkg.category}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-900/75 text-stone-100 backdrop-blur-md">
            {pkg.code}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Tersedia
          </span>
        </div>

        {/* Price Tag with Rupiah format */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <span className="text-[11px] text-rose-200 uppercase tracking-wider block font-medium">
              Investasi Mulai
            </span>
            <span className="text-2xl font-bold font-serif tracking-tight text-white drop-shadow">
              {formatRupiah(pkg.price)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <Tag className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif text-stone-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-1">
            {pkg.name}
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            {pkg.description}
          </p>

          {/* Key Facilities Preview */}
          <div className="border-t border-rose-50 pt-3.5 mb-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Fasilitas Termasuk:
            </p>
            <ul className="space-y-1.5">
              {pkg.facilities.slice(0, 3).map((facility, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{facility}</span>
                </li>
              ))}
              {pkg.facilities.length > 3 && (
                <li className="text-[11px] text-rose-600 font-semibold pl-6 pt-0.5">
                  +{pkg.facilities.length - 3} fasilitas lainnya
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onViewDetail(pkg)}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600 hover:bg-rose-50/60 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-stone-500 group-hover:text-rose-500" />
            Lihat Rincian Paket
          </button>
          <button
            type="button"
            onClick={onStartRecommendation}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-rose-200 hover:shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Cek Kecocokan SAW
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

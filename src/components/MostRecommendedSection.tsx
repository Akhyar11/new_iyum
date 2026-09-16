import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  BarChart2, 
  HeartHandshake,
  Percent
} from 'lucide-react';
import { mockPackages } from '../data/mockPackages';
import { mockPackageDistribution } from '../data/mockDashboard';
import { formatRupiah } from '../utils/formatters';

interface MostRecommendedSectionProps {
  onViewPackageDetail?: (packageId: string) => void;
  onNavigateToWeights?: () => void;
}

export const MostRecommendedSection: React.FC<MostRecommendedSectionProps> = ({
  onViewPackageDetail,
  onNavigateToWeights
}) => {
  // Find the top package details from mockPackages
  const topDistribution = mockPackageDistribution[0]; // Paket Akad + Resepsi
  const topPackage = mockPackages.find(p => p.code === topDistribution.code) || mockPackages[2];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-100 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                Paket Paling Sering Direkomendasikan
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                <Sparkles className="w-3 h-3" />
                Rank #1
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Hasil akumulasi perhitungan algoritma Simple Additive Weighting (SAW) berdasarkan preferensi pengguna
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            46.8% Dominasi
          </span>
        </div>
      </div>

      {/* Main Top Package Feature Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-rose-50/70 via-stone-50/50 to-amber-50/40 rounded-3xl p-6 border border-rose-100">
        
        {/* Left: Package Image & Badges */}
        <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-md group">
          <img 
            src={topPackage.photo_url} 
            alt={topPackage.name} 
            className="w-full h-56 sm:h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Paling Favorit
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-800 shadow-xs">
              {topPackage.code}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-xs text-rose-200 font-medium">Harga Resmi Paket</p>
            <p className="text-xl font-serif font-bold text-white">
              {formatRupiah(topPackage.price)}
            </p>
          </div>
        </div>

        {/* Middle & Right: In-depth Stats & SAW Highlights */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {topPackage.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  46.8% Rekomendasi
                </span>
                <span className="px-3 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5" />
                  160 Sesi Dipilih
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {topPackage.description}
            </p>

            {/* Key Advantages / Facilities checklist */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Fasilitas Utama Paket:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                {(topPackage.facilities || []).slice(0, 4).map((f: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/80 backdrop-blur-2xs p-2 rounded-xl border border-stone-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-rose-200/60">
            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[11px] text-stone-400 uppercase font-bold tracking-wider block">
                Total Rekomendasi
              </span>
              <span className="text-lg font-serif font-bold text-stone-900">
                160 Kali
              </span>
              <span className="text-[11px] text-stone-500 block">dari 342 total simulasi</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[11px] text-stone-400 uppercase font-bold tracking-wider block">
                Rata-rata Skor SAW
              </span>
              <span className="text-lg font-serif font-bold text-emerald-600">
                0.965 / 1.00
              </span>
              <span className="text-[11px] text-emerald-600 font-medium block">96.5% Akurasi Cocok</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[11px] text-stone-400 uppercase font-bold tracking-wider block">
                Kriteria Dominan
              </span>
              <span className="text-sm font-bold text-stone-900 truncate block">
                Akad + Resepsi
              </span>
              <span className="text-[11px] text-stone-500 block">Bobot Acara (20%)</span>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onViewPackageDetail && (
              <button
                type="button"
                onClick={() => onViewPackageDetail(topPackage.id)}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Lihat Detail Lengkap Paket</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onNavigateToWeights && (
              <button
                type="button"
                onClick={onNavigateToWeights}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                <span>Atur Bobot SAW Kriteria</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Comparison Ranking of All Packages */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-stone-600">
            Peringkat Rekomendasi Semua Paket
          </h4>
          <span className="text-xs text-stone-400">Total: 100% Pangsa Pilihan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockPackageDistribution.map((item, index) => (
            <div 
              key={item.code} 
              className={`p-4 rounded-2xl border transition-all ${
                index === 0 
                  ? 'bg-rose-50/50 border-rose-300 shadow-xs ring-1 ring-rose-200' 
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  index === 0 ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  #{index + 1}
                </span>
                <span className="text-xs font-mono font-bold text-stone-700">
                  {item.percentage}%
                </span>
              </div>

              <p className="text-sm font-bold text-stone-900 truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-xs text-stone-500 mb-2.5">
                {formatRupiah(item.price)}
              </p>

              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-rose-500' :
                    index === 1 ? 'bg-amber-500' :
                    index === 2 ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-stone-500 mt-2 text-right font-medium">
                {item.count} rekomendasi
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

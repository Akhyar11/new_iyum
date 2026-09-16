import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Printer, 
  Download, 
  DollarSign, 
  PackageOpen, 
  Users, 
  ArrowUpRight
} from 'lucide-react';
import { 
  PackageReportStat, 
  initialPackageReportStats 
} from '../data/mockReports';
import { formatRupiah } from '../utils/formatters';

interface PackagePopularityStatsProps {
  stats?: PackageReportStat[];
  onSelectPackage?: (packageCode: string) => void;
  onNavigateToWeights?: () => void;
}

export const PackagePopularityStats: React.FC<PackagePopularityStatsProps> = ({
  stats = initialPackageReportStats,
  onSelectPackage,
  onNavigateToWeights
}) => {
  const [period, setPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  // Period multiplier for mock simulation
  const currentStats = useMemo(() => {
    if (period === 'month') {
      return stats.map(s => ({
        ...s,
        count: Math.round(s.count * 0.28),
        totalRevenuePotential: Math.round(s.totalRevenuePotential * 0.28)
      }));
    } else if (period === 'quarter') {
      return stats.map(s => ({
        ...s,
        count: Math.round(s.count * 0.65),
        totalRevenuePotential: Math.round(s.totalRevenuePotential * 0.65)
      }));
    }
    return stats;
  }, [stats, period]);

  const totalCount = useMemo(() => {
    return currentStats.reduce((acc, curr) => acc + curr.count, 0);
  }, [currentStats]);

  const totalRevenue = useMemo(() => {
    return currentStats.reduce((acc, curr) => acc + curr.totalRevenuePotential, 0);
  }, [currentStats]);

  const topPackage = currentStats[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Peringkat',
      'Kode Paket',
      'Nama Paket',
      'Kategori',
      'Jumlah Rekomendasi',
      'Persentase Pangsa (%)',
      'Harga Satuan (Rp)',
      'Potensi Omzet (Rp)',
      'Tren'
    ];

    const rows = currentStats.map((item, idx) => [
      idx + 1,
      `"${item.code}"`,
      `"${item.name}"`,
      `"${item.category}"`,
      item.count,
      item.percentage,
      item.price,
      item.totalRevenuePotential,
      `"${item.trend}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Statistik_Paket_Diminati_${period}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Period Selection & Export Buttons */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Analisis Popularitas Paket
            </span>
            <span className="text-xs text-stone-400">Periode: 2026</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mt-1">
            Statistik Paket Pernikahan Paling Diminati
          </h2>
          <p className="text-xs text-stone-500">
            Perbandingan jumlah dan persentase rekomendasi paket berdasarkan algoritma Simple Additive Weighting (SAW)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                period === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                period === 'month' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bulan Ini
            </button>
            <button
              type="button"
              onClick={() => setPeriod('quarter')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                period === 'quarter' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Kuartal
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                period === 'year' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tahun 2026
            </button>
          </div>

          {/* Export Action Buttons */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Cetak Statistik"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Ekspor CSV Data Statistik"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Total Rekomendasi
            </span>
            <span className="text-2xl font-serif font-bold text-stone-900 block">
              {totalCount} Sesi
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block">
              +14.2% dibanding kuartal lalu
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5 rounded-3xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
              Paket Terpopuler #1
            </span>
            <span className="text-lg font-serif font-bold text-stone-900 truncate max-w-[150px] block">
              {topPackage.name}
            </span>
            <span className="text-[11px] text-rose-600 font-bold block">
              {topPackage.percentage}% Dominasi ({topPackage.count} kali)
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Potensi Nilai Transaksi
            </span>
            <span className="text-xl font-serif font-bold text-emerald-700 block">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-[11px] text-stone-500 font-medium block">
              Estimasi total dari 4 paket
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Tingkat Ketepatan SAW
            </span>
            <span className="text-2xl font-serif font-bold text-amber-600 block">
              96.2%
            </span>
            <span className="text-[11px] text-stone-500 font-medium block">
              Kesesuaian kriteria kuesioner
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Percentage Distribution Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Pangsa Persentase Rekomendasi Antar Paket
            </h3>
            <p className="text-xs text-stone-500">
              Visualisasi proporsi pilihan algoritma SAW terhadap 100% akumulasi sesi konsultasi
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-center">
            Total 100% Pangsa
          </span>
        </div>

        {/* The Multi-colored Segmented Bar */}
        <div className="w-full h-8 bg-stone-100 rounded-2xl overflow-hidden flex shadow-inner p-1 gap-1">
          {currentStats.map((item) => (
            <div
              key={item.code}
              onMouseEnter={() => setHoveredPackage(item.code)}
              onMouseLeave={() => setHoveredPackage(null)}
              onClick={() => onSelectPackage?.(item.code)}
              className={`${item.colorClass} h-full rounded-xl transition-all duration-300 flex items-center justify-center text-white text-[11px] font-bold shadow-xs cursor-pointer ${
                hoveredPackage === item.code ? 'brightness-110 scale-[1.01]' : ''
              }`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.name}: ${item.percentage}% (${item.count} rekomendasi)`}
            >
              {item.percentage > 12 ? `${item.percentage}%` : ''}
            </div>
          ))}
        </div>

        {/* Legend / Package Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {currentStats.map((item, idx) => (
            <div 
              key={item.code}
              onClick={() => onSelectPackage?.(item.code)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                idx === 0 
                  ? 'bg-rose-50/70 border-rose-300 shadow-2xs' 
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${item.colorClass}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Rank #{idx + 1}
                  </span>
                </div>
                <span className="font-serif font-bold text-xs text-stone-900">
                  {item.percentage}%
                </span>
              </div>

              <p className="text-xs font-bold text-stone-900 truncate" title={item.name}>
                {item.name}
              </p>
              
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                <span>{item.count} rekomendasi</span>
                <span className="font-semibold text-emerald-600">{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Aggregated Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Tabel Statistik Lengkap Paket Rias Pengantin
            </h3>
            <p className="text-xs text-stone-500">
              Rincian jumlah sesi, pangsa persentase, harga paket, dan potensi perolehan
            </p>
          </div>

          {onNavigateToWeights && (
            <button
              type="button"
              onClick={onNavigateToWeights}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-rose-500" />
              <span>Kalibrasi Bobot Kriteria</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-5">Peringkat & Nama Paket</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Jumlah Rekomendasi</th>
                <th className="py-3.5 px-4 text-center">Persentase</th>
                <th className="py-3.5 px-4 text-right">Harga Resmi</th>
                <th className="py-3.5 px-4 text-right">Potensi Nilai Omzet</th>
                <th className="py-3.5 px-5 text-right">Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {currentStats.map((item, idx) => (
                <tr 
                  key={item.code} 
                  className={`hover:bg-stone-50/70 transition-colors ${
                    idx === 0 ? 'bg-rose-50/30 font-medium' : ''
                  }`}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-rose-600 text-white shadow-2xs' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-stone-900 block text-sm">{item.name}</span>
                        <span className="font-mono text-[10px] text-stone-400">{item.code}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-stone-600">
                    {item.category}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-stone-900 text-sm">{item.count}</span>
                    <span className="text-[10px] text-stone-400 block">kali dipilih</span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${item.accentBg} ${item.accentText}`}>
                      {item.percentage}%
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-serif font-bold text-stone-800">
                    {formatRupiah(item.price)}
                  </td>

                  <td className="py-4 px-4 text-right font-serif font-bold text-emerald-700">
                    {formatRupiah(item.totalRevenuePotential)}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {item.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-50 border-t-2 border-stone-200 font-bold text-stone-900">
              <tr>
                <td className="py-4 px-5" colSpan={2}>
                  Total Akumulasi
                </td>
                <td className="py-4 px-4 text-center text-sm">
                  {totalCount} Rekomendasi
                </td>
                <td className="py-4 px-4 text-center text-sm">
                  100%
                </td>
                <td className="py-4 px-4 text-right text-stone-400 text-[11px] font-normal">
                  Rata-rata tertimbang
                </td>
                <td className="py-4 px-4 text-right font-serif text-base text-emerald-700">
                  {formatRupiah(totalRevenue)}
                </td>
                <td className="py-4 px-5 text-right text-emerald-600 text-xs">
                  Stabil Positif
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Analytical Recommendations Callout */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white">
              Rekomendasi Bisnis & Operasional
            </span>
          </div>
          <h4 className="text-base font-serif font-bold text-white">
            Optimalkan Alokasi Perias & Busana untuk Paket Akad + Resepsi
          </h4>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            Paket Akad + Resepsi menyumbang 46.8% dari seluruh permintaan calon pengantin. Disarankan untuk menambah persediaan kebaya adat modern serta menjadwalkan perias cadangan di akhir pekan.
          </p>
        </div>

        {onSelectPackage && (
          <button
            type="button"
            onClick={() => onSelectPackage(topPackage.code)}
            className="px-4 py-2.5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-center flex-shrink-0 cursor-pointer"
          >
            <PackageOpen className="w-4 h-4 text-rose-600" />
            <span>Kelola Paket Populer</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-500" />
          </button>
        )}
      </div>
    </div>
  );
};

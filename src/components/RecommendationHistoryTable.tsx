import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Printer, 
  Download, 
  Phone, 
  Calendar, 
  Eye, 
  AlertCircle, 
  PackageOpen, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RecommendationDetailedItem } from '../data/mockReports';

interface RecommendationHistoryTableProps {
  data: RecommendationDetailedItem[];
  onUpdateStatus?: (id: string, status: 'Selesai' | 'Ditinjau' | 'Follow Up') => void;
  onDeleteItem?: (id: string) => void;
  onViewDetail?: (id: string) => void;
  showFilters?: boolean;
}

export const RecommendationHistoryTable: React.FC<RecommendationHistoryTableProps> = ({
  data,
  onUpdateStatus,
  onDeleteItem,
  onViewDetail,
  showFilters = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Selesai' | 'Ditinjau' | 'Follow Up'>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<RecommendationDetailedItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        item.clientName.toLowerCase().includes(q) ||
        item.clientPhone.includes(searchQuery) ||
        item.id.toLowerCase().includes(q) ||
        item.recommendedPackage.toLowerCase().includes(q) ||
        item.recommendedPackageCode.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchPackage = packageFilter === 'all' || item.recommendedPackageCode === packageFilter;

      return matchSearch && matchStatus && matchPackage;
    });
  }, [data, searchQuery, statusFilter, packageFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = [
      'ID Rekomendasi',
      'Nama Calon Pengantin',
      'Nomor Telepon',
      'Tanggal Acara',
      'Paket Rekomendasi',
      'Kode Paket',
      'Skor SAW (%)',
      'Anggaran',
      'Status',
      'Waktu Sesi'
    ];

    const rows = filteredData.map(item => [
      `"${item.id}"`,
      `"${item.clientName}"`,
      `"${item.clientPhone}"`,
      `"${item.eventDate}"`,
      `"${item.recommendedPackage}"`,
      `"${item.recommendedPackageCode}"`,
      item.topScore.toFixed(1),
      `"${item.budgetRange}"`,
      `"${item.status}"`,
      `"${item.timestamp}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Riwayat_Rekomendasi_SAW_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      {showFilters && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama pengantin, nomor telepon, ID sesi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-rose-500 focus:border-rose-500 bg-stone-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters & Export Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-semibold text-stone-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold bg-transparent text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditinjau">Ditinjau</option>
                <option value="Follow Up">Follow Up</option>
              </select>
            </div>

            {/* Package Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
              <PackageOpen className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-semibold text-stone-600">Paket:</span>
              <select
                value={packageFilter}
                onChange={(e) => {
                  setPackageFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold bg-transparent text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Paket</option>
                <option value="PKG-ALL-IN">Akad + Resepsi</option>
                <option value="PKG-AKAD">Paket Akad</option>
                <option value="PKG-RESEPSI">Paket Resepsi</option>
                <option value="PKG-SIRAMAN">Siraman</option>
              </select>
            </div>

            {/* Print & CSV Buttons */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Cetak Data Rekomendasi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Ekspor ke CSV / Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-5">ID & Calon Pengantin</th>
                <th className="py-3.5 px-4">Tanggal Acara</th>
                <th className="py-3.5 px-4">Paket Hasil Rekomendasi</th>
                <th className="py-3.5 px-4 text-center">Skor SAW</th>
                <th className="py-3.5 px-4">Preferensi Anggaran</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-stone-300" />
                      <p className="font-semibold text-stone-700">Tidak ada riwayat rekomendasi yang sesuai</p>
                      <p className="text-xs text-stone-400">Silakan sesuaikan kata kunci pencarian atau filter status Anda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* ID & Client */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                          {item.clientName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block text-sm">{item.clientName}</span>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span className="font-mono text-[10px] text-stone-400">{item.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-stone-400" />
                              {item.clientPhone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Event Date & Timestamp */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.eventDate}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5">{item.timestamp}</span>
                    </td>

                    {/* Recommended Package */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {item.recommendedPackage}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 block mt-0.5 pl-1">
                        {item.recommendedPackageCode}
                      </span>
                    </td>

                    {/* SAW Score */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-serif font-bold text-sm text-emerald-600">
                          {item.topScore.toFixed(1)}%
                        </span>
                        <div className="w-16 bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, item.topScore)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-4">
                      <span className="text-stone-700 font-medium text-xs block">
                        {item.budgetRange}
                      </span>
                    </td>

                    {/* Status with Quick Toggle */}
                    <td className="py-4 px-4 text-center">
                      <div className="relative inline-block">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateStatus?.(item.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer appearance-none pr-5 text-center focus:outline-none ${
                            item.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.status === 'Ditinjau'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="Selesai">Selesai</option>
                          <option value="Ditinjau">Ditinjau</option>
                          <option value="Follow Up">Follow Up</option>
                        </select>
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-60">▼</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewDetail) {
                              onViewDetail(item.id);
                            } else {
                              setSelectedItem(item);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          title="Lihat Rincian Jawaban Kuesioner & Skor SAW"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>

                        {onDeleteItem && (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Hapus riwayat rekomendasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Info Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-stone-400">|</span>
            <span>Menampilkan {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} dari {filteredData.length} data</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-3 py-1 font-semibold text-stone-800">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Jawaban Kuesioner (10 Kriteria SAW) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-stone-200 text-stone-700">
                    {selectedItem.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedItem.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Rincian Jawaban Kuesioner & Skor SAW
                </h3>
                <p className="text-xs text-stone-500">
                  Calon Pengantin: <strong className="text-stone-800">{selectedItem.clientName}</strong> ({selectedItem.clientPhone}) • Acara: {selectedItem.eventDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Hasil Rekomendasi Utama Card */}
              <div className="bg-gradient-to-r from-rose-50 via-stone-50 to-amber-50 p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                    Paket Rekomendasi Utama (Rank 1)
                  </span>
                  <p className="text-xl font-serif font-bold text-stone-900">
                    {selectedItem.recommendedPackage}
                  </p>
                  <p className="text-xs text-stone-600">
                    Kode Paket: <span className="font-mono font-bold text-stone-800">{selectedItem.recommendedPackageCode}</span> • Anggaran: {selectedItem.budgetRange}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-rose-200 sm:pl-6">
                  <span className="text-[11px] text-stone-500 block uppercase font-bold tracking-wider">Nilai Akhir SAW</span>
                  <span className="text-3xl font-serif font-bold text-emerald-600">
                    {selectedItem.topScore.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">Tingkat Kecocokan</span>
                </div>
              </div>

              {/* Urutan Peringkat Alternatif */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                  Peringkat Lengkap Alternatif Paket:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedItem.alternativePackages.map((alt) => (
                    <div 
                      key={alt.code} 
                      className={`p-3 rounded-xl border ${
                        alt.rank === 1 ? 'bg-rose-50/70 border-rose-300 font-bold' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-stone-500">Rank #{alt.rank}</span>
                        <span className="text-emerald-600 font-bold">{alt.score.toFixed(1)}%</span>
                      </div>
                      <p className="text-xs text-stone-900 truncate" title={alt.name}>{alt.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rincian 10 Pertanyaan & Jawaban Terpilih */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                    Jawaban 10 Kriteria Kuesioner SAW:
                  </h4>
                  <span className="text-[11px] text-stone-400">Total Bobot: 100%</span>
                </div>

                <div className="space-y-2.5">
                  {selectedItem.answersDetail.map((ans, idx) => (
                    <div 
                      key={ans.questionId}
                      className="p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-stone-900 text-xs">
                            {ans.questionText}
                          </span>
                        </div>
                        <div className="pl-7 flex items-center gap-2 text-stone-500 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                            {ans.criteriaName} (Bobot: {ans.weight}%)
                          </span>
                          <span>→</span>
                          <span className="text-rose-700 font-bold">
                            {ans.selectedOptionText}
                          </span>
                        </div>
                      </div>

                      <div className="pl-7 sm:pl-0 text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 border-stone-100 pt-2 sm:pt-0">
                        <span className="text-[11px] text-stone-400">Skor Opsi: <strong>{ans.rawScore}/4</strong></span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                          Kontribusi: +{ans.weightedContribution}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ubah Status Interaktif */}
              {onUpdateStatus && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-stone-700">Perbarui Status Penanganan Klien:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedItem.id, 'Selesai');
                        setSelectedItem({ ...selectedItem, status: 'Selesai' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedItem.status === 'Selesai' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-emerald-50'
                      }`}
                    >
                      Selesai
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedItem.id, 'Ditinjau');
                        setSelectedItem({ ...selectedItem, status: 'Ditinjau' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedItem.status === 'Ditinjau' 
                          ? 'bg-amber-600 text-white shadow-xs' 
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-amber-50'
                      }`}
                    >
                      Ditinjau
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedItem.id, 'Follow Up');
                        setSelectedItem({ ...selectedItem, status: 'Follow Up' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedItem.status === 'Follow Up' 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-blue-50'
                      }`}
                    >
                      Follow Up
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Dicatat pada {selectedItem.timestamp}
              </span>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              Hapus Riwayat Rekomendasi?
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
              Data riwayat rekomendasi ID <strong className="font-mono">{deleteConfirmId}</strong> akan dihapus dari daftar lokal. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteItem?.(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

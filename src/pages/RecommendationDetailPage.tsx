import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Phone, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  ExternalLink, 
  Save, 
  FileText, 
  Table, 
  AlertCircle,
  PackageOpen
} from 'lucide-react';
import { 
  RecommendationDetailedItem, 
  getRecommendationById, 
  updateStoredRecommendation 
} from '../data/mockReports';
import { mockPackages } from '../data/mockPackages';
import { formatRupiah } from '../utils/formatters';

interface RecommendationDetailPageProps {
  recommendationId: string;
  onBack: () => void;
  onNavigateToPackages?: () => void;
}

export const RecommendationDetailPage: React.FC<RecommendationDetailPageProps> = ({
  recommendationId,
  onBack,
  onNavigateToPackages
}) => {
  const [item, setItem] = useState<RecommendationDetailedItem | null>(() => getRecommendationById(recommendationId));
  const [activeSubTab, setActiveSubTab] = useState<'answers' | 'saw_matrix'>('answers');
  const [notes, setNotes] = useState<string>(item?.adminNotes || '');
  const [notesSaved, setNotesSaved] = useState<boolean>(false);
  const [status, setStatus] = useState<'Selesai' | 'Ditinjau' | 'Follow Up'>(item?.status || 'Selesai');

  useEffect(() => {
    const found = getRecommendationById(recommendationId);
    if (found) {
      setItem(found);
      setStatus(found.status);
      setNotes(found.adminNotes || '');
    }
  }, [recommendationId]);

  if (!item) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs max-w-2xl mx-auto my-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-stone-900">Data Rekomendasi Tidak Ditemukan</h2>
        <p className="text-xs text-stone-500">
          ID sesi rekomendasi <span className="font-mono font-bold text-stone-700">{recommendationId}</span> tidak tercatat dalam penyimpanan riwayat.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Rekomendasi</span>
        </button>
      </div>
    );
  }

  const pkgDetail = mockPackages.find(p => p.code === item.recommendedPackageCode) || mockPackages[0];

  const handleStatusChange = (newStatus: 'Selesai' | 'Ditinjau' | 'Follow Up') => {
    setStatus(newStatus);
    const updated = updateStoredRecommendation(item.id, { status: newStatus });
    if (updated) setItem(updated);
  };

  const handleSaveNotes = () => {
    const updated = updateStoredRecommendation(item.id, { adminNotes: notes });
    if (updated) {
      setItem(updated);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappPhone = item.clientPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone.startsWith('0') ? '62' + whatsappPhone.slice(1) : whatsappPhone}?text=${encodeURIComponent(
    `Halo Ibu/Bpk ${item.clientName}, kami dari IYUM MakeOver ingin menindaklanjuti hasil simulasi rekomendasi paket: ${item.recommendedPackage}. Apakah ada yang dapat kami bantu terkait jadwal dan fitting busana pengantin?`
  )}`;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Data Rekomendasi</span>
            </button>
            <span>/</span>
            <span className="font-mono text-stone-700 font-bold">{item.id}</span>
            <span>/</span>
            <span className="text-stone-800 font-semibold">Detail Jawaban Klien</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {item.clientName}
            </h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
              status === 'Selesai' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : status === 'Ditinjau' 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {status}
            </span>
          </div>

          <p className="text-xs text-stone-500 flex flex-wrap items-center gap-3 pt-0.5">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-400" />
              {item.clientPhone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              Tanggal Acara: <strong className="text-stone-700">{item.eventDate}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              Waktu Sesi: {item.timestamp}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs">
            <span className="text-stone-500 font-semibold">Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="Selesai">Selesai</option>
              <option value="Ditinjau">Ditinjau</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </div>

          {/* WhatsApp Follow Up */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Chat WhatsApp</span>
          </a>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Detailed Answer Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Top Recommendation & Alternatives Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Recommendation Highlight Card */}
          <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-3xl p-6 border border-rose-200 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Rekomendasi Terbaik (Rank 1)
              </span>
              <span className="font-mono text-xs text-stone-400 font-semibold">{item.recommendedPackageCode}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                {item.recommendedPackage}
              </h3>
              <p className="text-sm font-serif font-bold text-rose-700">
                {formatRupiah(pkgDetail.price)}
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {pkgDetail.description}
            </p>

            {/* Score Display */}
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Skor Akhir SAW</span>
                <span className="text-2xl font-serif font-bold text-emerald-600">
                  {item.topScore.toFixed(1)}%
                </span>
                <span className="text-[11px] text-stone-500 block">Kecocokan Sangat Sesuai</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Key Facilities checklist */}
            <div className="space-y-2 pt-1 border-t border-rose-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Fasilitas Utama Paket:
              </span>
              <div className="space-y-1.5 text-xs text-stone-700">
                {(pkgDetail.facilities || []).slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {onNavigateToPackages && (
              <button
                type="button"
                onClick={onNavigateToPackages}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PackageOpen className="w-3.5 h-3.5" />
                <span>Lihat di Katalog Paket</span>
              </button>
            )}
          </div>

          {/* Alternative Ranked Packages */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
              <span>Peringkat 4 Paket Alternatif</span>
              <span className="text-stone-400 font-normal">Hasil SAW</span>
            </h4>

            <div className="space-y-2">
              {item.alternativePackages.map((alt) => {
                const diff = (alt.score - item.topScore).toFixed(1);
                return (
                  <div 
                    key={alt.code} 
                    className={`p-3 rounded-2xl border transition-all ${
                      alt.rank === 1 
                        ? 'bg-rose-50/70 border-rose-200 ring-1 ring-rose-200' 
                        : 'bg-stone-50/60 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          alt.rank === 1 ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          #{alt.rank}
                        </span>
                        <span className="text-xs font-bold text-stone-900 truncate max-w-[140px]">{alt.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-serif font-bold text-emerald-600">{alt.score.toFixed(1)}%</span>
                        {alt.rank > 1 && (
                          <span className="text-[10px] text-stone-400 block font-mono">({diff}%)</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Follow-up Consultation Notes */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>Catatan Konsultasi & MUA</span>
              </h4>
              {notesSaved && (
                <span className="text-[10px] text-emerald-600 font-bold animate-fadeIn">Tersimpan!</span>
              )}
            </div>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tulis catatan kebutuhan khusus klien (misal: warna kebaya, jam kedatangan tim rias, busana keluarga tambahan)..."
              className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-rose-500 focus:border-rose-500 bg-stone-50/50"
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Catatan Klien</span>
            </button>
          </div>

        </div>

        {/* Right 8 Cols: Answer Breakdown & SAW Calculation Matrix */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sub-tab switcher */}
          <div className="flex items-center gap-2 bg-stone-200/70 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('answers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'answers' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-rose-500" />
              <span>Jawaban 10 Kriteria SAW</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('saw_matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'saw_matrix' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Table className="w-4 h-4 text-amber-500" />
              <span>Kalkulasi & Matriks Normalisasi</span>
            </button>
          </div>

          {/* SubTab 1: 10 Answers Breakdown */}
          {activeSubTab === 'answers' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    Rincian Jawaban Kuesioner Rekomendasi
                  </h3>
                  <p className="text-xs text-stone-500">
                    Evaluasi kesesuaian jawaban calon pengantin terhadap pembobotan 10 kriteria SAW
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
                  Total Bobot: 100%
                </span>
              </div>

              {/* 10 Criteria List Cards */}
              <div className="space-y-3">
                {item.answersDetail.map((ans, index) => (
                  <div 
                    key={ans.questionId}
                    className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/40 hover:bg-white hover:border-stone-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          C{index + 1}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          {ans.criteriaName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                          Bobot: {ans.weight}%
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 pl-8">
                        {ans.questionText}
                      </p>

                      <div className="pl-8 pt-1 flex items-center gap-2 text-xs">
                        <span className="text-stone-400 font-medium">Jawaban Dipilih:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-bold border border-rose-200/60">
                          {ans.selectedOptionText}
                        </span>
                      </div>
                    </div>

                    <div className="pl-8 md:pl-0 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-5 text-right flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Skor Opsi</span>
                        <span className="text-base font-bold text-stone-900 font-mono">{ans.rawScore} / 4</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold whitespace-nowrap">
                        Kontribusi: +{ans.weightedContribution}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary Footer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-stone-400">Total Akumulasi Skor SAW (Σ Bobot × Nilai / Max):</p>
                  <p className="text-lg font-serif font-bold text-white">
                    {item.recommendedPackage} (Rank 1)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-emerald-400">
                    {item.topScore.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-stone-400 block font-mono">0.{Math.round(item.topScore * 10)}</span>
                </div>
              </div>

            </div>
          )}

          {/* SubTab 2: Mathematical SAW Matrix Breakdown */}
          {activeSubTab === 'saw_matrix' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  Formulasi Simple Additive Weighting (SAW)
                </h3>
                <p className="text-xs text-stone-500">
                  Metode penjumlahan terbobot dengan normalisasi matriks keputusan skala 1–4 terhadap kriteria benefit
                </p>
              </div>

              {/* Formula Callout */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 font-mono text-xs text-stone-700 space-y-2">
                <p className="font-bold text-stone-900">1. Normalisasi Matriks (Kriteria Benefit):</p>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <code>r_ij = x_ij / max(x_ij)</code> — dimana nilai skala berkisar antara 1 hingga 4 (skor maksimum = 4).
                </div>

                <p className="font-bold text-stone-900 pt-2">2. Nilai Preferensi Alternatif (V_i):</p>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <code>V_i = Σ (w_j × r_ij)</code> — penjumlahan hasil kali bobot kriteria dengan nilai ternormalisasi.
                </div>
              </div>

              {/* Detailed Calculation Table per Kriteria */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Tabel Kalkulasi SAW per Kriteria:
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="bg-stone-100/80 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Kode</th>
                        <th className="py-2.5 px-3">Kriteria</th>
                        <th className="py-2.5 px-3 text-center">Bobot (W)</th>
                        <th className="py-2.5 px-3 text-center">Nilai (X)</th>
                        <th className="py-2.5 px-3 text-center">Normalisasi (R = X/4)</th>
                        <th className="py-2.5 px-3 text-right">Hasil (W × R)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {item.answersDetail.map((c, idx) => {
                        const norm = (c.rawScore / 4).toFixed(2);
                        return (
                          <tr key={c.questionId} className="hover:bg-stone-50/60">
                            <td className="py-2.5 px-3 font-mono text-stone-400">C{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-stone-800">{c.criteriaName}</td>
                            <td className="py-2.5 px-3 text-center font-mono">{c.weight}%</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-stone-800">{c.rawScore}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-emerald-600">{norm}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                              {c.weightedContribution.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-stone-100 font-bold text-stone-900 border-t-2 border-stone-200">
                      <tr>
                        <td className="py-3 px-3" colSpan={2}>Total Nilai Akhir SAW</td>
                        <td className="py-3 px-3 text-center">100%</td>
                        <td className="py-3 px-3 text-center">-</td>
                        <td className="py-3 px-3 text-center">1.00 Max</td>
                        <td className="py-3 px-3 text-right font-serif text-sm text-emerald-700">
                          {item.topScore.toFixed(1)}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

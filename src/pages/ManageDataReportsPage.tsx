import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  BarChart3, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Award 
} from 'lucide-react';
import { 
  RecommendationDetailedItem, 
  PackageReportStat, 
  getStoredRecommendations, 
  saveStoredRecommendations,
  initialPackageReportStats 
} from '../data/mockReports';
import { RecommendationHistoryTable } from '../components/RecommendationHistoryTable';
import { PackagePopularityStats } from '../components/PackagePopularityStats';
import { RecommendationDetailPage } from './RecommendationDetailPage';

interface ManageDataReportsPageProps {
  initialTab?: 'recommendations' | 'reports';
  onNavigateToDashboard?: () => void;
  onNavigateToPackages?: () => void;
  onNavigateToWeights?: () => void;
}

export const ManageDataReportsPage: React.FC<ManageDataReportsPageProps> = ({
  initialTab = 'recommendations',
  onNavigateToDashboard,
  onNavigateToPackages,
  onNavigateToWeights
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'reports'>(initialTab);
  const [recommendations, setRecommendations] = useState<RecommendationDetailedItem[]>(() => getStoredRecommendations());
  const [reportStats] = useState<PackageReportStat[]>(initialPackageReportStats);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: 'Selesai' | 'Ditinjau' | 'Follow Up') => {
    const updated = recommendations.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setRecommendations(updated);
    saveStoredRecommendations(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = recommendations.filter(item => item.id !== id);
    setRecommendations(updated);
    saveStoredRecommendations(updated);
  };

  if (selectedDetailId) {
    return (
      <RecommendationDetailPage
        recommendationId={selectedDetailId}
        onBack={() => {
          setSelectedDetailId(null);
          setRecommendations(getStoredRecommendations());
        }}
        onNavigateToPackages={onNavigateToPackages}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            {onNavigateToDashboard && (
              <button 
                type="button" 
                onClick={onNavigateToDashboard}
                className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            )}
            <span>/</span>
            <span className="text-stone-800 font-semibold">
              {activeTab === 'recommendations' ? 'Data Rekomendasi' : 'Laporan & Statistik'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {activeTab === 'recommendations' ? 'Data Riwayat Rekomendasi' : 'Laporan Rekomendasi Paket'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            {activeTab === 'recommendations' 
              ? 'Pantau data simulasi rekomendasi calon pengantin, jawaban kuesioner, dan nilai SAW'
              : 'Statistik agregasi dan analisis popularitas paket rias pengantin berbasis Simple Additive Weighting'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-stone-200/80 p-1.5 rounded-2xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-rose-500" />
            <span>Data Rekomendasi</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold">
              {recommendations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Laporan & Statistik</span>
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: DATA REKOMENDASI ======================= */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Top Quick Stats for Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">Total Sesi Tercatat</span>
                <span className="text-2xl font-serif font-bold text-stone-900">{recommendations.length} Konsultasi</span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-1">+8 sesi minggu ini</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">Status Selesai</span>
                <span className="text-2xl font-serif font-bold text-emerald-600">
                  {recommendations.filter(r => r.status === 'Selesai').length} Sesi
                </span>
                <span className="text-[11px] text-stone-500 font-medium block mt-1">Siap tindak lanjut akad/resepsi</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">Status Ditinjau</span>
                <span className="text-2xl font-serif font-bold text-amber-600">
                  {recommendations.filter(r => r.status === 'Ditinjau').length} Sesi
                </span>
                <span className="text-[11px] text-stone-500 font-medium block mt-1">Perlu konfirmasi jadwal MUA</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">Tingkat Akurasi SAW</span>
                <span className="text-2xl font-serif font-bold text-indigo-600">95.4%</span>
                <span className="text-[11px] text-stone-500 font-medium block mt-1">Rata-rata kesesuaian kriteria</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Reusable History Table Component with Search, Filters, CSV, Pagination & Modal */}
          <RecommendationHistoryTable
            data={recommendations}
            onUpdateStatus={handleUpdateStatus}
            onDeleteItem={handleDeleteItem}
            onViewDetail={(id) => setSelectedDetailId(id)}
          />
        </div>
      )}

      {/* ======================= TAB 2: LAPORAN & STATISTIK ======================= */}
      {activeTab === 'reports' && (
        <PackagePopularityStats
          stats={reportStats}
          onSelectPackage={onNavigateToPackages}
          onNavigateToWeights={onNavigateToWeights}
        />
      )}
    </div>
  );
};

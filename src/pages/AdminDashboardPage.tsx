import React, { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminSummaryCards } from '../components/AdminSummaryCards';
import { MostRecommendedSection } from '../components/MostRecommendedSection';
import { 
  PackageOpen, 
  ArrowRight,
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { mockPackages } from '../data/mockPackages';
import { 
  mockDashboardSummary, 
  mockRecentRecommendations 
} from '../data/mockDashboard';
import { formatRupiah } from '../utils/formatters';
import { ManagePackagesPage } from './ManagePackagesPage';
import { ManageQuestionsPage } from './ManageQuestionsPage';
import { ManageWeightsPage } from './ManageWeightsPage';
import { ManageDataReportsPage } from './ManageDataReportsPage';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigateToCatalog: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onLogout,
  onNavigateToCatalog,
}) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Header with prominent Keluar (Logout) button */}
      <AdminHeader
        onLogout={onLogout}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
      />

      {/* Main Admin Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeMenu === 'packages' ? (
          <ManagePackagesPage
            onNavigateToDashboard={() => setActiveMenu('dashboard')}
          />
        ) : activeMenu === 'questions' ? (
          <ManageQuestionsPage
            onNavigateToDashboard={() => setActiveMenu('dashboard')}
            onNavigateToWeights={() => setActiveMenu('weights')}
          />
        ) : activeMenu === 'weights' ? (
          <ManageWeightsPage
            onNavigateToDashboard={() => setActiveMenu('dashboard')}
            onNavigateToQuestions={() => setActiveMenu('questions')}
          />
        ) : activeMenu === 'recommendations' ? (
          <ManageDataReportsPage
            initialTab="recommendations"
            onNavigateToDashboard={() => setActiveMenu('dashboard')}
            onNavigateToPackages={() => setActiveMenu('packages')}
            onNavigateToWeights={() => setActiveMenu('weights')}
          />
        ) : activeMenu === 'reports' ? (
          <ManageDataReportsPage
            initialTab="reports"
            onNavigateToDashboard={() => setActiveMenu('dashboard')}
            onNavigateToPackages={() => setActiveMenu('packages')}
            onNavigateToWeights={() => setActiveMenu('weights')}
          />
        ) : (
          <div className="space-y-8">
        
        {/* Welcome Callout Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500 text-white">
                Sesi Administrator Aktif
              </span>
              <span className="text-xs text-stone-400">Dashboard Utama</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Selamat Datang di Area Pengelolaan
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Pantau jumlah paket, pertanyaan kriteria, pengguna, total rekomendasi SAW, dan paket pernikahan paling diminati secara menyeluruh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToCatalog}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lihat Halaman Publik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Four Core Summary Data Cards (Jumlah Paket, Pertanyaan, Pengguna, Rekomendasi) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Ringkasan Jumlah Data Utama
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              4 Metrik Inti
            </span>
          </div>
          <AdminSummaryCards 
            data={mockDashboardSummary} 
            onCardClick={(metric) => setActiveMenu(metric)} 
          />
        </section>

        {/* Section Paket Paling Sering Direkomendasikan */}
        <MostRecommendedSection 
          onNavigateToWeights={() => setActiveMenu('weights')} 
        />

        {/* Bottom Section: Recent Recommendations Table & Registered Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Recommendations Table (Data Rekomendasi Tiruan) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    Riwayat Rekomendasi Pengguna Terbaru
                  </h3>
                  <p className="text-xs text-stone-500">
                    Daftar simulasi konsultasi rekomendasi paket rias oleh calon pengantin
                  </p>
                </div>
              </div>
              <span className="text-xs text-stone-400 font-mono">5 Terbaru</span>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[560px]">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pr-4 whitespace-nowrap">ID & Pengantin</th>
                    <th className="pb-3 px-3 whitespace-nowrap">Tanggal Acara</th>
                    <th className="pb-3 px-3 whitespace-nowrap">Hasil Rekomendasi</th>
                    <th className="pb-3 px-3 whitespace-nowrap">Skor SAW</th>
                    <th className="pb-3 pl-3 text-right whitespace-nowrap">Waktu Sesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {mockRecentRecommendations.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-mono text-[10px] text-stone-400 block">{rec.id}</span>
                        <span className="font-bold text-stone-900">{rec.clientName}</span>
                      </td>
                      <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                        {rec.eventDate}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {rec.recommendedPackage}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-emerald-600">
                          {(rec.topScore * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 pl-3 text-right text-stone-400 font-mono text-[11px] whitespace-nowrap">
                        <span className="flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.timestamp.split(',')[0]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveMenu('recommendations')}
                className="w-full py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Semua Riwayat Rekomendasi</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>

          {/* Registered Packages Quick Catalog */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-rose-600" />
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  Katalog Paket Aktif
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono">{mockPackages.length} Paket</span>
            </div>

            <div className="divide-y divide-stone-100">
              {mockPackages.map((pkg) => (
                <div key={pkg.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={pkg.photo_url} 
                      alt={pkg.name} 
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">{pkg.name}</p>
                      <p className="text-[11px] text-stone-500">{pkg.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-serif text-stone-900">
                      {formatRupiah(pkg.price)}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">Aktif</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveMenu('packages')}
                className="w-full py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Kelola Semua Paket</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>

        </div>

          </div>
        )}

      </main>
    </div>
  );
};

import React from 'react';
import { PackageOpen, HelpCircle, Users, Calculator, ArrowUpRight } from 'lucide-react';

export interface SummaryData {
  totalPackages: number;
  totalQuestions: number;
  totalUsers: number;
  totalRecommendations: number;
}

interface AdminSummaryCardsProps {
  data?: Partial<SummaryData>;
  onCardClick?: (metric: 'packages' | 'questions' | 'users' | 'recommendations') => void;
}

export const AdminSummaryCards: React.FC<AdminSummaryCardsProps> = ({
  data,
  onCardClick
}) => {
  const stats: SummaryData = {
    totalPackages: data?.totalPackages ?? 4,
    totalQuestions: data?.totalQuestions ?? 10,
    totalUsers: data?.totalUsers ?? 128,
    totalRecommendations: data?.totalRecommendations ?? 342,
  };

  const cards = [
    {
      id: 'packages' as const,
      title: 'Jumlah Paket',
      count: `${stats.totalPackages} Paket`,
      subtitle: 'Semua paket aktif di katalog',
      badge: 'Aktif',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: PackageOpen,
      iconBg: 'bg-rose-50 text-rose-600',
      borderHover: 'hover:border-rose-300',
      gradient: 'from-rose-500/10 to-transparent'
    },
    {
      id: 'questions' as const,
      title: 'Jumlah Pertanyaan',
      count: `${stats.totalQuestions} Kriteria`,
      subtitle: '40 Opsi jawaban terstandar',
      badge: '10 Kriteria',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: HelpCircle,
      iconBg: 'bg-amber-50 text-amber-600',
      borderHover: 'hover:border-amber-300',
      gradient: 'from-amber-500/10 to-transparent'
    },
    {
      id: 'users' as const,
      title: 'Jumlah Pengguna',
      count: `${stats.totalUsers} Pengantin`,
      subtitle: 'Calon pengantin konsultasi',
      badge: '+12% bln ini',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      icon: Users,
      iconBg: 'bg-indigo-50 text-indigo-600',
      borderHover: 'hover:border-indigo-300',
      gradient: 'from-indigo-500/10 to-transparent'
    },
    {
      id: 'recommendations' as const,
      title: 'Jumlah Rekomendasi',
      count: `${stats.totalRecommendations} Sesi`,
      subtitle: 'Hasil pencocokan SAW selesai',
      badge: '98.4% Akurat',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: Calculator,
      iconBg: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-300',
      gradient: 'from-purple-500/10 to-transparent'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className={`group bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs ${card.borderHover} hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between`}
          >
            {/* Soft decorative background tint */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60`} />

            <div>
              {/* Header row with Icon and Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 transition-colors" />
                </div>
              </div>

              {/* Title & Count */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {card.title}
                </span>
                <span className="text-3xl font-bold font-serif text-stone-900 tracking-tight block">
                  {card.count}
                </span>
              </div>
            </div>

            {/* Subtitle / context note */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="truncate">{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

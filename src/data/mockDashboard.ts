export interface DashboardSummary {
  totalPackages: number;
  activePackages: number;
  totalQuestions: number;
  totalOptions: number;
  totalUsers: number;
  totalRecommendations: number;
  mostRecommendedPackage: string;
  mostRecommendedPercentage: number;
  sawAccuracy: number;
}

export interface RecommendationHistoryItem {
  id: string;
  clientName: string;
  eventDate: string;
  recommendedPackage: string;
  topScore: number;
  budgetRange: string;
  timestamp: string;
  status: 'Selesai' | 'Ditinjau';
}

export interface PackageDistribution {
  name: string;
  code: string;
  count: number;
  percentage: number;
  price: number;
  colorClass: string;
}

export const mockDashboardSummary: DashboardSummary = {
  totalPackages: 4,
  activePackages: 4,
  totalQuestions: 10,
  totalOptions: 40,
  totalUsers: 128,
  totalRecommendations: 342,
  mostRecommendedPackage: 'Paket Akad + Resepsi',
  mostRecommendedPercentage: 46.8,
  sawAccuracy: 98.4
};

export const mockRecentRecommendations: RecommendationHistoryItem[] = [
  {
    id: 'REC-2026-089',
    clientName: 'Anisa Citra & Dimas Pratama',
    eventDate: '24 Oktober 2026',
    recommendedPackage: 'Paket Akad + Resepsi',
    topScore: 0.965,
    budgetRange: 'Rp 20.000.000 - 30.000.000',
    timestamp: '12 Sep 2026, 13:40 WIB',
    status: 'Selesai'
  },
  {
    id: 'REC-2026-088',
    clientName: 'Siti Rahmadani & Arif',
    eventDate: '15 November 2026',
    recommendedPackage: 'Paket Akad',
    topScore: 0.920,
    budgetRange: 'Rp 10.000.000 - 15.000.000',
    timestamp: '12 Sep 2026, 11:15 WIB',
    status: 'Selesai'
  },
  {
    id: 'REC-2026-087',
    clientName: 'Putri Ayu Wandira & Rizky',
    eventDate: '02 Desember 2026',
    recommendedPackage: 'Paket Resepsi',
    topScore: 0.895,
    budgetRange: 'Rp 15.000.000 - 20.000.000',
    timestamp: '11 Sep 2026, 16:30 WIB',
    status: 'Selesai'
  },
  {
    id: 'REC-2026-086',
    clientName: 'Dewi Lestari & Satria',
    eventDate: '18 Oktober 2026',
    recommendedPackage: 'Siraman Package',
    topScore: 0.950,
    budgetRange: 'Rp 5.000.000 - 10.000.000',
    timestamp: '11 Sep 2026, 09:20 WIB',
    status: 'Selesai'
  },
  {
    id: 'REC-2026-085',
    clientName: 'Nabila Nuraini & Fajar',
    eventDate: '28 November 2026',
    recommendedPackage: 'Paket Akad + Resepsi',
    topScore: 0.975,
    budgetRange: '> Rp 25.000.000',
    timestamp: '10 Sep 2026, 14:05 WIB',
    status: 'Selesai'
  }
];

export const mockPackageDistribution: PackageDistribution[] = [
  {
    name: 'Paket Akad + Resepsi',
    code: 'PKG-ALL-IN',
    count: 160,
    percentage: 46.8,
    price: 25000000,
    colorClass: 'bg-rose-500 text-rose-500 border-rose-200'
  },
  {
    name: 'Paket Akad',
    code: 'PKG-AKAD',
    count: 86,
    percentage: 25.1,
    price: 9500000,
    colorClass: 'bg-amber-500 text-amber-500 border-amber-200'
  },
  {
    name: 'Paket Resepsi',
    code: 'PKG-RESEPSI',
    count: 68,
    percentage: 19.9,
    price: 17500000,
    colorClass: 'bg-blue-500 text-blue-500 border-blue-200'
  },
  {
    name: 'Siraman Package',
    code: 'PKG-SIRAMAN',
    count: 28,
    percentage: 8.2,
    price: 6500000,
    colorClass: 'bg-purple-500 text-purple-500 border-purple-200'
  }
];

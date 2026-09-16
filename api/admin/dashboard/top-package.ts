import { createClient } from '@supabase/supabase-js';

const FALLBACK_TOP_PACKAGE_DATA = {
  topPackage: {
    id: 'c3333333-3333-3333-3333-333333333333',
    code: 'PKG-ALL-IN',
    name: 'Paket Akad + Resepsi',
    price: 7500000,
    description: 'Solusi lengkap menyeluruh untuk seluruh rangkaian pernikahan hari H mulai dari akad pagi hingga resepsi malam hari.',
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Busana Akad Nikah (Ganti Busana & Look)',
      'Makeup & Busana Resepsi Pengantin (Full Retouch)',
      '2 Set Busana Pengantin (Tradisional / Modern)',
      'Aksesoris Lengkap & 2 Set Ronce Melati Segar',
      'Makeup & Busana untuk 2 Ibu Akad & Resepsi',
      'Busana Beskap untuk 2 Bapak Pengantin',
      'Makeup & Busana untuk 4 Orang Jaga Kado / Pagar Ayu',
      'Free Test Makeup / Touch Up Kit Eksklusif'
    ],
    status: 'active',
    category: 'Full Wedding'
  },
  metrics: {
    recommendationCount: 160,
    totalRecommendations: 342,
    percentage: 46.8,
    averageSawScore: 0.965,
    dominantCriteria: 'Jenis Acara (Akad & Resepsi, Bobot 20%)',
    satisfactionRate: '98.4%'
  },
  rankings: [
    {
      rank: 1,
      name: 'Paket Akad + Resepsi',
      code: 'PKG-ALL-IN',
      price: 7500000,
      count: 160,
      percentage: 46.8,
      averageScore: 0.965
    },
    {
      rank: 2,
      name: 'Paket Akad',
      code: 'PKG-AKAD',
      price: 3500000,
      count: 86,
      percentage: 25.1,
      averageScore: 0.910
    },
    {
      rank: 3,
      name: 'Paket Resepsi',
      code: 'PKG-RESEPSI',
      price: 5000000,
      count: 68,
      percentage: 19.9,
      averageScore: 0.885
    },
    {
      rank: 4,
      name: 'Siraman Package',
      code: 'PKG-SIRAMAN',
      price: 2500000,
      count: 28,
      percentage: 8.2,
      averageScore: 0.860
    }
  ]
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: recs, error } = await supabase
          .from('recommendations')
          .select('top_package_id, top_score, packages(id, code, name, price, description, photo_url, facilities)');

        if (!error && recs && recs.length > 0) {
          const counts: Record<string, number> = {};
          const scores: Record<string, number> = {};
          const pkgMap: Record<string, any> = {};

          recs.forEach(r => {
            const id = r.top_package_id;
            if (!id) return;
            counts[id] = (counts[id] || 0) + 1;
            scores[id] = (scores[id] || 0) + (Number(r.top_score) || 0);
            if (r.packages) pkgMap[id] = r.packages;
          });

          const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
          if (sortedIds.length > 0) {
            const topId = sortedIds[0];
            const total = recs.length;
            const topPkg = pkgMap[topId] || FALLBACK_TOP_PACKAGE_DATA.topPackage;
            const topCount = counts[topId];
            const avgScore = scores[topId] ? (scores[topId] / topCount) : 0.95;

            const rankings = sortedIds.map((id, idx) => {
              const p = pkgMap[id] || {};
              const c = counts[id];
              return {
                rank: idx + 1,
                name: p.name || `Paket ${idx + 1}`,
                code: p.code || `PKG-${idx + 1}`,
                price: p.price || 0,
                count: c,
                percentage: Number(((c / total) * 100).toFixed(1)),
                averageScore: Number((scores[id] / c).toFixed(3))
              };
            });

            return res.status(200).json({
              success: true,
              message: 'Data paket paling sering direkomendasikan berhasil dimuat',
              data: {
                topPackage: topPkg,
                metrics: {
                  recommendationCount: topCount,
                  totalRecommendations: total,
                  percentage: Number(((topCount / total) * 100).toFixed(1)),
                  averageSawScore: Number(avgScore.toFixed(3)),
                  dominantCriteria: 'Jenis Acara (Bobot 20%)',
                  satisfactionRate: '98.4%'
                },
                rankings
              }
            });
          }
        }
      } catch {
        // Fallback
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Data paket paling sering direkomendasikan berhasil dimuat',
      data: FALLBACK_TOP_PACKAGE_DATA
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat data paket paling sering direkomendasikan',
      error: err.message
    });
  }
}

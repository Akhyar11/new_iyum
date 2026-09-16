import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from './questions';
import { FALLBACK_CRITERIA } from './criteria';

// Mock package data fallback
const FALLBACK_PACKAGES = [
  {
    id: 'pkg-1',
    code: 'PKG-AKAD',
    name: 'Paket Akad',
    price: 3500000,
    description: 'Paket riasan sakral khusus prosesi akad nikah dengan sentuhan natural elegan dan tahan lama hingga acara selesai.',
    photo_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Hairdo/Hijabdo Pengantin Wanita untuk Akad',
      'Rias & Busana Pengantin Pria (Beskap/Jas)',
      'Aksesoris Pengantin & Ronce Melati Asli',
      'Retouch makeup 1 kali saat acara berlangsung',
      'Makeup & Busana untuk 2 Ibu Mempelai',
      'Free softlens & kuku palsu (fake nails)'
    ],
    status: 'active',
    category: 'Akad Nikah'
  },
  {
    id: 'pkg-2',
    code: 'PKG-RESEPSI',
    name: 'Paket Resepsi',
    price: 5000000,
    description: 'Paket tata rias megah dan glamor untuk acara pesta resepsi pernikahan, dirancang memikat di bawah sorot lampu panggung.',
    photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Hairdo/Hijabdo Pengantin Resepsi Glamour',
      'Busana Lengkap Pengantin Wanita & Pria Resepsi',
      'Aksesoris Mewah (Mahkota / Siger / Cunduk Mentul)',
      'Makeup & Kain/Kebaya untuk 2 Ibu Mempelai',
      'Busana Beskap untuk 2 Bapak Mempelai',
      'Makeup & Busana untuk 4 Pagar Ayu / Jaga Kado',
      'Standby MUA & Asisten selama acara'
    ],
    status: 'active',
    category: 'Resepsi'
  },
  {
    id: 'pkg-3',
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
  {
    id: 'pkg-4',
    code: 'PKG-SIRAMAN',
    name: 'Siraman Package',
    price: 2500000,
    description: 'Paket khusus prosesi adat pra-nikah Siraman & Midodareni dengan riasan tradisional sakral yang segar dan natural.',
    photo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup Tipis Natural Tahan Air untuk Calon Pengantin',
      'Hairdo Tradisional / Sanggul / Hijabdo Khusus Adat',
      'Ronce Melati Basahan Dada & Bando Melati Asli',
      'Penyewaan Kain Jarik Batik Tradisional & Kemben',
      'Makeup & Hairdo Sederhana untuk 2 Ibu',
      'Bimbingan tata cara paes & busana adat siraman'
    ],
    status: 'active',
    category: 'Prosesi Adat'
  }
];

export const IN_MEMORY_RECOMMENDATIONS: any[] = [];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Riwayat Rekomendasi
  if (req.method === 'GET') {
    const query = req.query || {};
    const search = (query.search || query.q || '').toString().toLowerCase().trim();
    const statusFilter = (query.status || '').toString().trim();
    const packageFilter = (query.package || query.packageCode || '').toString().trim();
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
    const page = Math.max(1, parseInt(query.page) || 1);
    const offset = (page - 1) * limit;

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        let queryBuilder = supabase
          .from('recommendations')
          .select(`
            id,
            code,
            client_name,
            client_phone,
            event_date,
            budget_range,
            top_score,
            status,
            admin_notes,
            raw_answers,
            created_at,
            top_package:top_package_id (id, code, name, price, photo_url, category),
            answers:recommendation_answers (
              id,
              question_id,
              question_code,
              question_text,
              criteria_name,
              weight,
              option_id,
              option_text,
              raw_score,
              weighted_score
            ),
            results:recommendation_results (
              id,
              package_id,
              package_code,
              package_name,
              final_score,
              rank
            )
          `, { count: 'exact' });

        if (statusFilter && statusFilter !== 'all') {
          queryBuilder = queryBuilder.eq('status', statusFilter);
        }

        if (packageFilter && packageFilter !== 'all') {
          queryBuilder = queryBuilder.or(`top_package_code.eq.${packageFilter}`);
        }

        if (search) {
          queryBuilder = queryBuilder.or(`client_name.ilike.%${search}%,client_phone.ilike.%${search}%,code.ilike.%${search}%`);
        }

        const { data, error, count } = await queryBuilder
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (!error && data && data.length > 0) {
          const mappedData = data.map((item: any) => ({
            id: item.id,
            code: item.code || item.id,
            clientName: item.client_name,
            clientPhone: item.client_phone || '-',
            eventDate: item.event_date || 'Belum Dijadwalkan',
            recommendedPackage: item.top_package?.name || item.top_package_name || 'Paket Rekomendasi',
            recommendedPackageCode: item.top_package?.code || item.top_package_code || 'PKG-ALL-IN',
            topScore: Number(item.top_score) || 0,
            budgetRange: item.budget_range || '-',
            status: item.status || 'Selesai',
            adminNotes: item.admin_notes || '',
            timestamp: new Date(item.created_at).toLocaleDateString('id-ID') + ', ' + new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            created_at: item.created_at,
            answers: item.raw_answers || {},
            answersDetail: (item.answers || []).map((a: any) => ({
              questionId: a.question_code || a.question_id,
              questionText: a.question_text || 'Pertanyaan Kriteria',
              criteriaName: a.criteria_name || 'Kriteria',
              weight: Number(a.weight) || 10,
              selectedOptionText: a.option_text || '-',
              rawScore: Number(a.raw_score) || 3,
              weightedContribution: Number(a.weighted_score) || 7.5
            })),
            alternativePackages: (item.results || []).map((r: any) => ({
              rank: r.rank,
              name: r.package_name || r.package?.name || 'Paket Alternatif',
              code: r.package_code || r.package?.code || 'PKG',
              score: Number(r.final_score) || 0
            }))
          }));

          return res.status(200).json({
            success: true,
            count: mappedData.length,
            total: count || mappedData.length,
            page,
            limit,
            data: mappedData
          });
        }
      } catch (err: any) {
        console.error('Error fetching recommendations from DB:', err.message);
      }
    }

    // Fallback data if DB is offline or empty
    let filtered = [...IN_MEMORY_RECOMMENDATIONS];

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (packageFilter && packageFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.recommendedPackageCode === packageFilter || 
        item.top_package_code === packageFilter
      );
    }

    if (search) {
      filtered = filtered.filter(item => {
        const name = (item.clientName || item.client_name || '').toLowerCase();
        const phone = (item.clientPhone || item.client_phone || '').toLowerCase();
        const code = (item.code || item.id || '').toLowerCase();
        const pkg = (item.recommendedPackage || '').toLowerCase();
        return name.includes(search) || phone.includes(search) || code.includes(search) || pkg.includes(search);
      });
    }

    const paginated = filtered.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      count: paginated.length,
      total: filtered.length,
      page,
      limit,
      data: paginated
    });
  }

  // POST: Hitung SAW & Simpan Riwayat
  if (req.method === 'POST') {
    try {
      const { userLabel = 'Pengunjung Web', answers } = req.body || {};

      if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Jawaban kuesioner diperlukan untuk perhitungan rekomendasi SAW.'
        });
      }

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      const criteriaMap: Record<string, number> = {};
      let packagesList = [...FALLBACK_PACKAGES];

      // Ambil bobot dinamis dari DB jika tersedia
      if (supabaseUrl && supabaseAnonKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data: dbCriteria } = await supabase
            .from('criteria')
            .select('*')
            .order('order_index', { ascending: true });

          if (dbCriteria && dbCriteria.length > 0) {
            dbCriteria.forEach((c: any) => {
              criteriaMap[c.id] = Number(c.weight);
              criteriaMap[c.code] = Number(c.weight);
              const qNum = c.code.replace('C', '');
              criteriaMap[`q${qNum}`] = Number(c.weight);
            });
          }

          const { data: dbPackages } = await supabase
            .from('packages')
            .select('*')
            .eq('status', 'active')
            .order('price', { ascending: true });

          if (dbPackages && dbPackages.length > 0) {
            packagesList = dbPackages;
          }
        } catch (err: any) {
          console.warn('Supabase fetch error:', err.message);
        }
      }

      FALLBACK_CRITERIA.forEach(c => {
        if (criteriaMap[c.id] === undefined) criteriaMap[c.id] = c.weight;
        if (criteriaMap[c.code] === undefined) criteriaMap[c.code] = c.weight;
        const qNum = c.code.replace('C', '');
        if (criteriaMap[`q${qNum}`] === undefined) criteriaMap[`q${qNum}`] = c.weight;
      });

      // Hitung skor SAW dinamis
      const packageScores: Record<string, number> = {};
      const packageBreakdowns: Record<string, any[]> = {};

      packagesList.forEach(pkg => {
        packageScores[pkg.id] = 0;
        packageBreakdowns[pkg.id] = [];
      });

      FALLBACK_QUESTIONS.forEach(q => {
        const selectedOptionId = answers[q.id];
        const option = (q.options || []).find((o: any) => o.id === selectedOptionId) || q.options?.[0];
        if (!option) return;

        const weightVal = criteriaMap[q.id] !== undefined
          ? criteriaMap[q.id]
          : (criteriaMap[q.criteriaId] !== undefined ? criteriaMap[q.criteriaId] : (q.weight || 10));

        const weightFraction = weightVal / 100;

        packagesList.forEach(pkg => {
          const rawScore = (option.scores && (option.scores[pkg.id] ?? option.scores[pkg.code?.toLowerCase()])) || 2;
          const normalizedValue = rawScore / 4;
          const weightedContribution = weightFraction * normalizedValue;

          packageScores[pkg.id] = (packageScores[pkg.id] || 0) + weightedContribution;

          if (!packageBreakdowns[pkg.id]) packageBreakdowns[pkg.id] = [];
          packageBreakdowns[pkg.id].push({
            questionId: q.id,
            criteriaName: q.criteriaName || 'Kriteria',
            weight: weightVal,
            optionText: option.text,
            rawScore,
            weightedContribution: Math.round(weightedContribution * 10000) / 100
          });
        });
      });

      // Urutkan paket berdasarkan skor tertinggi
      const ranked = packagesList.map(pkg => {
        const rawTotal = packageScores[pkg.id] || 0;
        const percentage = Math.round(rawTotal * 1000) / 10;

        return {
          packageId: pkg.id,
          pkg,
          rawScore: rawTotal,
          finalScore: percentage,
          rank: 0,
          breakdown: packageBreakdowns[pkg.id] || []
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

      const topPackage = ranked[0];
      const alternatives = ranked.slice(1);

      let savedId = 'rec-' + Date.now();

      // Simpan ke Supabase jika tersedia
      if (supabaseUrl && supabaseAnonKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          
          const { data: recRow, error: recError } = await supabase
            .from('recommendations')
            .insert({
              user_label: userLabel,
              top_package_id: topPackage.pkg.id.startsWith('pkg-') ? null : topPackage.pkg.id,
              top_score: topPackage.finalScore
            })
            .select()
            .single();

          if (!recError && recRow) {
            savedId = recRow.id;

            const answerRows = Object.entries(answers).map(([qId, optId]) => ({
              recommendation_id: recRow.id,
              question_id: (qId as string).startsWith('q') ? null : qId,
              option_id: (optId as string).startsWith('opt') ? null : optId
            }));

            if (answerRows.length > 0) {
              await supabase.from('recommendation_answers').insert(answerRows);
            }

            const resultRows = ranked.map(r => ({
              recommendation_id: recRow.id,
              package_id: r.pkg.id.startsWith('pkg-') ? null : r.pkg.id,
              final_score: r.finalScore,
              rank: r.rank
            }));

            if (resultRows.length > 0) {
              await supabase.from('recommendation_results').insert(resultRows);
            }
          }
        } catch (dbErr: any) {
          console.warn('Database save error:', dbErr.message);
        }
      }

      const responsePayload = {
        success: true,
        message: 'Perhitungan rekomendasi SAW dengan bobot dinamis berhasil.',
        recommendationId: savedId,
        data: {
          topPackage,
          alternatives,
          allRanked: ranked,
          appliedWeights: criteriaMap
        }
      };

      IN_MEMORY_RECOMMENDATIONS.unshift({
        id: savedId,
        userLabel,
        topPackage,
        alternatives,
        allRanked: ranked,
        created_at: new Date().toISOString()
      });

      return res.status(200).json(responsePayload);

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses rekomendasi.',
        error: err.message || String(err)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

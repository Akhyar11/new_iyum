import { createClient } from '@supabase/supabase-js';
import { IN_MEMORY_RECOMMENDATIONS } from '../recommendations';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Parameter ID atau kode rekomendasi diperlukan.'
    });
  }

  const targetId = id.toString().trim();
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  // GET: Ambil detail lengkap jawaban rekomendasi
  if (req.method === 'GET') {
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

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
            updated_at,
            top_package:top_package_id (*),
            answers:recommendation_answers (*),
            results:recommendation_results (*)
          `);

        if (isUuid) {
          queryBuilder = queryBuilder.or(`id.eq.${targetId},code.eq.${targetId}`);
        } else {
          queryBuilder = queryBuilder.eq('code', targetId);
        }

        const { data, error } = await queryBuilder.single();
        if (!error && data) {
          const rawData: any = data;
          const topPkg: any = Array.isArray(rawData.top_package) ? rawData.top_package[0] : rawData.top_package;
          const detailItem = {
            id: rawData.id,
            code: rawData.code || rawData.id,
            clientName: rawData.client_name,
            clientPhone: rawData.client_phone || '-',
            eventDate: rawData.event_date || 'Belum Dijadwalkan',
            recommendedPackage: topPkg?.name || rawData.top_package_name || 'Paket Rekomendasi',
            recommendedPackageCode: topPkg?.code || rawData.top_package_code || 'PKG-ALL-IN',
            topScore: Number(rawData.top_score) || 0,
            budgetRange: rawData.budget_range || '-',
            status: rawData.status || 'Selesai',
            adminNotes: rawData.admin_notes || '',
            timestamp: new Date(rawData.created_at).toLocaleDateString('id-ID') + ', ' + new Date(rawData.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            created_at: rawData.created_at,
            answers: rawData.raw_answers || {},
            answersDetail: (data.answers || []).map((a: any) => ({
              questionId: a.question_code || a.question_id,
              questionText: a.question_text || 'Pertanyaan Kriteria',
              criteriaName: a.criteria_name || 'Kriteria',
              weight: Number(a.weight) || 10,
              selectedOptionText: a.option_text || '-',
              rawScore: Number(a.raw_score) || 3,
              weightedContribution: Number(a.weighted_score) || 7.5
            })),
            alternativePackages: (data.results || []).map((r: any) => ({
              rank: r.rank,
              name: r.package_name || r.package?.name || 'Paket Alternatif',
              code: r.package_code || r.package?.code || 'PKG',
              score: Number(r.final_score) || 0
            }))
          };

          return res.status(200).json({ success: true, data: detailItem });
        }
      } catch (err: any) {
        console.warn('Supabase detail fetch error:', err.message);
      }
    }

    // In-memory fallback
    const found = IN_MEMORY_RECOMMENDATIONS.find(r => r.id === targetId || r.code === targetId);
    if (found) {
      return res.status(200).json({ success: true, data: found });
    }

    return res.status(404).json({
      success: false,
      message: `Riwayat rekomendasi dengan ID atau kode '${targetId}' tidak ditemukan.`
    });
  }

  // PATCH / PUT: Update status atau catatan admin
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const body = req.body || {};
    const { status, adminNotes, admin_notes } = body;

    const noteToUpdate = adminNotes !== undefined ? adminNotes : admin_notes;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const updates: any = {};
        if (status) updates.status = status;
        if (noteToUpdate !== undefined) updates.admin_notes = noteToUpdate;
        updates.updated_at = new Date().toISOString();

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
        let queryBuilder = supabase.from('recommendations').update(updates);

        if (isUuid) {
          queryBuilder = queryBuilder.or(`id.eq.${targetId},code.eq.${targetId}`);
        } else {
          queryBuilder = queryBuilder.eq('code', targetId);
        }

        const { data, error } = await queryBuilder.select().single();
        if (!error && data) {
          return res.status(200).json({
            success: true,
            message: 'Status dan catatan rekomendasi berhasil diperbarui di database.',
            data
          });
        }
      } catch (dbErr: any) {
        console.warn('Supabase update error:', dbErr.message);
      }
    }

    // Update in-memory
    const found = IN_MEMORY_RECOMMENDATIONS.find(r => r.id === targetId || r.code === targetId);
    if (found) {
      if (status) found.status = status;
      if (noteToUpdate !== undefined) {
        found.adminNotes = noteToUpdate;
        found.admin_notes = noteToUpdate;
      }
      return res.status(200).json({
        success: true,
        message: 'Data riwayat rekomendasi berhasil diperbarui.',
        data: found
      });
    }

    return res.status(404).json({
      success: false,
      message: `Riwayat rekomendasi dengan ID '${targetId}' tidak ditemukan.`
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

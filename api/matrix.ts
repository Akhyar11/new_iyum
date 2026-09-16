import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from './questions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Matriks skor
  if (req.method === 'GET') {
    try {
      const rows: any[] = [];
      FALLBACK_QUESTIONS.forEach(q => {
        (q.options || []).forEach(opt => {
          rows.push({
            questionId: q.id,
            questionText: q.text,
            criteriaName: q.criteriaName,
            optionId: opt.id,
            optionText: opt.text,
            description: opt.description || '',
            scores: opt.scores || { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 2 }
          });
        });
      });

      return res.status(200).json({
        success: true,
        count: rows.length,
        matrix: rows
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memuat matriks skor.',
        error: err.message || String(err)
      });
    }
  }

  // PUT / POST / PATCH: Perbarui matriks skor
  if (req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH') {
    try {
      const body = req.body || {};
      const { matrix, scores, optionId, packageId, score } = body;

      // Single cell update
      if (optionId && packageId && score !== undefined) {
        const parsedScore = Number(score);
        if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 4) {
          return res.status(400).json({
            success: false,
            message: 'Nilai skor harus antara 1 sampai 4.'
          });
        }

        for (const q of FALLBACK_QUESTIONS) {
          const opt = (q.options || []).find((o: any) => o.id === optionId);
          if (opt) {
            opt.scores = opt.scores || {};
            (opt.scores as Record<string, any>)[packageId] = parsedScore;
            return res.status(200).json({
              success: true,
              message: 'Nilai skor berhasil diperbarui.',
              data: { optionId, packageId, score: parsedScore }
            });
          }
        }
      }

      // Bulk update
      let updatesList: any[] = [];
      if (Array.isArray(matrix)) {
        updatesList = matrix;
      } else if (typeof scores === 'object' && scores !== null) {
        Object.entries(scores).forEach(([optId, sc]) => {
          updatesList.push({ optionId: optId, scores: sc });
        });
      }

      for (const update of updatesList) {
        for (const val of Object.values(update.scores || {})) {
          const num = Number(val);
          if (isNaN(num) || num < 1 || num > 4) {
            return res.status(400).json({
              success: false,
              message: 'Setiap nilai skor harus antara 1 sampai 4.'
            });
          }
        }
      }

      updatesList.forEach(update => {
        for (const q of FALLBACK_QUESTIONS) {
          const opt = (q.options || []).find((o: any) => o.id === update.optionId);
          if (opt) {
            opt.scores = {
              ...(opt.scores || {}),
              ...update.scores
            };
            break;
          }
        }
      });

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        for (const update of updatesList) {
          for (const [pkgId, sc] of Object.entries(update.scores || {})) {
            await supabase
              .from('option_scores')
              .upsert({
                option_id: update.optionId,
                package_id: pkgId,
                score: Number(sc),
                updated_at: new Date().toISOString()
              }, { onConflict: 'option_id,package_id' });
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Matriks skor jawaban berhasil disimpan.'
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui matriks skor.',
        error: err.message || String(err)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

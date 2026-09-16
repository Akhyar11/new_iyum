import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from '../questions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID opsi jawaban diperlukan.'
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  // GET: Detail opsi jawaban
  if (req.method === 'GET') {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('options')
          .select(`
            id,
            question_id,
            text,
            description,
            order_index,
            option_scores (
              package_id,
              score,
              package:packages (
                id,
                code
              )
            )
          `)
          .eq('id', id)
          .single();

        if (!error && data) {
          const scores: Record<string, number> = {};
          (data.option_scores || []).forEach((sc: any) => {
            const key = sc.package?.code?.toLowerCase() || sc.package_id;
            scores[key] = sc.score;
          });

          return res.status(200).json({
            success: true,
            data: {
              id: data.id,
              questionId: data.question_id,
              text: data.text,
              description: data.description,
              orderIndex: data.order_index,
              scores
            }
          });
        }
      }

      for (const q of FALLBACK_QUESTIONS) {
        const found = (q.options || []).find((o: any) => o.id === id);
        if (found) {
          return res.status(200).json({
            success: true,
            data: { ...found, questionId: q.id }
          });
        }
      }

      return res.status(404).json({
        success: false,
        message: `Opsi jawaban dengan ID "${id}" tidak ditemukan.`
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil detail opsi jawaban.',
        error: err.message || String(err)
      });
    }
  }

  // PUT / PATCH: Ubah data opsi jawaban
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = req.body || {};
      const { text, description, scores, orderIndex, order_index } = body;

      const updates: any = {};
      if (text !== undefined) {
        if (typeof text !== 'string' || !text.trim()) {
          return res.status(400).json({ success: false, message: 'Teks opsi tidak boleh kosong.' });
        }
        updates.text = text.trim();
      }

      if (description !== undefined) {
        updates.description = typeof description === 'string' ? description.trim() : '';
      }

      if (scores !== undefined) {
        updates.scores = scores;
      }

      if (orderIndex !== undefined || order_index !== undefined) {
        updates.orderIndex = Number(orderIndex !== undefined ? orderIndex : order_index) || 1;
      }

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const dbUpdates: any = {};
        if (updates.text !== undefined) dbUpdates.text = updates.text;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.orderIndex !== undefined) dbUpdates.order_index = updates.orderIndex;

        await supabase
          .from('options')
          .update(dbUpdates)
          .eq('id', id);
      }

      let updatedOption: any = null;
      for (const q of FALLBACK_QUESTIONS) {
        const optIdx = (q.options || []).findIndex((o: any) => o.id === id);
        if (optIdx !== -1) {
          q.options[optIdx] = {
            ...q.options[optIdx],
            ...updates
          };
          updatedOption = { ...q.options[optIdx], questionId: q.id };
          break;
        }
      }

      if (!updatedOption) {
        return res.status(404).json({
          success: false,
          message: `Opsi jawaban dengan ID "${id}" tidak ditemukan.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Opsi jawaban berhasil diperbarui.',
        data: updatedOption
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui opsi jawaban.',
        error: err.message || String(err)
      });
    }
  }

  // DELETE: Hapus opsi jawaban
  if (req.method === 'DELETE') {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase
          .from('options')
          .delete()
          .eq('id', id);
      }

      let deletedOption: any = null;
      for (const q of FALLBACK_QUESTIONS) {
        const optIdx = (q.options || []).findIndex((o: any) => o.id === id);
        if (optIdx !== -1) {
          deletedOption = q.options[optIdx];
          q.options.splice(optIdx, 1);
          break;
        }
      }

      if (!deletedOption) {
        return res.status(404).json({
          success: false,
          message: `Opsi jawaban dengan ID "${id}" tidak ditemukan.`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Opsi jawaban "${deletedOption.text}" berhasil dihapus.`,
        data: deletedOption
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus opsi jawaban.',
        error: err.message || String(err)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

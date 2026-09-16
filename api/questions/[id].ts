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
      message: 'ID pertanyaan diperlukan.'
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  // GET: Detail pertanyaan
  if (req.method === 'GET') {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
          .from('questions')
          .select(`
            id,
            text,
            subtitle,
            order_index,
            criteria:criteria_id (
              id,
              name,
              weight
            ),
            options (
              id,
              text,
              description,
              order_index
            )
          `)
          .eq('id', id)
          .single();

        if (!error && data) {
          return res.status(200).json({
            success: true,
            data: {
              id: data.id,
              criteriaId: data.criteria?.id,
              criteriaName: data.criteria?.name,
              weight: data.criteria?.weight,
              orderIndex: data.order_index,
              text: data.text,
              subtitle: data.subtitle,
              options: (data.options || []).sort((a: any, b: any) => a.order_index - b.order_index)
            }
          });
        }
      }

      const found = FALLBACK_QUESTIONS.find(q => q.id === id);
      if (!found) {
        return res.status(404).json({
          success: false,
          message: `Pertanyaan dengan ID "${id}" tidak ditemukan.`
        });
      }

      return res.status(200).json({
        success: true,
        data: found
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil detail pertanyaan.',
        error: err.message || String(err)
      });
    }
  }

  // PUT / PATCH: Ubah pertanyaan
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = req.body || {};
      const { text, subtitle, criteriaId, criteria_id, criteriaName, weight, orderIndex, order_index } = body;

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (text !== undefined) {
        if (typeof text !== 'string' || !text.trim()) {
          return res.status(400).json({ success: false, message: 'Teks pertanyaan tidak boleh kosong.' });
        }
        updates.text = text.trim();
      }

      if (subtitle !== undefined) {
        updates.subtitle = typeof subtitle === 'string' ? subtitle.trim() : '';
      }

      if (criteriaId !== undefined || criteria_id !== undefined) {
        updates.criteriaId = criteriaId || criteria_id;
        updates.criteria_id = criteriaId || criteria_id;
      }

      if (criteriaName !== undefined) {
        updates.criteriaName = criteriaName;
      }

      if (weight !== undefined) {
        updates.weight = Number(weight) || 0;
      }

      if (orderIndex !== undefined || order_index !== undefined) {
        const o = Number(orderIndex !== undefined ? orderIndex : order_index);
        updates.orderIndex = o;
        updates.order_index = o;
      }

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const dbUpdates: any = {};
        if (updates.text !== undefined) dbUpdates.text = updates.text;
        if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
        if (updates.criteria_id !== undefined) dbUpdates.criteria_id = updates.criteria_id;
        if (updates.order_index !== undefined) dbUpdates.order_index = updates.order_index;
        dbUpdates.updated_at = updates.updated_at;

        await supabase
          .from('questions')
          .update(dbUpdates)
          .eq('id', id);
      }

      const index = FALLBACK_QUESTIONS.findIndex(q => q.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Pertanyaan dengan ID "${id}" tidak ditemukan.`
        });
      }

      FALLBACK_QUESTIONS[index] = {
        ...FALLBACK_QUESTIONS[index],
        ...updates
      };

      return res.status(200).json({
        success: true,
        message: 'Pertanyaan berhasil diperbarui.',
        data: FALLBACK_QUESTIONS[index]
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui pertanyaan.',
        error: err.message || String(err)
      });
    }
  }

  // DELETE: Hapus pertanyaan
  if (req.method === 'DELETE') {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase
          .from('questions')
          .delete()
          .eq('id', id);
      }

      const index = FALLBACK_QUESTIONS.findIndex(q => q.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Pertanyaan dengan ID "${id}" tidak ditemukan.`
        });
      }

      const [deleted] = FALLBACK_QUESTIONS.splice(index, 1);

      FALLBACK_QUESTIONS.forEach((q, idx) => {
        q.orderIndex = idx + 1;
      });

      return res.status(200).json({
        success: true,
        message: `Pertanyaan "${deleted.text}" berhasil dihapus.`,
        data: deleted
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus pertanyaan.',
        error: err.message || String(err)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

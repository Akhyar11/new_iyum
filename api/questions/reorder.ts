import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from '../questions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Gunakan POST atau PUT untuk mengurutkan pertanyaan.'
    });
  }

  try {
    const body = req.body || {};
    const { orders, questionIds } = body;

    let orderList: Array<{ id: string; orderIndex: number }> = [];
    if (Array.isArray(orders) && orders.length > 0) {
      orderList = orders;
    } else if (Array.isArray(questionIds) && questionIds.length > 0) {
      orderList = questionIds.map((id: string, index: number) => ({ id, orderIndex: index + 1 }));
    } else {
      return res.status(400).json({
        success: false,
        message: 'Format pengurutan tidak valid. Berikan array "orders" [{ id, orderIndex }] atau "questionIds" [id1, id2, ...].'
      });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      for (const item of orderList) {
        const targetId = item.id;
        const oIndex = Number(item.orderIndex);
        if (targetId && !isNaN(oIndex)) {
          await supabase
            .from('questions')
            .update({ order_index: oIndex, updated_at: new Date().toISOString() })
            .eq('id', targetId);
        }
      }
    }

    orderList.forEach(item => {
      const targetId = item.id;
      const oIndex = Number(item.orderIndex);
      const found = FALLBACK_QUESTIONS.find(q => q.id === targetId);
      if (found && !isNaN(oIndex)) {
        found.orderIndex = oIndex;
      }
    });

    FALLBACK_QUESTIONS.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    return res.status(200).json({
      success: true,
      message: 'Urutan pertanyaan berhasil disimpan.',
      data: FALLBACK_QUESTIONS
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengurutkan pertanyaan.',
      error: err.message || String(err)
    });
  }
}

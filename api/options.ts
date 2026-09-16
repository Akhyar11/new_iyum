import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from './questions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Daftar opsi jawaban
  if (req.method === 'GET') {
    try {
      const { questionId, question_id } = req.query || {};
      const targetQId = questionId || question_id;

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        let query = supabase
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
          .order('order_index', { ascending: true });

        if (targetQId) {
          query = query.eq('question_id', targetQId);
        }

        const { data, error } = await query;
        if (!error && data) {
          const formatted = data.map((opt: any) => {
            const scores: Record<string, number> = {};
            (opt.option_scores || []).forEach((sc: any) => {
              const key = sc.package?.code?.toLowerCase() || sc.package_id;
              scores[key] = sc.score;
            });
            return {
              id: opt.id,
              questionId: opt.question_id,
              text: opt.text,
              description: opt.description,
              orderIndex: opt.order_index,
              scores
            };
          });

          return res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
          });
        }
      }

      // Fallback
      let options: any[] = [];
      if (targetQId) {
        const q = FALLBACK_QUESTIONS.find(item => item.id === targetQId);
        if (q) {
          options = (q.options || []).map(opt => ({ ...opt, questionId: q.id }));
        }
      } else {
        FALLBACK_QUESTIONS.forEach(q => {
          (q.options || []).forEach(opt => {
            options.push({ ...opt, questionId: q.id });
          });
        });
      }

      return res.status(200).json({
        success: true,
        count: options.length,
        data: options
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memuat opsi jawaban.',
        error: err.message || String(err)
      });
    }
  }

  // POST: Tambah opsi jawaban
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { questionId, question_id, text, description = '', scores = {}, orderIndex, order_index } = body;
      const targetQId = questionId || question_id || req.query?.questionId;

      if (!targetQId) {
        return res.status(400).json({
          success: false,
          message: 'ID pertanyaan (questionId) diperlukan.'
        });
      }

      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Teks opsi jawaban wajib diisi.'
        });
      }

      const targetQuestion = FALLBACK_QUESTIONS.find(q => q.id === targetQId);
      const existingCount = targetQuestion ? (targetQuestion.options || []).length : 0;
      const parsedOrder = Number(orderIndex || order_index) || (existingCount + 1);

      const newOption: any = {
        id: `opt-${Date.now()}`,
        questionId: targetQId,
        text: text.trim(),
        description: description.trim(),
        scores: scores || { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 2 },
        orderIndex: parsedOrder
      };

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('options')
          .insert([{
            question_id: targetQId,
            text: newOption.text,
            description: newOption.description,
            order_index: newOption.orderIndex
          }])
          .select()
          .single();

        if (!error && data) {
          newOption.id = data.id;
        }
      }

      if (targetQuestion) {
        targetQuestion.options = targetQuestion.options || [];
        targetQuestion.options.push(newOption);
      }

      return res.status(201).json({
        success: true,
        message: 'Opsi jawaban berhasil ditambahkan.',
        data: newOption
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menambahkan opsi jawaban.',
        error: err.message || String(err)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

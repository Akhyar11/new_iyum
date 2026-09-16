import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from '../questions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Gunakan GET untuk mengambil daftar pertanyaan rekomendasi.'
    });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
            order_index,
            option_scores (
              package_id,
              score,
              package:packages (
                id,
                code
              )
            )
          )
        `)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted = data.map((q: any, idx: number) => {
          const sortedOptions = (q.options || [])
            .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            .map((opt: any, oIdx: number) => {
              const scores: Record<string, number> = {};
              (opt.option_scores || []).forEach((sc: any) => {
                const key = sc.package?.code?.toLowerCase() || sc.package_id;
                scores[key] = sc.score;
              });
              return {
                id: opt.id,
                text: opt.text,
                description: opt.description || '',
                orderIndex: opt.order_index || (oIdx + 1),
                scores
              };
            });

          return {
            id: q.id,
            criteriaId: q.criteria?.id || `c${idx + 1}`,
            criteriaName: q.criteria?.name || 'Kriteria',
            weight: Number(q.criteria?.weight) || 10,
            orderIndex: q.order_index || (idx + 1),
            text: q.text,
            subtitle: q.subtitle || '',
            options: sortedOptions
          };
        });

        const totalWeight = formatted.reduce((sum: number, q: any) => sum + (q.weight || 0), 0);

        return res.status(200).json({
          success: true,
          count: formatted.length,
          totalWeight,
          data: formatted
        });
      }
    }

    const sorted = [...FALLBACK_QUESTIONS].sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const totalWeight = sorted.reduce((sum, q: any) => sum + (q.weight || 0), 0);

    return res.status(200).json({
      success: true,
      count: sorted.length,
      totalWeight,
      data: sorted
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat pertanyaan rekomendasi.',
      error: err.message || String(err)
    });
  }
}

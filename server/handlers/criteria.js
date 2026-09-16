import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from './questions.js';

export const DEFAULT_CRITERIA = [
  { id: 'c1', code: 'C1', name: 'Jenis Acara', weight: 20, orderIndex: 1, description: 'Kriteria penentu jenis prosesi pernikahan.' },
  { id: 'c2', code: 'C2', name: 'Waktu Pelaksanaan', weight: 10, orderIndex: 2, description: 'Penentu daya tahan riasan dan kebutuhan retouch.' },
  { id: 'c3', code: 'C3', name: 'Kebutuhan Makeup', weight: 15, orderIndex: 3, description: 'Alokasi tim MUA utama dan perias pendamping.' },
  { id: 'c4', code: 'C4', name: 'Kebutuhan Busana', weight: 10, orderIndex: 4, description: 'Penyewaan busana pengantin dan kain tradisional.' },
  { id: 'c5', code: 'C5', name: 'Gaya Riasan', weight: 10, orderIndex: 5, description: 'Gaya rias adat atau modern flawless.' },
  { id: 'c6', code: 'C6', name: 'Jumlah Ibu Mempelai', weight: 5, orderIndex: 6, description: 'Kebutuhan rias dan kebaya ibu kedua pihak.' },
  { id: 'c7', code: 'C7', name: 'Jumlah Jaga Kado', weight: 5, orderIndex: 7, description: 'Kebutuhan riasan pendamping dan pagar ayu.' },
  { id: 'c8', code: 'C8', name: 'Kebutuhan Siraman', weight: 15, orderIndex: 8, description: 'Prosesi adat sakral siraman & midodareni.' },
  { id: 'c9', code: 'C9', name: 'Tambahan Rias & Busana', weight: 5, orderIndex: 9, description: 'Sewa beskap bapak atau hijab styling khusus.' },
  { id: 'c10', code: 'C10', name: 'Anggaran (Budget)', weight: 5, orderIndex: 10, description: 'Kesesuaian alokasi anggaran calon pengantin.' }
];

export let FALLBACK_CRITERIA = [...DEFAULT_CRITERIA];

export async function handleGetCriteria(req, res) {
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
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('criteria')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted = data.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          weight: Number(c.weight),
          orderIndex: c.order_index,
          description: c.description
        }));

        const totalWeight = formatted.reduce((acc, c) => acc + (c.weight || 0), 0);

        return res.status(200).json({
          success: true,
          count: formatted.length,
          totalWeight,
          isValid: totalWeight === 100,
          data: formatted
        });
      }
    }

    const totalWeight = FALLBACK_CRITERIA.reduce((acc, c) => acc + (c.weight || 0), 0);

    return res.status(200).json({
      success: true,
      count: FALLBACK_CRITERIA.length,
      totalWeight,
      isValid: totalWeight === 100,
      data: FALLBACK_CRITERIA
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat kriteria: ' + err.message
    });
  }
}

export async function handleUpdateCriteriaWeights(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    let weightsInput = body.weights || body.criteria || body;

    // Normalisasi input ke map { id/code/questionId : number }
    const weightMap = {};

    if (Array.isArray(weightsInput)) {
      weightsInput.forEach(item => {
        const key = item.id || item.code || item.criteriaId || item.questionId;
        const w = Number(item.weight);
        if (key && !isNaN(w)) {
          weightMap[key] = w;
        }
      });
    } else if (typeof weightsInput === 'object' && weightsInput !== null) {
      Object.entries(weightsInput).forEach(([key, val]) => {
        const w = Number(val);
        if (!isNaN(w)) {
          weightMap[key] = w;
        }
      });
    }

    if (Object.keys(weightMap).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Data bobot tidak valid. Sediakan objek atau array pasangan kriteria dan bobot.'
      });
    }

    // Perbarui bobot sementara pada kriteria yang cocok
    const candidateCriteria = FALLBACK_CRITERIA.map(c => {
      let matchedWeight = c.weight;
      // Cek berdasarkan ID kriteria (c1), kode (C1), atau ID pertanyaan terkait (q1)
      const qIndex = parseInt(c.code.replace('C', ''), 10);
      const qId = `q${qIndex}`;

      if (weightMap[c.id] !== undefined) {
        matchedWeight = weightMap[c.id];
      } else if (weightMap[c.code] !== undefined) {
        matchedWeight = weightMap[c.code];
      } else if (weightMap[qId] !== undefined) {
        matchedWeight = weightMap[qId];
      }

      return {
        ...c,
        weight: matchedWeight
      };
    });

    // Validasi setiap bobot >= 0 dan <= 100
    for (const c of candidateCriteria) {
      if (c.weight < 0 || c.weight > 100) {
        return res.status(400).json({
          success: false,
          message: `Bobot kriteria ${c.name} (${c.weight}%) tidak valid. Harus bernilai antara 0% sampai 100%.`
        });
      }
    }

    // Validasi total bobot kriteria HARUS tepat 100%
    const totalWeight = candidateCriteria.reduce((acc, c) => acc + c.weight, 0);

    if (totalWeight !== 100) {
      return res.status(400).json({
        success: false,
        message: `Total bobot kriteria harus tepat 100%. Total saat ini adalah ${totalWeight}%. Silakan sesuaikan kembali sebelum menyimpan.`,
        totalWeight,
        isValid: false,
        discrepancy: 100 - totalWeight
      });
    }

    // Simpan ke Supabase jika terhubung
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      for (const c of candidateCriteria) {
        await supabase
          .from('criteria')
          .update({
            weight: c.weight,
            updated_at: new Date().toISOString()
          })
          .or(`id.eq.${c.id},code.eq.${c.code}`);
      }
    }

    // Simpan ke in-memory FALLBACK_CRITERIA
    FALLBACK_CRITERIA = candidateCriteria;

    // Sinkronisasi juga ke FALLBACK_QUESTIONS
    FALLBACK_QUESTIONS.forEach(q => {
      const matched = FALLBACK_CRITERIA.find(c => c.id === q.criteriaId || c.code === `C${q.orderIndex}`);
      if (matched) {
        q.weight = matched.weight;
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Bobot kriteria berhasil disimpan dengan validasi total 100%.',
      totalWeight: 100,
      isValid: true,
      data: FALLBACK_CRITERIA
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui bobot kriteria: ' + err.message
    });
  }
}

export async function handleResetCriteriaWeights(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    FALLBACK_CRITERIA = [...DEFAULT_CRITERIA];

    // Sinkronisasi ke FALLBACK_QUESTIONS
    FALLBACK_QUESTIONS.forEach(q => {
      const matched = FALLBACK_CRITERIA.find(c => c.id === q.criteriaId || c.code === `C${q.orderIndex}`);
      if (matched) {
        q.weight = matched.weight;
      }
    });

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      for (const c of DEFAULT_CRITERIA) {
        await supabase
          .from('criteria')
          .update({
            weight: c.weight,
            updated_at: new Date().toISOString()
          })
          .or(`id.eq.${c.id},code.eq.${c.code}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Bobot kriteria berhasil direset ke standar SAW (total 100%).',
      totalWeight: 100,
      isValid: true,
      data: FALLBACK_CRITERIA
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mereset bobot kriteria: ' + err.message
    });
  }
}

import { createClient } from '@supabase/supabase-js';
import { FALLBACK_QUESTIONS } from './questions.js';
import { FALLBACK_PACKAGES } from './packages.js';

// Salinan default skor matriks untuk reset
const DEFAULT_MATRIX_SCORES = {
  // q1
  'q1-opt1': { 'pkg-1': 4, 'pkg-2': 1, 'pkg-3': 3, 'pkg-4': 1 },
  'q1-opt2': { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 1 },
  'q1-opt3': { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 },
  'q1-opt4': { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 },
  // q2
  'q2-opt1': { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 3, 'pkg-4': 4 },
  'q2-opt2': { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 2 },
  'q2-opt3': { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 2 },
  'q2-opt4': { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 1 },
  // q3
  'q3-opt1': { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 3 },
  'q3-opt2': { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 4 },
  'q3-opt3': { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 },
  'q3-opt4': { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 4 },
  // q4
  'q4-opt1': { 'pkg-1': 3, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 3 },
  'q4-opt2': { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 2 },
  'q4-opt3': { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 1 },
  'q4-opt4': { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 4 },
  // q5
  'q5-opt1': { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2 },
  'q5-opt2': { 'pkg-1': 3, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 },
  'q5-opt3': { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 2 },
  'q5-opt4': { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 },
  // q6
  'q6-opt1': { 'pkg-1': 3, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 3 },
  'q6-opt2': { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 3 },
  'q6-opt3': { 'pkg-1': 3, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 4 },
  'q6-opt4': { 'pkg-1': 1, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2 },
  // q7
  'q7-opt1': { 'pkg-1': 4, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 },
  'q7-opt2': { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 3, 'pkg-4': 2 },
  'q7-opt3': { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 },
  'q7-opt4': { 'pkg-1': 1, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 },
  // q8
  'q8-opt1': { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 },
  'q8-opt2': { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 },
  'q8-opt3': { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 },
  'q8-opt4': { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 3 },
  // q9
  'q9-opt1': { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 3 },
  'q9-opt2': { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2 },
  'q9-opt3': { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 },
  'q9-opt4': { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 4 },
  // q10
  'q10-opt1': { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 4 },
  'q10-opt2': { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 3 },
  'q10-opt3': { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 2 },
  'q10-opt4': { 'pkg-1': 1, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 }
};

export async function handleGetScoreMatrix(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const packages = FALLBACK_PACKAGES.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      price: p.price
    }));

    const rows = [];
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
      packages,
      matrix: rows
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat matriks nilai jawaban: ' + err.message
    });
  }
}

export async function handleUpdateScoreMatrix(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { matrix, scores } = body;

    let updatesList = [];

    // Format 1: array of { optionId, scores: { [pkgId]: score } }
    if (Array.isArray(matrix)) {
      matrix.forEach(item => {
        if (item.optionId && item.scores) {
          updatesList.push({
            optionId: item.optionId,
            scores: item.scores
          });
        }
      });
    }
    // Format 2: array of { optionId, packageId, score }
    else if (Array.isArray(scores)) {
      const grouped = {};
      scores.forEach(item => {
        if (item.optionId && item.packageId && item.score !== undefined) {
          if (!grouped[item.optionId]) grouped[item.optionId] = {};
          grouped[item.optionId][item.packageId] = Number(item.score);
        }
      });
      Object.entries(grouped).forEach(([optionId, sc]) => {
        updatesList.push({ optionId, scores: sc });
      });
    }
    // Format 3: object { [optionId]: { [pkgId]: score } }
    else if (typeof scores === 'object' && scores !== null) {
      Object.entries(scores).forEach(([optionId, sc]) => {
        updatesList.push({ optionId, scores: sc });
      });
    }

    if (updatesList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Data matriks tidak valid. Sediakan array matrix atau scores.'
      });
    }

    // Validasi semua nilai berada di rentang 1 - 4
    for (const update of updatesList) {
      for (const [pkgKey, val] of Object.entries(update.scores)) {
        const num = Number(val);
        if (isNaN(num) || num < 1 || num > 4) {
          return res.status(400).json({
            success: false,
            message: `Nilai kecocokan untuk paket "${pkgKey}" pada opsi "${update.optionId}" harus berupa angka 1 sampai 4. Nilai diterima: ${val}`
          });
        }
      }
    }

    // Terapkan ke FALLBACK_QUESTIONS
    let updatedCount = 0;
    updatesList.forEach(update => {
      for (const q of FALLBACK_QUESTIONS) {
        const opt = (q.options || []).find(o => o.id === update.optionId);
        if (opt) {
          opt.scores = {
            ...(opt.scores || {}),
            ...update.scores
          };
          updatedCount++;
          break;
        }
      }
    });

    // Supabase update jika terhubung
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      for (const update of updatesList) {
        for (const [pkgId, sc] of Object.entries(update.scores)) {
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
      message: `Matriks nilai jawaban berhasil diperbarui (${updatedCount} opsi disinkronisasi).`,
      updatedCount
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui matriks nilai jawaban: ' + err.message
    });
  }
}

export async function handleUpdateMatrixCell(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { optionId, packageId, score } = body;

    if (!optionId || !packageId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Parameter optionId, packageId, dan score wajib diisi.'
      });
    }

    const parsedScore = Number(score);
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 4) {
      return res.status(400).json({
        success: false,
        message: 'Nilai kesesuaian skor harus berupa angka 1 sampai 4.'
      });
    }

    let foundOption = null;
    for (const q of FALLBACK_QUESTIONS) {
      const opt = (q.options || []).find(o => o.id === optionId);
      if (opt) {
        opt.scores = opt.scores || {};
        opt.scores[packageId] = parsedScore;
        foundOption = opt;
        break;
      }
    }

    if (!foundOption) {
      return res.status(404).json({
        success: false,
        message: `Opsi jawaban dengan ID "${optionId}" tidak ditemukan.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Nilai jawaban opsi "${optionId}" untuk paket "${packageId}" berhasil diubah menjadi ${parsedScore}.`,
      data: {
        optionId,
        packageId,
        score: parsedScore,
        scores: foundOption.scores
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah nilai sel matriks: ' + err.message
    });
  }
}

export async function handleResetScoreMatrix(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    FALLBACK_QUESTIONS.forEach(q => {
      (q.options || []).forEach(opt => {
        if (DEFAULT_MATRIX_SCORES[opt.id]) {
          opt.scores = { ...DEFAULT_MATRIX_SCORES[opt.id] };
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Matriks nilai jawaban SAW berhasil dikembalikan ke standar awal.'
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mereset matriks nilai: ' + err.message
    });
  }
}

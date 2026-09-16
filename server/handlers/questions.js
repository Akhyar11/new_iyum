import { createClient } from '@supabase/supabase-js';

export const FALLBACK_QUESTIONS = [
  {
    id: 'q1',
    criteriaId: 'c1',
    criteriaName: 'Jenis Acara',
    weight: 20,
    orderIndex: 1,
    text: 'Apa jenis acara pernikahan utama yang akan diselenggarakan?',
    subtitle: 'Kriteria dengan bobot tertinggi (20%) untuk menentukan keselarasan paket.',
    options: [
      { id: 'q1-opt1', text: 'Akad Nikah / Pemberkatan saja', description: 'Prosesi ijab kabul atau ibadah pernikahan sakral tanpa pesta resepsi besar.', scores: { 'pkg-1': 4, 'pkg-2': 1, 'pkg-3': 3, 'pkg-4': 1 } },
      { id: 'q1-opt2', text: 'Pesta Resepsi Pernikahan saja', description: 'Fokus pesta perayaan mengundang keluarga besar dan tamu undangan.', scores: { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 1 } },
      { id: 'q1-opt3', text: 'Akad Nikah & Resepsi (Satu Hari Penuh)', description: 'Rangkaian lengkap mulai dari akad sakral pagi hingga resepsi meriah siang/malam.', scores: { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q1-opt4', text: 'Prosesi Adat Siraman & Midodareni', description: 'Upacara adat penyucian dan malam midodareni sebelum hari pernikahan.', scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 } }
    ]
  },
  {
    id: 'q2',
    criteriaId: 'c2',
    criteriaName: 'Waktu Pelaksanaan',
    weight: 10,
    orderIndex: 2,
    text: 'Kapan perkiraan waktu pelaksanaan acara pernikahan Anda?',
    subtitle: 'Menentukan daya tahan riasan dan kebutuhan retouch MUA.',
    options: [
      { id: 'q2-opt1', text: 'Pagi Hari (07.00 - 11.00 WIB)', description: 'Cocok untuk akad atau siraman dengan pencahayaan alami.', scores: { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 3, 'pkg-4': 4 } },
      { id: 'q2-opt2', text: 'Siang Hari (11.00 - 15.00 WIB)', description: 'Resepsi siang membutuhkan riasan tahan panas dan kilap.', scores: { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 2 } },
      { id: 'q2-opt3', text: 'Malam Hari (18.30 - 22.00 WIB)', description: 'Resepsi malam dengan pencahayaan lampu panggung megah.', scores: { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 2 } },
      { id: 'q2-opt4', text: 'Seharian Penuh (Pagi sampai Malam)', description: 'Memerlukan pergantian busana, ronce melati baru, dan retouch intensif.', scores: { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 1 } }
    ]
  },
  {
    id: 'q3',
    criteriaId: 'c3',
    criteriaName: 'Kebutuhan Makeup',
    weight: 15,
    orderIndex: 3,
    text: 'Siapa saja pihak yang membutuhkan layanan rias wajah dari MUA?',
    subtitle: 'Menentukan alokasi tim MUA dan asisten di hari H.',
    options: [
      { id: 'q3-opt1', text: 'Hanya Kedua Mempelai (Pengantin Wanita & Pria)', description: 'Fokus riasan maksimal dan privat pada mempelai.', scores: { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 3 } },
      { id: 'q3-opt2', text: 'Kedua Mempelai + Orang Tua (2 Ibu)', description: 'Riasan pengantin ditambah rias anggun untuk ibu kedua pihak.', scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 4 } },
      { id: 'q3-opt3', text: 'Mempelai + Orang Tua + Pendamping / Jaga Kado', description: 'Paket lengkap beserta rias pagar ayu / penjaga buku tamu.', scores: { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q3-opt4', text: 'Calon Pengantin Wanita Khusus Prosesi Tradisional', description: 'Fokus pada riasan basahan atau natural sakral.', scores: { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 4 } }
    ]
  },
  {
    id: 'q4',
    criteriaId: 'c4',
    criteriaName: 'Kebutuhan Busana',
    weight: 10,
    orderIndex: 4,
    text: 'Apakah Anda membutuhkan penyewaan busana pengantin & keluarga?',
    subtitle: 'Ketersediaan kebaya, gaun, beskap adat, atau busana sendiri.',
    options: [
      { id: 'q4-opt1', text: 'Hanya Rias (Busana Sudah Disiapkan Sendiri)', description: 'Pengantin sudah memiliki busana jahit sendiri atau dari desainer.', scores: { 'pkg-1': 3, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 3 } },
      { id: 'q4-opt2', text: '1 Pasang Busana Pengantin (Akad atau Resepsi Saja)', description: 'Sewa 1 pasang busana mempelai wanita & pria.', scores: { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 2 } },
      { id: 'q4-opt3', text: '2 Pasang Busana Pengantin Lengkap (Akad + Resepsi)', description: 'Ganti busana akad sakral ke gaun/kebaya resepsi megah.', scores: { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q4-opt4', text: 'Kain Jarik Adat Siraman & Busana Tradisional', description: 'Kemben, kain batik mori, atau jarik khusus siraman.', scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 4 } }
    ]
  },
  {
    id: 'q5',
    criteriaId: 'c5',
    criteriaName: 'Gaya Riasan',
    weight: 10,
    orderIndex: 5,
    text: 'Gaya tata rias dan paes apa yang ingin Anda kenakan?',
    subtitle: 'Gaya riasan adat maupun modern memengaruhi keahlian dan aksesoris.',
    options: [
      { id: 'q5-opt1', text: 'Modern Flawless / Soft Glamour', description: 'Tampilan kulit segar natural berkilau dengan nuansa internasional/nasional.', scores: { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2 } },
      { id: 'q5-opt2', text: 'Adat Sunda Siger / Mahkota Elegan', description: 'Riasan pengantin Sunda lengkap dengan siger, kembang goyang, & melati kolong.', scores: { 'pkg-1': 3, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q5-opt3', text: 'Adat Jawa Solo Putri / Paes Ageng Jogja', description: 'Paes hitam prada sakral khas keratin Jawa dengan cunduk mentul.', scores: { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 2 } },
      { id: 'q5-opt4', text: 'Basahan Adat Tradisional Siraman', description: 'Riasan natural tahan air dengan ronce melati penutup dada.', scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 } }
    ]
  },
  {
    id: 'q6',
    criteriaId: 'c6',
    criteriaName: 'Jumlah Ibu Mempelai',
    weight: 5,
    orderIndex: 6,
    text: 'Berapa jumlah ibu (kandung/mertua) yang dirias dan dipakaikan busana?',
    subtitle: 'Rias ibu mencakup sanggul/hijabdo dan kebaya.',
    options: [
      { id: 'q6-opt1', text: 'Tidak ada / Rias Mandiri', description: 'Ibu mempelai menggunakan jasa MUA terpisah.', scores: { 'pkg-1': 3, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 3 } },
      { id: 'q6-opt2', text: '1 Orang Ibu', description: 'Hanya ibu kandung pengantin wanita.', scores: { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 3 } },
      { id: 'q6-opt3', text: '2 Orang Ibu (Kedua Pihak Keluarga)', description: 'Ibu mempelai wanita dan ibu mempelai pria (standar).', scores: { 'pkg-1': 3, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 4 } },
      { id: 'q6-opt4', text: 'Lebih dari 2 Orang Ibu / Besan Tambahan', description: 'Termasuk nenek atau tante keluarga inti.', scores: { 'pkg-1': 1, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2 } }
    ]
  },
  {
    id: 'q7',
    criteriaId: 'c7',
    criteriaName: 'Jumlah Jaga Kado',
    weight: 5,
    orderIndex: 7,
    text: 'Apakah membutuhkan tata rias untuk penerima tamu / pagar ayu?',
    subtitle: 'Menentukan kebutuhan asisten MUA tambahan.',
    options: [
      { id: 'q7-opt1', text: 'Tidak ada (0 Orang)', description: 'Acara intimate tanpa penerima tamu berseragam.', scores: { 'pkg-1': 4, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 } },
      { id: 'q7-opt2', text: '2 Orang Jaga Kado', description: 'Penerima tamu skala sedang.', scores: { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 3, 'pkg-4': 2 } },
      { id: 'q7-opt3', text: '4 Orang Jaga Kado / Pagar Ayu', description: 'Jumlah ideal standar resepsi gedung.', scores: { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q7-opt4', text: 'Lebih dari 4 Orang (> 4 Orang)', description: 'Pesta resepsi akbar dengan banyak pagar ayu.', scores: { 'pkg-1': 1, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 } }
    ]
  },
  {
    id: 'q8',
    criteriaId: 'c8',
    criteriaName: 'Kebutuhan Siraman',
    weight: 15,
    orderIndex: 8,
    text: 'Apakah agenda pernikahan Anda menyertakan prosesi siraman adat?',
    subtitle: 'Kriteria berbobot tinggi (15%) yang sangat spesifik.',
    options: [
      { id: 'q8-opt1', text: 'Sama sekali tidak ada prosesi siraman', description: 'Hanya menyelenggarakan akad dan/atau resepsi.', scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q8-opt2', text: 'Ada prosesi siraman sederhana di rumah', description: 'Siraman intim keluarga dengan ronce melati dan kain basahan.', scores: { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 } },
      { id: 'q8-opt3', text: 'Rangkaian adat Siraman & Midodareni lengkap', description: 'Upacara adat tradisional sakral pada malam sebelum hari H.', scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 } },
      { id: 'q8-opt4', text: 'Siraman digabung dalam paket hari H lengkap', description: 'Menginginkan satu vendor untuk siraman hingga resepsi.', scores: { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 3 } }
    ]
  },
  {
    id: 'q9',
    criteriaId: 'c9',
    criteriaName: 'Tambahan Rias & Busana',
    weight: 5,
    orderIndex: 9,
    text: 'Apakah memerlukan tambahan sewa jas/beskap pria atau hijab styling khusus?',
    subtitle: 'Fasilitas pelengkap untuk kenyamanan keluarga.',
    options: [
      { id: 'q9-opt1', text: 'Tidak perlu tambahan', description: 'Semua pihak pria membawa busana sendiri.', scores: { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 3 } },
      { id: 'q9-opt2', text: 'Tambahan Hijab Styling & Hairdo khusus', description: 'Variasi hijab do modern atau sanggul adat tambahan.', scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2 } },
      { id: 'q9-opt3', text: 'Sewa Beskap / Jas Bapak Mempelai', description: 'Beskap komplit blangkon & selop untuk bapak kedua pihak.', scores: { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 1 } },
      { id: 'q9-opt4', text: 'Ronce Melati Asli & Aksesoris Adat Ekstra', description: 'Ronce melati basahan, bando melati, atau kalung melati pria.', scores: { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 4 } }
    ]
  },
  {
    id: 'q10',
    criteriaId: 'c10',
    criteriaName: 'Anggaran (Budget)',
    weight: 5,
    orderIndex: 10,
    text: 'Berapa kisaran anggaran yang Anda siapkan untuk paket tata rias?',
    subtitle: 'Membantu mencocokkan nilai ekonomis paket terhadap anggaran Anda.',
    options: [
      { id: 'q10-opt1', text: 'Hingga Rp 3.000.000 (Ekonomis / Prosesi Adat)', description: 'Sesuai untuk prosesi adat sakral atau siraman hemat.', scores: { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 4 } },
      { id: 'q10-opt2', text: 'Rp 3.000.000 - Rp 4.500.000 (Standar Akad Nikah)', description: 'Ideal untuk riasan akad nikah khidmat dan elegan.', scores: { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 3 } },
      { id: 'q10-opt3', text: 'Rp 4.500.000 - Rp 6.500.000 (Pesta Resepsi)', description: 'Cakupan pas untuk pesta resepsi meriah beserta pendamping.', scores: { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 2 } },
      { id: 'q10-opt4', text: 'Diatas Rp 6.500.000 (All-in Akad + Resepsi Lengkap)', description: 'Kebutuhan paket komprehensif tanpa pusing mikir fasilitas terpisah.', scores: { 'pkg-1': 1, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 } }
    ]
  }
];

export async function handleGetQuestions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { search, criteriaId } = req.query || {};

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      let query = supabase
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
        .order('order_index', { ascending: true });

      if (criteriaId) {
        query = query.eq('criteria_id', criteriaId);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        let formatted = data.map((q) => ({
          id: q.id,
          criteriaId: q.criteria?.id,
          criteriaName: q.criteria?.name,
          weight: q.criteria?.weight,
          orderIndex: q.order_index,
          text: q.text,
          subtitle: q.subtitle,
          options: (q.options || []).sort((a, b) => a.order_index - b.order_index)
        }));

        if (search) {
          const lower = search.toLowerCase();
          formatted = formatted.filter(q => 
            q.text?.toLowerCase().includes(lower) || 
            q.subtitle?.toLowerCase().includes(lower) ||
            q.criteriaName?.toLowerCase().includes(lower)
          );
        }

        return res.status(200).json({
          success: true,
          count: formatted.length,
          data: formatted
        });
      }
    }

    // Fallback mode in-memory
    let list = [...FALLBACK_QUESTIONS];
    if (criteriaId) {
      list = list.filter(q => q.criteriaId === criteriaId);
    }
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(q => 
        q.text.toLowerCase().includes(lower) || 
        (q.subtitle && q.subtitle.toLowerCase().includes(lower)) ||
        q.criteriaName.toLowerCase().includes(lower)
      );
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat pertanyaan: ' + err.message
    });
  }
}

export async function handleGetQuestionDetail(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID pertanyaan diperlukan.' });
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
            options: (data.options || []).sort((a, b) => a.order_index - b.order_index)
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pertanyaan: ' + err.message
    });
  }
}

export async function handleCreateQuestion(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { 
      text, 
      subtitle = '', 
      criteriaId, 
      criteria_id,
      criteriaName = 'Umum', 
      weight = 10, 
      orderIndex,
      order_index,
      options = [] 
    } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Teks pertanyaan wajib diisi.'
      });
    }

    const targetCriteriaId = criteriaId || criteria_id || 'c1';
    const parsedOrder = Number(orderIndex || order_index) || (FALLBACK_QUESTIONS.length + 1);

    const newQuestion = {
      id: `q-${Date.now()}`,
      criteriaId: targetCriteriaId,
      criteriaName,
      weight: Number(weight) || 10,
      orderIndex: parsedOrder,
      text: text.trim(),
      subtitle: subtitle.trim(),
      options: Array.isArray(options) ? options : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase
        .from('questions')
        .insert([{
          text: newQuestion.text,
          subtitle: newQuestion.subtitle,
          criteria_id: targetCriteriaId,
          order_index: newQuestion.orderIndex
        }])
        .select()
        .single();

      if (!error && data) {
        newQuestion.id = data.id;
      }
    }

    FALLBACK_QUESTIONS.push(newQuestion);

    return res.status(201).json({
      success: true,
      message: 'Pertanyaan berhasil ditambahkan.',
      data: newQuestion
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan pertanyaan: ' + err.message
    });
  }
}

export async function handleUpdateQuestion(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID pertanyaan diperlukan.' });
  }

  try {
    const body = req.body || {};
    const { text, subtitle, criteriaId, criteria_id, criteriaName, weight, orderIndex, order_index } = body;

    const updates = {
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

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const dbUpdates = {};
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui pertanyaan: ' + err.message
    });
  }
}

export async function handleDeleteQuestion(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID pertanyaan diperlukan.' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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

    // Re-index urutan pertanyaan yang tersisa
    FALLBACK_QUESTIONS.forEach((q, idx) => {
      q.orderIndex = idx + 1;
    });

    return res.status(200).json({
      success: true,
      message: `Pertanyaan "${deleted.text}" berhasil dihapus.`,
      data: deleted
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus pertanyaan: ' + err.message
    });
  }
}

export async function handleGetOptions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        const formatted = data.map(opt => {
          const scores = {};
          (opt.option_scores || []).forEach(sc => {
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

    // Fallback mode in-memory
    let options = [];
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat opsi jawaban: ' + err.message
    });
  }
}

export async function handleGetOptionDetail(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, optionId } = req.query || {};
  const targetId = id || optionId;
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'ID opsi jawaban diperlukan.' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
        .eq('id', targetId)
        .single();

      if (!error && data) {
        const scores = {};
        (data.option_scores || []).forEach(sc => {
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

    // Fallback search
    for (const q of FALLBACK_QUESTIONS) {
      const found = (q.options || []).find(o => o.id === targetId);
      if (found) {
        return res.status(200).json({
          success: true,
          data: { ...found, questionId: q.id }
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: `Opsi jawaban dengan ID "${targetId}" tidak ditemukan.`
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail opsi: ' + err.message
    });
  }
}

export async function handleCreateOption(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { questionId, question_id, text, description = '', scores = {}, orderIndex, order_index } = body;
    const targetQId = questionId || question_id || req.query?.questionId;

    if (!targetQId) {
      return res.status(400).json({
        success: false,
        message: 'ID pertanyaan (questionId) diperlukan untuk menambahkan opsi.'
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

    const newOption = {
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan opsi jawaban: ' + err.message
    });
  }
}

export async function handleUpdateOption(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, optionId } = req.query || {};
  const targetId = id || optionId;
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'ID opsi jawaban diperlukan.' });
  }

  try {
    const body = req.body || {};
    const { text, description, scores, orderIndex, order_index } = body;

    const updates = {};
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

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const dbUpdates = {};
      if (updates.text !== undefined) dbUpdates.text = updates.text;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.orderIndex !== undefined) dbUpdates.order_index = updates.orderIndex;

      await supabase
        .from('options')
        .update(dbUpdates)
        .eq('id', targetId);
    }

    let updatedOption = null;
    for (const q of FALLBACK_QUESTIONS) {
      const optIdx = (q.options || []).findIndex(o => o.id === targetId);
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
        message: `Opsi jawaban dengan ID "${targetId}" tidak ditemukan.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Opsi jawaban berhasil diperbarui.',
      data: updatedOption
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui opsi jawaban: ' + err.message
    });
  }
}

export async function handleDeleteOption(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, optionId } = req.query || {};
  const targetId = id || optionId;
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'ID opsi jawaban diperlukan.' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      await supabase
        .from('options')
        .delete()
        .eq('id', targetId);
    }

    let deletedOption = null;
    for (const q of FALLBACK_QUESTIONS) {
      const optIdx = (q.options || []).findIndex(o => o.id === targetId);
      if (optIdx !== -1) {
        deletedOption = q.options[optIdx];
        q.options.splice(optIdx, 1);
        break;
      }
    }

    if (!deletedOption) {
      return res.status(404).json({
        success: false,
        message: `Opsi jawaban dengan ID "${targetId}" tidak ditemukan.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Opsi jawaban "${deletedOption.text}" berhasil dihapus.`,
      data: deletedOption
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus opsi jawaban: ' + err.message
    });
  }
}

export async function handleReorderQuestions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { orders, questionIds } = body;

    let orderList = [];
    if (Array.isArray(orders) && orders.length > 0) {
      orderList = orders;
    } else if (Array.isArray(questionIds) && questionIds.length > 0) {
      orderList = questionIds.map((id, index) => ({ id, orderIndex: index + 1 }));
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
        const oIndex = Number(item.orderIndex || item.order_index);
        if (targetId && !isNaN(oIndex)) {
          await supabase
            .from('questions')
            .update({ order_index: oIndex, updated_at: new Date().toISOString() })
            .eq('id', targetId);
        }
      }
    }

    // Update in-memory FALLBACK_QUESTIONS
    orderList.forEach(item => {
      const targetId = item.id;
      const oIndex = Number(item.orderIndex || item.order_index);
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengurutkan pertanyaan: ' + err.message
    });
  }
}

export async function handleMoveQuestion(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID pertanyaan diperlukan.' });
  }

  try {
    const body = req.body || {};
    const { direction } = body;
    if (direction !== 'up' && direction !== 'down') {
      return res.status(400).json({ success: false, message: 'Arah perpindahan harus "up" atau "down".' });
    }

    FALLBACK_QUESTIONS.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const currentIndex = FALLBACK_QUESTIONS.findIndex(q => q.id === id);

    if (currentIndex === -1) {
      return res.status(404).json({ success: false, message: `Pertanyaan dengan ID "${id}" tidak ditemukan.` });
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= FALLBACK_QUESTIONS.length) {
      return res.status(400).json({
        success: false,
        message: `Pertanyaan sudah berada di posisi paling ${direction === 'up' ? 'atas' : 'bawah'}.`
      });
    }

    // Swap positions
    const currentQ = FALLBACK_QUESTIONS[currentIndex];
    const adjacentQ = FALLBACK_QUESTIONS[targetIndex];

    const tempOrder = currentQ.orderIndex;
    currentQ.orderIndex = adjacentQ.orderIndex;
    adjacentQ.orderIndex = tempOrder;

    FALLBACK_QUESTIONS.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // Re-assign 1..N
    FALLBACK_QUESTIONS.forEach((q, idx) => {
      q.orderIndex = idx + 1;
    });

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      await Promise.all([
        supabase.from('questions').update({ order_index: currentQ.orderIndex, updated_at: new Date().toISOString() }).eq('id', currentQ.id),
        supabase.from('questions').update({ order_index: adjacentQ.orderIndex, updated_at: new Date().toISOString() }).eq('id', adjacentQ.id)
      ]);
    }

    return res.status(200).json({
      success: true,
      message: `Posisi pertanyaan berhasil dipindahkan ke ${direction}.`,
      data: FALLBACK_QUESTIONS
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memindahkan posisi pertanyaan: ' + err.message
    });
  }
}

export async function handleGetRecommendationQuestions(req, res) {
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
        const formatted = data.map((q, idx) => {
          const sortedOptions = (q.options || [])
            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
            .map((opt, oIdx) => {
              const scores = {};
              (opt.option_scores || []).forEach(sc => {
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

        const totalWeight = formatted.reduce((sum, q) => sum + (q.weight || 0), 0);

        return res.status(200).json({
          success: true,
          count: formatted.length,
          totalWeight,
          data: formatted
        });
      }
    }

    // Fallback data
    const sorted = [...FALLBACK_QUESTIONS].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const totalWeight = sorted.reduce((sum, q) => sum + (q.weight || 0), 0);

    return res.status(200).json({
      success: true,
      count: sorted.length,
      totalWeight,
      data: sorted
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat pertanyaan untuk rekomendasi: ' + err.message
    });
  }
}




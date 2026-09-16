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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Ambil daftar pertanyaan
  if (req.method === 'GET') {
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

        const { data: questionsData, error: qError } = await query;

        if (!qError && questionsData && questionsData.length > 0) {
          let formatted = questionsData.map((q: any) => ({
            id: q.id,
            criteriaId: q.criteria?.id,
            criteriaName: q.criteria?.name,
            weight: q.criteria?.weight,
            orderIndex: q.order_index,
            text: q.text,
            subtitle: q.subtitle,
            options: (q.options || []).sort((a: any, b: any) => a.order_index - b.order_index)
          }));

          if (search) {
            const lower = String(search).toLowerCase();
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

      let list = [...FALLBACK_QUESTIONS];
      if (criteriaId) {
        list = list.filter(q => q.criteriaId === criteriaId);
      }
      if (search) {
        const lower = String(search).toLowerCase();
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

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memuat pertanyaan rekomendasi.',
        error: error.message || String(error)
      });
    }
  }

  // POST: Tambah pertanyaan baru
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { text, subtitle = '', criteriaId, criteria_id, criteriaName = 'Umum', weight = 10, orderIndex, order_index, options = [] } = body;

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

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menambahkan pertanyaan.',
        error: error.message || String(error)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed. Gunakan GET atau POST.'
  });
}

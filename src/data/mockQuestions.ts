export interface CriteriaMock {
  id: string;
  name: string;
  weight: number; // in percentage e.g. 20 for 20%
}

export interface OptionMock {
  id: string;
  text: string;
  description?: string;
  // Scores for candidate packages: [pkg-1, pkg-2, pkg-3, pkg-4, pkg-5, pkg-6]
  scores: Record<string, number>;
}

export interface QuestionMock {
  id: string;
  criteriaId: string;
  criteriaName: string;
  weight: number;
  orderIndex: number;
  text: string;
  subtitle?: string;
  options: OptionMock[];
}

export const mockQuestions: QuestionMock[] = [
  {
    id: 'q1',
    criteriaId: 'c1',
    criteriaName: 'Jenis Acara',
    weight: 20,
    orderIndex: 1,
    text: 'Apa jenis acara pernikahan utama yang akan diselenggarakan?',
    subtitle: 'Kriteria dengan bobot tertinggi (20%) untuk menentukan keselarasan paket.',
    options: [
      {
        id: 'q1-opt1',
        text: 'Akad Nikah / Pemberkatan saja',
        description: 'Prosesi ijab kabul atau ibadah pernikahan sakral tanpa pesta resepsi besar.',
        scores: { 'pkg-1': 2, 'pkg-2': 1, 'pkg-3': 3, 'pkg-4': 1, 'pkg-5': 4, 'pkg-6': 1 }
      },
      {
        id: 'q1-opt2',
        text: 'Pesta Resepsi Pernikahan saja',
        description: 'Fokus pesta perayaan mengundang keluarga besar dan tamu undangan.',
        scores: { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 4, 'pkg-5': 1, 'pkg-6': 1 }
      },
      {
        id: 'q1-opt3',
        text: 'Akad Nikah & Resepsi (Satu Hari Penuh)',
        description: 'Rangkaian lengkap mulai dari akad sakral pagi hingga resepsi meriah siang/malam.',
        scores: { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 2, 'pkg-5': 2, 'pkg-6': 1 }
      },
      {
        id: 'q1-opt4',
        text: 'Prosesi Adat Ngunduh Mantu / Siraman',
        description: 'Upacara adat ngunduh mantu keluarga atau prosesi siraman & midodareni pra-nikah.',
        scores: { 'pkg-1': 2, 'pkg-2': 4, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 1, 'pkg-6': 4 }
      }
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
      {
        id: 'q2-opt1',
        text: 'Pagi Hari (07.00 - 11.00 WIB)',
        description: 'Cocok untuk akad atau siraman dengan pencahayaan alami.',
        scores: { 'pkg-1': 3, 'pkg-2': 2, 'pkg-3': 3, 'pkg-4': 1, 'pkg-5': 4, 'pkg-6': 4 }
      },
      {
        id: 'q2-opt2',
        text: 'Siang Hari (11.00 - 15.00 WIB)',
        description: 'Resepsi siang membutuhkan riasan tahan panas dan kilap.',
        scores: { 'pkg-1': 3, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 4, 'pkg-5': 2, 'pkg-6': 2 }
      },
      {
        id: 'q2-opt3',
        text: 'Malam Hari (18.30 - 22.00 WIB)',
        description: 'Resepsi malam dengan pencahayaan lampu panggung megah.',
        scores: { 'pkg-1': 3, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 4, 'pkg-5': 1, 'pkg-6': 2 }
      },
      {
        id: 'q2-opt4',
        text: 'Seharian Penuh (Pagi sampai Malam)',
        description: 'Memerlukan pergantian busana, ronce melati baru, dan retouch intensif.',
        scores: { 'pkg-1': 4, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2, 'pkg-5': 2, 'pkg-6': 1 }
      }
    ]
  },
  {
    id: 'q3',
    criteriaId: 'c3',
    criteriaName: 'Kebutuhan Makeup',
    weight: 15,
    orderIndex: 3,
    text: 'Siapa saja pihak yang membutuhkan layanan rias wajah dari MUA?',
    subtitle: 'Menentukan jumlah perias yang diberangkatkan ke lokasi acara.',
    options: [
      {
        id: 'q3-opt1',
        text: 'Hanya Kedua Mempelai (Pengantin Wanita & Pria)',
        description: 'Fokus rias eksklusif untuk kedua calon mempelai.',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 4, 'pkg-5': 3, 'pkg-6': 1 }
      },
      {
        id: 'q3-opt2',
        text: 'Kedua Mempelai + Orang Tua (2 Ibu)',
        description: 'Rias pengantin plus rias dan kain untuk kedua ibu kandung/mertua.',
        scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 3, 'pkg-4': 2, 'pkg-5': 4, 'pkg-6': 3 }
      },
      {
        id: 'q3-opt3',
        text: 'Mempelai + Orang Tua + Pendamping / Jaga Kado',
        description: 'Paket rias komprehensif mencakup keluarga inti dan pagar ayu penerima tamu.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 1, 'pkg-6': 2 }
      },
      {
        id: 'q3-opt4',
        text: 'Calon Pengantin Wanita Khusus Prosesi Tradisional',
        description: 'Riasan sakral khusus calon pengantin wanita dan orang tua untuk prosesi siraman.',
        scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 2, 'pkg-6': 4 }
      }
    ]
  },
  {
    id: 'q4',
    criteriaId: 'c4',
    criteriaName: 'Kebutuhan Busana',
    weight: 15,
    orderIndex: 4,
    text: 'Apakah Anda membutuhkan penyewaan busana pengantin & keluarga?',
    subtitle: 'Koleksi kebaya akad, gaun resepsi, beskap bapak, dan seragam jaga kado.',
    options: [
      {
        id: 'q4-opt1',
        text: 'Hanya Rias (Busana Sudah Disiapkan Sendiri)',
        description: 'Klien membawa busana pribadi dan hanya menyewa aksesoris/melati.',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 2, 'pkg-6': 2 }
      },
      {
        id: 'q4-opt2',
        text: '1 Pasang Busana Pengantin (Akad atau Resepsi Saja)',
        description: 'Sewa 1 pasang kebaya akad series atau kebaya/gaun resepsi.',
        scores: { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 4, 'pkg-5': 4, 'pkg-6': 1 }
      },
      {
        id: 'q4-opt3',
        text: '2 Pasang Busana Pengantin Lengkap (Akad + Resepsi)',
        description: 'Sewa sepasang kebaya akad dan sepasang gaun/kebaya resepsi kedua mempelai.',
        scores: { 'pkg-1': 4, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 2, 'pkg-5': 1, 'pkg-6': 1 }
      },
      {
        id: 'q4-opt4',
        text: 'Dodot Adat Siraman & Busana Tradisional',
        description: 'Penyewaan dodot siraman, kain jarik batik, dan beskap orang tua.',
        scores: { 'pkg-1': 1, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 1, 'pkg-6': 4 }
      }
    ]
  },
  {
    id: 'q5',
    criteriaId: 'c5',
    criteriaName: 'Gaya Riasan',
    weight: 10,
    orderIndex: 5,
    text: 'Gaya tata rias dan paes apa yang ingin Anda kenakan?',
    subtitle: 'Menentukan keahlian khusus MUA pada paes adat atau teknik soft glam.',
    options: [
      {
        id: 'q5-opt1',
        text: 'Modern Flawless / Soft Glamour',
        description: 'Riasan modern kekinian yang menonjolkan kecantikan alami tanpa paes.',
        scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 4, 'pkg-5': 4, 'pkg-6': 2 }
      },
      {
        id: 'q5-opt2',
        text: 'Adat Sunda Siger / Mahkota Elegan',
        description: 'Mahkota siger khas Sunda berpadu ronce melati anggun dan kembang goyang.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 3, 'pkg-5': 3, 'pkg-6': 1 }
      },
      {
        id: 'q5-opt3',
        text: 'Adat Jawa Solo Putri / Paes Ageng Jogja',
        description: 'Tata rias klasik Jawa dengan paes hitam, prada emas, cunduk mentul, dan centung.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 3, 'pkg-5': 3, 'pkg-6': 2 }
      },
      {
        id: 'q5-opt4',
        text: 'Basahan Adat Tradisional Siraman',
        description: 'Riasan natural tahan air dengan ronce melati basahan dada dan bando melati asli.',
        scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 1, 'pkg-6': 4 }
      }
    ]
  },
  {
    id: 'q6',
    criteriaId: 'c6',
    criteriaName: 'Jumlah Ibu Mempelai',
    weight: 5,
    orderIndex: 6,
    text: 'Berapa jumlah ibu (kandung/mertua) yang dirias dan dipakaikan busana?',
    subtitle: 'Mencakup rias wajah, sanggul/hijabdo, jarik, dan bunga melati.',
    options: [
      {
        id: 'q6-opt1',
        text: 'Tidak ada / Rias Mandiri',
        description: 'Keluarga ibu memilih merias diri secara mandiri di luar paket.',
        scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 4, 'pkg-4': 4, 'pkg-5': 2, 'pkg-6': 1 }
      },
      {
        id: 'q6-opt2',
        text: '1 Orang Ibu',
        description: 'Hanya 1 ibu (ibu calon pengantin wanita) yang membutuhkan riasan & kebaya.',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 3, 'pkg-4': 3, 'pkg-5': 3, 'pkg-6': 4 }
      },
      {
        id: 'q6-opt3',
        text: '2 Orang Ibu (Kedua Pihak Keluarga)',
        description: 'Ibu pengantin wanita dan ibu pengantin pria lengkap dengan rias & kebaya.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 4, 'pkg-6': 3 }
      },
      {
        id: 'q6-opt4',
        text: 'Lebih dari 2 Orang Ibu / Besan Tambahan',
        description: 'Ada tambahan nenek, bibi, atau keluarga inti wanita lainnya.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 2, 'pkg-4': 1, 'pkg-5': 2, 'pkg-6': 2 }
      }
    ]
  },
  {
    id: 'q7',
    criteriaId: 'c7',
    criteriaName: 'Jumlah Jaga Kado',
    weight: 5,
    orderIndex: 7,
    text: 'Apakah membutuhkan tata rias untuk penerima tamu / pagar ayu?',
    subtitle: 'Meliputi makeup, hijab/hairdo, dan busana seragam tanpa selop.',
    options: [
      {
        id: 'q7-opt1',
        text: 'Tidak ada (0 Orang)',
        description: 'Tidak ada tim jaga kado atau jaga kado berhias mandiri.',
        scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 4, 'pkg-4': 4, 'pkg-5': 4, 'pkg-6': 4 }
      },
      {
        id: 'q7-opt2',
        text: '2 Orang Jaga Kado',
        description: 'Rias sederhana untuk 2 penerima tamu di meja depan.',
        scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 1, 'pkg-6': 2 }
      },
      {
        id: 'q7-opt3',
        text: '4 Orang Jaga Kado / Pagar Ayu',
        description: 'Rias dan seragam lengkap untuk 4 orang penjaga buku tamu resepsi.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 1, 'pkg-6': 1 }
      },
      {
        id: 'q7-opt4',
        text: 'Lebih dari 4 Orang (> 4 Orang)',
        description: 'Memerlukan kuota besar pendamping pengantin (dapat ditambah biaya per orang).',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 1, 'pkg-6': 1 }
      }
    ]
  },
  {
    id: 'q8',
    criteriaId: 'c8',
    criteriaName: 'Kebutuhan Siraman',
    weight: 5,
    orderIndex: 8,
    text: 'Apakah agenda pernikahan Anda menyertakan prosesi siraman adat?',
    subtitle: 'Menentukan perlunya perlengkapan dodot siraman dan pemandu prosesi adat.',
    options: [
      {
        id: 'q8-opt1',
        text: 'Sama sekali tidak ada prosesi siraman',
        description: 'Rangkaian acara langsung menuju akad dan resepsi pernikahan.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 4, 'pkg-4': 4, 'pkg-5': 4, 'pkg-6': 1 }
      },
      {
        id: 'q8-opt2',
        text: 'Ada prosesi siraman sederhana di rumah',
        description: 'Prosesi siraman kekeluargaan sebelum hari akad nikah.',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 2, 'pkg-6': 4 }
      },
      {
        id: 'q8-opt3',
        text: 'Rangkaian adat Siraman & Midodareni lengkap',
        description: 'Upacara adat menyeluruh dengan dodot, pemandu adat, dan retouch malam midodareni.',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 1, 'pkg-4': 1, 'pkg-5': 1, 'pkg-6': 4 }
      },
      {
        id: 'q8-opt4',
        text: 'Siraman digabung dalam paket hari H lengkap',
        description: 'Ingin mengambil paket komprehensif hari H sekaligus siraman pra-nikah.',
        scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 2, 'pkg-6': 3 }
      }
    ]
  },
  {
    id: 'q9',
    criteriaId: 'c9',
    criteriaName: 'Tambahan Rias & Busana',
    weight: 5,
    orderIndex: 9,
    text: 'Apakah memerlukan tambahan sewa jas/beskap pria atau hijab styling khusus?',
    subtitle: 'Kelengkapan aksesoris dan busana pria pihak bapak kedua mempelai.',
    options: [
      {
        id: 'q9-opt1',
        text: 'Tidak perlu tambahan',
        description: 'Hanya fasilitas standar dasar tanpa sewa busana pria bapak.',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 4, 'pkg-4': 4, 'pkg-5': 4, 'pkg-6': 2 }
      },
      {
        id: 'q9-opt2',
        text: 'Tambahan Hijab Styling & Hairdo khusus',
        description: 'Penataan hijab modern glam atau hairdo sanggul artistik.',
        scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 3, 'pkg-4': 3, 'pkg-5': 3, 'pkg-6': 3 }
      },
      {
        id: 'q9-opt3',
        text: 'Sewa Beskap / Jas Bapak Mempelai & Pemandu Adat',
        description: 'Fasilitas sewa beskap/jas untuk 2 bapak mempelai dan kehadiran pemandu adat.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 2, 'pkg-6': 4 }
      },
      {
        id: 'q9-opt4',
        text: 'Ronce Melati Asli & Bucket Bunga Pengantin',
        description: 'Kelengkapan hiasan bunga melati segar dan buket bunga tangan pengantin.',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 2, 'pkg-5': 3, 'pkg-6': 4 }
      }
    ]
  },
  {
    id: 'q10',
    criteriaId: 'c10',
    criteriaName: 'Anggaran (Budget)',
    weight: 10,
    orderIndex: 10,
    text: 'Berapa kisaran anggaran yang Anda siapkan untuk paket tata rias?',
    subtitle: 'Disesuaikan dengan rentang pricelist resmi 2025 IYUM MakeOver.',
    options: [
      {
        id: 'q10-opt1',
        text: 'Rp 6.000.000 - Rp 7.500.000 (Paket Akad / Siraman)',
        description: 'Alokasi budget untuk Siraman package (Rp 6,5jt) atau Akad package (Rp 7jt).',
        scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 2, 'pkg-5': 4, 'pkg-6': 4 }
      },
      {
        id: 'q10-opt2',
        text: 'Rp 8.000.000 - Rp 10.000.000 (Paket Pengantin Resepsi)',
        description: 'Cocok untuk paket Pengantin Resepsi Only (Rp 9,5jt).',
        scores: { 'pkg-1': 2, 'pkg-2': 2, 'pkg-3': 3, 'pkg-4': 4, 'pkg-5': 2, 'pkg-6': 2 }
      },
      {
        id: 'q10-opt3',
        text: 'Rp 10.500.000 - Rp 12.500.000 (Pengantin Akad & Resepsi)',
        description: 'Cocok untuk paket Pengantin Akad Resepsi (Rp 11,5jt).',
        scores: { 'pkg-1': 3, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 2, 'pkg-5': 1, 'pkg-6': 1 }
      },
      {
        id: 'q10-opt4',
        text: 'Diatas Rp 13.000.000 (Paket Lengkap Keluarga & Ngunduh Mantu)',
        description: 'Alokasi untuk Ngunduh Mantu (Rp 14jt) atau Wedding Akad & Resepsi (Rp 15jt).',
        scores: { 'pkg-1': 4, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 2, 'pkg-5': 1, 'pkg-6': 1 }
      }
    ]
  }
];

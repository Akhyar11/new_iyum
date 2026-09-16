export interface RecommendationAnswerDetail {
  questionId: string;
  questionText: string;
  criteriaName: string;
  weight: number;
  selectedOptionText: string;
  rawScore: number;
  weightedContribution: number;
}

export interface RecommendationDetailedItem {
  id: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  recommendedPackage: string;
  recommendedPackageCode: string;
  topScore: number;
  budgetRange: string;
  timestamp: string;
  status: 'Selesai' | 'Ditinjau' | 'Follow Up';
  answers: Record<string, string>;
  answersDetail: RecommendationAnswerDetail[];
  alternativePackages: {
    rank: number;
    name: string;
    code: string;
    score: number;
  }[];
  adminNotes?: string;
}

export interface PackageReportStat {
  code: string;
  name: string;
  category: string;
  count: number;
  percentage: number;
  price: number;
  totalRevenuePotential: number;
  trend: string;
  colorClass: string;
  accentBg: string;
  accentText: string;
}

export const initialDetailedRecommendations: RecommendationDetailedItem[] = [
  {
    id: 'REC-2026-089',
    clientName: 'Anisa Citra & Dimas Pratama',
    clientPhone: '0812-3456-7890',
    eventDate: '24 Oktober 2026',
    recommendedPackage: 'Paket Akad + Resepsi',
    recommendedPackageCode: 'PKG-ALL-IN',
    topScore: 96.5,
    budgetRange: 'Diatas Rp 6.500.000 (All-in)',
    timestamp: '12 Sep 2026, 13:40 WIB',
    status: 'Selesai',
    answers: {
      q1: 'q1-opt3',
      q2: 'q2-opt4',
      q3: 'q3-opt3',
      q4: 'q4-opt3',
      q5: 'q5-opt2',
      q6: 'q6-opt3',
      q7: 'q7-opt3',
      q8: 'q8-opt1',
      q9: 'q9-opt3',
      q10: 'q10-opt4'
    },
    answersDetail: [
      { questionId: 'q1', questionText: 'Apa jenis acara pernikahan utama?', criteriaName: 'Jenis Acara', weight: 20, selectedOptionText: 'Akad Nikah & Resepsi (Satu Hari Penuh)', rawScore: 4, weightedContribution: 20 },
      { questionId: 'q2', questionText: 'Kapan waktu pelaksanaan acara?', criteriaName: 'Waktu Pelaksanaan', weight: 10, selectedOptionText: 'Seharian Penuh (Pagi sampai Malam)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q3', questionText: 'Siapa saja pihak yang butuh makeup?', criteriaName: 'Kebutuhan Makeup', weight: 15, selectedOptionText: 'Mempelai + Orang Tua + Pendamping / Jaga Kado', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q4', questionText: 'Kebutuhan penyewaan busana pengantin?', criteriaName: 'Kebutuhan Busana', weight: 10, selectedOptionText: '2 Pasang Busana Pengantin Lengkap', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q5', questionText: 'Gaya tata rias dan paes yang diinginkan?', criteriaName: 'Gaya Riasan', weight: 10, selectedOptionText: 'Adat Sunda Siger / Mahkota Elegan', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q6', questionText: 'Berapa jumlah ibu yang dirias?', criteriaName: 'Jumlah Ibu Mempelai', weight: 5, selectedOptionText: '2 Orang Ibu (Kedua Pihak Keluarga)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q7', questionText: 'Apakah butuh rias pagar ayu / jaga kado?', criteriaName: 'Jumlah Jaga Kado', weight: 5, selectedOptionText: '4 Orang Jaga Kado / Pagar Ayu', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q8', questionText: 'Apakah ada prosesi siraman adat?', criteriaName: 'Kebutuhan Siraman', weight: 15, selectedOptionText: 'Sama sekali tidak ada prosesi siraman', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q9', questionText: 'Tambahan sewa jas/beskap atau hijab?', criteriaName: 'Tambahan Rias & Busana', weight: 5, selectedOptionText: 'Sewa Beskap / Jas Bapak Mempelai', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q10', questionText: 'Kisaran anggaran yang disiapkan?', criteriaName: 'Anggaran (Budget)', weight: 5, selectedOptionText: 'Diatas Rp 6.500.000 (All-in)', rawScore: 4, weightedContribution: 5 }
    ],
    alternativePackages: [
      { rank: 1, name: 'Paket Akad + Resepsi', code: 'PKG-ALL-IN', score: 96.5 },
      { rank: 2, name: 'Paket Resepsi', code: 'PKG-RESEPSI', score: 78.2 },
      { rank: 3, name: 'Paket Akad', code: 'PKG-AKAD', score: 62.5 },
      { rank: 4, name: 'Siraman Package', code: 'PKG-SIRAMAN', score: 41.0 }
    ]
  },
  {
    id: 'REC-2026-088',
    clientName: 'Siti Rahmadani & Arif Hidayat',
    clientPhone: '0857-1122-3344',
    eventDate: '15 November 2026',
    recommendedPackage: 'Paket Akad',
    recommendedPackageCode: 'PKG-AKAD',
    topScore: 94.0,
    budgetRange: 'Rp 3.000.000 - Rp 4.500.000',
    timestamp: '12 Sep 2026, 11:15 WIB',
    status: 'Selesai',
    answers: {
      q1: 'q1-opt1',
      q2: 'q2-opt1',
      q3: 'q3-opt2',
      q4: 'q4-opt2',
      q5: 'q5-opt1',
      q6: 'q6-opt3',
      q7: 'q7-opt1',
      q8: 'q8-opt1',
      q9: 'q9-opt1',
      q10: 'q10-opt2'
    },
    answersDetail: [
      { questionId: 'q1', questionText: 'Apa jenis acara pernikahan utama?', criteriaName: 'Jenis Acara', weight: 20, selectedOptionText: 'Akad Nikah / Pemberkatan saja', rawScore: 4, weightedContribution: 20 },
      { questionId: 'q2', questionText: 'Kapan waktu pelaksanaan acara?', criteriaName: 'Waktu Pelaksanaan', weight: 10, selectedOptionText: 'Pagi Hari (07.00 - 11.00 WIB)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q3', questionText: 'Siapa saja pihak yang butuh makeup?', criteriaName: 'Kebutuhan Makeup', weight: 15, selectedOptionText: 'Kedua Mempelai + Orang Tua (2 Ibu)', rawScore: 3, weightedContribution: 11.25 },
      { questionId: 'q4', questionText: 'Kebutuhan penyewaan busana pengantin?', criteriaName: 'Kebutuhan Busana', weight: 10, selectedOptionText: '1 Pasang Busana Pengantin (Akad Saja)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q5', questionText: 'Gaya tata rias dan paes yang diinginkan?', criteriaName: 'Gaya Riasan', weight: 10, selectedOptionText: 'Modern Flawless / Soft Glamour', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q6', questionText: 'Berapa jumlah ibu yang dirias?', criteriaName: 'Jumlah Ibu Mempelai', weight: 5, selectedOptionText: '2 Orang Ibu (Kedua Pihak)', rawScore: 3, weightedContribution: 3.75 },
      { questionId: 'q7', questionText: 'Apakah butuh rias pagar ayu / jaga kado?', criteriaName: 'Jumlah Jaga Kado', weight: 5, selectedOptionText: 'Tidak ada (0 Orang)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q8', questionText: 'Apakah ada prosesi siraman adat?', criteriaName: 'Kebutuhan Siraman', weight: 15, selectedOptionText: 'Sama sekali tidak ada prosesi siraman', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q9', questionText: 'Tambahan sewa jas/beskap atau hijab?', criteriaName: 'Tambahan Rias & Busana', weight: 5, selectedOptionText: 'Tidak perlu tambahan', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q10', questionText: 'Kisaran anggaran yang disiapkan?', criteriaName: 'Anggaran (Budget)', weight: 5, selectedOptionText: 'Rp 3.000.000 - Rp 4.500.000', rawScore: 4, weightedContribution: 5 }
    ],
    alternativePackages: [
      { rank: 1, name: 'Paket Akad', code: 'PKG-AKAD', score: 94.0 },
      { rank: 2, name: 'Paket Akad + Resepsi', code: 'PKG-ALL-IN', score: 68.5 },
      { rank: 3, name: 'Paket Resepsi', code: 'PKG-RESEPSI', score: 55.0 },
      { rank: 4, name: 'Siraman Package', code: 'PKG-SIRAMAN', score: 45.0 }
    ]
  },
  {
    id: 'REC-2026-087',
    clientName: 'Putri Ayu Wandira & Rizky Aditya',
    clientPhone: '0813-9988-7766',
    eventDate: '02 Desember 2026',
    recommendedPackage: 'Paket Resepsi',
    recommendedPackageCode: 'PKG-RESEPSI',
    topScore: 91.5,
    budgetRange: 'Rp 4.500.000 - Rp 6.500.000',
    timestamp: '11 Sep 2026, 16:30 WIB',
    status: 'Selesai',
    answers: {
      q1: 'q1-opt2',
      q2: 'q2-opt3',
      q3: 'q3-opt3',
      q4: 'q4-opt2',
      q5: 'q5-opt3',
      q6: 'q6-opt3',
      q7: 'q7-opt3',
      q8: 'q8-opt1',
      q9: 'q9-opt3',
      q10: 'q10-opt3'
    },
    answersDetail: [
      { questionId: 'q1', questionText: 'Apa jenis acara pernikahan utama?', criteriaName: 'Jenis Acara', weight: 20, selectedOptionText: 'Pesta Resepsi Pernikahan saja', rawScore: 4, weightedContribution: 20 },
      { questionId: 'q2', questionText: 'Kapan waktu pelaksanaan acara?', criteriaName: 'Waktu Pelaksanaan', weight: 10, selectedOptionText: 'Malam Hari (18.30 - 22.00 WIB)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q3', questionText: 'Siapa saja pihak yang butuh makeup?', criteriaName: 'Kebutuhan Makeup', weight: 15, selectedOptionText: 'Mempelai + Orang Tua + Jaga Kado', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q4', questionText: 'Kebutuhan penyewaan busana pengantin?', criteriaName: 'Kebutuhan Busana', weight: 10, selectedOptionText: '1 Pasang Busana Pengantin (Resepsi Saja)', rawScore: 3, weightedContribution: 7.5 },
      { questionId: 'q5', questionText: 'Gaya tata rias dan paes yang diinginkan?', criteriaName: 'Gaya Riasan', weight: 10, selectedOptionText: 'Adat Jawa Solo Putri / Paes Ageng Jogja', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q6', questionText: 'Berapa jumlah ibu yang dirias?', criteriaName: 'Jumlah Ibu Mempelai', weight: 5, selectedOptionText: '2 Orang Ibu (Standar)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q7', questionText: 'Apakah butuh rias pagar ayu / jaga kado?', criteriaName: 'Jumlah Jaga Kado', weight: 5, selectedOptionText: '4 Orang Jaga Kado / Pagar Ayu', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q8', questionText: 'Apakah ada prosesi siraman adat?', criteriaName: 'Kebutuhan Siraman', weight: 15, selectedOptionText: 'Sama sekali tidak ada prosesi siraman', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q9', questionText: 'Tambahan sewa jas/beskap atau hijab?', criteriaName: 'Tambahan Rias & Busana', weight: 5, selectedOptionText: 'Sewa Beskap / Jas Bapak Mempelai', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q10', questionText: 'Kisaran anggaran yang disiapkan?', criteriaName: 'Anggaran (Budget)', weight: 5, selectedOptionText: 'Rp 4.500.000 - Rp 6.500.000', rawScore: 4, weightedContribution: 5 }
    ],
    alternativePackages: [
      { rank: 1, name: 'Paket Resepsi', code: 'PKG-RESEPSI', score: 91.5 },
      { rank: 2, name: 'Paket Akad + Resepsi', code: 'PKG-ALL-IN', score: 79.0 },
      { rank: 3, name: 'Paket Akad', code: 'PKG-AKAD', score: 58.0 },
      { rank: 4, name: 'Siraman Package', code: 'PKG-SIRAMAN', score: 38.0 }
    ]
  },
  {
    id: 'REC-2026-086',
    clientName: 'Dewi Lestari & Satria Danu',
    clientPhone: '0812-7766-5544',
    eventDate: '18 Oktober 2026',
    recommendedPackage: 'Siraman Package',
    recommendedPackageCode: 'PKG-SIRAMAN',
    topScore: 93.0,
    budgetRange: 'Hingga Rp 3.000.000',
    timestamp: '11 Sep 2026, 09:20 WIB',
    status: 'Ditinjau',
    answers: {
      q1: 'q1-opt4',
      q2: 'q2-opt1',
      q3: 'q3-opt4',
      q4: 'q4-opt4',
      q5: 'q5-opt4',
      q6: 'q6-opt3',
      q7: 'q7-opt1',
      q8: 'q8-opt2',
      q9: 'q9-opt4',
      q10: 'q10-opt1'
    },
    answersDetail: [
      { questionId: 'q1', questionText: 'Apa jenis acara pernikahan utama?', criteriaName: 'Jenis Acara', weight: 20, selectedOptionText: 'Prosesi Adat Siraman & Midodareni', rawScore: 4, weightedContribution: 20 },
      { questionId: 'q2', questionText: 'Kapan waktu pelaksanaan acara?', criteriaName: 'Waktu Pelaksanaan', weight: 10, selectedOptionText: 'Pagi Hari (07.00 - 11.00 WIB)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q3', questionText: 'Siapa saja pihak yang butuh makeup?', criteriaName: 'Kebutuhan Makeup', weight: 15, selectedOptionText: 'Calon Pengantin Wanita Khusus Prosesi Tradisional', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q4', questionText: 'Kebutuhan penyewaan busana pengantin?', criteriaName: 'Kebutuhan Busana', weight: 10, selectedOptionText: 'Kain Jarik Adat Siraman & Busana Tradisional', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q5', questionText: 'Gaya tata rias dan paes yang diinginkan?', criteriaName: 'Gaya Riasan', weight: 10, selectedOptionText: 'Basahan Adat Tradisional Siraman', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q6', questionText: 'Berapa jumlah ibu yang dirias?', criteriaName: 'Jumlah Ibu Mempelai', weight: 5, selectedOptionText: '2 Orang Ibu (Standar)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q7', questionText: 'Apakah butuh rias pagar ayu / jaga kado?', criteriaName: 'Jumlah Jaga Kado', weight: 5, selectedOptionText: 'Tidak ada (0 Orang)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q8', questionText: 'Apakah ada prosesi siraman adat?', criteriaName: 'Kebutuhan Siraman', weight: 15, selectedOptionText: 'Ada prosesi siraman sederhana di rumah', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q9', questionText: 'Tambahan sewa jas/beskap atau hijab?', criteriaName: 'Tambahan Rias & Busana', weight: 5, selectedOptionText: 'Ronce Melati Asli & Aksesoris Adat Ekstra', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q10', questionText: 'Kisaran anggaran yang disiapkan?', criteriaName: 'Anggaran (Budget)', weight: 5, selectedOptionText: 'Hingga Rp 3.000.000 (Ekonomis)', rawScore: 4, weightedContribution: 5 }
    ],
    alternativePackages: [
      { rank: 1, name: 'Siraman Package', code: 'PKG-SIRAMAN', score: 93.0 },
      { rank: 2, name: 'Paket Akad', code: 'PKG-AKAD', score: 60.5 },
      { rank: 3, name: 'Paket Akad + Resepsi', code: 'PKG-ALL-IN', score: 52.0 },
      { rank: 4, name: 'Paket Resepsi', code: 'PKG-RESEPSI', score: 41.5 }
    ]
  },
  {
    id: 'REC-2026-085',
    clientName: 'Nabila Nuraini & Fajar Baskara',
    clientPhone: '0811-2233-4455',
    eventDate: '28 November 2026',
    recommendedPackage: 'Paket Akad + Resepsi',
    recommendedPackageCode: 'PKG-ALL-IN',
    topScore: 97.5,
    budgetRange: 'Diatas Rp 6.500.000',
    timestamp: '10 Sep 2026, 14:05 WIB',
    status: 'Follow Up',
    answers: {
      q1: 'q1-opt3',
      q2: 'q2-opt4',
      q3: 'q3-opt3',
      q4: 'q4-opt3',
      q5: 'q5-opt1',
      q6: 'q6-opt4',
      q7: 'q7-opt4',
      q8: 'q8-opt1',
      q9: 'q9-opt3',
      q10: 'q10-opt4'
    },
    answersDetail: [
      { questionId: 'q1', questionText: 'Apa jenis acara pernikahan utama?', criteriaName: 'Jenis Acara', weight: 20, selectedOptionText: 'Akad Nikah & Resepsi (Satu Hari Penuh)', rawScore: 4, weightedContribution: 20 },
      { questionId: 'q2', questionText: 'Kapan waktu pelaksanaan acara?', criteriaName: 'Waktu Pelaksanaan', weight: 10, selectedOptionText: 'Seharian Penuh (Pagi sampai Malam)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q3', questionText: 'Siapa saja pihak yang butuh makeup?', criteriaName: 'Kebutuhan Makeup', weight: 15, selectedOptionText: 'Mempelai + Orang Tua + Pendamping', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q4', questionText: 'Kebutuhan penyewaan busana pengantin?', criteriaName: 'Kebutuhan Busana', weight: 10, selectedOptionText: '2 Pasang Busana Pengantin Lengkap', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q5', questionText: 'Gaya tata rias dan paes yang diinginkan?', criteriaName: 'Gaya Riasan', weight: 10, selectedOptionText: 'Modern Flawless / Soft Glamour', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q6', questionText: 'Berapa jumlah ibu yang dirias?', criteriaName: 'Jumlah Ibu Mempelai', weight: 5, selectedOptionText: 'Lebih dari 2 Orang Ibu / Besan', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q7', questionText: 'Apakah butuh rias pagar ayu / jaga kado?', criteriaName: 'Jumlah Jaga Kado', weight: 5, selectedOptionText: 'Lebih dari 4 Orang (> 4 Orang)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q8', questionText: 'Apakah ada prosesi siraman adat?', criteriaName: 'Kebutuhan Siraman', weight: 15, selectedOptionText: 'Sama sekali tidak ada prosesi siraman', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q9', questionText: 'Tambahan sewa jas/beskap atau hijab?', criteriaName: 'Tambahan Rias & Busana', weight: 5, selectedOptionText: 'Sewa Beskap / Jas Bapak Mempelai', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q10', questionText: 'Kisaran anggaran yang disiapkan?', criteriaName: 'Anggaran (Budget)', weight: 5, selectedOptionText: 'Diatas Rp 6.500.000', rawScore: 4, weightedContribution: 5 }
    ],
    alternativePackages: [
      { rank: 1, name: 'Paket Akad + Resepsi', code: 'PKG-ALL-IN', score: 97.5 },
      { rank: 2, name: 'Paket Resepsi', code: 'PKG-RESEPSI', score: 81.0 },
      { rank: 3, name: 'Paket Akad', code: 'PKG-AKAD', score: 63.5 },
      { rank: 4, name: 'Siraman Package', code: 'PKG-SIRAMAN', score: 39.0 }
    ]
  },
  {
    id: 'REC-2026-084',
    clientName: 'Rina Marlina & Hendra',
    clientPhone: '0812-4455-6677',
    eventDate: '05 Desember 2026',
    recommendedPackage: 'Paket Akad',
    recommendedPackageCode: 'PKG-AKAD',
    topScore: 92.5,
    budgetRange: 'Rp 3.000.000 - Rp 4.500.000',
    timestamp: '09 Sep 2026, 10:30 WIB',
    status: 'Selesai',
    answers: {
      q1: 'q1-opt1',
      q2: 'q2-opt1',
      q3: 'q3-opt1',
      q4: 'q4-opt2',
      q5: 'q5-opt2',
      q6: 'q6-opt2',
      q7: 'q7-opt1',
      q8: 'q8-opt1',
      q9: 'q9-opt1',
      q10: 'q10-opt2'
    },
    answersDetail: [
      { questionId: 'q1', questionText: 'Apa jenis acara pernikahan utama?', criteriaName: 'Jenis Acara', weight: 20, selectedOptionText: 'Akad Nikah saja', rawScore: 4, weightedContribution: 20 },
      { questionId: 'q2', questionText: 'Kapan waktu pelaksanaan acara?', criteriaName: 'Waktu Pelaksanaan', weight: 10, selectedOptionText: 'Pagi Hari (07.00 - 11.00 WIB)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q3', questionText: 'Siapa saja pihak yang butuh makeup?', criteriaName: 'Kebutuhan Makeup', weight: 15, selectedOptionText: 'Hanya Kedua Mempelai', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q4', questionText: 'Kebutuhan penyewaan busana pengantin?', criteriaName: 'Kebutuhan Busana', weight: 10, selectedOptionText: '1 Pasang Busana Pengantin (Akad Saja)', rawScore: 4, weightedContribution: 10 },
      { questionId: 'q5', questionText: 'Gaya tata rias dan paes yang diinginkan?', criteriaName: 'Gaya Riasan', weight: 10, selectedOptionText: 'Adat Sunda Siger', rawScore: 3, weightedContribution: 7.5 },
      { questionId: 'q6', questionText: 'Berapa jumlah ibu yang dirias?', criteriaName: 'Jumlah Ibu Mempelai', weight: 5, selectedOptionText: '1 Orang Ibu', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q7', questionText: 'Apakah butuh rias pagar ayu / jaga kado?', criteriaName: 'Jumlah Jaga Kado', weight: 5, selectedOptionText: 'Tidak ada (0 Orang)', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q8', questionText: 'Apakah ada prosesi siraman adat?', criteriaName: 'Kebutuhan Siraman', weight: 15, selectedOptionText: 'Sama sekali tidak ada', rawScore: 4, weightedContribution: 15 },
      { questionId: 'q9', questionText: 'Tambahan sewa jas/beskap atau hijab?', criteriaName: 'Tambahan Rias & Busana', weight: 5, selectedOptionText: 'Tidak perlu tambahan', rawScore: 4, weightedContribution: 5 },
      { questionId: 'q10', questionText: 'Kisaran anggaran yang disiapkan?', criteriaName: 'Anggaran (Budget)', weight: 5, selectedOptionText: 'Rp 3.000.000 - Rp 4.500.000', rawScore: 4, weightedContribution: 5 }
    ],
    alternativePackages: [
      { rank: 1, name: 'Paket Akad', code: 'PKG-AKAD', score: 92.5 },
      { rank: 2, name: 'Paket Akad + Resepsi', code: 'PKG-ALL-IN', score: 66.0 },
      { rank: 3, name: 'Paket Resepsi', code: 'PKG-RESEPSI', score: 51.5 },
      { rank: 4, name: 'Siraman Package', code: 'PKG-SIRAMAN', score: 43.0 }
    ]
  }
];

export const initialPackageReportStats: PackageReportStat[] = [
  {
    code: 'PKG-WED-AKAD-RESEPSI',
    name: 'Wedding Akad & Resepsi',
    category: 'Akad & Resepsi',
    count: 142,
    percentage: 41.5,
    price: 15000000,
    totalRevenuePotential: 142 * 15000000,
    trend: '+14.2% bln ini',
    colorClass: 'bg-rose-500',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700'
  },
  {
    code: 'PKG-PENGANTIN-AKAD-RESEPSI',
    name: 'Pengantin Akad Resepsi',
    category: 'Akad & Resepsi',
    count: 78,
    percentage: 22.8,
    price: 11500000,
    totalRevenuePotential: 78 * 11500000,
    trend: '+6.4% bln ini',
    colorClass: 'bg-pink-500',
    accentBg: 'bg-pink-50',
    accentText: 'text-pink-700'
  },
  {
    code: 'PKG-NGUNDUH-MANTU',
    name: 'Ngunduh Mantu',
    category: 'Ngunduh Mantu',
    count: 45,
    percentage: 13.2,
    price: 14000000,
    totalRevenuePotential: 45 * 14000000,
    trend: '+3.8% bln ini',
    colorClass: 'bg-amber-500',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700'
  },
  {
    code: 'PKG-PENGANTIN-RESEPSI-ONLY',
    name: 'Pengantin Resepsi Only',
    category: 'Resepsi',
    count: 36,
    percentage: 10.5,
    price: 9500000,
    totalRevenuePotential: 36 * 9500000,
    trend: '+2.1% bln ini',
    colorClass: 'bg-blue-500',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700'
  },
  {
    code: 'PKG-AKAD-PACKAGE',
    name: 'Akad package',
    category: 'Akad Nikah',
    count: 26,
    percentage: 7.6,
    price: 7000000,
    totalRevenuePotential: 26 * 7000000,
    trend: '+1.9% bln ini',
    colorClass: 'bg-emerald-500',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700'
  },
  {
    code: 'PKG-SIRAMAN-PACKAGE',
    name: 'Siraman package',
    category: 'Prosesi Adat',
    count: 15,
    percentage: 4.4,
    price: 6500000,
    totalRevenuePotential: 15 * 6500000,
    trend: '+1.2% bln ini',
    colorClass: 'bg-purple-500',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700'
  }
];

const STORAGE_KEY_RECOMMENDATIONS = 'iyum_makeover_data_recommendations_2025';

export function getStoredRecommendations(): RecommendationDetailedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECOMMENDATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Gagal membaca riwayat rekomendasi:', err);
  }
  return initialDetailedRecommendations;
}

export function saveStoredRecommendations(items: RecommendationDetailedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECOMMENDATIONS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('recommendations_updated', { detail: items }));
  } catch (err) {
    console.error('Gagal menyimpan riwayat rekomendasi:', err);
  }
}

export function getRecommendationById(id: string): RecommendationDetailedItem | null {
  const items = getStoredRecommendations();
  return items.find(item => item.id === id) || null;
}

export function updateStoredRecommendation(id: string, updates: Partial<RecommendationDetailedItem>): RecommendationDetailedItem | null {
  const items = getStoredRecommendations();
  let updatedItem: RecommendationDetailedItem | null = null;
  const next = items.map(item => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates };
      return updatedItem;
    }
    return item;
  });
  if (updatedItem) {
    saveStoredRecommendations(next);
  }
  return updatedItem;
}


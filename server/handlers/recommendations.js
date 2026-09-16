import { createClient } from '@supabase/supabase-js';
import { FALLBACK_PACKAGES } from './packages.js';
import { FALLBACK_QUESTIONS } from './questions.js';
import { FALLBACK_CRITERIA } from './criteria.js';

export const FALLBACK_RECOMMENDATIONS_HISTORY = [
  {
    id: 'f6152a92-2d42-40ff-aa93-5ed1cf4252a1',
    code: 'REC-2026-089',
    client_name: 'Anisa Citra & Dimas Pratama',
    clientName: 'Anisa Citra & Dimas Pratama',
    client_phone: '0812-3456-7890',
    clientPhone: '0812-3456-7890',
    event_date: '24 Oktober 2026',
    eventDate: '24 Oktober 2026',
    recommendedPackage: 'Paket Akad + Resepsi',
    recommendedPackageCode: 'PKG-ALL-IN',
    top_score: 96.5,
    topScore: 96.5,
    budget_range: 'Diatas Rp 6.500.000 (All-in)',
    budgetRange: 'Diatas Rp 6.500.000 (All-in)',
    status: 'Selesai',
    admin_notes: 'Klien memilih busana adat Sunda Siger lengkap dengan 2 busana pengantin.',
    adminNotes: 'Klien memilih busana adat Sunda Siger lengkap dengan 2 busana pengantin.',
    timestamp: '12 Sep 2026, 13:40 WIB',
    created_at: '2026-09-12T06:40:00.000Z',
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
    id: 'f6152a92-2d42-40ff-aa93-5ed1cf4252a2',
    code: 'REC-2026-088',
    client_name: 'Siti Rahmadani & Arif Hidayat',
    clientName: 'Siti Rahmadani & Arif Hidayat',
    client_phone: '0857-1122-3344',
    clientPhone: '0857-1122-3344',
    event_date: '15 November 2026',
    eventDate: '15 November 2026',
    recommendedPackage: 'Paket Akad',
    recommendedPackageCode: 'PKG-AKAD',
    top_score: 94.0,
    topScore: 94.0,
    budget_range: 'Rp 3.000.000 - Rp 4.500.000',
    budgetRange: 'Rp 3.000.000 - Rp 4.500.000',
    status: 'Selesai',
    admin_notes: 'Acara akad pagi hari di masjid, riasan modern flawless.',
    adminNotes: 'Acara akad pagi hari di masjid, riasan modern flawless.',
    timestamp: '12 Sep 2026, 11:15 WIB',
    created_at: '2026-09-12T04:15:00.000Z',
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
    id: 'f6152a92-2d42-40ff-aa93-5ed1cf4252a3',
    code: 'REC-2026-087',
    client_name: 'Putri Ayu Wandira & Rizky Aditya',
    clientName: 'Putri Ayu Wandira & Rizky Aditya',
    client_phone: '0813-9988-7766',
    clientPhone: '0813-9988-7766',
    event_date: '02 Desember 2026',
    eventDate: '02 Desember 2026',
    recommendedPackage: 'Paket Resepsi',
    recommendedPackageCode: 'PKG-RESEPSI',
    top_score: 91.5,
    topScore: 91.5,
    budget_range: 'Rp 4.500.000 - Rp 6.500.000',
    budgetRange: 'Rp 4.500.000 - Rp 6.500.000',
    status: 'Selesai',
    admin_notes: 'Gaya riasan Paes Ageng Jogja dengan 4 orang jaga kado.',
    adminNotes: 'Gaya riasan Paes Ageng Jogja dengan 4 orang jaga kado.',
    timestamp: '11 Sep 2026, 16:30 WIB',
    created_at: '2026-09-11T09:30:00.000Z',
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
    id: 'f6152a92-2d42-40ff-aa93-5ed1cf4252a4',
    code: 'REC-2026-086',
    client_name: 'Dewi Lestari & Satria Danu',
    clientName: 'Dewi Lestari & Satria Danu',
    client_phone: '0812-7766-5544',
    clientPhone: '0812-7766-5544',
    event_date: '18 Oktober 2026',
    eventDate: '18 Oktober 2026',
    recommendedPackage: 'Siraman Package',
    recommendedPackageCode: 'PKG-SIRAMAN',
    top_score: 93.0,
    topScore: 93.0,
    budget_range: 'Hingga Rp 3.000.000',
    budgetRange: 'Hingga Rp 3.000.000',
    status: 'Ditinjau',
    admin_notes: 'Menunggu kepastian lokasi rumah untuk prosesi siraman dan ronce melati.',
    adminNotes: 'Menunggu kepastian lokasi rumah untuk prosesi siraman dan ronce melati.',
    timestamp: '11 Sep 2026, 09:20 WIB',
    created_at: '2026-09-11T02:20:00.000Z',
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
    id: 'f6152a92-2d42-40ff-aa93-5ed1cf4252a5',
    code: 'REC-2026-085',
    client_name: 'Nabila Nuraini & Fajar Baskara',
    clientName: 'Nabila Nuraini & Fajar Baskara',
    client_phone: '0811-2233-4455',
    clientPhone: '0811-2233-4455',
    event_date: '28 November 2026',
    eventDate: '28 November 2026',
    recommendedPackage: 'Paket Akad + Resepsi',
    recommendedPackageCode: 'PKG-ALL-IN',
    top_score: 97.5,
    topScore: 97.5,
    budget_range: 'Diatas Rp 6.500.000',
    budgetRange: 'Diatas Rp 6.500.000',
    status: 'Follow Up',
    admin_notes: 'Riasan all-in gedung pertemuan, butuh fitting kebaya resepsi.',
    adminNotes: 'Riasan all-in gedung pertemuan, butuh fitting kebaya resepsi.',
    timestamp: '10 Sep 2026, 14:05 WIB',
    created_at: '2026-09-10T07:05:00.000Z',
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
    id: 'f6152a92-2d42-40ff-aa93-5ed1cf4252a6',
    code: 'REC-2026-084',
    client_name: 'Rina Marlina & Hendra',
    clientName: 'Rina Marlina & Hendra',
    client_phone: '0812-4455-6677',
    clientPhone: '0812-4455-6677',
    event_date: '05 Desember 2026',
    eventDate: '05 Desember 2026',
    recommendedPackage: 'Paket Akad',
    recommendedPackageCode: 'PKG-AKAD',
    top_score: 92.5,
    topScore: 92.5,
    budget_range: 'Rp 3.000.000 - Rp 4.500.000',
    budgetRange: 'Rp 3.000.000 - Rp 4.500.000',
    status: 'Selesai',
    admin_notes: 'Akad nikah Sunda Siger sederhana di kediaman mempelai.',
    adminNotes: 'Akad nikah Sunda Siger sederhana di kediaman mempelai.',
    timestamp: '09 Sep 2026, 10:30 WIB',
    created_at: '2026-09-09T03:30:00.000Z',
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

export const RECOMMENDATIONS_HISTORY = [...FALLBACK_RECOMMENDATIONS_HISTORY];

/**
 * Menghitung rekomendasi paket makeup menggunakan metode Simple Additive Weighting (SAW)
 * dengan bobot kriteria dinamis yang dapat disesuaikan oleh admin tanpa ubah kode.
 * Formula SAW: Skor = Σ (bobot_kriteria * (nilai_kesesuaian / max_nilai))
 */
export async function calculateSAW(answers = {}, userLabel = 'Pengunjung Web') {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  let criteriaMap = {};
  let packagesList = [...FALLBACK_PACKAGES];
  const questionsList = [...FALLBACK_QUESTIONS];

  // 1. Ambil bobot kriteria dinamis dari database jika tersedia
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: dbCriteria } = await supabase
        .from('criteria')
        .select('*')
        .order('order_index', { ascending: true });

      if (dbCriteria && dbCriteria.length > 0) {
        dbCriteria.forEach(c => {
          criteriaMap[c.id] = Number(c.weight);
          criteriaMap[c.code] = Number(c.weight);
          const qNum = c.code.replace('C', '');
          criteriaMap[`q${qNum}`] = Number(c.weight);
        });
      }

      const { data: dbPackages } = await supabase
        .from('packages')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (dbPackages && dbPackages.length > 0) {
        packagesList = dbPackages;
      }
    } catch (err) {
      console.warn('Supabase fetch error in SAW, using fallback:', err.message);
    }
  }

  // Lengkapi dengan bobot kriteria in-memory jika belum terisi
  FALLBACK_CRITERIA.forEach(c => {
    if (criteriaMap[c.id] === undefined) criteriaMap[c.id] = c.weight;
    if (criteriaMap[c.code] === undefined) criteriaMap[c.code] = c.weight;
    const qNum = c.code.replace('C', '');
    if (criteriaMap[`q${qNum}`] === undefined) criteriaMap[`q${qNum}`] = c.weight;
  });

  // 2. Perhitungan SAW Dinamis
  const packageScores = {};
  const packageBreakdowns = {};

  packagesList.forEach(pkg => {
    packageScores[pkg.id] = 0;
    packageBreakdowns[pkg.id] = [];
  });

  // Iterasi 10 kriteria pertanyaan
  questionsList.forEach(q => {
    const selectedOptionId = answers[q.id];
    const option = (q.options || []).find(o => o.id === selectedOptionId) || q.options?.[0];
    if (!option) return;

    // Bobot dinamis kriteria ini
    const weightVal = criteriaMap[q.id] !== undefined
      ? criteriaMap[q.id]
      : (criteriaMap[q.criteriaId] !== undefined ? criteriaMap[q.criteriaId] : (q.weight || 10));

    const weightFraction = weightVal / 100; // misal 20% -> 0.20

    packagesList.forEach(pkg => {
      // Nilai kecocokan opsi terhadap paket (skala 1-4)
      const rawScore = (option.scores && (option.scores[pkg.id] ?? option.scores[pkg.code?.toLowerCase()])) || 2;
      
      // Normalisasi SAW: nilai / max_score (skala 1-4, max = 4)
      const normalizedValue = rawScore / 4;
      const weightedContribution = weightFraction * normalizedValue;

      packageScores[pkg.id] = (packageScores[pkg.id] || 0) + weightedContribution;

      if (!packageBreakdowns[pkg.id]) packageBreakdowns[pkg.id] = [];
      packageBreakdowns[pkg.id].push({
        questionId: q.id,
        criteriaName: q.criteriaName || 'Kriteria',
        weight: weightVal,
        optionText: option.text,
        rawScore,
        weightedContribution: Math.round(weightedContribution * 10000) / 100
      });
    });
  });

  // 3. Normalisasi akhir dan pemeringkatan (ranking)
  const ranked = packagesList.map(pkg => {
    const rawTotal = packageScores[pkg.id] || 0;
    const percentage = Math.round(rawTotal * 1000) / 10; // e.g. 92.5%

    return {
      packageId: pkg.id,
      pkg,
      rawScore: rawTotal,
      finalScore: percentage,
      rank: 0,
      breakdown: packageBreakdowns[pkg.id] || []
    };
  })
  .sort((a, b) => b.finalScore - a.finalScore)
  .map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  const topPackage = ranked[0] || null;
  const alternatives = ranked.slice(1);

  const recommendationResult = {
    id: `rec-${Date.now()}`,
    code: `REC-${Date.now().toString().slice(-6)}`,
    client_name: userLabel,
    clientName: userLabel,
    client_phone: '',
    clientPhone: '',
    event_date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    eventDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    topPackage,
    recommendedPackage: topPackage?.pkg?.name || 'Paket Rekomendasi',
    recommendedPackageCode: topPackage?.pkg?.code || 'PKG-ALL-IN',
    top_score: topPackage?.finalScore || 0,
    topScore: topPackage?.finalScore || 0,
    status: 'Selesai',
    budget_range: 'Sesuai Pilihan Klien',
    budgetRange: 'Sesuai Pilihan Klien',
    timestamp: new Date().toLocaleDateString('id-ID') + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    alternatives,
    alternativePackages: alternatives.map(a => ({
      rank: a.rank,
      name: a.pkg.name,
      code: a.pkg.code,
      score: a.finalScore
    })),
    allRanked: ranked,
    appliedWeights: criteriaMap,
    answers,
    answersDetail: topPackage?.breakdown || [],
    created_at: new Date().toISOString()
  };

  // 4. Simpan ke database Supabase jika terhubung
  if (supabaseUrl && supabaseAnonKey && topPackage) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: recRow } = await supabase
        .from('recommendations')
        .insert({
          code: recommendationResult.code,
          client_name: userLabel,
          top_package_id: topPackage.pkg.id.startsWith('pkg-') ? null : topPackage.pkg.id,
          top_package_code: topPackage.pkg.code,
          top_package_name: topPackage.pkg.name,
          top_score: topPackage.finalScore,
          status: 'Selesai',
          raw_answers: answers
        })
        .select()
        .single();

      if (recRow) {
        recommendationResult.id = recRow.id;

        const answerRows = Object.entries(answers).map(([qId, optId]) => ({
          recommendation_id: recRow.id,
          question_id: qId.startsWith('q') ? null : qId,
          option_id: optId.startsWith('opt') ? null : optId
        }));
        if (answerRows.length > 0) {
          await supabase.from('recommendation_answers').insert(answerRows);
        }

        const resultRows = ranked.map(r => ({
          recommendation_id: recRow.id,
          package_id: r.pkg.id.startsWith('pkg-') ? null : r.pkg.id,
          package_code: r.pkg.code,
          package_name: r.pkg.name,
          final_score: r.finalScore,
          rank: r.rank
        }));
        if (resultRows.length > 0) {
          await supabase.from('recommendation_results').insert(resultRows);
        }
      }
    } catch (dbErr) {
      console.warn('Database save recommendation error:', dbErr.message);
    }
  }

  RECOMMENDATIONS_HISTORY.unshift(recommendationResult);
  return recommendationResult;
}

/**
 * GET: Mengambil daftar riwayat rekomendasi dengan dukungan filter dan pencarian
 */
export async function handleGetRecommendations(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};
  const search = (query.search || query.q || '').toString().toLowerCase().trim();
  const statusFilter = (query.status || '').toString().trim();
  const packageFilter = (query.package || query.packageCode || '').toString().trim();
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  const page = Math.max(1, parseInt(query.page) || 1);
  const offset = (page - 1) * limit;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      let queryBuilder = supabase
        .from('recommendations')
        .select(`
          id,
          code,
          client_name,
          client_phone,
          event_date,
          budget_range,
          top_score,
          status,
          admin_notes,
          raw_answers,
          created_at,
          updated_at,
          top_package:top_package_id (id, code, name, price, photo_url, category),
          answers:recommendation_answers (
            id,
            question_id,
            question_code,
            question_text,
            criteria_name,
            weight,
            option_id,
            option_text,
            raw_score,
            weighted_score
          ),
          results:recommendation_results (
            id,
            package_id,
            package_code,
            package_name,
            final_score,
            rank
          )
        `, { count: 'exact' });

      if (statusFilter && statusFilter !== 'all') {
        queryBuilder = queryBuilder.eq('status', statusFilter);
      }

      if (packageFilter && packageFilter !== 'all') {
        queryBuilder = queryBuilder.or(`top_package_code.eq.${packageFilter}`);
      }

      if (search) {
        queryBuilder = queryBuilder.or(`client_name.ilike.%${search}%,client_phone.ilike.%${search}%,code.ilike.%${search}%`);
      }

      const { data, error, count } = await queryBuilder
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (!error && data && data.length > 0) {
        const mappedData = data.map(item => ({
          id: item.id,
          code: item.code || item.id,
          clientName: item.client_name,
          clientPhone: item.client_phone || '-',
          eventDate: item.event_date || 'Belum Dijadwalkan',
          recommendedPackage: item.top_package?.name || item.top_package_name || 'Paket Rekomendasi',
          recommendedPackageCode: item.top_package?.code || item.top_package_code || 'PKG-ALL-IN',
          topScore: Number(item.top_score) || 0,
          budgetRange: item.budget_range || '-',
          status: item.status || 'Selesai',
          adminNotes: item.admin_notes || '',
          timestamp: new Date(item.created_at).toLocaleDateString('id-ID') + ', ' + new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          created_at: item.created_at,
          answers: item.raw_answers || {},
          answersDetail: (item.answers || []).map(a => ({
            questionId: a.question_code || a.question_id,
            questionText: a.question_text || 'Pertanyaan Kriteria',
            criteriaName: a.criteria_name || 'Kriteria',
            weight: Number(a.weight) || 10,
            selectedOptionText: a.option_text || '-',
            rawScore: Number(a.raw_score) || 3,
            weightedContribution: Number(a.weighted_score) || 7.5
          })),
          alternativePackages: (item.results || []).map(r => ({
            rank: r.rank,
            name: r.package_name || r.package?.name || 'Paket Alternatif',
            code: r.package_code || r.package?.code || 'PKG',
            score: Number(r.final_score) || 0
          }))
        }));

        return res.status(200).json({
          success: true,
          count: mappedData.length,
          total: count || mappedData.length,
          page,
          limit,
          data: mappedData
        });
      }
    } catch (err) {
      console.warn('Database fetch error in handleGetRecommendations:', err.message);
    }
  }

  // Fallback ke in-memory dataset
  let filtered = [...RECOMMENDATIONS_HISTORY];

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter);
  }

  if (packageFilter && packageFilter !== 'all') {
    filtered = filtered.filter(item => 
      item.recommendedPackageCode === packageFilter || 
      item.top_package_code === packageFilter
    );
  }

  if (search) {
    filtered = filtered.filter(item => {
      const name = (item.clientName || item.client_name || '').toLowerCase();
      const phone = (item.clientPhone || item.client_phone || '').toLowerCase();
      const code = (item.code || item.id || '').toLowerCase();
      const pkg = (item.recommendedPackage || '').toLowerCase();
      return name.includes(search) || phone.includes(search) || code.includes(search) || pkg.includes(search);
    });
  }

  const paginated = filtered.slice(offset, offset + limit);

  return res.status(200).json({
    success: true,
    count: paginated.length,
    total: filtered.length,
    page,
    limit,
    data: paginated
  });
}

/**
 * GET: Mengambil satu detail riwayat rekomendasi berdasarkan ID atau Kode
 */
export async function handleGetRecommendationDetail(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = (req.query.id || req.query.code || '').toString().trim();
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID atau kode rekomendasi diperlukan.' });
  }

  const found = RECOMMENDATIONS_HISTORY.find(r => r.id === id || r.code === id);
  if (found) {
    return res.status(200).json({ success: true, data: found });
  }

  return res.status(404).json({ success: false, message: 'Riwayat rekomendasi tidak ditemukan.' });
}

/**
 * PATCH / PUT: Memperbarui status atau catatan riwayat rekomendasi
 */
export async function handleUpdateRecommendationStatus(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = (req.query.id || req.query.code || '').toString().trim();
  const body = req.body || {};
  const { status, adminNotes, admin_notes } = body;

  const found = RECOMMENDATIONS_HISTORY.find(r => r.id === id || r.code === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Riwayat rekomendasi tidak ditemukan.' });
  }

  if (status) found.status = status;
  if (adminNotes !== undefined) {
    found.adminNotes = adminNotes;
    found.admin_notes = adminNotes;
  } else if (admin_notes !== undefined) {
    found.adminNotes = admin_notes;
    found.admin_notes = admin_notes;
  }

  return res.status(200).json({
    success: true,
    message: 'Data riwayat rekomendasi berhasil diperbarui.',
    data: found
  });
}

/**
 * Handler utama /api/recommendations
 */
export async function handleRecommendations(req, res) {
  if (req.method === 'GET') {
    return handleGetRecommendations(req, res);
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { answers = {}, userLabel = 'Pengunjung Web' } = body;

      if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Jawaban kuesioner diperlukan untuk perhitungan rekomendasi SAW.'
        });
      }

      const result = await calculateSAW(answers, userLabel);

      return res.status(200).json({
        success: true,
        message: 'Perhitungan rekomendasi SAW dengan bobot dinamis berhasil.',
        recommendationId: result.id,
        data: {
          id: result.id,
          code: result.code,
          topPackage: result.topPackage,
          recommendedPackage: result.recommendedPackage,
          alternatives: result.alternatives,
          allRanked: result.allRanked,
          appliedWeights: result.appliedWeights
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses perhitungan rekomendasi SAW: ' + err.message
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed.'
  });
}

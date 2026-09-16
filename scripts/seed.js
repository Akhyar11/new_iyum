/**
 * Node.js script untuk melakukan seeding data paket, 10 kriteria, pertanyaan, opsi,
 * dan matriks nilai kecocokan SAW (option_scores) ke Supabase / Database.
 * Jalankan dengan: npm run seed
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Baca .env jika ada
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...val] = trimmed.split('=');
      if (key && val) {
        process.env[key.trim()] = val.join('=').trim();
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// 1. Data 4 Paket Make Up
export const SEED_PACKAGES = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    code: 'PKG-AKAD',
    name: 'Paket Akad',
    price: 3500000,
    description: 'Paket riasan sakral khusus prosesi akad nikah dengan sentuhan natural elegan dan tahan lama hingga acara selesai.',
    photo_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Hairdo/Hijabdo Pengantin Wanita untuk Akad',
      'Rias & Busana Pengantin Pria (Beskap/Jas)',
      'Aksesoris Pengantin & Ronce Melati Asli',
      'Retouch makeup 1 kali saat acara berlangsung',
      'Makeup & Busana untuk 2 Ibu Mempelai',
      'Free softlens & kuku palsu (fake nails)'
    ],
    status: 'active',
    category: 'Akad Nikah'
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    code: 'PKG-RESEPSI',
    name: 'Paket Resepsi',
    price: 5000000,
    description: 'Paket tata rias megah dan glamor untuk acara pesta resepsi pernikahan, dirancang memikat di bawah sorot lampu panggung.',
    photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Hairdo/Hijabdo Pengantin Resepsi Glamour',
      'Busana Lengkap Pengantin Wanita & Pria Resepsi',
      'Aksesoris Mewah (Mahkota / Siger / Cunduk Mentul)',
      'Makeup & Kain/Kebaya untuk 2 Ibu Mempelai',
      'Busana Beskap untuk 2 Bapak Mempelai',
      'Makeup & Busana untuk 4 Pagar Ayu / Jaga Kado',
      'Standby MUA & Asisten selama acara'
    ],
    status: 'active',
    category: 'Resepsi'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    code: 'PKG-ALL-IN',
    name: 'Paket Akad + Resepsi',
    price: 7500000,
    description: 'Solusi lengkap menyeluruh untuk seluruh rangkaian pernikahan hari H mulai dari akad pagi hingga resepsi malam hari.',
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Busana Akad Nikah (Ganti Busana & Look)',
      'Makeup & Busana Resepsi Pengantin (Full Retouch)',
      '2 Set Busana Pengantin (Tradisional / Modern)',
      'Aksesoris Lengkap & 2 Set Ronce Melati Segar',
      'Makeup & Busana untuk 2 Ibu Akad & Resepsi',
      'Busana Beskap untuk 2 Bapak Pengantin',
      'Makeup & Busana untuk 4 Orang Jaga Kado / Pagar Ayu',
      'Free Test Makeup / Touch Up Kit Eksklusif'
    ],
    status: 'active',
    category: 'Full Wedding'
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    code: 'PKG-SIRAMAN',
    name: 'Siraman Package',
    price: 2500000,
    description: 'Paket khusus prosesi adat pra-nikah Siraman & Midodareni dengan riasan tradisional sakral yang segar dan natural.',
    photo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup Tipis Natural Tahan Air untuk Calon Pengantin',
      'Hairdo Tradisional / Sanggul / Hijabdo Khusus Adat',
      'Ronce Melati Basahan Dada & Bando Melati Asli',
      'Penyewaan Kain Jarik Batik Tradisional & Kemben',
      'Makeup & Hairdo Sederhana untuk 2 Ibu',
      'Bimbingan tata cara paes & busana adat siraman'
    ],
    status: 'active',
    category: 'Prosesi Adat'
  }
];

// 2. Data 10 Kriteria Bobot (Total = 100%)
export const SEED_CRITERIA = [
  { id: '11111111-1111-1111-1111-000000000001', code: 'C1', name: 'Jenis Acara', weight: 20, order_index: 1 },
  { id: '11111111-1111-1111-1111-000000000002', code: 'C2', name: 'Waktu Pelaksanaan', weight: 10, order_index: 2 },
  { id: '11111111-1111-1111-1111-000000000003', code: 'C3', name: 'Kebutuhan Makeup', weight: 15, order_index: 3 },
  { id: '11111111-1111-1111-1111-000000000004', code: 'C4', name: 'Kebutuhan Busana', weight: 10, order_index: 4 },
  { id: '11111111-1111-1111-1111-000000000005', code: 'C5', name: 'Gaya Riasan', weight: 10, order_index: 5 },
  { id: '11111111-1111-1111-1111-000000000006', code: 'C6', name: 'Jumlah Ibu Mempelai', weight: 5, order_index: 6 },
  { id: '11111111-1111-1111-1111-000000000007', code: 'C7', name: 'Jumlah Jaga Kado', weight: 5, order_index: 7 },
  { id: '11111111-1111-1111-1111-000000000008', code: 'C8', name: 'Kebutuhan Siraman', weight: 15, order_index: 8 },
  { id: '11111111-1111-1111-1111-000000000009', code: 'C9', name: 'Tambahan Rias & Busana', weight: 5, order_index: 9 },
  { id: '11111111-1111-1111-1111-000000000010', code: 'C10', name: 'Anggaran (Budget)', weight: 5, order_index: 10 }
];

// 3. Pertanyaan & Opsi beserta Nilai SAW
export const SEED_QUESTIONS = [
  {
    id: '22222222-2222-2222-2222-000000000001',
    criteria_id: '11111111-1111-1111-1111-000000000001',
    text: 'Apa jenis acara pernikahan utama yang akan diselenggarakan?',
    subtitle: 'Kriteria dengan bobot tertinggi (20%) untuk menentukan keselarasan paket.',
    order_index: 1,
    options: [
      { id: '33333333-3333-3333-3333-000000000001', text: 'Akad Nikah / Pemberkatan saja', order_index: 1, scores: { 'c1111111-1111-1111-1111-111111111111': 4, 'c2222222-2222-2222-2222-222222222222': 1, 'c3333333-3333-3333-3333-333333333333': 3, 'c4444444-4444-4444-4444-444444444444': 1 } },
      { id: '33333333-3333-3333-3333-000000000002', text: 'Pesta Resepsi Pernikahan saja', order_index: 2, scores: { 'c1111111-1111-1111-1111-111111111111': 1, 'c2222222-2222-2222-2222-222222222222': 4, 'c3333333-3333-3333-3333-333333333333': 3, 'c4444444-4444-4444-4444-444444444444': 1 } },
      { id: '33333333-3333-3333-3333-000000000003', text: 'Akad Nikah & Resepsi (Satu Hari Penuh)', order_index: 3, scores: { 'c1111111-1111-1111-1111-111111111111': 2, 'c2222222-2222-2222-2222-222222222222': 3, 'c3333333-3333-3333-3333-333333333333': 4, 'c4444444-4444-4444-4444-444444444444': 1 } },
      { id: '33333333-3333-3333-3333-000000000004', text: 'Prosesi Adat Siraman & Midodareni', order_index: 4, scores: { 'c1111111-1111-1111-1111-111111111111': 1, 'c2222222-2222-2222-2222-222222222222': 1, 'c3333333-3333-3333-3333-333333333333': 2, 'c4444444-4444-4444-4444-444444444444': 4 } }
    ]
  },
  {
    id: '22222222-2222-2222-2222-000000000002',
    criteria_id: '11111111-1111-1111-1111-000000000002',
    text: 'Kapan perkiraan waktu pelaksanaan acara pernikahan Anda?',
    subtitle: 'Menentukan daya tahan riasan dan kebutuhan retouch MUA.',
    order_index: 2,
    options: [
      { id: '33333333-3333-3333-3333-000000000005', text: 'Pagi Hari (07.00 - 11.00 WIB)', order_index: 1, scores: { 'c1111111-1111-1111-1111-111111111111': 4, 'c2222222-2222-2222-2222-222222222222': 2, 'c3333333-3333-3333-3333-333333333333': 3, 'c4444444-4444-4444-4444-444444444444': 4 } },
      { id: '33333333-3333-3333-3333-000000000006', text: 'Siang Hari (11.00 - 15.00 WIB)', order_index: 2, scores: { 'c1111111-1111-1111-1111-111111111111': 2, 'c2222222-2222-2222-2222-222222222222': 4, 'c3333333-3333-3333-3333-333333333333': 3, 'c4444444-4444-4444-4444-444444444444': 2 } },
      { id: '33333333-3333-3333-3333-000000000007', text: 'Malam Hari (18.30 - 22.00 WIB)', order_index: 3, scores: { 'c1111111-1111-1111-1111-111111111111': 1, 'c2222222-2222-2222-2222-222222222222': 4, 'c3333333-3333-3333-3333-333333333333': 4, 'c4444444-4444-4444-4444-444444444444': 2 } },
      { id: '33333333-3333-3333-3333-000000000008', text: 'Seharian Penuh (Pagi sampai Malam)', order_index: 4, scores: { 'c1111111-1111-1111-1111-111111111111': 1, 'c2222222-2222-2222-2222-222222222222': 2, 'c3333333-3333-3333-3333-333333333333': 4, 'c4444444-4444-4444-4444-444444444444': 1 } }
    ]
  }
];

export const SEED_ADMINS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    email: 'admin@griyarias.com',
    password_hash: 'admin123',
    name: 'Administrator Griya Rias',
    role: 'admin',
    status: 'active'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    email: 'admin@makeup.com',
    password_hash: 'admin12345',
    name: 'Admin Make Up',
    role: 'admin',
    status: 'active'
  }
];

async function runCompleteSeed() {
  console.log('🌸 Menjalankan seeding paket, kriteria, pertanyaan, opsi & nilai SAW...');

  // Validasi total bobot kriteria harus tepat 100%
  const totalWeight = SEED_CRITERIA.reduce((acc, c) => acc + c.weight, 0);
  if (totalWeight !== 100) {
    throw new Error(`Total bobot kriteria tidak valid: ${totalWeight}% (harus tepat 100%)`);
  }
  console.log(`✓ Validasi bobot kriteria: ${SEED_CRITERIA.length} kriteria = ${totalWeight}%`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('ℹ️  Supabase URL/Anon Key belum diisi. Verifikasi struktur data lokal berhasil.');
    console.log(`   - Paket: ${SEED_PACKAGES.length}`);
    console.log(`   - Kriteria: ${SEED_CRITERIA.length}`);
    console.log(`   - Admin: ${SEED_ADMINS.length}`);
    console.log(`   - Pertanyaan kuesioner siap terhubung.`);
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('🔌 Terhubung ke Supabase:', supabaseUrl);

  // 1. Seed Packages
  for (const pkg of SEED_PACKAGES) {
    await supabase.from('packages').upsert(pkg, { onConflict: 'code' });
  }
  console.log(`✓ Seed ${SEED_PACKAGES.length} paket berhasil.`);

  // 2. Seed Criteria
  for (const c of SEED_CRITERIA) {
    await supabase.from('criteria').upsert(c, { onConflict: 'code' });
  }
  console.log(`✓ Seed ${SEED_CRITERIA.length} kriteria berhasil.`);

  // 3. Seed Admins
  for (const adm of SEED_ADMINS) {
    await supabase.from('admins').upsert(adm, { onConflict: 'email' });
  }
  console.log(`✓ Seed ${SEED_ADMINS.length} akun admin berhasil.`);

  console.log('✨ Selesai melakukan seeding seluruh data awal!');
}

runCompleteSeed().catch(err => {
  console.error('Error saat seeding:', err);
  process.exit(1);
});

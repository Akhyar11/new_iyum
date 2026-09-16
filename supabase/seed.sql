-- Seed Data Awal: 4 Kandidat Paket Make Up Pengantin
-- Sesuai Dokumen Kebutuhan PRD Rekomendasi Paket Makeup

INSERT INTO public.packages (id, code, name, price, description, photo_url, category, status, facilities)
VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    'PKG-AKAD',
    'Paket Akad',
    3500000,
    'Paket riasan sakral khusus prosesi akad nikah dengan sentuhan natural elegan dan tahan lama hingga acara selesai.',
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    'Akad Nikah',
    'active',
    json_build_array(
        'Makeup & Hairdo/Hijabdo Pengantin Wanita untuk Akad',
        'Rias & Busana Pengantin Pria (Beskap/Jas)',
        'Aksesoris Pengantin & Ronce Melati Asli',
        'Retouch makeup 1 kali saat acara berlangsung',
        'Makeup & Busana untuk 2 Ibu Mempelai',
        'Free softlens & kuku palsu (fake nails)'
    )
),
(
    'c2222222-2222-2222-2222-222222222222',
    'PKG-RESEPSI',
    'Paket Resepsi',
    5000000,
    'Paket tata rias megah dan glamor untuk acara pesta resepsi pernikahan, dirancang memikat di bawah sorot lampu panggung.',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    'Resepsi',
    'active',
    json_build_array(
        'Makeup & Hairdo/Hijabdo Pengantin Resepsi Glamour',
        'Busana Lengkap Pengantin Wanita & Pria Resepsi',
        'Aksesoris Mewah (Mahkota / Siger / Cunduk Mentul)',
        'Makeup & Kain/Kebaya untuk 2 Ibu Mempelai',
        'Busana Beskap untuk 2 Bapak Mempelai',
        'Makeup & Busana untuk 4 Pagar Ayu / Jaga Kado',
        'Standby MUA & Asisten selama acara'
    )
),
(
    'c3333333-3333-3333-3333-333333333333',
    'PKG-ALL-IN',
    'Paket Akad + Resepsi',
    7500000,
    'Solusi lengkap menyeluruh untuk seluruh rangkaian pernikahan hari H mulai dari akad pagi hingga resepsi malam hari.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'Full Wedding',
    'active',
    json_build_array(
        'Makeup & Busana Akad Nikah (Ganti Busana & Look)',
        'Makeup & Busana Resepsi Pengantin (Full Retouch)',
        '2 Set Busana Pengantin (Tradisional / Modern)',
        'Aksesoris Lengkap & 2 Set Ronce Melati Segar',
        'Makeup & Busana untuk 2 Ibu Akad & Resepsi',
        'Busana Beskap untuk 2 Bapak Pengantin',
        'Makeup & Busana untuk 4 Orang Jaga Kado / Pagar Ayu',
        'Free Test Makeup / Touch Up Kit Eksklusif'
    )
),
(
    'c4444444-4444-4444-4444-444444444444',
    'PKG-SIRAMAN',
    'Siraman Package',
    2500000,
    'Paket khusus prosesi adat pra-nikah Siraman & Midodareni dengan riasan tradisional sakral yang segar dan natural.',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'Prosesi Adat',
    'active',
    json_build_array(
        'Makeup Tipis Natural Tahan Air untuk Calon Pengantin',
        'Hairdo Tradisional / Sanggul / Hijabdo Khusus Adat',
        'Ronce Melati Basahan Dada & Bando Melati Asli',
        'Penyewaan Kain Jarik Batik Tradisional & Kemben',
        'Makeup & Hairdo Sederhana untuk 2 Ibu',
        'Bimbingan tata cara paes & busana adat siraman'
    )
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    photo_url = EXCLUDED.photo_url,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    facilities = EXCLUDED.facilities,
    updated_at = timezone('utc'::text, now());

-- 2. Seed Akun Kredensial Administrator
INSERT INTO public.admins (id, email, password_hash, name, role, status)
VALUES 
    (
        'a1111111-1111-1111-1111-111111111111',
        'admin@griyarias.com',
        crypt('admin123', gen_salt('bf')),
        'Administrator Griya Rias',
        'admin',
        'active'
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'admin@makeup.com',
        crypt('admin12345', gen_salt('bf')),
        'Admin Make Up',
        'admin',
        'active'
    )
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name,
    status = 'active',
    updated_at = timezone('utc'::text, now());


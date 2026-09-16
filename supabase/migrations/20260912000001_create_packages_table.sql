-- Migration: Buat tabel packages dan migrasi di Supabase
-- Tanggal: 2026-09-12

-- 1. Pastikan ekstensi UUID tersedia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Buat tabel packages
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    photo_url TEXT,
    facilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Trigger otomatis untuk updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
CREATE TRIGGER set_packages_updated_at
    BEFORE UPDATE ON public.packages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Indeks Performa untuk Pencarian dan Filter Cepat
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages (status);
CREATE INDEX IF NOT EXISTS idx_packages_category ON public.packages (category);
CREATE INDEX IF NOT EXISTS idx_packages_price ON public.packages (price ASC);
CREATE INDEX IF NOT EXISTS idx_packages_code ON public.packages (code);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages (created_at DESC);

-- 5. Aktifkan Row Level Security (RLS)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan RLS (Policies)
-- Publik (termasuk anonim) dapat melihat paket yang berstatus aktif
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
CREATE POLICY "Public can view active packages"
    ON public.packages
    FOR SELECT
    USING (status = 'active');

-- Admin dan peran terautentikasi memiliki akses penuh CRUD ke paket
DROP POLICY IF EXISTS "Admins have full access to packages" ON public.packages;
CREATE POLICY "Admins have full access to packages"
    ON public.packages
    FOR ALL
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 7. Masukkan data awal (Seed Data)
INSERT INTO public.packages (code, name, price, description, photo_url, category, status, facilities)
VALUES
(
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
    facilities = EXCLUDED.facilities,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    updated_at = timezone('utc'::text, now());

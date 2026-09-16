-- Migration: Skema tabel bobot kriteria (criteria) dan migrasi
-- Tanggal: 2026-09-12

-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabel Kriteria & Bobot (criteria)
CREATE TABLE IF NOT EXISTS public.criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    weight NUMERIC NOT NULL CHECK (weight >= 0 AND weight <= 100),
    order_index INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Indeks Performa
CREATE INDEX IF NOT EXISTS idx_criteria_code ON public.criteria(code);
CREATE INDEX IF NOT EXISTS idx_criteria_order_index ON public.criteria(order_index);
CREATE INDEX IF NOT EXISTS idx_criteria_weight ON public.criteria(weight);

-- 4. Trigger updated_at otomatis
CREATE OR REPLACE FUNCTION public.update_criteria_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_criteria_updated_at ON public.criteria;
CREATE TRIGGER trg_criteria_updated_at
    BEFORE UPDATE ON public.criteria
    FOR EACH ROW
    EXECUTE FUNCTION public.update_criteria_updated_at();

-- 5. Row Level Security (RLS)
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan RLS (Policies)
DROP POLICY IF EXISTS "Public read criteria" ON public.criteria;
CREATE POLICY "Public read criteria" ON public.criteria FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage criteria" ON public.criteria;
CREATE POLICY "Admin manage criteria" ON public.criteria FOR ALL USING (auth.role() = 'authenticated');

-- 7. Seed 10 Kriteria SAW dengan Total Bobot 100%
INSERT INTO public.criteria (id, code, name, weight, order_index, description)
VALUES
    ('c1111111-1111-4111-8111-111111111101', 'C1', 'Jenis Acara', 20, 1, 'Kriteria utama menentukan keselarasan jenis prosesi pernikahan.'),
    ('c1111111-1111-4111-8111-111111111102', 'C2', 'Waktu Pelaksanaan', 10, 2, 'Kriteria penentu daya tahan riasan dan kebutuhan retouch tim MUA.'),
    ('c1111111-1111-4111-8111-111111111103', 'C3', 'Kebutuhan Makeup', 15, 3, 'Menentukan alokasi tim MUA utama dan perias pendamping.'),
    ('c1111111-1111-4111-8111-111111111104', 'C4', 'Kebutuhan Busana', 10, 4, 'Kebutuhan sewa busana akad, resepsi, maupun kain jarik tradisional.'),
    ('c1111111-1111-4111-8111-111111111105', 'C5', 'Gaya Riasan', 10, 5, 'Gaya paes adat maupun modern flawless yang diinginkan pengantin.'),
    ('c1111111-1111-4111-8111-111111111106', 'C6', 'Jumlah Ibu Mempelai', 5, 6, 'Kebutuhan rias dan kebaya ibu mempelai kedua belah pihak.'),
    ('c1111111-1111-4111-8111-111111111107', 'C7', 'Jumlah Jaga Kado', 5, 7, 'Kebutuhan riasan dan busana pendamping pagar ayu / jaga kado.'),
    ('c1111111-1111-4111-8111-111111111108', 'C8', 'Kebutuhan Siraman', 15, 8, 'Kriteria penting spesifik prosesi adat sakral siraman & midodareni.'),
    ('c1111111-1111-4111-8111-111111111109', 'C9', 'Tambahan Rias & Busana', 5, 9, 'Pelengkap sewa beskap jas bapak, hijab styling, atau ronce melati.'),
    ('c1111111-1111-4111-8111-111111111110', 'C10', 'Anggaran (Budget)', 5, 10, 'Kesesuaian alokasi anggaran calon pengantin terhadap nilai paket.')
ON CONFLICT (code) DO UPDATE 
SET 
    weight = EXCLUDED.weight,
    name = EXCLUDED.name,
    order_index = EXCLUDED.order_index,
    description = EXCLUDED.description,
    updated_at = timezone('utc'::text, now());

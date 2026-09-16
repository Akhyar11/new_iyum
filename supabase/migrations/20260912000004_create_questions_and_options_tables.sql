-- Migration: Skema tabel pertanyaan (questions) dan opsi jawaban (options)
-- Tanggal: 2026-09-12

-- 1. Pastikan ekstensi UUID tersedia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Pastikan tabel criteria tersedia
CREATE TABLE IF NOT EXISTS public.criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    weight NUMERIC NOT NULL CHECK (weight >= 0 AND weight <= 100),
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabel Pertanyaan (questions)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    criteria_id UUID REFERENCES public.criteria(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    subtitle TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabel Opsi Jawaban (options)
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Indeks Performa
CREATE INDEX IF NOT EXISTS idx_questions_criteria_id ON public.questions(criteria_id);
CREATE INDEX IF NOT EXISTS idx_questions_order_index ON public.questions(order_index);
CREATE INDEX IF NOT EXISTS idx_options_question_id ON public.options(question_id);
CREATE INDEX IF NOT EXISTS idx_options_order_index ON public.options(order_index);

-- 6. Trigger updated_at otomatis
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_questions_updated_at ON public.questions;
CREATE TRIGGER trg_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_options_updated_at ON public.options;
CREATE TRIGGER trg_options_updated_at
    BEFORE UPDATE ON public.options
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;

-- 8. Kebijakan RLS (Policies)
DROP POLICY IF EXISTS "Public read questions" ON public.questions;
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read options" ON public.options;
CREATE POLICY "Public read options" ON public.options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage questions" ON public.questions;
CREATE POLICY "Admin manage questions" ON public.questions FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage options" ON public.options;
CREATE POLICY "Admin manage options" ON public.options FOR ALL USING (auth.role() = 'authenticated');

-- 9. Seed Data Kriteria, Pertanyaan, dan Opsi Awal
INSERT INTO public.criteria (id, code, name, weight, order_index)
VALUES
    ('c1111111-1111-4111-8111-111111111101', 'C1', 'Jenis Acara', 20, 1),
    ('c1111111-1111-4111-8111-111111111102', 'C2', 'Waktu Pelaksanaan', 10, 2),
    ('c1111111-1111-4111-8111-111111111103', 'C3', 'Kebutuhan Makeup', 15, 3),
    ('c1111111-1111-4111-8111-111111111104', 'C4', 'Kebutuhan Busana', 10, 4),
    ('c1111111-1111-4111-8111-111111111105', 'C5', 'Gaya Riasan', 10, 5),
    ('c1111111-1111-4111-8111-111111111106', 'C6', 'Jumlah Ibu Mempelai', 5, 6),
    ('c1111111-1111-4111-8111-111111111107', 'C7', 'Jumlah Jaga Kado', 5, 7),
    ('c1111111-1111-4111-8111-111111111108', 'C8', 'Kebutuhan Siraman', 15, 8),
    ('c1111111-1111-4111-8111-111111111109', 'C9', 'Tambahan Rias & Busana', 5, 9),
    ('c1111111-1111-4111-8111-111111111110', 'C10', 'Anggaran (Budget)', 5, 10)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.questions (id, criteria_id, text, subtitle, order_index)
VALUES
    ('d1111111-1111-4111-8111-111111111101', 'c1111111-1111-4111-8111-111111111101', 'Apa jenis acara pernikahan utama yang akan diselenggarakan?', 'Kriteria dengan bobot tertinggi (20%) untuk menentukan keselarasan paket.', 1),
    ('d1111111-1111-4111-8111-111111111102', 'c1111111-1111-4111-8111-111111111102', 'Kapan perkiraan waktu pelaksanaan acara pernikahan Anda?', 'Menentukan daya tahan riasan dan kebutuhan retouch MUA.', 2),
    ('d1111111-1111-4111-8111-111111111103', 'c1111111-1111-4111-8111-111111111103', 'Siapa saja pihak yang membutuhkan layanan rias wajah dari MUA?', 'Menentukan alokasi tim MUA dan asisten di hari H.', 3),
    ('d1111111-1111-4111-8111-111111111104', 'c1111111-1111-4111-8111-111111111104', 'Apakah Anda membutuhkan penyewaan busana pengantin & keluarga?', 'Ketersediaan kebaya, gaun, beskap adat, atau busana sendiri.', 4),
    ('d1111111-1111-4111-8111-111111111105', 'c1111111-1111-4111-8111-111111111105', 'Gaya tata rias dan paes apa yang ingin Anda kenakan?', 'Gaya riasan adat maupun modern memengaruhi keahlian dan aksesoris.', 5),
    ('d1111111-1111-4111-8111-111111111106', 'c1111111-1111-4111-8111-111111111106', 'Berapa jumlah ibu (kandung/mertua) yang dirias dan dipakaikan busana?', 'Rias ibu mencakup sanggul/hijabdo dan kebaya.', 6),
    ('d1111111-1111-4111-8111-111111111107', 'c1111111-1111-4111-8111-111111111107', 'Apakah membutuhkan tata rias untuk penerima tamu / pagar ayu?', 'Menentukan kebutuhan asisten MUA tambahan.', 7),
    ('d1111111-1111-4111-8111-111111111108', 'c1111111-1111-4111-8111-111111111108', 'Apakah agenda pernikahan Anda menyertakan prosesi siraman adat?', 'Kriteria berbobot tinggi (15%) yang sangat spesifik.', 8),
    ('d1111111-1111-4111-8111-111111111109', 'c1111111-1111-4111-8111-111111111109', 'Apakah memerlukan tambahan sewa jas/beskap pria atau hijab styling khusus?', 'Fasilitas pelengkap untuk kenyamanan keluarga.', 9),
    ('d1111111-1111-4111-8111-111111111110', 'c1111111-1111-4111-8111-111111111110', 'Berapa kisaran anggaran yang Anda siapkan untuk paket tata rias?', 'Membantu mencocokkan nilai ekonomis paket terhadap anggaran Anda.', 10)
ON CONFLICT (id) DO NOTHING;

-- Opsi untuk Pertanyaan 1 (Jenis Acara)
INSERT INTO public.options (id, question_id, text, description, order_index)
VALUES
    ('e1111111-1111-4111-8111-111111111101', 'd1111111-1111-4111-8111-111111111101', 'Akad Nikah / Pemberkatan saja', 'Prosesi ijab kabul atau ibadah pernikahan sakral tanpa pesta resepsi besar.', 1),
    ('e1111111-1111-4111-8111-111111111102', 'd1111111-1111-4111-8111-111111111101', 'Pesta Resepsi Pernikahan saja', 'Fokus pesta perayaan mengundang keluarga besar dan tamu undangan.', 2),
    ('e1111111-1111-4111-8111-111111111103', 'd1111111-1111-4111-8111-111111111101', 'Akad Nikah & Resepsi (Satu Hari Penuh)', 'Rangkaian lengkap mulai dari akad sakral pagi hingga resepsi meriah siang/malam.', 3),
    ('e1111111-1111-4111-8111-111111111104', 'd1111111-1111-4111-8111-111111111101', 'Prosesi Adat Siraman & Midodareni', 'Upacara adat penyucian dan malam midodareni sebelum hari pernikahan.', 4)
ON CONFLICT (id) DO NOTHING;

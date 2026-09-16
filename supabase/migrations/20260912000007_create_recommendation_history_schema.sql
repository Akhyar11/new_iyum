-- Migration: Skema dan migrasi tabel riwayat rekomendasi (recommendations, answers, results)
-- Tanggal: 2026-09-12

-- 1. Tabel Utama Riwayat Rekomendasi (recommendations)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    event_date TEXT,
    budget_range TEXT,
    top_package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    top_package_code TEXT,
    top_package_name TEXT,
    top_score NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Selesai' CHECK (status IN ('Selesai', 'Ditinjau', 'Follow Up')),
    admin_notes TEXT,
    raw_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Pastikan kolom baru tersedia jika tabel sudah ada dari migrasi sebelumnya
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS client_name TEXT NOT NULL DEFAULT 'Calon Pengantin';
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS client_phone TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS event_date TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS budget_range TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS top_package_code TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS top_package_name TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Selesai';
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS raw_answers JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- 2. Tabel Rincian Jawaban Kuesioner Pengguna (recommendation_answers)
CREATE TABLE IF NOT EXISTS public.recommendation_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    question_code TEXT,
    question_text TEXT,
    criteria_name TEXT,
    weight NUMERIC,
    option_id UUID REFERENCES public.options(id) ON DELETE SET NULL,
    option_text TEXT,
    raw_score INT CHECK (raw_score >= 1 AND raw_score <= 4),
    weighted_score NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS question_code TEXT;
ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS question_text TEXT;
ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS criteria_name TEXT;
ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS weight NUMERIC;
ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS option_text TEXT;
ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS raw_score INT;
ALTER TABLE public.recommendation_answers ADD COLUMN IF NOT EXISTS weighted_score NUMERIC;

-- 3. Tabel Hasil Perankingan Paket Alternatif (recommendation_results)
CREATE TABLE IF NOT EXISTS public.recommendation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    package_code TEXT,
    package_name TEXT,
    final_score NUMERIC NOT NULL,
    rank INT NOT NULL CHECK (rank >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.recommendation_results ADD COLUMN IF NOT EXISTS package_code TEXT;
ALTER TABLE public.recommendation_results ADD COLUMN IF NOT EXISTS package_name TEXT;

-- 4. Indeks Performa untuk Pencarian dan Agregasi Laporan Cepat
CREATE INDEX IF NOT EXISTS idx_recommendations_code ON public.recommendations (code);
CREATE INDEX IF NOT EXISTS idx_recommendations_client_name ON public.recommendations (client_name);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON public.recommendations (status);
CREATE INDEX IF NOT EXISTS idx_recommendations_top_pkg ON public.recommendations (top_package_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON public.recommendations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rec_answers_rec_id ON public.recommendation_answers (recommendation_id);
CREATE INDEX IF NOT EXISTS idx_rec_answers_qid ON public.recommendation_answers (question_id);
CREATE INDEX IF NOT EXISTS idx_rec_answers_optid ON public.recommendation_answers (option_id);

CREATE INDEX IF NOT EXISTS idx_rec_results_rec_id ON public.recommendation_results (recommendation_id);
CREATE INDEX IF NOT EXISTS idx_rec_results_pkg_id ON public.recommendation_results (package_id);
CREATE INDEX IF NOT EXISTS idx_rec_results_rank ON public.recommendation_results (rank ASC);

-- 5. Trigger updated_at otomatis untuk tabel recommendations
DROP TRIGGER IF EXISTS set_recommendations_updated_at ON public.recommendations;
CREATE TRIGGER set_recommendations_updated_at
    BEFORE UPDATE ON public.recommendations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row Level Security (RLS)
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_results ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (pengguna umum & simulasi rekomendasi)
DROP POLICY IF EXISTS "Public can insert recommendations" ON public.recommendations;
CREATE POLICY "Public can insert recommendations"
    ON public.recommendations
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view recommendations" ON public.recommendations;
CREATE POLICY "Public can view recommendations"
    ON public.recommendations
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can insert recommendation answers" ON public.recommendation_answers;
CREATE POLICY "Public can insert recommendation answers"
    ON public.recommendation_answers
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view recommendation answers" ON public.recommendation_answers;
CREATE POLICY "Public can view recommendation answers"
    ON public.recommendation_answers
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can insert recommendation results" ON public.recommendation_results;
CREATE POLICY "Public can insert recommendation results"
    ON public.recommendation_results
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view recommendation results" ON public.recommendation_results;
CREATE POLICY "Public can view recommendation results"
    ON public.recommendation_results
    FOR SELECT
    USING (true);

-- Kebijakan Akses Admin Penuh
DROP POLICY IF EXISTS "Admin full access to recommendations" ON public.recommendations;
CREATE POLICY "Admin full access to recommendations"
    ON public.recommendations
    FOR ALL
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access to recommendation answers" ON public.recommendation_answers;
CREATE POLICY "Admin full access to recommendation answers"
    ON public.recommendation_answers
    FOR ALL
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access to recommendation results" ON public.recommendation_results;
CREATE POLICY "Admin full access to recommendation results"
    ON public.recommendation_results
    FOR ALL
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 7. Masukkan Data Awal Riwayat Rekomendasi (Seed Data)
INSERT INTO public.recommendations (
    code,
    client_name,
    client_phone,
    event_date,
    budget_range,
    top_package_code,
    top_package_name,
    top_score,
    status,
    admin_notes,
    raw_answers,
    created_at
)
VALUES
(
    'REC-2026-089',
    'Anisa Citra & Dimas Pratama',
    '0812-3456-7890',
    '24 Oktober 2026',
    'Diatas Rp 6.500.000 (All-in)',
    'PKG-ALL-IN',
    'Paket Akad + Resepsi',
    96.50,
    'Selesai',
    'Klien memilih busana adat Sunda Siger lengkap dengan 2 busana pengantin.',
    '{"q1": "q1-opt3", "q2": "q2-opt4", "q3": "q3-opt3", "q4": "q4-opt3", "q5": "q5-opt2", "q6": "q6-opt3", "q7": "q7-opt3", "q8": "q8-opt1", "q9": "q9-opt3", "q10": "q10-opt4"}'::jsonb,
    '2026-09-12 13:40:00+07'
),
(
    'REC-2026-088',
    'Siti Rahmadani & Arif Hidayat',
    '0857-1122-3344',
    '15 November 2026',
    'Rp 3.000.000 - Rp 4.500.000',
    'PKG-AKAD',
    'Paket Akad',
    94.00,
    'Selesai',
    'Acara akad pagi hari di masjid, riasan modern flawless.',
    '{"q1": "q1-opt1", "q2": "q2-opt1", "q3": "q3-opt2", "q4": "q4-opt2", "q5": "q5-opt1", "q6": "q6-opt3", "q7": "q7-opt1", "q8": "q8-opt1", "q9": "q9-opt1", "q10": "q10-opt2"}'::jsonb,
    '2026-09-12 11:15:00+07'
),
(
    'REC-2026-087',
    'Putri Ayu Wandira & Rizky Aditya',
    '0813-9988-7766',
    '02 Desember 2026',
    'Rp 4.500.000 - Rp 6.500.000',
    'PKG-RESEPSI',
    'Paket Resepsi',
    91.50,
    'Selesai',
    'Gaya riasan Paes Ageng Jogja dengan 4 orang jaga kado.',
    '{"q1": "q1-opt2", "q2": "q2-opt3", "q3": "q3-opt3", "q4": "q4-opt2", "q5": "q5-opt3", "q6": "q6-opt3", "q7": "q7-opt3", "q8": "q8-opt1", "q9": "q9-opt3", "q10": "q10-opt3"}'::jsonb,
    '2026-09-11 16:30:00+07'
),
(
    'REC-2026-086',
    'Dewi Lestari & Satria Danu',
    '0812-7766-5544',
    '18 Oktober 2026',
    'Hingga Rp 3.000.000',
    'PKG-SIRAMAN',
    'Siraman Package',
    93.00,
    'Ditinjau',
    'Menunggu kepastian lokasi rumah untuk prosesi siraman dan ronce melati.',
    '{"q1": "q1-opt4", "q2": "q2-opt1", "q3": "q3-opt4", "q4": "q4-opt4", "q5": "q5-opt4", "q6": "q6-opt3", "q7": "q7-opt1", "q8": "q8-opt2", "q9": "q9-opt4", "q10": "q10-opt1"}'::jsonb,
    '2026-09-11 09:20:00+07'
),
(
    'REC-2026-085',
    'Nabila Nuraini & Fajar Baskara',
    '0811-2233-4455',
    '28 November 2026',
    'Diatas Rp 6.500.000',
    'PKG-ALL-IN',
    'Paket Akad + Resepsi',
    97.50,
    'Follow Up',
    'Riasan all-in gedung pertemuan, butuh fitting kebaya resepsi.',
    '{"q1": "q1-opt3", "q2": "q2-opt4", "q3": "q3-opt3", "q4": "q4-opt3", "q5": "q5-opt1", "q6": "q6-opt4", "q7": "q7-opt4", "q8": "q8-opt1", "q9": "q9-opt3", "q10": "q10-opt4"}'::jsonb,
    '2026-09-10 14:05:00+07'
),
(
    'REC-2026-084',
    'Rina Marlina & Hendra',
    '0812-4455-6677',
    '05 Desember 2026',
    'Rp 3.000.000 - Rp 4.500.000',
    'PKG-AKAD',
    'Paket Akad',
    92.50,
    'Selesai',
    'Akad nikah Sunda Siger sederhana di kediaman mempelai.',
    '{"q1": "q1-opt1", "q2": "q2-opt1", "q3": "q3-opt1", "q4": "q4-opt2", "q5": "q5-opt2", "q6": "q6-opt2", "q7": "q7-opt1", "q8": "q8-opt1", "q9": "q9-opt1", "q10": "q10-opt2"}'::jsonb,
    '2026-09-09 10:30:00+07'
)
ON CONFLICT (code) DO UPDATE SET
    client_name = EXCLUDED.client_name,
    client_phone = EXCLUDED.client_phone,
    event_date = EXCLUDED.event_date,
    budget_range = EXCLUDED.budget_range,
    top_package_code = EXCLUDED.top_package_code,
    top_package_name = EXCLUDED.top_package_name,
    top_score = EXCLUDED.top_score,
    status = EXCLUDED.status,
    admin_notes = EXCLUDED.admin_notes,
    raw_answers = EXCLUDED.raw_answers,
    updated_at = timezone('utc'::text, now());

-- Hubungkan top_package_id dengan id packages aktual
UPDATE public.recommendations r
SET top_package_id = p.id
FROM public.packages p
WHERE r.top_package_code = p.code AND r.top_package_id IS NULL;

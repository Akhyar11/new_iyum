-- Migration: Skema tabel kriteria, pertanyaan, opsi, nilai (option_scores), dan riwayat rekomendasi
-- Tanggal: 2026-09-12

-- 1. Tabel Kriteria (criteria)
CREATE TABLE IF NOT EXISTS public.criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    weight NUMERIC NOT NULL CHECK (weight >= 0 AND weight <= 100),
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Tabel Pertanyaan (questions)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    criteria_id UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    subtitle TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabel Opsi Jawaban (options)
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabel Nilai Jawaban terhadap Paket (option_scores)
CREATE TABLE IF NOT EXISTS public.option_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(option_id, package_id)
);

-- 5. Tabel Riwayat Rekomendasi (recommendations)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_label TEXT,
    top_package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    top_score NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Tabel Jawaban Riwayat (recommendation_answers)
CREATE TABLE IF NOT EXISTS public.recommendation_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    option_id UUID REFERENCES public.options(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Tabel Hasil Skor Per Paket (recommendation_results)
CREATE TABLE IF NOT EXISTS public.recommendation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    final_score NUMERIC NOT NULL,
    rank INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Aktifkan Row Level Security (RLS)
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_results ENABLE ROW LEVEL SECURITY;

-- 9. Kebijakan RLS (Policies)
-- Akses publik untuk membaca kriteria, pertanyaan, opsi, dan nilai
CREATE POLICY "Public read criteria" ON public.criteria FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read options" ON public.options FOR SELECT USING (true);
CREATE POLICY "Public read option_scores" ON public.option_scores FOR SELECT USING (true);

-- Akses publik untuk membuat riwayat rekomendasi baru
CREATE POLICY "Public insert recommendations" ON public.recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own recommendations" ON public.recommendations FOR SELECT USING (true);

CREATE POLICY "Public insert answers" ON public.recommendation_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read answers" ON public.recommendation_answers FOR SELECT USING (true);

CREATE POLICY "Public insert results" ON public.recommendation_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read results" ON public.recommendation_results FOR SELECT USING (true);

-- Akses penuh Admin untuk mengelola semua tabel
CREATE POLICY "Admin manage criteria" ON public.criteria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage questions" ON public.questions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage options" ON public.options FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage option_scores" ON public.option_scores FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage recommendations" ON public.recommendations FOR ALL USING (auth.role() = 'authenticated');

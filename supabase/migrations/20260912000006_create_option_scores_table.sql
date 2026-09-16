-- Migration: Skema tabel nilai jawaban terhadap paket (option_scores) dan migrasi
-- Tanggal: 2026-09-12

-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabel Nilai Jawaban terhadap Paket (option_scores)
CREATE TABLE IF NOT EXISTS public.option_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(option_id, package_id)
);
ALTER TABLE public.option_scores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- 3. Indeks Performa
CREATE INDEX IF NOT EXISTS idx_option_scores_option_id ON public.option_scores(option_id);
CREATE INDEX IF NOT EXISTS idx_option_scores_package_id ON public.option_scores(package_id);
CREATE INDEX IF NOT EXISTS idx_option_scores_score ON public.option_scores(score);

-- 4. Trigger updated_at otomatis
CREATE OR REPLACE FUNCTION public.update_option_scores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_option_scores_updated_at ON public.option_scores;
CREATE TRIGGER trg_option_scores_updated_at
    BEFORE UPDATE ON public.option_scores
    FOR EACH ROW
    EXECUTE FUNCTION public.update_option_scores_updated_at();

-- 5. Row Level Security (RLS)
ALTER TABLE public.option_scores ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan RLS (Policies)
DROP POLICY IF EXISTS "Public read option_scores" ON public.option_scores;
CREATE POLICY "Public read option_scores" ON public.option_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage option_scores" ON public.option_scores;
CREATE POLICY "Admin manage option_scores" ON public.option_scores FOR ALL USING (auth.role() = 'authenticated');

-- 7. Seed data awal untuk opsi Pertanyaan 1 terhadap paket kandidat
INSERT INTO public.option_scores (option_id, package_id, score)
SELECT opt.id, pkg.id, val.score
FROM (
  VALUES
    ('e1111111-1111-4111-8111-111111111101', 'PKG-AKAD', 4),
    ('e1111111-1111-4111-8111-111111111101', 'PKG-RESEPSI', 1),
    ('e1111111-1111-4111-8111-111111111101', 'PKG-ALL-IN', 3),
    ('e1111111-1111-4111-8111-111111111101', 'PKG-SIRAMAN', 1),
    ('e1111111-1111-4111-8111-111111111102', 'PKG-AKAD', 1),
    ('e1111111-1111-4111-8111-111111111102', 'PKG-RESEPSI', 4),
    ('e1111111-1111-4111-8111-111111111102', 'PKG-ALL-IN', 3),
    ('e1111111-1111-4111-8111-111111111102', 'PKG-SIRAMAN', 1),
    ('e1111111-1111-4111-8111-111111111103', 'PKG-AKAD', 2),
    ('e1111111-1111-4111-8111-111111111103', 'PKG-RESEPSI', 3),
    ('e1111111-1111-4111-8111-111111111103', 'PKG-ALL-IN', 4),
    ('e1111111-1111-4111-8111-111111111103', 'PKG-SIRAMAN', 1),
    ('e1111111-1111-4111-8111-111111111104', 'PKG-AKAD', 1),
    ('e1111111-1111-4111-8111-111111111104', 'PKG-RESEPSI', 1),
    ('e1111111-1111-4111-8111-111111111104', 'PKG-ALL-IN', 2),
    ('e1111111-1111-4111-8111-111111111104', 'PKG-SIRAMAN', 4)
) AS val(option_id, package_code, score)
JOIN public.options opt ON opt.id = val.option_id::uuid
JOIN public.packages pkg ON pkg.code = val.package_code
ON CONFLICT (option_id, package_id) DO UPDATE
SET 
    score = EXCLUDED.score,
    updated_at = timezone('utc'::text, now());


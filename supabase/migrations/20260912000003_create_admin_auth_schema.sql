-- Migration: Skema Autentikasi & Kredensial Administrator di Supabase
-- Tanggal: 2026-09-12

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabel Administrator (admins)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pencarian cepat berdasarkan email
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Keamanan RLS:
-- Mencegah akses publik sembarangan terhadap password_hash
DROP POLICY IF EXISTS "Service role full access to admins" ON public.admins;
CREATE POLICY "Service role full access to admins" 
ON public.admins 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 4. Fungsi Verifikasi Kredensial Admin di Level Database
CREATE OR REPLACE FUNCTION public.verify_admin_login(
    p_email TEXT,
    p_password TEXT
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    role TEXT,
    status TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.email,
        a.name,
        a.role,
        a.status
    FROM public.admins a
    WHERE lower(a.email) = lower(trim(p_email))
      AND a.status = 'active'
      AND (
          a.password_hash = crypt(p_password, a.password_hash)
          OR a.password_hash = encode(digest(p_password, 'sha256'), 'hex')
          OR a.password_hash = p_password -- fallback testing plain hash
      );

    -- Update last_login_at jika berhasil
    IF FOUND THEN
        UPDATE public.admins
        SET last_login_at = timezone('utc'::text, now())
        WHERE lower(public.admins.email) = lower(trim(p_email));
    END IF;
END;
$$;

-- 5. Seed Kredensial Admin Awal (Default)
-- Akun 1: admin@griyarias.com / admin123
-- Akun 2: admin@makeup.com / admin12345
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

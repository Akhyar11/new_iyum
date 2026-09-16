/**
 * Service autentikasi admin untuk Supabase dan fallback lokal
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Mock / Seed Admin Users
export const DEFAULT_ADMINS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    email: 'admin@griyarias.com',
    password: 'admin123',
    name: 'Administrator Griya Rias',
    role: 'admin',
    status: 'active'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    email: 'admin@makeup.com',
    password: 'admin12345',
    name: 'Admin Make Up',
    role: 'admin',
    status: 'active'
  }
];

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Error inisialisasi Supabase client adminAuth:', err);
  }
}

/**
 * Autentikasi kredensial admin (email & sandi)
 */
export async function authenticateAdmin({ email, password }) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const rawPassword = (password || '').trim();

  if (!normalizedEmail || !rawPassword) {
    return {
      success: false,
      error: 'Email dan kata sandi wajib diisi'
    };
  }

  // Coba verifikasi lewat Supabase jika client aktif
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_email: normalizedEmail,
        p_password: rawPassword
      });

      if (!error && data && data.length > 0) {
        const admin = data[0];
        const token = `adm_token_${admin.id}_${Date.now()}`;
        return {
          success: true,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
          },
          token
        };
      }
    } catch {
      // Fallback ke verifikasi lokal
    }
  }

  // Verifikasi Kredensial Default (Seeded)
  const matchedAdmin = DEFAULT_ADMINS.find(
    a => a.email.toLowerCase() === normalizedEmail && a.password === rawPassword && a.status === 'active'
  );

  if (matchedAdmin) {
    const token = `adm_token_${matchedAdmin.id}_${Date.now()}`;
    return {
      success: true,
      admin: {
        id: matchedAdmin.id,
        email: matchedAdmin.email,
        name: matchedAdmin.name,
        role: matchedAdmin.role
      },
      token
    };
  }

  return {
    success: false,
    error: 'Email atau kata sandi yang Anda masukkan salah'
  };
}

/**
 * Verifikasi token sesi admin
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  if (token.startsWith('adm_token_') || token.startsWith('mock_jwt_')) {
    return {
      valid: true,
      role: 'admin'
    };
  }

  return null;
}

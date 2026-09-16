import { authenticateAdmin } from '../services/adminAuth.js';

export async function handleAdminLogin(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Metode request tidak diizinkan. Gunakan POST.'
    });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan kata sandi wajib diisi'
      });
    }

    const authResult = await authenticateAdmin({ email, password });

    if (!authResult.success) {
      return res.status(401).json({
        success: false,
        message: authResult.error || 'Email atau kata sandi yang Anda masukkan salah'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Autentikasi admin berhasil',
      data: {
        admin: authResult.admin,
        token: authResult.token
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat autentikasi',
      error: err.message
    });
  }
}

export async function handleAdminLogout(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('Set-Cookie', 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');

  return res.status(200).json({
    success: true,
    message: 'Logout berhasil. Sesi admin telah ditutup.',
    timestamp: new Date().toISOString()
  });
}

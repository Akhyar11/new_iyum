import { verifyAdminToken } from '../services/adminAuth.js';

/**
 * Middleware untuk memproteksi endpoint dan route pengelolaan admin.
 * Memeriksa Authorization header (Bearer token), query token, atau cookie.
 */
export function requireAdminAuth(req, res, next) {
  // Ambil token dari Authorization header, query, atau cookie
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  let token = null;

  if (authHeader && typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  // Coba ambil dari cookie jika tidak ada di header
  if (!token && req.headers['cookie']) {
    const cookies = req.headers['cookie'].split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === 'admin_session' && val) {
        token = decodeURIComponent(val);
        break;
      }
    }
  }

  // Coba ambil dari query param (opsional untuk download file / export)
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Akses ditolak: Token autentikasi admin tidak ditemukan. Silakan masuk terlebih dahulu.'
    });
  }

  const verification = verifyAdminToken(token);
  if (!verification || !verification.valid) {
    return res.status(401).json({
      success: false,
      error: 'InvalidToken',
      message: 'Akses ditolak: Sesi atau token admin tidak valid atau sudah kadaluarsa.'
    });
  }

  req.admin = verification;
  if (typeof next === 'function') {
    return next();
  }
  return true;
}

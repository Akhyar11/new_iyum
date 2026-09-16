/**
 * Middleware proteksi halaman / endpoint pengelolaan admin untuk Vercel Serverless
 */
export function withAdminAuth(handler: (req: any, res: any) => Promise<any> | any) {
  return async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let token: string | null = null;

    if (authHeader && typeof authHeader === 'string') {
      token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    }

    if (!token && req.headers['cookie']) {
      const cookies = req.headers['cookie'].split(';');
      for (const c of cookies) {
        const [k, v] = c.trim().split('=');
        if (k === 'admin_session' && v) {
          token = decodeURIComponent(v);
          break;
        }
      }
    }

    if (!token && req.query?.token) {
      token = req.query.token;
    }

    if (!token || (!token.startsWith('adm_token_') && !token.startsWith('mock_jwt_'))) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Akses ditolak: Anda harus memiliki sesi admin yang sah untuk mengakses area pengelolaan ini.'
      });
    }

    req.admin = { role: 'admin', token };
    return handler(req, res);
  };
}

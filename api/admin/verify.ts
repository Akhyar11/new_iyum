import { withAdminAuth } from '../middleware/auth';

async function verifyHandler(req: any, res: any) {
  return res.status(200).json({
    success: true,
    message: 'Sesi admin aktif dan terverifikasi.',
    data: {
      authenticated: true,
      role: req.admin?.role || 'admin',
      verifiedAt: new Date().toISOString()
    }
  });
}

export default withAdminAuth(verifyHandler);

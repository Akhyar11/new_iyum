import { URL } from 'url';
import { 
  handleGetPackages, 
  handleGetPackageDetail, 
  handleCreatePackage,
  handleUpdatePackage,
  handleTogglePackageStatus,
  handleDeletePackage
} from '../server/handlers/packages.js';
import { 
  handleGetQuestions,
  handleGetQuestionDetail,
  handleCreateQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  handleGetOptions,
  handleGetOptionDetail,
  handleCreateOption,
  handleUpdateOption,
  handleDeleteOption,
  handleReorderQuestions,
  handleMoveQuestion,
  handleGetRecommendationQuestions
} from '../server/handlers/questions.js';
import { 
  handleRecommendations,
  handleGetRecommendations,
  handleGetRecommendationDetail,
  handleUpdateRecommendationStatus
} from '../server/handlers/recommendations.js';
import { handleAdminLogin, handleAdminLogout } from '../server/handlers/auth.js';
import { requireAdminAuth } from '../server/middleware/authMiddleware.js';
import { handleGetDashboardSummary, handleGetTopPackage } from '../server/handlers/dashboard.js';
import { 
  handleGetCriteria, 
  handleUpdateCriteriaWeights, 
  handleResetCriteriaWeights 
} from '../server/handlers/criteria.js';
import {
  handleGetScoreMatrix,
  handleUpdateScoreMatrix,
  handleUpdateMatrixCell,
  handleResetScoreMatrix
} from '../server/handlers/matrix.js';
import { handleGetPackagePopularityStats } from '../server/handlers/reports.js';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams.entries());

  req.query = { ...query, ...(req.query || {}) };

  // Helper response polyfill if needed
  if (!res.status) {
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
  }
  if (!res.json) {
    res.json = (data: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
  }

  // Parse body if not pre-parsed
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && !req.body) {
    try {
      const buffers: any[] = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString();
      if (rawBody) {
        req.body = JSON.parse(rawBody);
      }
    } catch {
      req.body = {};
    }
  }

  // Packages API
  if (pathname === '/api/packages') {
    if (req.method === 'POST') return handleCreatePackage(req, res);
    return handleGetPackages(req, res);
  }

  if (pathname.startsWith('/api/packages/') && pathname.endsWith('/status')) {
    const id = pathname.replace('/api/packages/', '').replace('/status', '').trim();
    req.query.id = id;
    return handleTogglePackageStatus(req, res);
  }

  if (pathname.startsWith('/api/packages/')) {
    const id = pathname.replace('/api/packages/', '').trim();
    req.query.id = id;
    if (req.method === 'PUT' || req.method === 'PATCH') return handleUpdatePackage(req, res);
    if (req.method === 'DELETE') return handleDeletePackage(req, res);
    return handleGetPackageDetail(req, res);
  }

  // Questions API
  if (pathname === '/api/questions') {
    if (req.method === 'POST') return handleCreateQuestion(req, res);
    return handleGetQuestions(req, res);
  }

  const nestedOptionsMatch = pathname.match(/^\/api\/questions\/([^/]+)\/options(?:\/([^/]+))?$/);
  if (nestedOptionsMatch) {
    const questionId = nestedOptionsMatch[1];
    const optionId = nestedOptionsMatch[2];
    req.query.questionId = questionId;
    if (optionId) {
      req.query.id = optionId;
      req.query.optionId = optionId;
      if (req.method === 'PUT' || req.method === 'PATCH') return handleUpdateOption(req, res);
      if (req.method === 'DELETE') return handleDeleteOption(req, res);
      return handleGetOptionDetail(req, res);
    } else {
      if (req.method === 'POST') return handleCreateOption(req, res);
      return handleGetOptions(req, res);
    }
  }

  if (pathname === '/api/options') {
    if (req.method === 'POST') return handleCreateOption(req, res);
    return handleGetOptions(req, res);
  }

  if (pathname.startsWith('/api/options/')) {
    const id = pathname.replace('/api/options/', '').trim();
    req.query.id = id;
    req.query.optionId = id;
    if (req.method === 'PUT' || req.method === 'PATCH') return handleUpdateOption(req, res);
    if (req.method === 'DELETE') return handleDeleteOption(req, res);
    return handleGetOptionDetail(req, res);
  }

  if (pathname === '/api/questions/reorder') {
    return handleReorderQuestions(req, res);
  }

  if (
    pathname === '/api/questions/recommendation' ||
    pathname === '/api/recommendations/questions' ||
    pathname === '/api/recommendation-questions'
  ) {
    return handleGetRecommendationQuestions(req, res);
  }

  if (pathname.startsWith('/api/questions/') && pathname.endsWith('/move')) {
    const id = pathname.replace('/api/questions/', '').replace('/move', '').trim();
    req.query.id = id;
    return handleMoveQuestion(req, res);
  }

  if (pathname.startsWith('/api/questions/')) {
    const id = pathname.replace('/api/questions/', '').trim();
    req.query.id = id;
    if (req.method === 'PUT' || req.method === 'PATCH') return handleUpdateQuestion(req, res);
    if (req.method === 'DELETE') return handleDeleteQuestion(req, res);
    return handleGetQuestionDetail(req, res);
  }

  // Criteria API
  if (pathname === '/api/criteria/reset' || pathname === '/api/weights/reset') {
    return handleResetCriteriaWeights(req, res);
  }

  if (
    pathname === '/api/criteria' ||
    pathname === '/api/criteria/weights' ||
    pathname === '/api/weights'
  ) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      return handleUpdateCriteriaWeights(req, res);
    }
    return handleGetCriteria(req, res);
  }

  // Matrix API
  if (pathname === '/api/matrix/reset') {
    return handleResetScoreMatrix(req, res);
  }

  if (pathname === '/api/matrix/cell') {
    return handleUpdateMatrixCell(req, res);
  }

  if (pathname === '/api/matrix' || pathname === '/api/option-scores') {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      return handleUpdateScoreMatrix(req, res);
    }
    return handleGetScoreMatrix(req, res);
  }

  // Recommendations API
  if (
    pathname === '/api/recommendations' ||
    pathname === '/api/recommendations/history' ||
    pathname === '/api/history'
  ) {
    if (req.method === 'GET') return handleGetRecommendations(req, res);
    return handleRecommendations(req, res);
  }

  if (pathname.startsWith('/api/recommendations/') && pathname.endsWith('/status')) {
    const id = pathname.replace('/api/recommendations/', '').replace('/status', '').trim();
    req.query.id = id;
    return handleUpdateRecommendationStatus(req, res);
  }

  if (pathname.startsWith('/api/recommendations/')) {
    const id = pathname.replace('/api/recommendations/', '').trim();
    req.query.id = id;
    if (req.method === 'PATCH' || req.method === 'PUT') return handleUpdateRecommendationStatus(req, res);
    return handleGetRecommendationDetail(req, res);
  }

  // Auth API
  if (pathname === '/api/auth/login' || pathname === '/api/login') {
    return handleAdminLogin(req, res);
  }

  if (pathname === '/api/auth/logout' || pathname === '/api/logout') {
    return handleAdminLogout(req, res);
  }

  // Dashboard API
  if (pathname === '/api/admin/dashboard/summary' || pathname === '/api/dashboard/summary') {
    return handleGetDashboardSummary(req, res);
  }

  if (pathname === '/api/admin/dashboard/top-package' || pathname === '/api/dashboard/top-package') {
    return handleGetTopPackage(req, res);
  }

  // Reports API
  if (
    pathname === '/api/reports' ||
    pathname === '/api/reports/package-popularity' ||
    pathname === '/api/reports/stats' ||
    pathname === '/api/admin/reports/package-popularity'
  ) {
    return handleGetPackagePopularityStats(req, res);
  }

  // Admin Verification
  if (pathname.startsWith('/api/admin')) {
    const authOk = requireAdminAuth(req, res);
    if (!authOk) return;

    if (pathname === '/api/admin/verify' || pathname === '/api/admin/me') {
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
  }

  // Health check
  if (pathname === '/api/health' || pathname === '/api' || pathname === '/') {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'API Rekomendasi Paket Makeup'
    });
  }

  return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
}

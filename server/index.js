/**
 * Server Node.js untuk API Sistem Rekomendasi Paket Make Up
 * Menyediakan endpoint:
 *   - GET  /api/packages
 *   - GET  /api/packages/:id
 *   - GET  /api/questions
 *   - POST /api/recommendations
 *   - GET  /api/recommendations
 *
 * Dijalankan dengan: node server/index.js
 */

import http from 'http';
import { URL } from 'url';
import { 
  handleGetPackages, 
  handleGetPackageDetail, 
  handleCreatePackage,
  handleUpdatePackage,
  handleTogglePackageStatus,
  handleDeletePackage
} from './handlers/packages.js';
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
} from './handlers/questions.js';
import { 
  handleRecommendations,
  handleGetRecommendations,
  handleGetRecommendationDetail,
  handleUpdateRecommendationStatus
} from './handlers/recommendations.js';
import { handleAdminLogin, handleAdminLogout } from './handlers/auth.js';
import { requireAdminAuth } from './middleware/authMiddleware.js';
import { handleGetDashboardSummary, handleGetTopPackage } from './handlers/dashboard.js';
import { 
  handleGetCriteria, 
  handleUpdateCriteriaWeights, 
  handleResetCriteriaWeights 
} from './handlers/criteria.js';
import {
  handleGetScoreMatrix,
  handleUpdateScoreMatrix,
  handleUpdateMatrixCell,
  handleResetScoreMatrix
} from './handlers/matrix.js';
import { handleGetPackagePopularityStats } from './handlers/reports.js';

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams.entries());

  req.query = query;

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  let body = {};
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString();
      if (rawBody) {
        body = JSON.parse(rawBody);
      }
    } catch {
      // ignore
    }
  }
  req.body = body;

  // Routing
  if (pathname === '/api/packages') {
    if (req.method === 'POST') {
      return handleCreatePackage(req, res);
    }
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
    if (req.method === 'PUT' || req.method === 'PATCH') {
      return handleUpdatePackage(req, res);
    }
    if (req.method === 'DELETE') {
      return handleDeletePackage(req, res);
    }
    return handleGetPackageDetail(req, res);
  }

  if (pathname === '/api/questions') {
    if (req.method === 'POST') {
      return handleCreateQuestion(req, res);
    }
    return handleGetQuestions(req, res);
  }

  // Nested endpoint: /api/questions/:questionId/options/:optionId
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

  // Direct endpoint: /api/options and /api/options/:id
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
    if (req.method === 'PUT' || req.method === 'PATCH') {
      return handleUpdateQuestion(req, res);
    }
    if (req.method === 'DELETE') {
      return handleDeleteQuestion(req, res);
    }
    return handleGetQuestionDetail(req, res);
  }

  // Criteria & Bobot Endpoints
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

  // Matriks Nilai Jawaban SAW
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
    if (req.method === 'PATCH' || req.method === 'PUT') {
      return handleUpdateRecommendationStatus(req, res);
    }
    return handleGetRecommendationDetail(req, res);
  }

  if (pathname === '/api/auth/login' || pathname === '/api/login') {
    return handleAdminLogin(req, res);
  }

  if (pathname === '/api/auth/logout' || pathname === '/api/logout') {
    return handleAdminLogout(req, res);
  }

  if (pathname === '/api/admin/dashboard/summary' || pathname === '/api/dashboard/summary') {
    return handleGetDashboardSummary(req, res);
  }

  if (pathname === '/api/admin/dashboard/top-package' || pathname === '/api/dashboard/top-package') {
    return handleGetTopPackage(req, res);
  }

  // Reports & Popularity Stats Endpoints
  if (
    pathname === '/api/reports' ||
    pathname === '/api/reports/package-popularity' ||
    pathname === '/api/reports/stats' ||
    pathname === '/api/admin/reports/package-popularity'
  ) {
    return handleGetPackagePopularityStats(req, res);
  }

  // Middleware Proteksi Halaman / Endpoint Pengelolaan Admin
  if (pathname.startsWith('/api/admin')) {
    const authOk = requireAdminAuth(req, res);
    if (!authOk) return; // Response 401 sudah dikirim oleh middleware

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

  if (pathname === '/api/health' || pathname === '/') {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'API Rekomendasi Paket Makeup'
    });
  }

  return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server Backend Node.js aktif di http://localhost:${PORT}`);
});

export default server;

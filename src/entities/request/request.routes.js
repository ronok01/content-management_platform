import express from 'express';
import {
  verifyToken,
  checkRole,
} from '../../core/middlewares/authMiddleware.js';
import {
  requestCreatorAccess,
  getPendingRequests,
  approveRequest,
  rejectRequest,
} from './request.controller.js';

const router = express.Router();

// Route for a 'reader' to request creator access
router.post('/request-access', verifyToken, checkRole(['reader']), requestCreatorAccess);

// Admin routes to manage requests
router.get(
  '/requests',
  verifyToken,
  checkRole(['admin']),
  getPendingRequests,
);
router.put(
  '/requests/:userId/approve',
  verifyToken,
  checkRole(['admin']),
  approveRequest,
);
router.put(
  '/requests/:userId/reject',
  verifyToken,
  checkRole(['admin']),
  rejectRequest,
);

export default router;

import { Router } from 'express';
import {
  getFinancialReport,
  getDriverPerformance,
  getPopularItems,
} from '../controllers/analyticsController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Enforce auth and RBAC: accessible only by admin, merchant, or manager
router.use(authenticateUser);
router.use(authorizeRoles('admin', 'merchant', 'manager'));

router.get('/financials', getFinancialReport);
router.get('/drivers', getDriverPerformance);
router.get('/menu-popularity', getPopularItems);

export default router;
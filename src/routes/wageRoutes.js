import { Router } from 'express';
import { getWages, logWageActivity, updateStatus } from '../controllers/wageController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all wage routes with authentication
router.use(authenticateUser);

// Allow admin, merchant, or manager
router.get('/', authorizeRoles('admin', 'merchant', 'manager'), getWages);
router.post('/', authorizeRoles('admin', 'merchant', 'manager'), logWageActivity);
router.patch('/:id/status', authorizeRoles('admin', 'merchant', 'manager'), updateStatus);

export default router;
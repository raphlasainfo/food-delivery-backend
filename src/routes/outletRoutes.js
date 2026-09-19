import { Router } from 'express';
import {
  getOutlets,
  getOutletById,
  createOutlet,
  updateOutlet,
  deleteOutlet,
} from '../controllers/outletController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getOutlets);
router.get('/:id', getOutletById);

// Protected endpoints
router.post('/', authenticateUser, authorizeRoles('admin', 'merchant'), createOutlet);
router.patch('/:id', authenticateUser, authorizeRoles('admin', 'merchant'), updateOutlet);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteOutlet);

export default router;
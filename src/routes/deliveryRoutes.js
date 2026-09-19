import { Router } from 'express';
import {
  createAssignment,
  updateStatus,
  getDeliveryByOrder,
} from '../controllers/deliveryController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.post('/assign', authorizeRoles('admin', 'merchant'), createAssignment);
router.patch('/:id/status', authorizeRoles('admin', 'driver'), updateStatus);
router.get('/order/:orderId', getDeliveryByOrder);

export default router;
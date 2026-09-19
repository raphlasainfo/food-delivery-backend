import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  checkout,
  updateStatus,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/checkout', checkout);
router.patch('/:id/status', updateStatus);

export default router;
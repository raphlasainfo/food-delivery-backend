import { Router } from 'express';
import {
  processPayment,
  getPaymentById,
  getPaymentByOrder,
} from '../controllers/paymentController.js';

const router = Router();

router.post('/process', processPayment);
router.get('/:id', getPaymentById);
router.get('/order/:orderId', getPaymentByOrder);

export default router;
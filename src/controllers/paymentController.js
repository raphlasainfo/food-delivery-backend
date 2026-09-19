import * as paymentModel from '../models/paymentModel.js';
import * as orderModel from '../models/orderModel.js';

export const processPayment = async (req, res, next) => {
  try {
    const { order_id, payment_method, amount, transaction_id } = req.body;

    // Validate request inputs
    const allowedMethods = ['card', 'upi', 'cod'];
    if (!order_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'order_id and payment_method are required.',
      });
    }

    const normalizedMethod = payment_method.toLowerCase();
    if (!allowedMethods.includes(normalizedMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${allowedMethods.join(', ')}`,
      });
    }

    // Verify order exists
    const order = await orderModel.fetchOrderById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Determine default payment state based on method
    // COD orders stay 'pending' until arrival; card/upi mark 'completed'
    const status = normalizedMethod === 'cod' ? 'pending' : 'completed';

    // Auto-generate a transaction ID for digital payments if none was provided
    const finalTxnId =
      transaction_id ||
      (normalizedMethod === 'cod' ? null : `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`);

    const paymentRecord = await paymentModel.createPayment({
      order_id,
      amount: amount || order.total_amount,
      payment_method: normalizedMethod,
      transaction_id: finalTxnId,
      status,
    });

    res.status(201).json({
      success: true,
      message:
        status === 'completed'
          ? 'Payment processed and order confirmed.'
          : 'Payment recorded as pending (Cash on Delivery).',
      data: paymentRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentModel.fetchPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await paymentModel.fetchPaymentByOrderId(req.params.orderId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'No payment found for this order' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
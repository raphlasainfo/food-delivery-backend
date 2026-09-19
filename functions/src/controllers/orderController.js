import * as orderModel from '../models/orderModel.js';

export const getOrders = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const orders = await orderModel.fetchAllOrders(user_id);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderModel.fetchOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const checkout = async (req, res, next) => {
  try {
    const { user_id, outlet_id, items } = req.body;

    // Validate payload
    if (!user_id || !outlet_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'user_id, outlet_id, and at least one item are required to checkout.',
      });
    }

    // Calculate total order amount dynamically
    const total_amount = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    const newOrder = await orderModel.placeOrder({
      user_id,
      outlet_id,
      total_amount,
      items,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updatedOrder = await orderModel.updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};
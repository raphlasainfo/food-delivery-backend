import * as deliveryModel from '../models/deliveryModel.js';
import * as orderModel from '../models/orderModel.js';

export const createAssignment = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const driver_id = req.body.driver_id || req.body.delivery_partner_id;

    if (!order_id || !driver_id) {
      return res.status(400).json({
        success: false,
        message: 'order_id and driver_id are required.',
      });
    }

    const order = await orderModel.fetchOrderById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const assignment = await deliveryModel.assignDelivery({
      order_id,
      driver_id,
    });

    res.status(201).json({
      success: true,
      message: 'Driver assigned successfully',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['assigned', 'picked_up', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Valid status required: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await deliveryModel.updateDeliveryStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: `Delivery status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryByOrder = async (req, res, next) => {
  try {
    const delivery = await deliveryModel.fetchDeliveryByOrderId(req.params.orderId);
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'No delivery assignment found for this order' });
    }
    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    next(error);
  }
};
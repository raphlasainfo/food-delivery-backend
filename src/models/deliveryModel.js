import { supabase } from '../config/supabase.js';

// Assign a driver to an order
export const assignDelivery = async ({ order_id, driver_id }) => {
  const { data: assignment, error: assignError } = await supabase
    .from('delivery_assignments')
    .insert([
      {
        order_id,
        driver_id,
        status: 'assigned',
      },
    ])
    .select()
    .single();

  if (assignError) throw assignError;

  // Sync parent order status
  await supabase
    .from('orders')
    .update({ status: 'preparing' })
    .eq('id', order_id);

  return assignment;
};

// Update delivery status
export const updateDeliveryStatus = async (id, status) => {
  const updates = { status };

  const { data: assignment, error: assignError } = await supabase
    .from('delivery_assignments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (assignError) throw assignError;

  // When delivered, complete the parent order
  if (status === 'delivered') {
    await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', assignment.order_id);
  }

  return assignment;
};

// Get assignment by Order ID
export const fetchDeliveryByOrderId = async (orderId) => {
  const { data, error } = await supabase
    .from('delivery_assignments')
    .select('*, orders(*)')
    .eq('order_id', orderId)
    .single();

  if (error) throw error;
  return data;
};
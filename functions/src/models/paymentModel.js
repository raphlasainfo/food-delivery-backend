import { supabase } from '../config/supabase.js';

export const createPayment = async ({ order_id, amount, payment_method, transaction_id = null, status = 'completed' }) => {
  // 1. Insert payment record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert([
      {
        order_id,
        amount,
        payment_method,
        transaction_id,
        status,
      },
    ])
    .select()
    .single();

  if (paymentError) throw paymentError;

  // 2. Link payment outcome to order fulfillment state
  let nextOrderStatus = 'pending';
  if (status === 'completed') {
    nextOrderStatus = 'confirmed';
  } else if (status === 'failed') {
    nextOrderStatus = 'cancelled';
  }

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({ status: nextOrderStatus })
    .eq('id', order_id);

  if (orderUpdateError) throw orderUpdateError;

  return payment;
};

export const fetchPaymentByOrderId = async (orderId) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*, orders(*)')
    .eq('order_id', orderId)
    .single();

  if (error) throw error;
  return data;
};

export const fetchPaymentById = async (id) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*, orders(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};
import { supabase } from '../config/supabase.js';

export const fetchAllOrders = async (userId) => {
  let query = supabase
    .from('orders')
    .select('*, order_items(*), outlets(name)');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), outlets(name, address)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const placeOrder = async ({ user_id, outlet_id, total_amount, status = 'pending', items }) => {
  // 1. Insert parent order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id,
        outlet_id,
        total_amount,
        status,
      },
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Map items using 'price_at_time' from your Supabase table
  const orderItemsData = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_at_time: item.price ?? item.price_at_time,
  }));

  // 3. Batch insert order items
  const { data: insertedItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)
    .select();

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    throw itemsError;
  }

  return {
    ...order,
    items: insertedItems,
  };
};

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
import { supabase } from '../config/supabase.js';

export const fetchMenuItems = async (outletId) => {
  let query = supabase.from('menu_items').select('*');

  // Filter by outlet if outletId is provided
  if (outletId) {
    query = query.eq('outlet_id', outletId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchMenuItemById = async (id) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createMenuItem = async (itemData) => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([itemData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMenuItem = async (id, updates) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMenuItem = async (id) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
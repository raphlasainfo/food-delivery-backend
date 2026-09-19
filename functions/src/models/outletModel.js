import { supabase } from '../config/supabase.js';

export const fetchAllOutlets = async () => {
  const { data, error } = await supabase.from('outlets').select('*');
  if (error) throw error;
  return data;
};

export const fetchOutletById = async (id) => {
  const { data, error } = await supabase.from('outlets').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createOutlet = async (outletData) => {
  const { data, error } = await supabase
    .from('outlets')
    .insert([outletData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOutlet = async (id, updates) => {
  const { data, error } = await supabase
    .from('outlets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteOutlet = async (id) => {
  const { error } = await supabase
    .from('outlets')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
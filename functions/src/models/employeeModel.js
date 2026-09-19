import { supabase } from '../config/supabase.js';

export const fetchAllEmployees = async (outletId) => {
  let query = supabase
    .from('employees')
    .select('*, users(name, email, phone), outlets(name)');
  if (outletId) query = query.eq('outlet_id', outletId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Resilient lookup supporting both employee id and user_id
export const fetchEmployeeById = async (id) => {
  const cleanId = String(id).trim();

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .or(`id.eq.${cleanId},user_id.eq.${cleanId}`)
    .maybeSingle();

  if (error) {
    console.error('[EMPLOYEE_MODEL ERROR]:', error.message);
    throw error;
  }
  return data;
};

export const createEmployee = async (employeeData) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateEmployee = async (id, updates) => {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id) => {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) throw error;
  return true;
};
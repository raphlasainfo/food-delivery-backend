import { supabase } from '../config/supabase.js';

// Fetch wage logs with nested employee and user details
export const fetchWages = async (employeeId) => {
  let query = supabase
    .from('wage_activities')
    .select('*, employees(id, designation, hourly_rate, users(name, email))');

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Clean insert returning only the created record
export const recordWage = async (wageData) => {
  const { data, error } = await supabase
    .from('wage_activities')
    .insert([wageData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update wage payout status (pending -> paid)
export const updateWageStatus = async (id, payment_status) => {
  const { data, error } = await supabase
    .from('wage_activities')
    .update({ payment_status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
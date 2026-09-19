import { supabase } from '../config/supabase.js';

// 1. Revenue vs. Labor Costs Aggregation
export const getRevenueVsLabor = async ({ outletId, startDate, endDate }) => {
  let ordersQuery = supabase
    .from('orders')
    .select('id, outlet_id, total_amount, status, created_at')
    .eq('status', 'completed');

  if (outletId) ordersQuery = ordersQuery.eq('outlet_id', outletId);
  if (startDate) ordersQuery = ordersQuery.gte('created_at', startDate);
  if (endDate) ordersQuery = ordersQuery.lte('created_at', endDate);

  const { data: orders, error: ordersError } = await ordersQuery;
  if (ordersError) throw ordersError;

  let wagesQuery = supabase
    .from('wage_activities')
    .select('id, amount, hours_worked, payment_status, created_at, employees!inner(outlet_id)')
    .neq('payment_status', 'cancelled');

  if (outletId) wagesQuery = wagesQuery.eq('employees.outlet_id', outletId);
  if (startDate) wagesQuery = wagesQuery.gte('created_at', startDate);
  if (endDate) wagesQuery = wagesQuery.lte('created_at', endDate);

  const { data: wages, error: wagesError } = await wagesQuery;
  if (wagesError) throw wagesError;

  const totalRevenue = (orders || []).reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const totalLaborExpense = (wages || []).reduce((sum, wage) => sum + Number(wage.amount || 0), 0);
  const totalHoursWorked = (wages || []).reduce((sum, wage) => sum + Number(wage.hours_worked || 0), 0);
  const netMargin = totalRevenue - totalLaborExpense;
  const laborCostPercentage = totalRevenue > 0 ? (totalLaborExpense / totalRevenue) * 100 : 0;

  return {
    period: { startDate: startDate || 'all-time', endDate: endDate || 'present' },
    summary: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalLaborExpense: Number(totalLaborExpense.toFixed(2)),
      netOperatingProfit: Number(netMargin.toFixed(2)),
      laborCostPercentage: `${laborCostPercentage.toFixed(2)}%`,
      totalHoursWorked: Number(totalHoursWorked.toFixed(2)),
      completedOrdersCount: orders?.length || 0,
    },
  };
};

// 2. Driver Fulfillment & Delivery Metrics
export const getDriverMetrics = async ({ driverId, startDate, endDate }) => {
  let query = supabase
    .from('delivery_assignments')
    .select('id, order_id, driver_id, status, created_at, users:driver_id(name, email)');

  if (driverId) query = query.eq('driver_id', driverId);
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data: deliveries, error } = await query;
  if (error) throw error;

  const total = deliveries.length;
  const completed = deliveries.filter((d) => d.status === 'delivered').length;
  const inTransit = deliveries.filter((d) => ['assigned', 'picked_up', 'in_transit'].includes(d.status)).length;
  const cancelled = deliveries.filter((d) => d.status === 'cancelled').length;
  const fulfillmentRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    totalAssignments: total,
    completed,
    inTransit,
    cancelled,
    fulfillmentRate: `${fulfillmentRate.toFixed(2)}%`,
    deliveries,
  };
};

// 3. Top-Selling Menu Items (Price fetched from menu_items)
export const getMenuPopularity = async ({ outletId, limit = 10 }) => {
  let query = supabase
    .from('order_items')
    .select('quantity, menu_item_id, menu_items!inner(id, name, price, outlet_id, outlets(name))');

  if (outletId) query = query.eq('menu_items.outlet_id', outletId);

  const { data: items, error } = await query;
  if (error) throw error;

  const itemMap = {};

  (items || []).forEach(({ quantity, menu_item_id, menu_items }) => {
    const qty = Number(quantity || 0);
    const itemPrice = Number(menu_items?.price || 0);
    const subtotal = qty * itemPrice;

    if (!itemMap[menu_item_id]) {
      itemMap[menu_item_id] = {
        itemId: menu_item_id,
        name: menu_items?.name || 'Unknown Item',
        outlet: menu_items?.outlets?.name || 'Unassigned',
        unitsSold: 0,
        totalRevenue: 0,
      };
    }

    itemMap[menu_item_id].unitsSold += qty;
    itemMap[menu_item_id].totalRevenue += subtotal;
  });

  return Object.values(itemMap)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, Number(limit))
    .map((item) => ({
      ...item,
      totalRevenue: Number(item.totalRevenue.toFixed(2)),
    }));
};
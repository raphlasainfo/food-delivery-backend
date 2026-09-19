import * as analyticsModel from '../models/analyticsModel.js';

// GET /api/analytics/financials
export const getFinancialReport = async (req, res, next) => {
  try {
    const { outlet_id, start_date, end_date } = req.query;

    const report = await analyticsModel.getRevenueVsLabor({
      outletId: outlet_id,
      startDate: start_date,
      endDate: end_date,
    });

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/drivers
export const getDriverPerformance = async (req, res, next) => {
  try {
    const { driver_id, start_date, end_date } = req.query;

    const report = await analyticsModel.getDriverMetrics({
      driverId: driver_id,
      startDate: start_date,
      endDate: end_date,
    });

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/menu-popularity
export const getPopularItems = async (req, res, next) => {
  try {
    const { outlet_id, limit } = req.query;

    const popularItems = await analyticsModel.getMenuPopularity({
      outletId: outlet_id,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    res.status(200).json({ success: true, count: popularItems.length, data: popularItems });
  } catch (error) {
    next(error);
  }
};